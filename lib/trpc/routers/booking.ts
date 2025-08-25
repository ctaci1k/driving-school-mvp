// lib/trpc/routers/booking.ts

import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { 
  BookingStatus, 
  LessonType,
  UserRole,
  Prisma
} from '@prisma/client'
import { 
  addHours, 
  addDays, 
  addWeeks, 
  startOfDay, 
  endOfDay,
  format,
  isBefore,
  isAfter,
  differenceInMinutes
} from 'date-fns'

// ====== VALIDATION SCHEMAS ======
const CreateBookingSchema = z.object({
  instructorId: z.string(),
  vehicleId: z.string().optional(),
  locationId: z.string(),
  startTime: z.string().datetime(),
  lessonType: z.nativeEnum(LessonType).default(LessonType.STANDARD),
  notes: z.string().optional(),
  useCredits: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurringSettings: z.object({
    pattern: z.enum(['daily', 'weekly', 'biweekly']),
    endType: z.enum(['date', 'count']),
    endDate: z.string().datetime().optional(),
    count: z.number().min(1).max(20).optional(),
    skipWeekends: z.boolean().default(true),
  }).optional(),
})

const UpdateBookingSchema = z.object({
  id: z.string(),
  startTime: z.string().datetime().optional(),
  vehicleId: z.string().optional(),
  locationId: z.string().optional(),
  lessonType: z.nativeEnum(LessonType).optional(),
  notes: z.string().optional(),
})

const CancelBookingSchema = z.object({
  id: z.string(),
  reason: z.string().min(1),
})

const BookingListSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  studentId: z.string().optional(),
  instructorId: z.string().optional(),
  vehicleId: z.string().optional(),
  locationId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  orderBy: z.enum(['startTime', 'createdAt', 'status']).default('startTime'),
  orderDirection: z.enum(['asc', 'desc']).default('asc'),
}).optional()

const MyBookingsSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  period: z.enum(['upcoming', 'past', 'today', 'week', 'month']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().min(1).max(50).default(10),
  cursor: z.string().optional(),
}).optional()

// ====== HELPER FUNCTIONS ======
async function checkInstructorAvailability(
  prisma: any,
  instructorId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
) {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      instructorId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { 
        notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED] 
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    },
  })

  return !conflictingBooking
}

async function checkVehicleAvailability(
  prisma: any,
  vehicleId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
) {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      vehicleId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { 
        notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED] 
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    },
  })

  return !conflictingBooking
}

async function getInstructorSchedule(
  prisma: any,
  instructorId: string,
  dayOfWeek: number
) {
  return await prisma.instructorSchedule.findFirst({
    where: {
      instructorId,
      dayOfWeek,
      isAvailable: true,
    },
  })
}

// Helper function to build WHERE clause based on user role and filters
function buildBookingWhereClause(
  user: any,
  input: any
): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput = {}

  // Role-based filtering
  if (user.role === UserRole.STUDENT) {
    where.studentId = user.id
  } else if (user.role === UserRole.INSTRUCTOR) {
    where.instructorId = user.id
  } else if (user.role === UserRole.BRANCH_MANAGER) {
    // Branch manager sees only bookings from their location
    if (user.locationId) {
      where.locationId = user.locationId
    }
  } else if (user.role === UserRole.DISPATCHER) {
    // Dispatcher sees bookings from their location or all if no location
    if (user.locationId) {
      where.locationId = user.locationId
    }
  }
  // ADMIN sees all - no filter

  // Apply additional filters
  if (input?.status) {
    where.status = input.status
  }

  if (input?.studentId) {
    where.studentId = input.studentId
  }

  if (input?.instructorId) {
    where.instructorId = input.instructorId
  }

  if (input?.vehicleId) {
    where.vehicleId = input.vehicleId
  }

  if (input?.locationId) {
    where.locationId = input.locationId
  }

  // Date range filter
  if (input?.from || input?.to) {
    where.startTime = {}
    if (input.from) {
      where.startTime.gte = new Date(input.from)
    }
    if (input.to) {
      where.startTime.lte = new Date(input.to)
    }
  }

  return where
}

// Helper for period-based filtering
function getPeriodDateRange(period: string): { from: Date; to: Date } {
  const now = new Date()
  const today = startOfDay(now)
  
  switch (period) {
    case 'today':
      return {
        from: today,
        to: endOfDay(now),
      }
    case 'week':
      return {
        from: today,
        to: addDays(today, 7),
      }
    case 'month':
      return {
        from: today,
        to: addDays(today, 30),
      }
    case 'upcoming':
      return {
        from: now,
        to: addDays(now, 90), // 3 months ahead
      }
    case 'past':
      return {
        from: addDays(now, -90), // 3 months back
        to: now,
      }
    default:
      return {
        from: addDays(now, -30),
        to: addDays(now, 30),
      }
  }
}

// ====== MAIN ROUTER ======
export const bookingRouter = router({
  // ===== 1. UNIVERSAL LIST METHOD =====
  // Used by frontend components, filters by user role automatically
  list: protectedProcedure
    .input(BookingListSchema)
    .query(async ({ ctx, input }) => {
      try {
        const where = buildBookingWhereClause(ctx.session.user, input)
        
        const [bookings, totalCount] = await Promise.all([
          ctx.db.booking.findMany({
            where,
            take: (input?.limit || 20) + 1,
            cursor: input?.cursor ? { id: input.cursor } : undefined,
            orderBy: {
              [input?.orderBy || 'startTime']: input?.orderDirection || 'asc'
            },
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                }
              },
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                }
              },
              vehicle: {
                select: {
                  id: true,
                  make: true,
                  model: true,
                  registrationNumber: true,
                }
              },
              location: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                }
              },
              payment: true,
            },
          }),
          ctx.db.booking.count({ where })
        ])

        let nextCursor: string | undefined = undefined
        if (bookings.length > (input?.limit || 20)) {
          const nextItem = bookings.pop()
          nextCursor = nextItem!.id
        }

        return {
          items: bookings,
          nextCursor,
          totalCount,
          hasMore: !!nextCursor,
        }
      } catch (error) {
        console.error('Error in booking.list:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nie udało się pobrać rezerwacji',
        })
      }
    }),

  // ===== 2. ADMIN LIST ALL METHOD =====
  // Full access for admins with advanced filtering
  listAll: adminProcedure
    .input(BookingListSchema)
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.BookingWhereInput = {}
        
        // Apply all filters without role restrictions
        if (input?.status) where.status = input.status
        if (input?.studentId) where.studentId = input.studentId
        if (input?.instructorId) where.instructorId = input.instructorId
        if (input?.vehicleId) where.vehicleId = input.vehicleId
        if (input?.locationId) where.locationId = input.locationId
        
        if (input?.from || input?.to) {
          where.startTime = {}
          if (input.from) where.startTime.gte = new Date(input.from)
          if (input.to) where.startTime.lte = new Date(input.to)
        }

        const [bookings, totalCount, stats] = await Promise.all([
          ctx.db.booking.findMany({
            where,
            take: (input?.limit || 20) + 1,
            cursor: input?.cursor ? { id: input.cursor } : undefined,
            orderBy: {
              [input?.orderBy || 'startTime']: input?.orderDirection || 'asc'
            },
            include: {
              instructor: true,
              student: true,
              vehicle: true,
              location: true,
              payment: true,
            },
          }),
          ctx.db.booking.count({ where }),
          // Additional statistics for admin dashboard
          ctx.db.booking.groupBy({
            by: ['status'],
            where,
            _count: true,
          })
        ])

        let nextCursor: string | undefined = undefined
        if (bookings.length > (input?.limit || 20)) {
          const nextItem = bookings.pop()
          nextCursor = nextItem!.id
        }

        // Transform stats into a more usable format
        const statusCounts = stats.reduce((acc, stat) => {
          acc[stat.status] = stat._count
          return acc
        }, {} as Record<BookingStatus, number>)

        return {
          items: bookings,
          nextCursor,
          totalCount,
          hasMore: !!nextCursor,
          statistics: {
            total: totalCount,
            byStatus: statusCounts,
          }
        }
      } catch (error) {
        console.error('Error in booking.listAll:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nie udało się pobrać wszystkich rezerwacji',
        })
      }
    }),

  // ===== 3. GET MY BOOKINGS METHOD =====
  // Optimized for personal dashboard with period filtering
  getMy: protectedProcedure
    .input(MyBookingsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.BookingWhereInput = {}
        
        // Filter by user role
        if (ctx.session.user.role === UserRole.STUDENT) {
          where.studentId = ctx.session.user.id
        } else if (ctx.session.user.role === UserRole.INSTRUCTOR) {
          where.instructorId = ctx.session.user.id
        } else {
          // For admin/branch manager, show their recent interactions
          where.OR = [
            { studentId: ctx.session.user.id },
            { instructorId: ctx.session.user.id },
          ]
        }

        // Apply status filter
        if (input?.status) {
          where.status = input.status
        }

        // Apply period or custom date range
        if (input?.period) {
          const { from, to } = getPeriodDateRange(input.period)
          where.startTime = {
            gte: from,
            lte: to,
          }
        } else if (input?.from || input?.to) {
          where.startTime = {}
          if (input.from) where.startTime.gte = new Date(input.from)
          if (input.to) where.startTime.lte = new Date(input.to)
        }

        const [bookings, upcomingCount, completedCount] = await Promise.all([
          ctx.db.booking.findMany({
            where,
            take: (input?.limit || 10) + 1,
            cursor: input?.cursor ? { id: input.cursor } : undefined,
            orderBy: { startTime: 'asc' },
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                }
              },
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                }
              },
              vehicle: {
                select: {
                  id: true,
                  make: true,
                  model: true,
                  registrationNumber: true,
                }
              },
              location: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                }
              },
              payment: {
                select: {
                  id: true,
                  status: true,
                  amount: true,
                }
              },
            },
          }),
          // Count upcoming bookings
          ctx.db.booking.count({
            where: {
              ...where,
              status: BookingStatus.CONFIRMED,
              startTime: { gte: new Date() }
            }
          }),
          // Count completed bookings
          ctx.db.booking.count({
            where: {
              ...where,
              status: BookingStatus.COMPLETED,
            }
          })
        ])

        let nextCursor: string | undefined = undefined
        if (bookings.length > (input?.limit || 10)) {
          const nextItem = bookings.pop()
          nextCursor = nextItem!.id
        }

        // Calculate summary for user dashboard
        const summary = {
          upcoming: upcomingCount,
          completed: completedCount,
          nextLesson: bookings.find(b => 
            b.status === BookingStatus.CONFIRMED && 
            new Date(b.startTime) > new Date()
          ),
        }

        return {
          items: bookings,
          nextCursor,
          hasMore: !!nextCursor,
          summary,
        }
      } catch (error) {
        console.error('Error in booking.getMy:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nie udało się pobrać Twoich rezerwacji',
        })
      }
    }),

  // ===== EXISTING METHODS (unchanged) =====
  // Create booking
  create: protectedProcedure
    .input(CreateBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const startTime = new Date(input.startTime)
      const endTime = addHours(startTime, 2) // Standard 2-hour lesson

      // Check if booking is in the past
      if (isBefore(startTime, new Date())) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Nie można rezerwować lekcji w przeszłości',
        })
      }

      // Check instructor availability
      const instructorAvailable = await checkInstructorAvailability(
        ctx.db,
        input.instructorId,
        startTime,
        endTime
      )

      if (!instructorAvailable) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Instruktor jest zajęty w tym czasie',
        })
      }

      // Check vehicle availability if specified
      if (input.vehicleId) {
        const vehicleAvailable = await checkVehicleAvailability(
          ctx.db,
          input.vehicleId,
          startTime,
          endTime
        )

        if (!vehicleAvailable) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Pojazd jest zajęty w tym czasie',
          })
        }

        // Verify vehicle is active
        const vehicle = await ctx.db.vehicle.findUnique({
          where: { id: input.vehicleId },
        })

        if (!vehicle || vehicle.status !== 'ACTIVE') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Pojazd niedostępny',
          })
        }
      }

      // Verify location
      const location = await ctx.db.location.findUnique({
        where: { id: input.locationId },
      })

      if (!location || !location.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Lokalizacja niedostępna',
        })
      }

      // Check instructor schedule and buffers
      const dayOfWeek = startTime.getDay()
      const schedule = await getInstructorSchedule(ctx.db, input.instructorId, dayOfWeek)
      
      if (schedule) {
        const [scheduleStartHour, scheduleStartMinute] = schedule.startTime.split(':').map(Number)
        const [scheduleEndHour, scheduleEndMinute] = schedule.endTime.split(':').map(Number)
        
        const lessonStartMinutes = startTime.getHours() * 60 + startTime.getMinutes()
        const lessonEndMinutes = endTime.getHours() * 60 + endTime.getMinutes()
        const scheduleStartMinutes = scheduleStartHour * 60 + scheduleStartMinute
        const scheduleEndMinutes = scheduleEndHour * 60 + scheduleEndMinute
        
        if (
          lessonStartMinutes < scheduleStartMinutes ||
          lessonEndMinutes > scheduleEndMinutes
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Godzina lekcji poza harmonogramem instruktora',
          })
        }
      }

      // Handle recurring bookings
      if (input.isRecurring && input.recurringSettings) {
        const bookings = []
        const { recurringSettings } = input
        let currentDate = new Date(input.startTime)
        const dates: Date[] = []

        // Generate dates for series
        if (recurringSettings.endType === 'count' && recurringSettings.count) {
          for (let i = 0; i < recurringSettings.count; i++) {
            if (recurringSettings.skipWeekends && recurringSettings.pattern === 'daily') {
              while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                currentDate = addDays(currentDate, 1)
              }
            }
            
            dates.push(new Date(currentDate))
            
            if (recurringSettings.pattern === 'daily') {
              currentDate = addDays(currentDate, 1)
            } else if (recurringSettings.pattern === 'weekly') {
              currentDate = addWeeks(currentDate, 1)
            } else if (recurringSettings.pattern === 'biweekly') {
              currentDate = addWeeks(currentDate, 2)
            }
          }
        } else if (recurringSettings.endType === 'date' && recurringSettings.endDate) {
          const endDate = new Date(recurringSettings.endDate)
          
          while (currentDate <= endDate) {
            if (recurringSettings.skipWeekends && recurringSettings.pattern === 'daily') {
              while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                currentDate = addDays(currentDate, 1)
              }
            }
            
            if (currentDate <= endDate) {
              dates.push(new Date(currentDate))
            }
            
            if (recurringSettings.pattern === 'daily') {
              currentDate = addDays(currentDate, 1)
            } else if (recurringSettings.pattern === 'weekly') {
              currentDate = addWeeks(currentDate, 1)
            } else if (recurringSettings.pattern === 'biweekly') {
              currentDate = addWeeks(currentDate, 2)
            }
          }
        }

        // Check conflicts for all dates
        const conflicts = []
        for (const date of dates) {
          const bookingStartTime = new Date(date)
          const bookingEndTime = addHours(bookingStartTime, 2)
          
          const instructorAvailable = await checkInstructorAvailability(
            ctx.db,
            input.instructorId,
            bookingStartTime,
            bookingEndTime
          )
          
          if (!instructorAvailable) {
            conflicts.push(format(bookingStartTime, 'dd.MM.yyyy HH:mm'))
          }
        }

        if (conflicts.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Niedostępne daty: ${conflicts.join(', ')}. Proszę wybrać inne terminy.`,
          })
        }

        // Create all bookings
        for (const date of dates) {
          const bookingStartTime = new Date(date)
          const bookingEndTime = addHours(bookingStartTime, 2)
          
          const booking = await ctx.db.booking.create({
            data: {
              studentId: ctx.session.user.id,
              instructorId: input.instructorId,
              vehicleId: input.vehicleId,
              locationId: input.locationId,
              startTime: bookingStartTime,
              endTime: bookingEndTime,
              duration: 120,
              lessonType: input.lessonType,
              status: BookingStatus.CONFIRMED,
              notes: input.notes,
              price: 200, // TODO: Get from package or settings
              isPaid: false,
            },
          })
          
          bookings.push(booking)
        }

        return bookings
      }

      // Create single booking
      const booking = await ctx.db.booking.create({
        data: {
          studentId: ctx.session.user.id,
          instructorId: input.instructorId,
          vehicleId: input.vehicleId,
          locationId: input.locationId,
          startTime,
          endTime,
          duration: 120,
          lessonType: input.lessonType,
          status: BookingStatus.CONFIRMED,
          notes: input.notes,
          price: 200, // TODO: Get from package or settings
          isPaid: false,
        },
        include: {
          instructor: true,
          student: true,
          vehicle: true,
          location: true,
          payment: true,
        },
      })

      // TODO: Send notification
      // await sendBookingConfirmation(booking)

      return booking
    }),

    
  // Update booking
  update: protectedProcedure
    .input(UpdateBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rezerwacja nie znaleziona',
        })
      }

      // Check permissions
      if (
        ctx.session.user.role !== UserRole.ADMIN &&
        booking.studentId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Brak uprawnień do edycji tej rezerwacji',
        })
      }

      // Check if booking can be modified
      if (booking.status === BookingStatus.COMPLETED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Nie można edytować zakończonej lekcji',
        })
      }

      // If changing time, check availability
      if (input.startTime) {
        const startTime = new Date(input.startTime)
        const endTime = addHours(startTime, 2)

        const instructorAvailable = await checkInstructorAvailability(
          ctx.db,
          booking.instructorId,
          startTime,
          endTime,
          input.id
        )

        if (!instructorAvailable) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Instruktor jest zajęty w tym czasie',
          })
        }

        if (input.vehicleId || booking.vehicleId) {
          const vehicleId = input.vehicleId || booking.vehicleId
          const vehicleAvailable = await checkVehicleAvailability(
            ctx.db,
            vehicleId!,
            startTime,
            endTime,
            input.id
          )

          if (!vehicleAvailable) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Pojazd jest zajęty w tym czasie',
            })
          }
        }
      }

      // Update booking
      return await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          startTime: input.startTime ? new Date(input.startTime) : undefined,
          endTime: input.startTime ? addHours(new Date(input.startTime), 2) : undefined,
          vehicleId: input.vehicleId,
          locationId: input.locationId,
          lessonType: input.lessonType,
          notes: input.notes,
          status: input.startTime ? BookingStatus.RESCHEDULED : undefined,
        },
        include: {
          instructor: true,
          student: true,
          vehicle: true,
          location: true,
          payment: true,
        },
      })
    }),

  // Cancel booking
  cancel: protectedProcedure
    .input(CancelBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rezerwacja nie znaleziona',
        })
      }

      // Check permissions
      if (
        ctx.session.user.role !== UserRole.ADMIN &&
        ctx.session.user.role !== UserRole.INSTRUCTOR &&
        booking.studentId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Brak uprawnień do anulowania tej rezerwacji',
        })
      }

      // Check if can be cancelled
      if (booking.status === BookingStatus.COMPLETED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Nie można anulować zakończonej lekcji',
        })
      }

      // Check cancellation policy (24h before)
      const hoursUntilLesson = differenceInMinutes(new Date(booking.startTime), new Date()) / 60
      if (hoursUntilLesson < 24 && ctx.session.user.role === UserRole.STUDENT) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Lekcję można anulować minimum 24 godziny przed rozpoczęciem',
        })
      }

      // Cancel booking
      const cancelledBooking = await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelledBy: ctx.session.user.id,
          cancellationReason: input.reason,
        },
        include: {
          instructor: true,
          student: true,
          vehicle: true,
          location: true,
        },
      })

      // TODO: Send cancellation notification
      // await sendCancellationNotification(cancelledBooking)

      return cancelledBooking
    }),

  // Get booking by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input },
        include: {
          instructor: true,
          student: true,
          vehicle: true,
          location: true,
          payment: true,
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rezerwacja nie znaleziona',
        })
      }

      // Check permissions
      if (
        ctx.session.user.role !== UserRole.ADMIN &&
        booking.studentId !== ctx.session.user.id &&
        booking.instructorId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Brak dostępu do tej rezerwacji',
        })
      }

      return booking
    }),

  // Get available slots
  getAvailableSlots: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      date: z.string().datetime(),
      vehicleId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date)
      const dayOfWeek = date.getDay()

      // Get instructor schedule for this day
      const schedule = await ctx.db.instructorSchedule.findFirst({
        where: {
          instructorId: input.instructorId,
          dayOfWeek,
          isAvailable: true,
        },
      })

      if (!schedule) {
        return []
      }

      // Get existing bookings for this day
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const existingBookings = await ctx.db.booking.findMany({
        where: {
          instructorId: input.instructorId,
          status: { 
            notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED] 
          },
          startTime: { gte: dayStart },
          endTime: { lte: dayEnd },
        },
        orderBy: { startTime: 'asc' },
      })

      // Generate available slots
      const slots = []
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number)

      const scheduleStart = new Date(date)
      scheduleStart.setHours(startHour, startMinute, 0, 0)

      const scheduleEnd = new Date(date)
      scheduleEnd.setHours(endHour, endMinute, 0, 0)

      const slotDuration = 120 // 2 hours in minutes
      const bufferBefore = schedule.bufferBefore || 15
      const bufferAfter = schedule.bufferAfter || 15

      let currentTime = scheduleStart.getTime()
      const now = new Date().getTime()

      while (currentTime + slotDuration * 60 * 1000 <= scheduleEnd.getTime()) {
        const slotStart = new Date(currentTime)
        const slotEnd = new Date(currentTime + slotDuration * 60 * 1000)

        // Check if slot is in the past
        if (slotStart.getTime() <= now) {
          currentTime += 30 * 60 * 1000 // Move to next 30-minute slot
          continue
        }

        // Check for conflicts with existing bookings
        const hasConflict = existingBookings.some(booking => {
          const bookingStartWithBuffer = new Date(booking.startTime.getTime() - bufferBefore * 60 * 1000)
          const bookingEndWithBuffer = new Date(booking.endTime.getTime() + bufferAfter * 60 * 1000)
          
          return (
            (slotStart >= bookingStartWithBuffer && slotStart < bookingEndWithBuffer) ||
            (slotEnd > bookingStartWithBuffer && slotEnd <= bookingEndWithBuffer) ||
            (slotStart <= bookingStartWithBuffer && slotEnd >= bookingEndWithBuffer)
          )
        })

        if (!hasConflict) {
          // Check vehicle availability if specified
          if (input.vehicleId) {
            const vehicleAvailable = await checkVehicleAvailability(
              ctx.db,
              input.vehicleId,
              slotStart,
              slotEnd
            )

            if (vehicleAvailable) {
              slots.push({
                startTime: slotStart,
                endTime: slotEnd,
                available: true,
                bufferBefore,
                bufferAfter,
              })
            }
          } else {
            slots.push({
              startTime: slotStart,
              endTime: slotEnd,
              available: true,
              bufferBefore,
              bufferAfter,
            })
          }
        }

        currentTime += 30 * 60 * 1000 // Move to next 30-minute slot
      }

      return slots
    }),

  // Keep the old getMyBookings for backward compatibility
// lib/trpc/routers/booking.ts
// Додати ці методи в існуючий роутер:

getMyBookings: protectedProcedure
  .input(z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED']).optional(),
    upcoming: z.boolean().optional(),
    past: z.boolean().optional(),
    lessonType: z.string().optional(),
    instructorId: z.string().optional()
  }).optional())
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const now = new Date()
    
    const where: any = {
      studentId: userId
    }
    
    if (input?.status) {
      where.status = input.status
    }
    
    if (input?.upcoming) {
      where.startTime = { gte: now }
      where.status = where.status || 'CONFIRMED'
    }
    
    if (input?.past) {
      where.startTime = { lt: now }
    }
    
    if (input?.lessonType) {
      where.lessonType = input.lessonType
    }
    
    if (input?.instructorId) {
      where.instructorId = input.instructorId
    }
    
    const bookings = await ctx.db.booking.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            rating: true
          }
        },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            registrationNumber: true,
            category: true,
            transmission: true,
            fuelType: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true,
            city: true,
            postalCode: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })
    
    return bookings
  }),

getStudentBookings: protectedProcedure
  .input(z.object({
    studentId: z.string(),
    startDate: z.date().optional(),
    endDate: z.date().optional()
  }))
  .query(async ({ ctx, input }) => {
    // Перевірка що це інструктор або адмін
    const userRole = ctx.session.user.role
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only instructors and admins can access this'
      })
    }
    
    const where: any = {
      studentId: input.studentId
    }
    
    if (input.startDate && input.endDate) {
      where.startTime = {
        gte: input.startDate,
        lte: input.endDate
      }
    }
    
    const bookings = await ctx.db.booking.findMany({
      where,
      include: {
        student: true,
        instructor: true,
        vehicle: true,
        location: true,
        payment: true
      },
      orderBy: {
        startTime: 'desc'
      }
    })
    
    return bookings
  }),
})