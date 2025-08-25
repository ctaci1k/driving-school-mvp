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
    }),


getLessonHistory: protectedProcedure
  .input(z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    limit: z.number().min(1).max(100).default(50)
  }).optional())
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    
    const where: any = {
      studentId: userId,
      status: {
        in: ['COMPLETED', 'CANCELLED', 'NO_SHOW']
      }
    }
    
    if (input?.startDate && input?.endDate) {
      where.startTime = {
        gte: input.startDate,
        lte: input.endDate
      }
    }
    
    const lessons = await ctx.db.booking.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            rating: true
          }
        },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            registrationNumber: true,
            category: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true,
            method: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      },
      take: input?.limit || 50
    })
    
    return lessons
  }),

getProgress: protectedProcedure
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    
    // Отримуємо дані користувача
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        completedLessons: true,
        examAttempts: true,
        examPassed: true,
        examPassedDate: true
      }
    })
    
    // Підраховуємо уроки по типах
    const lessonsByType = await ctx.db.booking.groupBy({
      by: ['lessonType'],
      where: {
        studentId: userId,
        status: 'COMPLETED'
      },
      _count: true
    })
    
    const lessonCounts = lessonsByType.reduce((acc, item) => {
      acc[item.lessonType] = item._count
      return acc
    }, {} as Record<string, number>)
    
    // Розраховуємо прогрес
    const totalCompleted = user?.completedLessons || 0
    const requiredForExam = 30
    const examProgress = Math.min((totalCompleted / requiredForExam) * 100, 100)
    
    // Прогрес по категоріях
    const cityProgress = Math.min(((lessonCounts['CITY_TRAFFIC'] || 0) / 5) * 100, 100)
    const parkingProgress = Math.min(((lessonCounts['PARKING'] || 0) / 3) * 100, 100)
    const highwayProgress = Math.min(((lessonCounts['HIGHWAY'] || 0) / 3) * 100, 100)
    
    // Досягнення
    const achievements = []
    
    if (totalCompleted >= 1) {
      achievements.push({
        id: 'first_lesson',
        name: 'First Step',
        description: 'Completed your first lesson',
        icon: '🎯',
        unlocked: true
      })
    }
    
    if (totalCompleted >= 10) {
      achievements.push({
        id: 'ten_lessons',
        name: 'Dedicated Learner',
        description: 'Completed 10 lessons',
        icon: '⭐',
        unlocked: true
      })
    }
    
    if (examProgress >= 100) {
      achievements.push({
        id: 'ready_for_exam',
        name: 'Exam Ready',
        description: 'Completed required lessons for exam',
        icon: '🏆',
        unlocked: true
      })
    }
    
    if (user?.examPassed) {
      achievements.push({
        id: 'passed_exam',
        name: 'Licensed Driver',
        description: 'Passed the driving exam',
        icon: '🎓',
        unlocked: true
      })
    }
    
    // Рекомендації
    const recommendations = []
    
    if (cityProgress < 60) {
      recommendations.push('Focus on city traffic lessons to improve your urban driving skills')
    }
    
    if (parkingProgress < 60) {
      recommendations.push('Practice more parking maneuvers')
    }
    
    if (highwayProgress < 40) {
      recommendations.push('Schedule highway driving lessons for high-speed experience')
    }
    
    if (examProgress >= 80 && !user?.examPassed) {
      recommendations.push('You are almost ready for the exam! Consider booking exam preparation lessons')
    }
    
    return {
      examProgress,
      cityProgress,
      parkingProgress,
      highwayProgress,
      lessonsCompleted: totalCompleted,
      lessonsRequired: requiredForExam,
      examPassed: user?.examPassed || false,
      examPassedDate: user?.examPassedDate,
      examAttempts: user?.examAttempts || 0,
      achievements,
      recommendations
    }
  }),

exportReport: protectedProcedure
  .input(z.object({
    period: z.enum(['week', 'month', 'quarter', 'year', 'all']),
    format: z.enum(['csv', 'json']).default('csv')
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    
    // Визначаємо період
    let startDate: Date | undefined
    const now = new Date()
    
    switch (input.period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'all':
        startDate = undefined
        break
    }
    
    // Отримуємо дані
    const [stats, lessons, payments] = await Promise.all([
      // Статистика
      ctx.db.booking.aggregate({
        where: {
          studentId: userId,
          ...(startDate && { startTime: { gte: startDate } })
        },
        _count: true,
        _sum: {
          duration: true,
          usedCredits: true
        }
      }),
      // Уроки
      ctx.db.booking.findMany({
        where: {
          studentId: userId,
          ...(startDate && { startTime: { gte: startDate } })
        },
        include: {
          instructor: true,
          vehicle: true,
          location: true
        },
        orderBy: {
          startTime: 'desc'
        }
      }),
      // Платежі
      ctx.db.payment.findMany({
        where: {
          userId,
          status: 'COMPLETED',
          ...(startDate && { completedAt: { gte: startDate } })
        },
        orderBy: {
          completedAt: 'desc'
        }
      })
    ])
    
    if (input.format === 'csv') {
      // Генерація CSV звіту
      const reportData = [
        ['Student Report'],
        ['Generated:', new Date().toISOString()],
        ['Period:', input.period],
        [''],
        ['SUMMARY'],
        ['Total Lessons:', stats._count],
        ['Total Hours:', (stats._sum.duration || 0) / 60],
        ['Credits Used:', stats._sum.usedCredits || 0],
        ['Total Spent:', payments.reduce((sum, p) => sum + Number(p.amount), 0) + ' PLN'],
        [''],
        ['LESSON HISTORY'],
        ['Date', 'Time', 'Type', 'Instructor', 'Vehicle', 'Location', 'Status'],
        ...lessons.map(l => [
          l.startTime.toLocaleDateString(),
          l.startTime.toLocaleTimeString(),
          l.lessonType,
          `${l.instructor.firstName} ${l.instructor.lastName}`,
          l.vehicle ? `${l.vehicle.make} ${l.vehicle.model}` : '-',
          l.location?.name || '-',
          l.status
        ])
      ]
      
      const csv = reportData.map(row => row.join(',')).join('\n')
      
      return {
        content: csv,
        filename: `student-report-${input.period}-${new Date().toISOString().split('T')[0]}.csv`
      }
    }
    
    // JSON формат
    return {
      content: JSON.stringify({
        summary: {
          totalLessons: stats._count,
          totalHours: (stats._sum.duration || 0) / 60,
          creditsUsed: stats._sum.usedCredits || 0,
          totalSpent: payments.reduce((sum, p) => sum + Number(p.amount), 0)
        },
        lessons,
        payments
      }, null, 2),
      filename: `student-report-${input.period}-${new Date().toISOString().split('T')[0]}.json`
    }
  }),
})