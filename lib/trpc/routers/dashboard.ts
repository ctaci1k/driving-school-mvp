// lib/trpc/routers/dashboard.ts - ШВИДКЕ ВИПРАВЛЕННЯ

import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { TRPCError } from "@trpc/server";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { UserRole } from "@prisma/client";

export const dashboardRouter = router({
  // Get dashboard statistics
  getStats: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;

      // Get user info
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          firstName: true,
          lastName: true,
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Base stats
      let stats: any = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      }

      if (user.role === UserRole.STUDENT) {
        // Student dashboard stats
        const [
          completedLessons,
          upcomingLessons,
          totalLessons,
          activePackage
        ] = await Promise.all([
          ctx.db.booking.count({
            where: {
              studentId: userId,
              status: "COMPLETED",
            },
          }),
          ctx.db.booking.count({
            where: {
              studentId: userId,
              status: "CONFIRMED",
              // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
              startTime: { gte: new Date().toISOString() },
            },
          }),
          ctx.db.booking.count({
            where: {
              studentId: userId,
            },
          }),
          ctx.db.userPackage.findFirst({
            where: {
              userId: userId,
              status: "ACTIVE",
              expiresAt: { gte: new Date() },
            },
            include: {
              package: true,
            },
            orderBy: {
              expiresAt: 'desc'
            }
          }),
        ]);

        // Calculate exam readiness (simple formula)
        const examReadiness = totalLessons > 0 
          ? Math.min(Math.round((completedLessons / 30) * 100), 100) // Assuming 30 lessons for full readiness
          : 0;

        // Calculate remaining lessons from active packages
        const remainingLessons = activePackage ? 
          Math.floor(activePackage.creditsRemaining / 2) : 0; // Assuming 2 credits per lesson

        stats = {
          ...stats,
          completedLessons,
          remainingLessons,
          upcomingLessons,
          examReadiness,
          activePackage: activePackage?.package?.name || null,
          nextPayment: null, // Will be implemented when payment system is ready
        };

      } else if (user.role === UserRole.INSTRUCTOR) {
        // Instructor dashboard stats
        const [
          todayBookings,
          monthlyBookings,
          totalStudents,
          rating
        ] = await Promise.all([
          ctx.db.booking.count({
            where: {
              instructorId: userId,
              startTime: {
                // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
                gte: startOfDay(new Date()).toISOString(),
                lte: endOfDay(new Date()).toISOString(),
              },
              status: "CONFIRMED",
            },
          }),
          ctx.db.booking.count({
            where: {
              instructorId: userId,
              startTime: {
                // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
                gte: startOfMonth(new Date()).toISOString(),
                lte: endOfMonth(new Date()).toISOString(),
              },
              status: { in: ["COMPLETED", "CONFIRMED"] },
            },
          }),
          ctx.db.booking.findMany({
            where: {
              instructorId: userId,
              status: "COMPLETED",
            },
            select: { studentId: true },
            distinct: ['studentId'],
          }),
          ctx.db.user.findUnique({
            where: { id: userId },
            select: { 
            }
          })
        ]);

        stats = {
          ...stats,
          todayBookings,
          monthlyBookings,
          totalStudents: totalStudents.length,
        };
      }

      return stats;
    }),

  // Get upcoming lessons
  getUpcomingLessons: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Build where clause based on user role
      const where: any = {
        // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
        startTime: { gte: new Date().toISOString() },
        status: "CONFIRMED",
      };

      if (user.role === UserRole.STUDENT) {
        where.studentId = userId;
      } else if (user.role === UserRole.INSTRUCTOR) {
        where.instructorId = userId;
      }

      const lessons = await ctx.db.booking.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
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
          }
        },
        orderBy: { startTime: "asc" },
        take: input.limit,
      });

      return lessons.map((lesson) => ({
        id: lesson.id,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        lessonType: lesson.lessonType,
        status: lesson.status,
        instructor: user.role === UserRole.STUDENT ? lesson.instructor : null,
        student: user.role === UserRole.INSTRUCTOR ? lesson.student : null,
        vehicle: lesson.vehicle,
        location: lesson.location,
      }));
    }),

  // Get recent activity
  getRecentActivity: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const activities: any[] = [];

      // Get recent bookings
      const bookingWhere: any = {};
      if (user.role === UserRole.STUDENT) {
        bookingWhere.studentId = userId;
      } else if (user.role === UserRole.INSTRUCTOR) {
        bookingWhere.instructorId = userId;
      }

      const recentBookings = await ctx.db.booking.findMany({
        where: bookingWhere,
        include: {
          instructor: {
            select: { firstName: true, lastName: true }
          },
          student: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { updatedAt: "desc" },
        take: Math.ceil(input.limit / 2),
      });

      // Add booking activities
      activities.push(
        ...recentBookings.map((booking) => ({
          id: booking.id,
          type: "lesson" as const,
          date: booking.updatedAt,
          title: `Lesson ${booking.status.toLowerCase()}`,
          description: user.role === UserRole.STUDENT 
            ? `${booking.lessonType} with ${booking.instructor?.firstName} ${booking.instructor?.lastName}`
            : `${booking.lessonType} with ${booking.student?.firstName} ${booking.student?.lastName}`,
          status: booking.status,
          icon: "calendar" as const,
        }))
      );

      // Get recent payments (for students)
      if (user.role === UserRole.STUDENT) {
        const recentPayments = await ctx.db.payment.findMany({
          where: { userId: userId },
          orderBy: { createdAt: "desc" },
          take: Math.floor(input.limit / 2),
        });

        activities.push(
          ...recentPayments.map((payment) => ({
            id: payment.id,
            type: "payment" as const,
            date: payment.createdAt,
            title: `Payment ${payment.status.toLowerCase()}`,
            description: `Amount: PLN ${payment.amount}`,
            status: payment.status,
            icon: "credit-card" as const,
          }))
        );
      }

      // Sort by date and limit
      return activities
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, input.limit);
    }),

  // Get progress (for students)
  getProgress: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { 
          role: true,
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.role !== UserRole.STUDENT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Progress is only available for students",
        });
      }

      // Get lesson statistics by type
      const lessonStats = await ctx.db.booking.groupBy({
        by: ["lessonType", "status"],
        where: { studentId: userId },
        _count: true,
      });

      // Mock skills data (this would come from a separate progress tracking system)
      const skills = [
        { 
          name: "Parking", 
          value: 45,
          color: "#3B82F6" 
        },
        { 
          name: "Traffic Rules", 
          value: 65,
          color: "#10B981" 
        },
        { 
          name: "City Driving", 
          value: 35,
          color: "#F59E0B" 
        },
        { 
          name: "Highway Driving", 
          value: 85,
          color: "#8B5CF6" 
        },
        { 
          name: "Night Driving", 
          value: 45,
          color: "#EF4444" 
        },
        { 
          name: "Emergency", 
          value: 12,
          color: "#06B6D4" 
        },
      ];

      // Weekly progress
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      
      const weeklyLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          status: "COMPLETED",
          startTime: {
            // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
            gte: weekStart.toISOString(),
            lte: weekEnd.toISOString(),
          },
        },
      });

      // Monthly progress
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      
      const monthlyLessons = await ctx.db.booking.count({
        where: {
          studentId: userId,
          status: "COMPLETED",
          startTime: {
            // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
            gte: monthStart.toISOString(),
            lte: monthEnd.toISOString(),
          },
        },
      });

      return {
        skills,
        lessonStats: lessonStats.map((stat) => ({
          type: stat.lessonType,
          status: stat.status,
          count: stat._count,
        })),
        weeklyProgress: {
          completed: weeklyLessons,
          target: 3,
        },
        monthlyProgress: {
          completed: monthlyLessons,
          target: 12,
        },
        overallProgress: 95,
      };
    }),

  // Get next lesson
  getNextLesson: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user) {
        return null;
      }

      const where: any = {
        status: "CONFIRMED",
        // ВИПРАВЛЕНО: Конвертуємо Date в ISO string
        startTime: { gte: new Date().toISOString() },
      };

      if (user.role === UserRole.STUDENT) {
        where.studentId = userId;
      } else if (user.role === UserRole.INSTRUCTOR) {
        where.instructorId = userId;
      }

      const nextLesson = await ctx.db.booking.findFirst({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              phone: true,
            }
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          },
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              registrationNumber: true,
              category: true,
            }
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true,
            }
          }
        },
        orderBy: { startTime: "asc" },
      });

      if (!nextLesson) {
        return null;
      }

      return {
        id: nextLesson.id,
        startTime: nextLesson.startTime,
        endTime: nextLesson.endTime,
        lessonType: nextLesson.lessonType,
        status: nextLesson.status,
        instructor: user.role === UserRole.STUDENT ? nextLesson.instructor : null,
        student: user.role === UserRole.INSTRUCTOR ? nextLesson.student : null,
        vehicle: nextLesson.vehicle,
        location: nextLesson.location,
      };
    }),
});