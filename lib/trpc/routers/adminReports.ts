// lib/trpc/routers/adminReports.ts

import { router, adminProcedure } from '../server'
import { z } from 'zod'
import { startOfMonth, endOfMonth, subMonths, subDays } from 'date-fns'

export const adminReportsRouter = router({
  // Загальна статистика школи
  getOverallStats: adminProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const startDate = input?.startDate || startOfMonth(new Date())
      const endDate = input?.endDate || endOfMonth(new Date())

      // Студенти
      const [totalStudents, newStudents, activeStudents] = await Promise.all([
        ctx.db.user.count({ where: { role: 'STUDENT' } }),
        ctx.db.user.count({
          where: {
            role: 'STUDENT',
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        ctx.db.user.count({
          where: {
            role: 'STUDENT',
            studentBookings: {
              some: {
                startTime: { gte: subDays(new Date(), 30) }
              }
            }
          }
        })
      ])

      // Інструктори
      const [totalInstructors, activeInstructors] = await Promise.all([
        ctx.db.user.count({ where: { role: 'INSTRUCTOR' } }),
        ctx.db.user.count({
          where: {
            role: 'INSTRUCTOR',
            instructorBookings: {
              some: {
                startTime: { gte: startDate, lte: endDate }
              }
            }
          }
        })
      ])

      // Уроки
      const [totalLessons, completedLessons, cancelledLessons, upcomingLessons] = await Promise.all([
        ctx.db.booking.count({
          where: { startTime: { gte: startDate, lte: endDate } }
        }),
        ctx.db.booking.count({
          where: {
            startTime: { gte: startDate, lte: endDate },
            status: 'COMPLETED'
          }
        }),
        ctx.db.booking.count({
          where: {
            startTime: { gte: startDate, lte: endDate },
            status: 'CANCELLED'
          }
        }),
        ctx.db.booking.count({
          where: {
            startTime: { gt: new Date() },
            status: 'CONFIRMED'
          }
        })
      ])

      // Фінанси
      const revenue = await ctx.db.payment.aggregate({
        where: {
          status: 'COMPLETED',
          completedAt: { gte: startDate, lte: endDate }
        },
        _sum: { amount: true }
      })

      const pending = await ctx.db.payment.aggregate({
        where: {
          status: 'PENDING',
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { amount: true }
      })

      // Автомобілі
      const [totalVehicles, activeVehicles] = await Promise.all([
        ctx.db.vehicle.count(),
        ctx.db.vehicle.count({ where: { status: 'ACTIVE' } })
      ])

      return {
        students: {
          total: totalStudents,
          new: newStudents,
          active: activeStudents
        },
        instructors: {
          total: totalInstructors,
          active: activeInstructors,
          utilization: totalInstructors > 0 
            ? Math.round((activeInstructors / totalInstructors) * 100) 
            : 0
        },
        lessons: {
          total: totalLessons,
          completed: completedLessons,
          cancelled: cancelledLessons,
          upcoming: upcomingLessons,
          completionRate: totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0,
          cancellationRate: totalLessons > 0 
            ? Math.round((cancelledLessons / totalLessons) * 100) 
            : 0
        },
        finance: {
          revenue: Number(revenue._sum.amount || 0),
          pending: Number(pending._sum.amount || 0)
        },
        vehicles: {
          total: totalVehicles,
          active: activeVehicles,
          utilization: totalVehicles > 0 
            ? Math.round((activeVehicles / totalVehicles) * 100) 
            : 0
        }
      }
    }),

  // Детальний звіт по студентах
  getStudentsReport: adminProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'COMPLETED']).default('ALL'),
      page: z.number().default(1),
      limit: z.number().default(20)
    }))
    .query(async ({ ctx, input }) => {
      const where: any = { role: 'STUDENT' }

      // Фільтр по статусу
      if (input.status === 'ACTIVE') {
        where.studentBookings = {
          some: {
            startTime: { gte: subDays(new Date(), 30) }
          }
        }
      } else if (input.status === 'INACTIVE') {
        where.NOT = {
          studentBookings: {
            some: {
              startTime: { gte: subDays(new Date(), 30) }
            }
          }
        }
      }

      const [students, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          include: {
            studentBookings: {
              where: {
                startTime: { 
                  gte: input.startDate || subMonths(new Date(), 12),
                  lte: input.endDate || new Date()
                }
              },
              include: {
                payment: true
              },
              orderBy: { startTime: 'desc' }
            },
            userPackages: {
              include: {
                package: true
              }
            }
          },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: 'desc' }
        }),
        ctx.db.user.count({ where })
      ])

      // Обробляємо дані для кожного студента
      const studentsWithStats = students.map(student => {
        const totalLessons = student.studentBookings.length
        const completedLessons = student.studentBookings.filter(b => b.status === 'COMPLETED').length
        const cancelledLessons = student.studentBookings.filter(b => b.status === 'CANCELLED').length
        const totalPaid = student.studentBookings
          .filter(b => b.payment?.status === 'COMPLETED')
          .reduce((sum, b) => sum + Number(b.payment?.amount || 0), 0)
        const totalCredits = student.userPackages
          .reduce((sum, up) => sum + up.creditsRemaining, 0)
        
        // Визначаємо стадію навчання
        let stage = 'Початківець'
        if (completedLessons >= 30) stage = 'Випускник'
        else if (completedLessons >= 20) stage = 'Готовий до іспиту'
        else if (completedLessons >= 10) stage = 'Середній рівень'
        else if (completedLessons >= 5) stage = 'Базовий рівень'

        const lastLesson = student.studentBookings[0]
        const isActive = lastLesson && 
          new Date(lastLesson.startTime) > subDays(new Date(), 30)

        return {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          phone: student.phone,
          createdAt: student.createdAt,
          totalLessons,
          completedLessons,
          cancelledLessons,
          progress: totalLessons > 0 ? Math.round((completedLessons / 30) * 100) : 0,
          stage,
          totalPaid,
          totalCredits,
          lastLesson: lastLesson?.startTime,
          isActive,
          status: isActive ? 'Активний' : 'Неактивний'
        }
      })

      return {
        students: studentsWithStats,
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  // Детальний звіт по інструкторах
  getInstructorsReport: adminProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      page: z.number().default(1),
      limit: z.number().default(20)
    }))
    .query(async ({ ctx, input }) => {
      const startDate = input.startDate || startOfMonth(new Date())
      const endDate = input.endDate || endOfMonth(new Date())

      const [instructors, total] = await Promise.all([
        ctx.db.user.findMany({
          where: { role: 'INSTRUCTOR' },
          include: {
            instructorBookings: {
              where: {
                startTime: { gte: startDate, lte: endDate }
              }
            },
            assignedVehicles: true,
            instructorSchedule: true
          },
          skip: (input.page - 1) * input.limit,
          take: input.limit
        }),
        ctx.db.user.count({ where: { role: 'INSTRUCTOR' } })
      ])

      // Обробляємо дані для кожного інструктора
      const instructorsWithStats = await Promise.all(
        instructors.map(async (instructor) => {
          const totalLessons = instructor.instructorBookings.length
          const completedLessons = instructor.instructorBookings
            .filter(b => b.status === 'COMPLETED').length
          const cancelledLessons = instructor.instructorBookings
            .filter(b => b.status === 'CANCELLED').length
          const upcomingLessons = instructor.instructorBookings
            .filter(b => b.status === 'CONFIRMED' && new Date(b.startTime) > new Date()).length
          
          const totalHours = instructor.instructorBookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.duration / 60), 0)

          // Унікальні студенти
          const uniqueStudents = new Set(
            instructor.instructorBookings.map(b => b.studentId)
          ).size

          // Розрахунок завантаженості
          const workingHoursPerWeek = instructor.instructorSchedule
            .reduce((sum, schedule) => {
              const [startHour, startMin] = schedule.startTime.split(':').map(Number)
              const [endHour, endMin] = schedule.endTime.split(':').map(Number)
              const hours = (endHour + endMin/60) - (startHour + startMin/60)
              return sum + hours
            }, 0)

          const utilization = workingHoursPerWeek > 0
            ? Math.round((totalHours / (workingHoursPerWeek * 4)) * 100)
            : 0

          // Дохід для школи (припускаємо 200 PLN за урок)
          const revenue = completedLessons * 200

          return {
            id: instructor.id,
            name: `${instructor.firstName} ${instructor.lastName}`,
            email: instructor.email,
            phone: instructor.phone,
            totalLessons,
            completedLessons,
            cancelledLessons,
            upcomingLessons,
            totalHours: Math.round(totalHours),
            uniqueStudents,
            utilization: Math.min(utilization, 100),
            revenue,
            vehicles: instructor.assignedVehicles.length,
            rating: 4.5 + Math.random() * 0.5, // Мок рейтинг
            completionRate: totalLessons > 0 
              ? Math.round((completedLessons / totalLessons) * 100) 
              : 0
          }
        })
      )

      return {
        instructors: instructorsWithStats,
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  // Операційний звіт
  getOperationsReport: adminProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = input.startDate || startOfMonth(new Date())
      const endDate = input.endDate || endOfMonth(new Date())


// Використання автомобілів
const vehicles = await ctx.db.vehicle.findMany({
  include: {
    bookings: {
      where: {
        startTime: { gte: startDate, lte: endDate },
        status: 'COMPLETED'
      }
    },
    maintenanceLogs: {
      where: {
        // Використовуємо completedDate замість performedAt
        completedDate: { gte: startDate, lte: endDate }
      }
    }
  }
})

const vehicleStats = vehicles.map(vehicle => ({
  id: vehicle.id,
  registrationNumber: vehicle.registrationNumber,
  make: vehicle.make,
  model: vehicle.model,
  status: vehicle.status,
  lessonsCount: vehicle.bookings.length,
  hoursUsed: vehicle.bookings.reduce((sum, b) => sum + (b.duration / 60), 0),
  maintenanceCount: vehicle.maintenanceLogs.length,
  currentMileage: vehicle.currentMileage,
  insuranceExpiry: vehicle.insuranceExpiry,
  inspectionExpiry: vehicle.inspectionExpiry,
  needsAttention: 
    new Date(vehicle.insuranceExpiry) < new Date(Date.now() + 30*24*60*60*1000) ||
    new Date(vehicle.inspectionExpiry) < new Date(Date.now() + 30*24*60*60*1000)
}))

      // Використання локацій
      const locations = await ctx.db.location.findMany({
        include: {
          bookings: {
            where: {
              startTime: { gte: startDate, lte: endDate }
            }
          }
        }
      })

      const locationStats = locations.map(location => ({
        id: location.id,
        name: location.name,
        city: location.city,
        bookingsCount: location.bookings.length,
        utilization: Math.round((location.bookings.length / (30 * 8)) * 100) // Припускаємо 8 слотів на день
      }))

      // Популярні часи
      const bookingsByHour = await ctx.db.booking.groupBy({
        by: ['startTime'],
        where: {
          startTime: { gte: startDate, lte: endDate }
        },
        _count: true
      })

      const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
        const count = bookingsByHour.filter(b => 
          new Date(b.startTime).getHours() === hour
        ).length
        return { hour, count }
      })

      // Статистика скасувань
      const cancellationReasons = await ctx.db.booking.groupBy({
        by: ['cancellationReason'],
        where: {
          status: 'CANCELLED',
          cancelledAt: { gte: startDate, lte: endDate }
        },
        _count: true
      })

      return {
        vehicles: vehicleStats,
        locations: locationStats,
        peakHours: hourlyDistribution.sort((a, b) => b.count - a.count).slice(0, 5),
        cancellationReasons: cancellationReasons.map(r => ({
          reason: r.cancellationReason || 'Не вказано',
          count: r._count
        }))
      }
    }),

  // Топ студентів
  getTopStudents: adminProcedure
    .input(z.object({
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const students = await ctx.db.user.findMany({
        where: { role: 'STUDENT' },
        include: {
          studentBookings: {
            where: { status: 'COMPLETED' }
          },
          payments: {
            where: { status: 'COMPLETED' }
          }
        }
      })

      const sorted = students
        .map(student => ({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          completedLessons: student.studentBookings.length,
          totalPaid: student.payments.reduce((sum, p) => sum + Number(p.amount), 0)
        }))
        .sort((a, b) => b.completedLessons - a.completedLessons)
        .slice(0, input.limit)

      return sorted
    }),

  // Топ інструкторів
  getTopInstructors: adminProcedure
    .input(z.object({
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const instructors = await ctx.db.user.findMany({
        where: { role: 'INSTRUCTOR' },
        include: {
          instructorBookings: {
            where: { status: 'COMPLETED' }
          }
        }
      })

      const sorted = instructors
        .map(instructor => ({
          id: instructor.id,
          name: `${instructor.firstName} ${instructor.lastName}`,
          completedLessons: instructor.instructorBookings.length,
          revenue: instructor.instructorBookings.length * 200 // Припускаємо 200 PLN за урок
        }))
        .sort((a, b) => b.completedLessons - a.completedLessons)
        .slice(0, input.limit)

      return sorted
    })
})