// lib/trpc/routers/schedule.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  UserRole,
  BookingStatus,
  ScheduleExceptionType
} from '@prisma/client'
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  addDays,
  addWeeks,
  format,
  parseISO,
  isBefore,
  isAfter,
  areIntervalsOverlapping,
  setHours,
  setMinutes,
  differenceInMinutes,
  getDay
} from 'date-fns'
import { pl } from 'date-fns/locale'

// Type definitions
type TimeSlot = {
  startTime: Date
  endTime: Date
}

type WeeklyViewDay = {
  date: Date
  dayOfWeek: number
  schedule: any
  exceptions: any[]
  bookings: any[]
  availableSlots: TimeSlot[]
  isAvailable: boolean
}

// Validation Schemas
const CreateScheduleSchema = z.object({
  instructorId: z.string().optional(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  locationId: z.string().optional(),
  maxBookings: z.number().min(1).max(20).optional(),
  breakStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  breakDuration: z.number().min(15).max(120).optional(),
  bufferBefore: z.number().min(0).max(60).default(15),
  bufferAfter: z.number().min(0).max(60).default(15),
  nightDriving: z.boolean().default(false),
  earlyMorning: z.boolean().default(false),
  notes: z.string().optional(),
})

const UpdateScheduleSchema = z.object({
  id: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  locationId: z.string().optional(),
  maxBookings: z.number().min(1).max(20).optional(),
  breakStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  breakDuration: z.number().min(15).max(120).optional(),
  bufferBefore: z.number().min(0).max(60).optional(),
  bufferAfter: z.number().min(0).max(60).optional(),
  isAvailable: z.boolean().optional(),
  notes: z.string().optional(),
})

const CreateScheduleTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  weekPattern: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    locationId: z.string().optional(),
    maxBookings: z.number().optional(),
    breakStart: z.string().optional(),
    breakDuration: z.number().optional(),
  })),
})

const CreateScheduleExceptionSchema = z.object({
  instructorId: z.string().optional(),
  type: z.nativeEnum(ScheduleExceptionType),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  allDay: z.boolean().default(true),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
})

// Helper functions
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTimeString(timeStr)
  return hours * 60 + minutes
}

function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Min = timeToMinutes(start1)
  const end1Min = timeToMinutes(end1)
  const start2Min = timeToMinutes(start2)
  const end2Min = timeToMinutes(end2)

  return (
    (start1Min >= start2Min && start1Min < end2Min) ||
    (end1Min > start2Min && end1Min <= end2Min) ||
    (start1Min <= start2Min && end1Min >= end2Min)
  )
}

function generateTimeSlots(
  date: Date,
  startTime: string,
  endTime: string,
  duration: number = 120,
  bufferBefore: number = 15,
  bufferAfter: number = 15,
  breakStart?: string,
  breakDuration?: number
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const { hours: startHour, minutes: startMinute } = parseTimeString(startTime)
  const { hours: endHour, minutes: endMinute } = parseTimeString(endTime)

  let currentTime = setMinutes(setHours(date, startHour), startMinute)
  const dayEnd = setMinutes(setHours(date, endHour), endMinute)

  let breakStartTime: Date | null = null
  let breakEndTime: Date | null = null
  
  if (breakStart && breakDuration) {
    const { hours: breakHour, minutes: breakMinute } = parseTimeString(breakStart)
    breakStartTime = setMinutes(setHours(date, breakHour), breakMinute)
    breakEndTime = new Date(breakStartTime.getTime() + breakDuration * 60 * 1000)
  }

  while (currentTime.getTime() + duration * 60 * 1000 <= dayEnd.getTime()) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000)
    
    if (breakStartTime && breakEndTime) {
      const slotOverlapsBreak = areIntervalsOverlapping(
        { start: currentTime, end: slotEnd },
        { start: breakStartTime, end: breakEndTime }
      )
      
      if (!slotOverlapsBreak) {
        slots.push({
          startTime: currentTime,
          endTime: slotEnd,
        })
      }
    } else {
      slots.push({
        startTime: currentTime,
        endTime: slotEnd,
      })
    }

    currentTime = new Date(currentTime.getTime() + (duration + bufferAfter + bufferBefore) * 60 * 1000)
  }

  return slots
}

export const scheduleRouter = router({
  // Create schedule
  create: protectedProcedure
    .input(CreateScheduleSchema)
    .mutation(async ({ ctx, input }) => {
      const instructorId = input.instructorId || ctx.session.user.id

      if (instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to manage other instructor schedules',
          })
        }
      }

      const instructor = await ctx.db.user.findFirst({
        where: {
          id: instructorId,
          role: UserRole.INSTRUCTOR,
          status: 'ACTIVE',
        },
      })

      if (!instructor) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Instructor not found or not active',
        })
      }

      if (timeToMinutes(input.startTime) >= timeToMinutes(input.endTime)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'End time must be after start time',
        })
      }

      const existing = await ctx.db.instructorSchedule.findFirst({
        where: {
          instructorId,
          dayOfWeek: input.dayOfWeek,
        },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Schedule already exists for this day',
        })
      }

      const schedule = await ctx.db.instructorSchedule.create({
        data: {
          instructorId,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
          locationId: input.locationId,
          maxBookings: input.maxBookings,
          breakStart: input.breakStart,
          breakDuration: input.breakDuration,
          bufferBefore: input.bufferBefore,
          bufferAfter: input.bufferAfter,
          nightDriving: input.nightDriving,
          earlyMorning: input.earlyMorning,
          notes: input.notes,
          isAvailable: true,
        },
        include: {
          instructor: true,
          location: true,
        },
      })

      return schedule
    }),

  // Update schedule
  update: protectedProcedure
    .input(UpdateScheduleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const existing = await ctx.db.instructorSchedule.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Schedule not found',
        })
      }

      if (existing.instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to update this schedule',
          })
        }
      }

      if (data.startTime || data.endTime) {
        const startTime = data.startTime || existing.startTime
        const endTime = data.endTime || existing.endTime
        
        if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'End time must be after start time',
          })
        }
      }

      const schedule = await ctx.db.instructorSchedule.update({
        where: { id },
        data,
        include: {
          instructor: true,
          location: true,
        },
      })

      return schedule
    }),

  // Delete schedule
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.instructorSchedule.findUnique({
        where: { id: input },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Schedule not found',
        })
      }

      if (existing.instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to delete this schedule',
          })
        }
      }

      const today = new Date()
      const futureBookings = await ctx.db.booking.count({
        where: {
          instructorId: existing.instructorId,
          startTime: { gte: today },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
      })

      if (futureBookings > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete schedule with ${futureBookings} future bookings`,
        })
      }

      await ctx.db.instructorSchedule.delete({
        where: { id: input },
      })

      return { success: true }
    }),

  // Get instructor schedules
  getInstructorSchedules: protectedProcedure
    .input(z.object({
      instructorId: z.string().optional(),
      includeUnavailable: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = input.instructorId || ctx.session.user.id

      if (instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role === UserRole.STUDENT) {
          input.includeUnavailable = false
        }
      }

      const where: any = {
        instructorId,
      }

      if (!input.includeUnavailable) {
        where.isAvailable = true
      }

      const schedules = await ctx.db.instructorSchedule.findMany({
        where,
        include: {
          instructor: true,
          location: true,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      })

      return schedules
    }),

  // Get weekly view
  getWeeklySchedule: protectedProcedure
    .input(z.object({
      instructorId: z.string().optional(),
      weekStart: z.string().datetime(),
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = input.instructorId || ctx.session.user.id
      const weekStart = startOfWeek(new Date(input.weekStart), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

      const schedules = await ctx.db.instructorSchedule.findMany({
        where: {
          instructorId,
          isAvailable: true,
        },
        include: {
          location: true,
        },
      })

      const exceptions = await ctx.db.scheduleException.findMany({
        where: {
          instructorId,
          startDate: { lte: weekEnd },
          endDate: { gte: weekStart },
        },
      })

      const bookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          startTime: { gte: weekStart },
          endTime: { lte: weekEnd },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
        include: {
          student: true,
          vehicle: true,
          location: true,
        },
      })

      const weeklyView: WeeklyViewDay[] = []
      
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(weekStart, i)
        const dayOfWeek = getDay(currentDate)
        
        const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek)
        
        const dayExceptions = exceptions.filter(e => {
          const exceptionStart = new Date(e.startDate)
          const exceptionEnd = new Date(e.endDate)
          return currentDate >= exceptionStart && currentDate <= exceptionEnd
        })
        
        const dayBookings = bookings.filter(b => {
          const bookingDate = new Date(b.startTime)
          return format(bookingDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
        })

        const hasBlockingException = dayExceptions.some(e => 
          e.type === ScheduleExceptionType.VACATION || 
          e.type === ScheduleExceptionType.SICK_LEAVE ||
          e.type === ScheduleExceptionType.HOLIDAY
        )

        // Properly typed availableSlots
        let availableSlots: TimeSlot[] = []
        
        if (daySchedule && !hasBlockingException) {
          const allSlots = generateTimeSlots(
            currentDate,
            daySchedule.startTime,
            daySchedule.endTime,
            120,
            daySchedule.bufferBefore,
            daySchedule.bufferAfter,
            daySchedule.breakStart || undefined,
            daySchedule.breakDuration || undefined
          )

          availableSlots = allSlots.filter(slot => {
            return !dayBookings.some(booking => {
              return areIntervalsOverlapping(
                { start: slot.startTime, end: slot.endTime },
                { start: new Date(booking.startTime), end: new Date(booking.endTime) }
              )
            })
          })
        }

        weeklyView.push({
          date: currentDate,
          dayOfWeek,
          schedule: daySchedule,
          exceptions: dayExceptions,
          bookings: dayBookings,
          availableSlots,
          isAvailable: Boolean(daySchedule && !hasBlockingException && daySchedule.isAvailable),
        })
      }

      return weeklyView
    }),

  // Create schedule template
  createTemplate: protectedProcedure
    .input(CreateScheduleTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== UserRole.INSTRUCTOR &&
          ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only instructors can create schedule templates',
        })
      }

      const template = await ctx.db.scheduleTemplate.create({
        data: {
          instructorId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          weekPattern: input.weekPattern,
        },
      })

      return template
    }),

  // Apply schedule template
  applyTemplate: protectedProcedure
    .input(z.object({
      templateId: z.string(),
      clearExisting: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.scheduleTemplate.findUnique({
        where: { id: input.templateId },
      })

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        })
      }

      if (template.instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to use this template',
          })
        }
      }

      if (input.clearExisting) {
        await ctx.db.instructorSchedule.deleteMany({
          where: {
            instructorId: template.instructorId,
          },
        })
      }

      const weekPattern = template.weekPattern as any[]
      const createdSchedules = []

      for (const pattern of weekPattern) {
        const existing = await ctx.db.instructorSchedule.findFirst({
          where: {
            instructorId: template.instructorId,
            dayOfWeek: pattern.dayOfWeek,
          },
        })

        if (!existing) {
          const schedule = await ctx.db.instructorSchedule.create({
            data: {
              instructorId: template.instructorId,
              dayOfWeek: pattern.dayOfWeek,
              startTime: pattern.startTime,
              endTime: pattern.endTime,
              locationId: pattern.locationId,
              maxBookings: pattern.maxBookings,
              breakStart: pattern.breakStart,
              breakDuration: pattern.breakDuration,
              bufferBefore: pattern.bufferBefore || 15,
              bufferAfter: pattern.bufferAfter || 15,
              isAvailable: true,
            },
          })
          createdSchedules.push(schedule)
        }
      }

      return {
        applied: createdSchedules.length,
        schedules: createdSchedules,
      }
    }),

  // Create schedule exception
  createException: protectedProcedure
    .input(CreateScheduleExceptionSchema)
    .mutation(async ({ ctx, input }) => {
      const instructorId = input.instructorId || ctx.session.user.id

      if (instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to create exceptions for other instructors',
          })
        }
      }

      const startDate = new Date(input.startDate)
      const endDate = new Date(input.endDate)

      if (endDate < startDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'End date must be after start date',
        })
      }

      const affectedBookings = await ctx.db.booking.count({
        where: {
          instructorId,
          startTime: { gte: startDate },
          endTime: { lte: endDate },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
      })

      const exception = await ctx.db.scheduleException.create({
        data: {
          instructorId,
          type: input.type,
          startDate,
          endDate,
          allDay: input.allDay,
          startTime: input.startTime,
          endTime: input.endTime,
          reason: input.reason,
          description: input.description,
          location: input.location,
          affectsBookings: affectedBookings > 0,
          bookingsReassigned: 0,
          isApproved: ctx.session.user.role === UserRole.ADMIN,
          approvedBy: ctx.session.user.role === UserRole.ADMIN ? ctx.session.user.id : null,
          approvedAt: ctx.session.user.role === UserRole.ADMIN ? new Date() : null,
        },
      })

      return exception
    }),

  // Get schedule exceptions
  getExceptions: protectedProcedure
    .input(z.object({
      instructorId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      type: z.nativeEnum(ScheduleExceptionType).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}

      if (input.instructorId) {
        where.instructorId = input.instructorId
      } else if (ctx.session.user.role === UserRole.INSTRUCTOR) {
        where.instructorId = ctx.session.user.id
      }

      if (input.from || input.to) {
        where.startDate = {}
        if (input.from) {
          where.startDate.gte = new Date(input.from)
        }
        if (input.to) {
          where.startDate.lte = new Date(input.to)
        }
      }

      if (input.type) {
        where.type = input.type
      }

      const exceptions = await ctx.db.scheduleException.findMany({
        where,
        include: {
          instructor: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      })

      return exceptions
    }),

  // Get available instructors for a time slot
  getAvailableInstructors: protectedProcedure
    .input(z.object({
      date: z.string().datetime(),
      duration: z.number().min(60).max(240).default(120),
      locationId: z.string().optional(),
      vehicleCategory: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const requestedDate = new Date(input.date)
      const dayOfWeek = getDay(requestedDate)
      const requestedTime = format(requestedDate, 'HH:mm')
      const endTime = format(addDays(requestedDate, input.duration / (24 * 60)), 'HH:mm')

      const instructors = await ctx.db.user.findMany({
        where: {
          role: UserRole.INSTRUCTOR,
          status: 'ACTIVE',
        },
        include: {
          instructorSchedule: {
            where: {
              dayOfWeek,
              isAvailable: true,
            },
          },
          scheduleExceptions: {
            where: {
              startDate: { lte: requestedDate },
              endDate: { gte: requestedDate },
            },
          },
          instructorBookings: {
            where: {
              startTime: {
                lte: new Date(requestedDate.getTime() + input.duration * 60 * 1000),
              },
              endTime: {
                gte: requestedDate,
              },
              status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
            },
          },
        },
      })

      const availableInstructors = instructors.filter(instructor => {
        const daySchedule = instructor.instructorSchedule[0]
        if (!daySchedule) return false

        if (timeToMinutes(requestedTime) < timeToMinutes(daySchedule.startTime) ||
            timeToMinutes(endTime) > timeToMinutes(daySchedule.endTime)) {
          return false
        }

        const hasException = instructor.scheduleExceptions.some(exception => {
          if (exception.allDay) return true
          if (exception.startTime && exception.endTime) {
            return isTimeOverlapping(
              requestedTime,
              endTime,
              exception.startTime,
              exception.endTime
            )
          }
          return false
        })
        if (hasException) return false

        const hasConflict = instructor.instructorBookings.length > 0
        if (hasConflict) return false

        if (input.locationId && daySchedule.locationId !== input.locationId) {
          return false
        }

        return true
      })

      return availableInstructors.map(instructor => ({
        id: instructor.id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        rating: instructor.rating,
        totalLessons: instructor.totalLessons,
        specializations: instructor.specializations,
        schedule: instructor.instructorSchedule[0],
      }))
    }),

  // Get schedule statistics
  getStatistics: protectedProcedure
    .input(z.object({
      instructorId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = input.instructorId || ctx.session.user.id

      if (instructorId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view these statistics',
          })
        }
      }

      const dateFilter = {
        gte: input.from ? new Date(input.from) : undefined,
        lte: input.to ? new Date(input.to) : undefined,
      }

      const schedules = await ctx.db.instructorSchedule.findMany({
        where: { instructorId },
      })

      const bookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          startTime: dateFilter,
        },
      })

      const exceptions = await ctx.db.scheduleException.findMany({
        where: {
          instructorId,
          startDate: dateFilter,
        },
      })

      const stats = {
        totalScheduledHours: 0,
        totalBookedHours: 0,
        totalCompletedHours: 0,
        utilizationRate: 0,
        cancellationRate: 0,
        noShowRate: 0,
        averageBookingsPerDay: 0,
        totalExceptions: exceptions.length,
        exceptionsByType: {} as Record<string, number>,
        bookingsByStatus: {} as Record<string, number>,
        bookingsByDayOfWeek: {} as Record<number, number>,
        peakHours: {} as Record<string, number>,
      }

      schedules.forEach(schedule => {
        const startMin = timeToMinutes(schedule.startTime)
        const endMin = timeToMinutes(schedule.endTime)
        const breakMin = schedule.breakDuration || 0
        stats.totalScheduledHours += (endMin - startMin - breakMin) / 60
      })

      bookings.forEach(booking => {
        const hours = booking.duration / 60
        stats.totalBookedHours += hours

        if (booking.status === 'COMPLETED') {
          stats.totalCompletedHours += hours
        }

        stats.bookingsByStatus[booking.status] = 
          (stats.bookingsByStatus[booking.status] || 0) + 1

        const dayOfWeek = getDay(new Date(booking.startTime))
        stats.bookingsByDayOfWeek[dayOfWeek] = 
          (stats.bookingsByDayOfWeek[dayOfWeek] || 0) + 1

        const hour = format(new Date(booking.startTime), 'HH:00')
        stats.peakHours[hour] = (stats.peakHours[hour] || 0) + 1
      })

      exceptions.forEach(exception => {
        stats.exceptionsByType[exception.type] = 
          (stats.exceptionsByType[exception.type] || 0) + 1
      })

      if (bookings.length > 0) {
        stats.cancellationRate = 
          ((stats.bookingsByStatus['CANCELLED'] || 0) / bookings.length) * 100
        stats.noShowRate = 
          ((stats.bookingsByStatus['NO_SHOW'] || 0) / bookings.length) * 100
      }

      if (stats.totalScheduledHours > 0) {
        stats.utilizationRate = 
          (stats.totalCompletedHours / stats.totalScheduledHours) * 100
      }

      return stats
    }),
})