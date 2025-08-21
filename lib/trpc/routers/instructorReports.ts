// lib/trpc/routers/instructorReports.ts

import { router, protectedProcedure, instructorProcedure } from '../server'
import { z } from 'zod'
import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export const instructorReportsRouter = router({
  // Отримати загальну статистику
  getStats: instructorProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      
      // За замовчуванням - поточний місяць
      const startDate = input?.startDate || startOfMonth(new Date())
      const endDate = input?.endDate || endOfMonth(new Date())

      // Всього проведено уроків
      const totalLessons = await ctx.db.booking.count({
        where: {
          instructorId,
          status: 'COMPLETED'
        }
      })

      // Уроки за період
      const periodLessons = await ctx.db.booking.count({
        where: {
          instructorId,
          startTime: { gte: startDate, lte: endDate },
          status: 'COMPLETED'
        }
      })

      // Відпрацьовано годин за період
      const completedBookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          startTime: { gte: startDate, lte: endDate },
          status: 'COMPLETED'
        },
        select: { duration: true }
      })
      
      const totalHours = completedBookings.reduce((sum, booking) => sum + (booking.duration / 60), 0)

      // Майбутні уроки
      const upcomingLessons = await ctx.db.booking.count({
        where: {
          instructorId,
          startTime: { gt: new Date() },
          status: 'CONFIRMED'
        }
      })

      // Скасовані уроки за період
      const cancelledLessons = await ctx.db.booking.count({
        where: {
          instructorId,
          startTime: { gte: startDate, lte: endDate },
          status: 'CANCELLED'
        }
      })

      // Унікальні студенти
      const uniqueStudents = await ctx.db.booking.findMany({
        where: {
          instructorId,
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        },
        select: { studentId: true },
        distinct: ['studentId']
      })

      // Розрахунок заробітку (фіксована ставка або погодинна)
      // Припускаємо фіксовану ставку 100 PLN за урок або 50 PLN за годину
      const rateType = 'fixed' // Можна отримати з профілю інструктора
      const earnings = rateType === 'fixed' 
        ? periodLessons * 100 
        : totalHours * 50

      return {
        totalLessons,
        periodLessons,
        totalHours: Math.round(totalHours * 10) / 10, // Округлення до 1 знаку
        upcomingLessons,
        cancelledLessons,
        totalStudents: uniqueStudents.length,
        earnings,
        rateType
      }
    }),

  // Отримати робочі години по днях
  getWorkingHours: instructorProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      
      const bookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          startTime: { gte: input.startDate, lte: input.endDate },
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        },
        select: {
          startTime: true,
          endTime: true,
          duration: true,
          status: true
        },
        orderBy: { startTime: 'asc' }
      })

      // Групуємо по днях
      const dayMap = new Map<string, { date: Date, hours: number, lessons: number }>()
      
      bookings.forEach(booking => {
        const dayKey = format(booking.startTime, 'yyyy-MM-dd')
        const existing = dayMap.get(dayKey) || { 
          date: booking.startTime, 
          hours: 0, 
          lessons: 0 
        }
        
        existing.hours += booking.duration / 60
        existing.lessons += 1
        dayMap.set(dayKey, existing)
      })

      // Перетворюємо в масив і додаємо дні без уроків
      const allDays = eachDayOfInterval({ 
        start: input.startDate, 
        end: input.endDate 
      })

      const workingDays = allDays.map(date => {
        const dayKey = format(date, 'yyyy-MM-dd')
        const dayData = dayMap.get(dayKey)
        
        return {
          date,
          hours: dayData?.hours || 0,
          lessons: dayData?.lessons || 0,
          isWeekend: date.getDay() === 0 || date.getDay() === 6
        }
      })

      return workingDays
    }),

  // Отримати детальну історію уроків
  getLessonsHistory: instructorProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(['ALL', 'COMPLETED', 'CONFIRMED', 'CANCELLED']).optional(),
      page: z.number().default(1),
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      const startDate = input.startDate || subMonths(new Date(), 12)
      const endDate = input.endDate || new Date()

      const where: any = {
        instructorId,
        startTime: { gte: startDate, lte: endDate }
      }

      if (input.status && input.status !== 'ALL') {
        where.status = input.status
      }

      const [lessons, total] = await Promise.all([
        ctx.db.booking.findMany({
          where,
          include: {
            student: {
              select: { 
                firstName: true, 
                lastName: true, 
                email: true,
                phone: true 
              }
            },
            vehicle: {
              select: { 
                make: true, 
                model: true, 
                registrationNumber: true 
              }
            },
            location: {
              select: { name: true, address: true }
            }
          },
          orderBy: { startTime: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit
        }),
        ctx.db.booking.count({ where })
      ])

      return {
        lessons,
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  // Отримати фінансовий звіт
  getFinancialReport: instructorProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      rateType: z.enum(['fixed', 'hourly']).default('fixed'),
      rate: z.number().optional()
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      
      // Ставки за замовчуванням
      const defaultRates = {
        fixed: 100, // PLN за урок
        hourly: 50  // PLN за годину
      }
      
      const rate = input.rate || defaultRates[input.rateType]

      // Отримуємо всі завершені уроки
      const completedBookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          startTime: { gte: input.startDate, lte: input.endDate },
          status: 'COMPLETED'
        },
        select: {
          id: true,
          startTime: true,
          duration: true,
          student: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { startTime: 'asc' }
      })

      // Розраховуємо заробіток для кожного уроку
      const lessonsWithEarnings = completedBookings.map(booking => ({
        ...booking,
        hours: booking.duration / 60,
        earnings: input.rateType === 'fixed' 
          ? rate 
          : (booking.duration / 60) * rate
      }))

      // Загальна статистика
      const totalLessons = lessonsWithEarnings.length
      const totalHours = lessonsWithEarnings.reduce((sum, l) => sum + l.hours, 0)
      const totalEarnings = lessonsWithEarnings.reduce((sum, l) => sum + l.earnings, 0)
      
      // Комісія школи (припустимо 20%)
      const schoolCommission = totalEarnings * 0.2
      const netEarnings = totalEarnings - schoolCommission

      return {
        lessons: lessonsWithEarnings,
        summary: {
          totalLessons,
          totalHours: Math.round(totalHours * 10) / 10,
          grossEarnings: totalEarnings,
          schoolCommission,
          netEarnings,
          rateType: input.rateType,
          rate
        }
      }
    }),

  // Отримати список студентів
  getStudents: instructorProcedure
    .query(async ({ ctx }) => {
      const instructorId = ctx.session.user.id
      
      // Отримуємо всіх унікальних студентів
      const bookings = await ctx.db.booking.findMany({
        where: {
          instructorId,
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        },
        select: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          startTime: true,
          status: true
        },
        orderBy: { startTime: 'desc' }
      })

      // Групуємо по студентах
      const studentMap = new Map()
      
      bookings.forEach(booking => {
        const studentId = booking.student.id
        
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            ...booking.student,
            totalLessons: 0,
            completedLessons: 0,
            lastLesson: booking.startTime
          })
        }
        
        const student = studentMap.get(studentId)
        student.totalLessons++
        
        if (booking.status === 'COMPLETED') {
          student.completedLessons++
        }
        
        if (booking.startTime < student.lastLesson) {
          student.lastLesson = booking.startTime
        }
      })

      return Array.from(studentMap.values())
    }),

  // Статистика по тижнях
  getWeeklyStats: instructorProcedure
    .input(z.object({
      weeks: z.number().default(8)
    }))
    .query(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      const stats = []

      for (let i = 0; i < input.weeks; i++) {
        const weekStart = startOfWeek(subMonths(new Date(), i * 7), { weekStartsOn: 1 })
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

        const [lessons, hours] = await Promise.all([
          ctx.db.booking.count({
            where: {
              instructorId,
              startTime: { gte: weekStart, lte: weekEnd },
              status: 'COMPLETED'
            }
          }),
          ctx.db.booking.aggregate({
            where: {
              instructorId,
              startTime: { gte: weekStart, lte: weekEnd },
              status: 'COMPLETED'
            },
            _sum: { duration: true }
          })
        ])

        stats.unshift({
          weekStart,
          weekEnd,
          lessons,
          hours: (hours._sum.duration || 0) / 60
        })
      }

      return stats
    })
})