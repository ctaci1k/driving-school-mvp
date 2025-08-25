// lib/trpc/routers/user.ts

import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  UserRole,
  UserStatus,
  PackageStatus
} from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths,
  differenceInYears
} from 'date-fns'

// ====== VALIDATION SCHEMAS ======
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().min(9).max(15).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  licenseNumber: z.string().optional(),
  locationId: z.string().optional(),
  language: z.string().default('pl'),
})

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(9).max(15).optional(),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  avatar: z.string().url().optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
})

const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100),
})

// Helper functions
async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

function calculateAge(dateOfBirth: Date): number {
  return differenceInYears(new Date(), dateOfBirth)
}

export const userRouter = router({
  // Get current user profile
  getMe: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          location: true,
          userPackages: {
            where: {
              status: PackageStatus.ACTIVE,
              expiresAt: { gte: new Date() },
            },
            include: {
              package: true,
            },
          },
          _count: {
            select: {
              studentBookings: {
                where: { status: 'COMPLETED' }
              },
              instructorBookings: {
                where: { status: 'COMPLETED' }
              },
              payments: {
                where: { status: 'COMPLETED' }
              },
              notifications: {
                where: { readAt: null }
              }
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Calculate role-specific stats
      let additionalStats = {}

      if (user.role === UserRole.STUDENT) {
        const upcomingBookings = await ctx.db.booking.count({
          where: {
            studentId: user.id,
            startTime: { gte: new Date() },
            status: 'CONFIRMED',
          },
        })

        additionalStats = {
          completedLessons: user._count.studentBookings,
          upcomingLessons: upcomingBookings,
          totalCredits: user.userPackages.reduce(
            (sum, pkg) => sum + pkg.creditsRemaining, 
            0
          ),
        }
      } else if (user.role === UserRole.INSTRUCTOR) {
        const todayBookings = await ctx.db.booking.count({
          where: {
            instructorId: user.id,
            startTime: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            status: 'CONFIRMED',
          },
        })

        additionalStats = {
          todayBookings,
          totalLessons: user.totalLessons || 0,
          rating: user.rating || 0,
          successRate: user.successRate || 0,
        }
      }

      return {
        ...user,
        ...additionalStats,
        age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
      }
    }),

  // Update profile
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        },
        include: {
          location: true,
        }
      })

      return user
    }),

  // Change password
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { passwordHash: true },
      })

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      const isValid = await verifyPassword(input.currentPassword, user.passwordHash)
      
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        })
      }

      const newPasswordHash = await hashPassword(input.newPassword)

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { passwordHash: newPasswordHash },
      })

      return { success: true }
    }),

  // Admin: Get all users
  getAll: adminProcedure
    .input(z.object({
      role: z.nativeEnum(UserRole).optional(),
      status: z.nativeEnum(UserStatus).optional(),
      search: z.string().optional(),
      locationId: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        deletedAt: null,
      }

      if (input.role) {
        where.role = input.role
      }

      if (input.status) {
        where.status = input.status
      }

      if (input.locationId) {
        where.locationId = input.locationId
      }

      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: 'insensitive' } },
          { lastName: { contains: input.search, mode: 'insensitive' } },
          { email: { contains: input.search, mode: 'insensitive' } },
          { phone: { contains: input.search } },
        ]
      }

      const [users, totalCount] = await Promise.all([
        ctx.db.user.findMany({
          where,
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: { createdAt: 'desc' },
          include: {
            location: true,
            _count: {
              select: {
                studentBookings: true,
                instructorBookings: true,
              },
            },
          },
        }),
        ctx.db.user.count({ where })
      ])

      let nextCursor: string | undefined = undefined
      if (users.length > input.limit) {
        const nextItem = users.pop()
        nextCursor = nextItem!.id
      }

      return {
        items: users,
        nextCursor,
        totalCount,
      }
    }),

  // Get user by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Check permissions
      if (input !== ctx.session.user.id && 
          !['ADMIN', 'BRANCH_MANAGER', 'DISPATCHER'].includes(ctx.session.user.role)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view this user',
        })
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input },
        include: {
          location: true,
          userPackages: {
            include: {
              package: true,
              payment: true,
            },
            orderBy: { purchasedAt: 'desc' },
            take: 10,
          },
          studentBookings: {
            take: 10,
            orderBy: { startTime: 'desc' },
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  rating: true,
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
          },
          instructorBookings: {
            take: 10,
            orderBy: { startTime: 'desc' },
            include: {
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
            },
          },
          _count: {
            select: {
              studentBookings: true,
              instructorBookings: true,
              payments: true,
              notifications: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return {
        ...user,
        age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
      }
    }),

  // Get instructors
  getInstructors: protectedProcedure
    .input(z.object({
      locationId: z.string().optional(),
      availableOnly: z.boolean().default(true),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        role: UserRole.INSTRUCTOR,
        deletedAt: null,
      }

      if (input.availableOnly) {
        where.status = UserStatus.ACTIVE
      }

      if (input.locationId) {
        where.locationId = input.locationId
      }

      const instructors = await ctx.db.user.findMany({
        where,
        take: input.limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          rating: true,
          totalLessons: true,
          successRate: true,
          specializations: true,
          licenseCategories: true,
          yearsOfExperience: true,
          phone: true,
          email: true,
          location: {
            select: {
              id: true,
              name: true,
              address: true,
            }
          },
          instructorSchedule: {
            where: {
              isAvailable: true,
            },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          },
          _count: {
            select: {
              instructorBookings: {
                where: {
                  status: 'COMPLETED',
                },
              },
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { totalLessons: 'desc' },
        ],
      })

      return instructors
    }),

  // Admin: Create user
  create: adminProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        })
      }

      const passwordHash = await hashPassword(input.password)

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: input.role,
          status: UserStatus.ACTIVE,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          emergencyContact: input.emergencyContact,
          emergencyPhone: input.emergencyPhone,
          licenseNumber: input.licenseNumber,
          locationId: input.locationId,
          language: input.language,
          emailVerified: new Date(), // Auto-verify for admin-created users
        },
        include: {
          location: true,
        }
      })

      return user
    }),

  // Get user statistics
  getStats: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id

      // Check permissions
      if (userId !== ctx.session.user.id && 
          !['ADMIN', 'BRANCH_MANAGER'].includes(ctx.session.user.role)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view these statistics',
        })
      }

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      const dateFilter = input.from || input.to ? {
        gte: input.from ? new Date(input.from) : undefined,
        lte: input.to ? new Date(input.to) : undefined,
      } : undefined

      let stats: any = {
        role: user.role,
        memberSince: user.createdAt,
        lastActive: user.lastLoginAt,
      }

      if (user.role === UserRole.STUDENT) {
        const [bookingStats, activePackages, totalSpent] = await Promise.all([
          ctx.db.booking.aggregate({
            where: {
              studentId: userId,
              startTime: dateFilter,
            },
            _count: true,
            _sum: { duration: true },
          }),
          ctx.db.userPackage.findMany({
            where: {
              userId,
              status: PackageStatus.ACTIVE,
              expiresAt: { gte: new Date() },
            },
            include: { package: true },
          }),
          ctx.db.payment.aggregate({
            where: {
              userId,
              status: 'COMPLETED',
              createdAt: dateFilter,
            },
            _sum: { amount: true },
          })
        ])

        const completedLessons = await ctx.db.booking.count({
          where: {
            studentId: userId,
            status: 'COMPLETED',
            startTime: dateFilter,
          },
        })

        stats = {
          ...stats,
          totalLessons: bookingStats._count,
          totalHours: (bookingStats._sum.duration || 0) / 60,
          completedLessons,
          totalSpent: Number(totalSpent._sum.amount || 0),
          activePackages: activePackages.length,
          totalCredits: activePackages.reduce(
            (sum, pkg) => sum + pkg.creditsRemaining, 
            0
          ),
        }
      } else if (user.role === UserRole.INSTRUCTOR) {
        const bookingStats = await ctx.db.booking.aggregate({
          where: {
            instructorId: userId,
            status: 'COMPLETED',
            startTime: dateFilter,
          },
          _count: true,
          _sum: {
            duration: true,
            price: true,
          },
        })

        const studentCount = await ctx.db.booking.findMany({
          where: {
            instructorId: userId,
            startTime: dateFilter,
          },
          select: { studentId: true },
          distinct: ['studentId'],
        })

        stats = {
          ...stats,
          totalLessons: bookingStats._count,
          totalHours: (bookingStats._sum.duration || 0) / 60,
          totalRevenue: Number(bookingStats._sum.price || 0),
          uniqueStudents: studentCount.length,
          rating: user.rating || 0,
          successRate: user.successRate || 0,
        }
      }

      return stats
    }),

  // Check email availability
  checkEmail: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      })

      return {
        available: !user,
      }
    }),
})