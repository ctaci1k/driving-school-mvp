// lib/trpc/routers/booking.ts 

import { router, protectedProcedure } from '../server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { BookingStatus } from '@prisma/client'
import { addHours, addDays, addWeeks, format, addMinutes  } from 'date-fns'


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
          message: 'Instruktor jest zajęty w tym czasie',
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
            message: 'Pojazd jest zajęty w tym czasie',
          })
        }

        // Перевірка що автомобіль активний
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

      // Перевірка локації
      const location = await ctx.db.location.findUnique({
        where: { id: input.locationId },
      })

      if (!location || !location.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Lokalizacja niedostępna',
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
          subject: 'Potwierdzenie rezerwacji',
          content: `Twoja lekcja zarezerwowana na ${format(startTime, 'dd.MM.yyyy HH:mm')}`,
          metadata: {
            bookingId: booking.id,
            instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
            locationName: booking.location?.name || 'Nie określono',
          },
          status: 'PENDING',
        },
      })

      return booking
    }),

  // Створити повторювані бронювання
  createRecurring: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      startTime: z.date().or(z.string()).transform(val => new Date(val)),
      vehicleId: z.string().optional(),
      locationId: z.string(),
      notes: z.string().optional(),
      isRecurring: z.boolean().optional(),
      recurringSettings: z.object({
        pattern: z.enum(['daily', 'weekly', 'biweekly']),
        endType: z.enum(['count', 'date']),
        count: z.number().optional(),
        endDate: z.date().or(z.string()).transform(val => new Date(val)).optional(),
        skipWeekends: z.boolean()
      }).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Якщо не повторювані - створюємо одне бронювання
      if (!input.isRecurring || !input.recurringSettings) {
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
            ],
          },
        })

        if (instructorConflict) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Instruktor jest zajęty w tym czasie',
          })
        }

        // Створення одиночного бронювання
        return await ctx.db.booking.create({
          data: {
            studentId: ctx.session.user.id,
            instructorId: input.instructorId,
            vehicleId: input.vehicleId,
            locationId: input.locationId,
            startTime,
            endTime,
            duration: 120,
            status: 'CONFIRMED',
            notes: input.notes,
            price: 200,
            isPaid: false,
          },
          include: {
            instructor: true,
            student: true,
            vehicle: true,
            location: true,
          },
        })
      }

      // Створення повторюваних бронювань
      const { recurringSettings } = input
      const conflicts = []
      
      let currentDate = new Date(input.startTime)
      const dates: Date[] = []
      
      // Генерація дат для серії
      if (recurringSettings.endType === 'count' && recurringSettings.count) {
        for (let i = 0; i < recurringSettings.count; i++) {
          // Пропускаємо вихідні якщо потрібно
          if (recurringSettings.skipWeekends && recurringSettings.pattern === 'daily') {
            while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
              currentDate = addDays(currentDate, 1)
            }
          }
          
          dates.push(new Date(currentDate))
          
          // Наступна дата
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
          // Пропускаємо вихідні якщо потрібно
          if (recurringSettings.skipWeekends && recurringSettings.pattern === 'daily') {
            while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
              currentDate = addDays(currentDate, 1)
            }
          }
          
          if (currentDate <= endDate) {
            dates.push(new Date(currentDate))
          }
          
          // Наступна дата
          if (recurringSettings.pattern === 'daily') {
            currentDate = addDays(currentDate, 1)
          } else if (recurringSettings.pattern === 'weekly') {
            currentDate = addWeeks(currentDate, 1)
          } else if (recurringSettings.pattern === 'biweekly') {
            currentDate = addWeeks(currentDate, 2)
          }
        }
      }

      // Перевірка конфліктів для всіх дат
      for (const date of dates) {
        const startTime = new Date(date)
        const endTime = addHours(startTime, 2)
        
        const conflict = await ctx.db.booking.findFirst({
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
            ],
          },
        })
        
        if (conflict) {
          conflicts.push(format(startTime, 'dd.MM.yyyy HH:mm'))
        }
      }

      // Якщо є конфлікти - повідомляємо
      if (conflicts.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Niedostępne daty: ${conflicts.join(', ')}. Spróbuj inny czas lub zmniejsz liczbę lekcji.`,
        })
      }

      // Створюємо всі бронювання в транзакції
      const createdBookings = await ctx.db.$transaction(async (tx) => {
        const results = []
        
        for (const date of dates) {
          const startTime = new Date(date)
          const endTime = addHours(startTime, 2)
          
          const booking = await tx.booking.create({
            data: {
              studentId: ctx.session.user.id,
              instructorId: input.instructorId,
              vehicleId: input.vehicleId,
              locationId: input.locationId,
              startTime,
              endTime,
              duration: 120,
              status: 'CONFIRMED',
              notes: input.notes,
              price: 200,
              isPaid: false,
            },
            include: {
              instructor: true,
              student: true,
              vehicle: true,
              location: true,
            },
          })
          
          results.push(booking)
        }
        
        return results
      })

      // Створюємо повідомлення
      await ctx.db.notification.create({
        data: {
          userId: ctx.session.user.id,
          type: 'BOOKING_CONFIRMATION',
          channel: 'EMAIL',
          subject: 'Potwierdzenie serii rezerwacji',
          content: `Zarezerwowano ${createdBookings.length} lekcji. Pierwsza lekcja: ${format(createdBookings[0].startTime, 'dd.MM.yyyy HH:mm')}`,
          metadata: {
            bookingIds: createdBookings.map(b => b.id),
            count: createdBookings.length,
          },
          status: 'PENDING',
        },
      })

      return createdBookings
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
          message: 'Rezerwacja nie znaleziona',
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
          message: 'Nie możesz anulować tej rezerwacji',
        })
      }

      // Перевірка часу (не можна скасувати менше ніж за 24 години)
      const hoursUntilLesson = (booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntilLesson < 24 && ctx.session.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Nie można anulować mniej niż 24 godziny przed lekcją',
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
            subject: 'Anulowanie rezerwacji',
            content: 'Twoja rezerwacja została anulowana. Środki zostaną zwrócone w ciągu 3-5 dni roboczych.',
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
// lib/trpc/routers/booking.ts
// Знайдіть метод getAvailableSlots і замініть генерацію слотів:

// Otrimati dostupni sloty
getAvailableSlots: protectedProcedure
  .input(z.object({
    instructorId: z.string(),
    date: z.date().or(z.string()).transform(val => new Date(val)),
    vehicleId: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const date = new Date(input.date)
    const dayOfWeek = date.getDay()
    
    // Otrimati rozklad instruktora
    const schedule = await ctx.db.instructorSchedule.findFirst({
      where: {
        instructorId: input.instructorId,
        OR: [
          { dayOfWeek, specificDate: null },
          { specificDate: date },
        ],
      },
      orderBy: {
        specificDate: 'desc',
      },
    })

    if (!schedule || !schedule.isAvailable) {
      return []
    }

    // Wyciągamy wartości bufora z bazy danych
    const BUFFER_BEFORE = schedule.bufferBefore || 15
    const BUFFER_AFTER = schedule.bufferAfter || 15

    // Sprawdzenie wyjątków
    const exceptions = await ctx.db.scheduleException.findMany({
      where: {
        instructorId: input.instructorId,
        startDate: { lte: date },
        endDate: { gte: date }
      }
    })

    if (exceptions.some(e => e.allDay)) {
      return []
    }

    // Otrimati isnujuchi bronuvannia
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await ctx.db.booking.findMany({
      where: {
        OR: [
          {
            instructorId: input.instructorId,
            status: { not: 'CANCELLED' },
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          ...(input.vehicleId ? [{
            vehicleId: input.vehicleId,
            status: { not: BookingStatus.CANCELLED },
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          }] : []),
        ],
      },
    })

    // Generacja slotów
    const slots = []
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number)
    
    let currentTime = new Date(date)
    currentTime.setHours(startHour, startMinute, 0, 0)
    
    const dayEnd = new Date(date)
    dayEnd.setHours(endHour, endMinute, 0, 0)

    const now = new Date()

    while (currentTime < dayEnd) {
      const slotEnd = addHours(currentTime, 2)
      
      // Dodajemy bufor
      const slotStartWithBuffer = addMinutes(currentTime, -BUFFER_BEFORE)
      const slotEndWithBuffer = addMinutes(slotEnd, BUFFER_AFTER)
      
      // Sprawdzamy czy slot z buforem mieści się w godzinach pracy
      const workStart = new Date(date)
      workStart.setHours(startHour, startMinute, 0, 0)
      
      if (slotStartWithBuffer < workStart || slotEndWithBuffer > dayEnd) {
        // Przesuwamy czas i próbujemy następny slot
        currentTime = addMinutes(currentTime, 30)
        continue
      }
      
      // Sprawdzenie konfliktów Z BUFOREM
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(booking.startTime)
        const bookingEnd = new Date(booking.endTime)
        
        // Dodajemy bufor do istniejących rezerwacji
        const bookingStartWithBuffer = addMinutes(bookingStart, -BUFFER_BEFORE)
        const bookingEndWithBuffer = addMinutes(bookingEnd, BUFFER_AFTER)
        
        // Sprawdzamy nakładanie się
        return (
          (slotStartWithBuffer < bookingEndWithBuffer && slotEndWithBuffer > bookingStartWithBuffer)
        )
      })

      // Sprawdzenie wyjątków czasowych
      const hasTimeException = exceptions.some(e => {
        if (e.allDay) return true
        if (!e.startTime || !e.endTime) return false
        
        const [excStartHour, excStartMin] = e.startTime.split(':').map(Number)
        const [excEndHour, excEndMin] = e.endTime.split(':').map(Number)
        
        const excStart = new Date(date)
        excStart.setHours(excStartHour, excStartMin, 0, 0)
        
        const excEnd = new Date(date)
        excEnd.setHours(excEndHour, excEndMin, 0, 0)
        
        return (
          (currentTime >= excStart && currentTime < excEnd) ||
          (slotEnd > excStart && slotEnd <= excEnd)
        )
      })

      if (!isBooked && !hasTimeException && slotEndWithBuffer <= dayEnd && currentTime > now) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(slotEnd),
          available: true,
          // Informacja o buforze dla UI
          bufferBefore: BUFFER_BEFORE,
          bufferAfter: BUFFER_AFTER,
        })
      }

      // Następny slot zaczyna się PO buforze
      currentTime = slotEndWithBuffer
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
          message: 'Rezerwacja nie znaleziona',
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
          message: 'Brak dostępu do tej rezerwacji',
        })
      }

      return booking
    }),
})