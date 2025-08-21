// lib/trpc/routers/studentReports.ts

import { router, protectedProcedure } from '../server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns'

export const studentReportsRouter = router({
  // Отримати загальну статистику
  getStats: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      
      // За замовчуванням - поточний місяць
      const startDate = input?.startDate || startOfMonth(new Date())
      const endDate = input?.endDate || endOfMonth(new Date())

      // Загальна кількість уроків
      const totalLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        }
      })

      // Уроки за період
      const periodLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          startTime: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        }
      })

      // Майбутні уроки
      const upcomingLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          startTime: { gt: new Date() },
          status: 'CONFIRMED'
        }
      })

      // Витрачені кредити
      const usedCredits = await ctx.db.booking.aggregate({
        where: {
          studentId: userId,
          usedCredits: { gt: 0 }
        },
        _sum: { usedCredits: true }
      })

      // Доступні кредити
      const availableCredits = await ctx.db.userPackage.aggregate({
        where: {
          userId,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() }
        },
        _sum: { creditsRemaining: true }
      })

      // Загальні витрати
      const totalSpent = await ctx.db.payment.aggregate({
        where: {
          userId,
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      })

      // Витрати за період
      const periodSpent = await ctx.db.payment.aggregate({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: { gte: startDate, lte: endDate }
        },
        _sum: { amount: true }
      })

      return {
        totalLessons,
        periodLessons,
        upcomingLessons,
        usedCredits: usedCredits._sum.usedCredits || 0,
        availableCredits: availableCredits._sum.creditsRemaining || 0,
        totalSpent: Number(totalSpent._sum.amount || 0),
        periodSpent: Number(periodSpent._sum.amount || 0),
        progress: Math.round((totalLessons / 30) * 100) // Припускаємо 30 уроків для повного курсу
      }
    }),

  // Отримати історію уроків
  getLessonsHistory: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(['ALL', 'COMPLETED', 'CONFIRMED', 'CANCELLED']).optional(),
      page: z.number().default(1),
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const startDate = input.startDate || subMonths(new Date(), 12) // За рік за замовчуванням
      const endDate = input.endDate || new Date()

      const where: any = {
        studentId: userId,
        startTime: { gte: startDate, lte: endDate }
      }

      if (input.status && input.status !== 'ALL') {
        where.status = input.status
      }

      const [lessons, total] = await Promise.all([
        ctx.db.booking.findMany({
          where,
          include: {
            instructor: {
              select: { firstName: true, lastName: true }
            },
            vehicle: {
              select: { make: true, model: true, registrationNumber: true }
            },
            location: {
              select: { name: true, address: true }
            },
            payment: {
              select: { amount: true, method: true, status: true }
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

  // Отримати інформацію про пакети
  getPackages: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const packages = await ctx.db.userPackage.findMany({
        where: { userId },
        include: {
          package: {
            select: { name: true, description: true }
          },
          payment: {
            select: { amount: true, completedAt: true }
          }
        },
        orderBy: { purchasedAt: 'desc' }
      })

      // Порахувати використання кредитів для кожного пакету
      const packagesWithUsage = await Promise.all(
        packages.map(async (pkg) => {
          const usageHistory = await ctx.db.booking.findMany({
            where: {
              studentId: userId,
              usedCredits: { gt: 0 },
              createdAt: {
                gte: pkg.purchasedAt,
                lte: pkg.expiresAt
              }
            },
            select: {
              startTime: true,
              usedCredits: true
            },
            orderBy: { startTime: 'desc' }
          })

          return {
            ...pkg,
            usageHistory
          }
        })
      )

      return packagesWithUsage
    }),

  // Отримати історію платежів
  getPayments: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      page: z.number().default(1),
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const startDate = input.startDate || subMonths(new Date(), 12)
      const endDate = input.endDate || new Date()

      const where = {
        userId,
        createdAt: { gte: startDate, lte: endDate }
      }

      const [payments, total] = await Promise.all([
        ctx.db.payment.findMany({
          where,
          include: {
            booking: {
              select: {
                startTime: true,
                instructor: {
                  select: { firstName: true, lastName: true }
                }
              }
            },
            userPackage: {
              select: {
                package: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit
        }),
        ctx.db.payment.count({ where })
      ])

      return {
        payments: payments.map(p => ({
          ...p,
          amount: Number(p.amount)
        })),
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  // Отримати статистику по місяцях
  getMonthlyStats: protectedProcedure
    .input(z.object({
      months: z.number().default(6)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const stats = []

      for (let i = 0; i < input.months; i++) {
        const date = subMonths(new Date(), i)
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        const [lessons, spent] = await Promise.all([
          ctx.db.booking.count({
            where: {
              studentId: userId,
              startTime: { gte: start, lte: end },
              status: { in: ['COMPLETED', 'CONFIRMED'] }
            }
          }),
          ctx.db.payment.aggregate({
            where: {
              userId,
              status: 'COMPLETED',
              completedAt: { gte: start, lte: end }
            },
            _sum: { amount: true }
          })
        ])

        stats.unshift({
          month: start,
          lessons,
          spent: Number(spent._sum.amount || 0)
        })
      }

      return stats
    })
})