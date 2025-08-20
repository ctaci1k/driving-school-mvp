import { router, protectedProcedure } from '../server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { addHours, format } from 'date-fns'
import { sendEmail, bookingConfirmationEmail } from '@/lib/email'

export const bookingRouter = router({
  create: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      startTime: z.date(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Fixed 2-hour duration for MVP
      const endTime = addHours(input.startTime, 2)

      // Check for conflicts
      const conflict = await ctx.db.booking.findFirst({
        where: {
          instructorId: input.instructorId,
          status: { not: 'CANCELLED' },
          OR: [
            {
              AND: [
                { startTime: { lte: input.startTime } },
                { endTime: { gt: input.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      })

      if (conflict) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This time slot is already booked',
        })
      }

      const booking = await ctx.db.booking.create({
        data: {
          studentId: ctx.session.user.id,
          instructorId: input.instructorId,
          startTime: input.startTime,
          endTime,
          notes: input.notes,
        },
        include: {
          instructor: true,
          student: true,
        },
      })
      
      // В методі create після створення booking:
      if (booking) {
        // Send confirmation email (mock for MVP)
        await sendEmail(bookingConfirmationEmail(
          ctx.session.user.email,
          {
            studentName: `${booking.student.firstName} ${booking.student.lastName}`,
            instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
            date: format(booking.startTime, 'EEEE, MMMM d, yyyy'),
            time: `${format(booking.startTime, 'HH:mm')} - ${format(booking.endTime, 'HH:mm')}`
          }
        ))
      }
      
      return booking
    }),

  list: protectedProcedure
    .input(z.object({
      role: z.enum(['student', 'instructor', 'admin']).optional(),
      status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}

      if (ctx.session.user.role === 'STUDENT') {
        where.studentId = ctx.session.user.id
      } else if (ctx.session.user.role === 'INSTRUCTOR') {
        where.instructorId = ctx.session.user.id
      }

      if (input.status) {
        where.status = input.status
      }

      const bookings = await ctx.db.booking.findMany({
        where,
        include: {
          instructor: true,
          student: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      })

      return bookings
    }),

  cancel: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }

      // Check permissions
      if (
        ctx.session.user.role !== 'ADMIN' &&
        booking.studentId !== ctx.session.user.id &&
        booking.instructorId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot cancel this booking',
        })
      }

      const updated = await ctx.db.booking.update({
        where: { id: input.id },
        data: { status: 'CANCELLED' },
      })

      return updated
    }),

  getAvailableSlots: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      date: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Get instructor's schedule for the day
      const dayOfWeek = input.date.getDay()
      
      const schedule = await ctx.db.instructorSchedule.findUnique({
        where: {
          instructorId_dayOfWeek: {
            instructorId: input.instructorId,
            dayOfWeek,
          },
        },
      })

      if (!schedule || !schedule.isAvailable) {
        return []
      }

      // Get existing bookings for the day
      const startOfDay = new Date(input.date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(input.date)
      endOfDay.setHours(23, 59, 59, 999)

      const bookings = await ctx.db.booking.findMany({
        where: {
          instructorId: input.instructorId,
          status: { not: 'CANCELLED' },
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      })

      // Generate available slots
      const slots = []
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number)
      
      let currentTime = new Date(input.date)
      currentTime.setHours(startHour, startMinute, 0, 0)
      
      const dayEnd = new Date(input.date)
      dayEnd.setHours(endHour, endMinute, 0, 0)

      while (currentTime < dayEnd) {
        const slotEnd = addHours(currentTime, 2) // 2-hour slots
        
        // Check if slot is available
        const isBooked = bookings.some(booking => {
          return (
            (currentTime >= booking.startTime && currentTime < booking.endTime) ||
            (slotEnd > booking.startTime && slotEnd <= booking.endTime)
          )
        })

        if (!isBooked && slotEnd <= dayEnd && currentTime > new Date()) {
          slots.push({
            startTime: new Date(currentTime),
            endTime: new Date(slotEnd),
            available: true,
          })
        }

        currentTime = slotEnd
      }

      return slots
    }),
})