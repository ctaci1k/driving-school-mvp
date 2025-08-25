// lib/trpc/routers/dashboard.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { 
  BookingStatus, 
  UserRole,
  ExamType,
  PackageStatus
} from '@prisma/client'

export const dashboardRouter = router({
  /**
   * Get complete dashboard data for student
   * Combines multiple queries into one for optimal performance
   */
  getStudentDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      // Verify user is a student
const user = await ctx.db.user.findUnique({
  where: { id: userId },
  select: { 
    role: true,
    locationId: true 
  }
})

      if (user?.role !== UserRole.STUDENT) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied. Student role required.'
        })
      }

      // Parallel queries for better performance
      const [
        userProfile,
        nextBooking,
        upcomingBookings,
        studentProgress,
        activePackages,
        recentAchievements,
        unreadMessages,
        recentExamResults,
        instructorsList
      ] = await Promise.all([
        // 1. User Profile with Student Profile
        ctx.db.user.findUnique({
          where: { id: userId },
          include: {
            studentProfile: true,
            location: true,
            studentPreferences: true
          }
        }),

// 2. Next Booking
ctx.db.booking.findFirst({
  where: {
    studentId: userId,
    status: BookingStatus.CONFIRMED,
    date: { gte: new Date() }
  },
  orderBy: { date: 'asc' },
  include: {
    instructor: {
      include: {
        instructorProfile: true
      }
    },
    vehicle: true,
    location: true
  }
}),

// 3. Upcoming Bookings (next 5)
ctx.db.booking.findMany({
  where: {
    studentId: userId,
    status: BookingStatus.CONFIRMED,
    date: { gte: new Date() }
  },
  orderBy: { date: 'asc' },
  take: 5,
  include: {
    instructor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true
      }
    },
    vehicle: {
      select: {
        make: true,
        model: true,
        registrationNumber: true
      }
    }
  }
}),

        // 4. Student Progress
ctx.db.studentProgress.findUnique({
  where: { userId },
  include: {
    user: {
      include: {
        studentBookings: {
          where: {
            status: BookingStatus.COMPLETED
          },
          select: {
            id: true,
            rating: true
          }
        }
      }
    }
  }
}),


        // 5. Active Packages & Credits
        ctx.db.userPackage.findMany({
          where: {
            userId,
            status: PackageStatus.ACTIVE,
            expiresAt: { gte: new Date() }
          },
          include: {
            package: true
          },
          orderBy: { expiresAt: 'asc' }
        }),

        // 6. Recent Achievements
        ctx.db.userAchievement.findMany({
          where: {
            userId,
            unlockedAt: { not: null }
          },
          orderBy: { unlockedAt: 'desc' },
          take: 3,
          include: {
            achievement: true
          }
        }),

        // 7. Unread Messages Count
        ctx.db.message.count({
          where: {
            receiverId: userId,
            isRead: false
          }
        }),

        // 8. Recent Exam Results
        ctx.db.examResult.findMany({
          where: { userId },
          orderBy: { takenAt: 'desc' },
          take: 2
        }),

        // 9. Available Instructors
        ctx.db.user.findMany({
          where: {
            role: UserRole.INSTRUCTOR,
            status: 'ACTIVE',
            locationId: user?.locationId
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            instructorProfile: {
              select: {
                rating: true,
                specializations: true,
                totalStudents: true
              }
            }
          },
          take: 5
        })
      ])

      // Calculate statistics
      const completedLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          status: BookingStatus.COMPLETED
        }
      })

      const totalCredits = activePackages.reduce(
        (sum, pkg) => sum + pkg.creditsRemaining, 
        0
      )

      const averageRating = studentProgress?.user?.studentBookings
        .filter(b => b.rating)
        .reduce((sum, b, _, arr) => 
          sum + (b.rating || 0) / arr.length, 0
        ) || 0

      // Calculate exam readiness (simplified formula)
let examReadiness = 0
if (studentProgress) {
  const factors = [
    studentProgress.overallProgress || 50,  // Використовуй існуюче поле
    studentProgress.currentLevel * 10 || 0,  // Використовуй існуюче поле
    completedLessons >= 20 ? 100 : (completedLessons / 20) * 100,
    averageRating * 20
  ]
  examReadiness = Math.round(
    factors.reduce((a, b) => a + b, 0) / factors.length
  )
}

      // Format the response
      return {
        user: {
          id: userProfile?.id,
          firstName: userProfile?.firstName,
          lastName: userProfile?.lastName,
          email: userProfile?.email,
          avatar: userProfile?.avatar,
          role: userProfile?.role,
          joinDate: userProfile?.createdAt,
          phone: userProfile?.phone,
          locationId: userProfile?.locationId,
          location: userProfile?.location
        },
        
stats: {
  completedLessons,
  totalCredits,
  averageRating: Math.round(averageRating * 10) / 10,
  examReadiness,
  totalHours: Math.round(completedLessons * 1.5),
  theoryProgress: studentProgress?.overallProgress || 0,
  practicalProgress: (studentProgress?.currentLevel || 0) * 10,
  nextLessonIn: nextBooking ? 
    Math.ceil((nextBooking.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
    null
},

        nextLesson: nextBooking ? {
          id: nextBooking.id,
          date: nextBooking.date,
          startTime: nextBooking.startTime,
          endTime: nextBooking.endTime,
          duration: nextBooking.duration,
          type: nextBooking.type,
          instructor: {
            id: nextBooking.instructor.id,
            name: `${nextBooking.instructor.firstName} ${nextBooking.instructor.lastName}`,
            avatar: nextBooking.instructor.avatar,
            rating: nextBooking.instructor.instructorProfile?.rating,
            phone: nextBooking.instructor.phone
          },
          vehicle: nextBooking.vehicle ? {
            id: nextBooking.vehicle.id,
            make: nextBooking.vehicle.make,
            model: nextBooking.vehicle.model,
            registration: nextBooking.vehicle.registrationNumber,
            transmission: nextBooking.vehicle.transmission
          } : null,
          location: nextBooking.location ? {
            id: nextBooking.location.id,
            name: nextBooking.location.name,
            address: nextBooking.location.address,
            city: nextBooking.location.city
          } : {
            address: nextBooking.pickupLocation
          },
          pickupLocation: nextBooking.pickupLocation,
          status: nextBooking.status,
          notes: nextBooking.notes
        } : null,

        upcomingLessons: upcomingBookings.map(booking => ({
          id: booking.id,
          date: booking.date,
          startTime: booking.startTime,
          type: booking.type,
          instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
          vehicle: booking.vehicle ? 
            `${booking.vehicle.make} ${booking.vehicle.model}` : 
            'Do ustalenia'
        })),

        packages: activePackages.map(pkg => ({
          id: pkg.id,
          name: pkg.package.name,
          creditsRemaining: pkg.creditsRemaining,
          creditsTotal: pkg.creditsTotal,
          expiresAt: pkg.expiresAt,
          daysRemaining: Math.ceil(
            (pkg.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          ),
          progress: Math.round(
            ((pkg.creditsTotal - pkg.creditsRemaining) / pkg.creditsTotal) * 100
          )
        })),

        achievements: recentAchievements.map(ua => ({
          id: ua.achievement.id,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          category: ua.achievement.category,
          points: ua.achievement.points,
          unlockedAt: ua.unlockedAt
        })),

        examResults: recentExamResults.map(exam => ({
          id: exam.id,
          type: exam.type,
          passed: exam.passed,
          score: exam.score,
          percentage: exam.percentage,
          takenAt: exam.takenAt,
          attemptNumber: exam.attemptNumber
        })),

        instructors: instructorsList.map(instructor => ({
          id: instructor.id,
          name: `${instructor.firstName} ${instructor.lastName}`,
          avatar: instructor.avatar,
          rating: instructor.instructorProfile?.rating,
          specializations: instructor.instructorProfile?.specializations,
          totalStudents: instructor.instructorProfile?.totalStudents
        })),

notifications: {
  unreadMessages,
  upcomingLessons: upcomingBookings.length,
  expiringCredits: activePackages.filter(pkg => {
    const daysRemaining = Math.ceil(
      (pkg.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysRemaining <= 7;
  }).length
},

        progress: {
          currentSkill: studentProgress?.currentSkill || 'Podstawy jazdy',
          weakPoints: studentProgress?.weakPoints || [],
          strongPoints: studentProgress?.strongPoints || [],
          lastUpdate: studentProgress?.lastUpdatedAt
        }
      }
    }),

  /**
   * Get quick stats for dashboard widgets
   */
  getQuickStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const [
        todayBookings,
        weekBookings,
        totalSpent,
        hoursThisMonth
      ] = await Promise.all([
        // Today's bookings
        ctx.db.booking.count({
          where: {
            studentId: userId,
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }),

        // This week's bookings
        ctx.db.booking.count({
          where: {
            studentId: userId,
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          }
        }),

        // Total spent
        ctx.db.payment.aggregate({
          where: {
            userId,
            status: 'COMPLETED'
          },
          _sum: {
            amount: true
          }
        }),

        // Hours this month
        ctx.db.booking.aggregate({
          where: {
            studentId: userId,
            status: BookingStatus.COMPLETED,
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: {
            duration: true
          }
        })
      ])

return {
  todayBookings,
  weekBookings,
  totalSpent: totalSpent._sum.amount ? Number(totalSpent._sum.amount) : 0,
  hoursThisMonth: Math.round((hoursThisMonth._sum.duration || 0) / 60)
}
    }),

  /**
   * Mark dashboard as viewed (for analytics)
   */
  markDashboardViewed: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id

      await ctx.db.user.update({
        where: { id: userId },
        data: {
          lastActivityAt: new Date()
        }
      })

      return { success: true }
    })
})