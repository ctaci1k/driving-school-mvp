// lib/trpc/routers/booking.ts - ПОВНА ВЕРСІЯ З УСІМА ЗВ'ЯЗКАМИ

import { router, protectedProcedure } from '../server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { addHours, format } from 'date-fns'
import { BookingStatus } from '@prisma/client'

export const bookingRouter = router({
  // Створити бронювання
  create: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      startTime: z.date().or(z.string()).transform(val => new Date(val)),
      vehicleId: z.string().optional(),
      locationId: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Фіксована тривалість 2 години для MVP
      const startTime = new Date(input.startTime)
      const endTime = addHours(startTime, 2)

      // Перевірка конфлікту з інструктором
      const instructorConflict = await ctx.db.booking.findFirst({
        where: {
          instructorId: input.instructorId,
          status: { not: 'CANCELLED' },
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

      if (instructorConflict) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Інструктор зайнятий в цей час',
        })
      }

      // Перевірка конфлікту з автомобілем якщо вибрано
      if (input.vehicleId) {
        const vehicleConflict = await ctx.db.booking.findFirst({
          where: {
            vehicleId: input.vehicleId,
            status: { not: 'CANCELLED' },
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

        if (vehicleConflict) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Автомобіль зайнятий в цей час',
          })
        }

        // Перевірка що автомобіль активний
        const vehicle = await ctx.db.vehicle.findUnique({
          where: { id: input.vehicleId },
        })

        if (!vehicle || vehicle.status !== 'ACTIVE') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Автомобіль недоступний',
          })
        }
      }

      // Перевірка локації
      const location = await ctx.db.location.findUnique({
        where: { id: input.locationId },
      })

      if (!location || !location.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Локація недоступна',
        })
      }

      // Створення бронювання
      const booking = await ctx.db.booking.create({
        data: {
          studentId: ctx.session.user.id,
          instructorId: input.instructorId,
          vehicleId: input.vehicleId,
          locationId: input.locationId,
          startTime,
          endTime,
          duration: 120, // 2 години в хвилинах
          status: 'CONFIRMED',
          notes: input.notes,
          price: 200, // Фіксована ціна для MVP
          isPaid: false,
        },
        include: {
          instructor: true,
          student: true,
          vehicle: true,
          location: true,
        },
      })

      // Створення повідомлення (для Phase 2)
      await ctx.db.notification.create({
        data: {
          userId: ctx.session.user.id,
          type: 'BOOKING_CONFIRMATION',
          channel: 'EMAIL',
          subject: 'Підтвердження бронювання',
          content: `Ваш урок заброньовано на ${format(startTime, 'dd.MM.yyyy HH:mm')}`,
metadata: {
  bookingId: booking.id,
  instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
  locationName: booking.location?.name || 'Не вказано',
},
          status: 'PENDING',
        },
      })

      return booking
    }),

  // Отримати список бронювань
  list: protectedProcedure
    .input(z.object({
      status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
      includeVehicle: z.boolean().optional(),
      includeLocation: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {}

      // Фільтр по ролі
      if (ctx.session.user.role === 'STUDENT') {
        where.studentId = ctx.session.user.id
      } else if (ctx.session.user.role === 'INSTRUCTOR') {
        where.instructorId = ctx.session.user.id
      }
      // ADMIN бачить всі

      if (input?.status) {
        where.status = input.status
      }

      const bookings = await ctx.db.booking.findMany({
        where,
        include: {
          instructor: true,
          student: true,
          vehicle: input?.includeVehicle ? true : false,
          location: input?.includeLocation ? true : false,
          payment: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      })

      return bookings
    }),

  // Скасувати бронювання
  cancel: protectedProcedure
    .input(z.object({
      id: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          payment: true,
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Бронювання не знайдено',
        })
      }

      // Перевірка прав
      if (
        ctx.session.user.role !== 'ADMIN' &&
        booking.studentId !== ctx.session.user.id &&
        booking.instructorId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Ви не можете скасувати це бронювання',
        })
      }

      // Перевірка часу (не можна скасувати менше ніж за 24 години)
      const hoursUntilLesson = (booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntilLesson < 24 && ctx.session.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не можна скасувати менше ніж за 24 години до уроку',
        })
      }

      // Оновлення бронювання
      const updated = await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: ctx.session.user.id,
          cancellationReason: input.reason,
        },
      })

      // Якщо було оплачено - створюємо повернення (для Phase 2)
      if (booking.isPaid && booking.payment) {
        // Тут буде логіка повернення коштів
        await ctx.db.notification.create({
          data: {
            userId: booking.studentId,
            type: 'BOOKING_CANCELLED',
            channel: 'EMAIL',
            subject: 'Скасування бронювання',
            content: 'Ваше бронювання скасовано. Кошти будуть повернені протягом 3-5 робочих днів.',
            metadata: {
              bookingId: booking.id,
            },
            status: 'PENDING',
          },
        })
      }

      return updated
    }),

  // Отримати доступні слоти
  getAvailableSlots: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      date: z.date().or(z.string()).transform(val => new Date(val)),
      vehicleId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date)
      const dayOfWeek = date.getDay()
      
      // Отримати розклад інструктора
      const schedule = await ctx.db.instructorSchedule.findFirst({
        where: {
          instructorId: input.instructorId,
          OR: [
            { dayOfWeek, specificDate: null },
            { specificDate: date },
          ],
        },
        orderBy: {
          specificDate: 'desc', // Пріоритет конкретній даті над загальним розкладом
        },
      })

      if (!schedule || !schedule.isAvailable) {
        return []
      }

      // Отримати існуючі бронювання на день
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const bookings = await ctx.db.booking.findMany({
        where: {
          OR: [
            // Бронювання інструктора
            {
              instructorId: input.instructorId,
              status: { not: 'CANCELLED' },
              startTime: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            // Бронювання автомобіля якщо вказано
...(input.vehicleId ? [{
  vehicleId: input.vehicleId,
  status: { not: BookingStatus.CANCELLED }, // <-- Використовуйте enum
  startTime: {
    gte: startOfDay,
    lte: endOfDay,
  },
}] : []),
          ],
        },
      })

      // Генерація доступних слотів
      const slots = []
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number)
      
      let currentTime = new Date(date)
      currentTime.setHours(startHour, startMinute, 0, 0)
      
      const dayEnd = new Date(date)
      dayEnd.setHours(endHour, endMinute, 0, 0)

      const now = new Date()

      while (currentTime < dayEnd) {
        const slotEnd = addHours(currentTime, 2) // 2-годинні слоти
        
        // Перевірка чи слот не зайнятий
        const isBooked = bookings.some(booking => {
          const bookingStart = new Date(booking.startTime)
          const bookingEnd = new Date(booking.endTime)
          return (
            (currentTime >= bookingStart && currentTime < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (currentTime <= bookingStart && slotEnd >= bookingEnd)
          )
        })

        // Додаємо слот якщо він вільний і в майбутньому
        if (!isBooked && slotEnd <= dayEnd && currentTime > now) {
          slots.push({
            startTime: new Date(currentTime),
            endTime: new Date(slotEnd),
            available: true,
          })
        }

        currentTime = new Date(slotEnd)
      }

      return slots
    }),

  // Отримати деталі бронювання
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
          message: 'Бронювання не знайдено',
        })
      }

      // Перевірка доступу
      if (
        ctx.session.user.role !== 'ADMIN' &&
        booking.studentId !== ctx.session.user.id &&
        booking.instructorId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Немає доступу до цього бронювання',
        })
      }

      return booking
    }),
})