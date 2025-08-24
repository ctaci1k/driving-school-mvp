// lib/trpc/routers/user.ts

import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../server'
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
  format,
  differenceInYears
} from 'date-fns'

// Validation Schemas
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().min(9).max(15),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  licenseNumber: z.string().optional(),
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

const UpdateUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(9).max(15).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  licenseNumber: z.string().optional(),
  // Instructor specific
  licenseCategories: z.array(z.string()).optional(),
  licenseIssuedDate: z.string().datetime().optional(),
  licenseExpiryDate: z.string().datetime().optional(),
  instructorLicenseNumber: z.string().optional(),
  instructorLicenseDate: z.string().datetime().optional(),
  yearsOfExperience: z.number().min(0).optional(),
  specializations: z.array(z.string()).optional(),
})

const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100),
})

const ResetPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8).max(100),
})

const InstructorDetailsSchema = z.object({
  licenseCategories: z.array(z.string()),
  licenseIssuedDate: z.string().datetime(),
  licenseExpiryDate: z.string().datetime(),
  instructorLicenseNumber: z.string(),
  instructorLicenseDate: z.string().datetime(),
  yearsOfExperience: z.number().min(0),
  specializations: z.array(z.string()).default([]),
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
  // Get current user
  getMe: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
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
              studentBookings: true,
              instructorBookings: true,
              payments: true,
              notifications: {
                where: { readAt: null },
              },
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

      // Calculate additional stats based on role
      let additionalStats = {}

      if (user.role === UserRole.STUDENT) {
        const completedLessons = await ctx.db.booking.count({
          where: {
            studentId: user.id,
            status: 'COMPLETED',
          },
        })

        const upcomingLessons = await ctx.db.booking.count({
          where: {
            studentId: user.id,
            startTime: { gte: new Date() },
            status: 'CONFIRMED',
          },
        })

        additionalStats = {
          completedLessons,
          upcomingLessons,
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

        const monthlyStats = await ctx.db.booking.aggregate({
          where: {
            instructorId: user.id,
            startTime: {
              gte: startOfMonth(new Date()),
              lte: endOfMonth(new Date()),
            },
            status: 'COMPLETED',
          },
          _count: true,
          _sum: {
            duration: true,
          },
        })

        additionalStats = {
          todayBookings,
          monthlyLessons: monthlyStats._count,
          monthlyHours: (monthlyStats._sum.duration || 0) / 60,
          rating: user.rating || 0,
          totalLessons: user.totalLessons || 0,
        }
      }

      return {
        ...user,
        ...additionalStats,
        age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
      }
    }),

  // Update current user profile
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        },
      })

      return user
    }),

  // Change password
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // Get user with password
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

      // Verify current password
      const isValid = await verifyPassword(input.currentPassword, user.passwordHash)
      
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        })
      }

      // Hash new password
      const newPasswordHash = await hashPassword(input.newPassword)

      // Update password
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { passwordHash: newPasswordHash },
      })

      return { success: true }
    }),

  // Admin: Create user
  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can create users',
        })
      }

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

      // Hash password
      const passwordHash = await hashPassword(input.password)

      // Create user
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
          language: input.language,
          emailVerified: new Date(), // Auto-verify for admin-created users
        },
      })

      return user
    }),

  // Admin: Update user
  update: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can update users',
        })
      }

      const { id, ...data } = input

      // Check if user exists
      const existing = await ctx.db.user.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Don't allow changing own role
      if (id === ctx.session.user.id && data.role) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot change your own role',
        })
      }

      // Update user
      const user = await ctx.db.user.update({
        where: { id },
        data: {
          ...data,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          licenseIssuedDate: data.licenseIssuedDate ? new Date(data.licenseIssuedDate) : undefined,
          licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate) : undefined,
          instructorLicenseDate: data.instructorLicenseDate ? new Date(data.instructorLicenseDate) : undefined,
        },
      })

      return user
    }),

  // Admin: Reset user password
  resetPassword: protectedProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can reset passwords',
        })
      }

      // Hash new password
      const passwordHash = await hashPassword(input.newPassword)

      // Update password
      await ctx.db.user.update({
        where: { id: input.userId },
        data: { passwordHash },
      })

      return { success: true }
    }),

  // Admin: Delete user (soft delete)
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can delete users',
        })
      }

      // Don't allow self-deletion
      if (input === ctx.session.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete your own account',
        })
      }

      // Check for active bookings
      const activeBookings = await ctx.db.booking.count({
        where: {
          OR: [
            { studentId: input },
            { instructorId: input },
          ],
          startTime: { gte: new Date() },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
      })

      if (activeBookings > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete user with ${activeBookings} active bookings`,
        })
      }

      // Soft delete
      const user = await ctx.db.user.update({
        where: { id: input },
        data: {
          status: UserStatus.INACTIVE,
          deletedAt: new Date(),
        },
      })

      return user
    }),

  // Get all users (with filters)
  getAll: protectedProcedure
    .input(z.object({
      role: z.nativeEnum(UserRole).optional(),
      status: z.nativeEnum(UserStatus).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Check permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER &&
          ctx.session.user.role !== UserRole.DISPATCHER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view users',
        })
      }

      const where: any = {
        deletedAt: null,
      }

      if (input.role) {
        where.role = input.role
      }

      if (input.status) {
        where.status = input.status
      }

      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: 'insensitive' } },
          { lastName: { contains: input.search, mode: 'insensitive' } },
          { email: { contains: input.search, mode: 'insensitive' } },
          { phone: { contains: input.search } },
        ]
      }

      const users = await ctx.db.user.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: [
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              studentBookings: true,
              instructorBookings: true,
            },
          },
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (users.length > input.limit) {
        const nextItem = users.pop()
        nextCursor = nextItem!.id
      }

      return {
        items: users,
        nextCursor,
      }
    }),

  // Get user by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Check permissions
      if (input !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER &&
            ctx.session.user.role !== UserRole.DISPATCHER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view this user',
          })
        }
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input },
        include: {
          userPackages: {
            include: {
              package: true,
            },
            orderBy: {
              purchasedAt: 'desc',
            },
          },
          studentBookings: {
            take: 10,
            orderBy: {
              startTime: 'desc',
            },
            include: {
              instructor: true,
              vehicle: true,
            },
          },
          instructorBookings: {
            take: 10,
            orderBy: {
              startTime: 'desc',
            },
            include: {
              student: true,
              vehicle: true,
            },
          },
          payments: {
            take: 10,
            orderBy: {
              createdAt: 'desc',
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

      return user
    }),

  // Get instructors
  getInstructors: publicProcedure
    .input(z.object({
      locationId: z.string().optional(),
      specialization: z.string().optional(),
      availableOnly: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        role: UserRole.INSTRUCTOR,
        deletedAt: null,
      }

      if (input.availableOnly) {
        where.status = UserStatus.ACTIVE
      }

      if (input.specialization) {
        where.specializations = {
          has: input.specialization,
        }
      }

      const instructors = await ctx.db.user.findMany({
        where,
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
          instructorSchedule: {
            where: {
              isAvailable: true,
            },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              locationId: true,
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

      // Filter by location if specified
      if (input.locationId) {
        return instructors.filter(instructor => 
          instructor.instructorSchedule.some(schedule => 
            schedule.locationId === input.locationId
          )
        )
      }

      return instructors
    }),

  // Update instructor details
  updateInstructorDetails: protectedProcedure
    .input(InstructorDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is instructor
      if (ctx.session.user.role !== UserRole.INSTRUCTOR) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only instructors can update instructor details',
        })
      }

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          licenseCategories: input.licenseCategories,
          licenseIssuedDate: new Date(input.licenseIssuedDate),
          licenseExpiryDate: new Date(input.licenseExpiryDate),
          instructorLicenseNumber: input.instructorLicenseNumber,
          instructorLicenseDate: new Date(input.instructorLicenseDate),
          yearsOfExperience: input.yearsOfExperience,
          specializations: input.specializations,
        },
      })

      return user
    }),

  // Get user statistics
  getStatistics: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id

      // Check permissions
      if (userId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view these statistics',
          })
        }
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
        // Student statistics
        const bookingStats = await ctx.db.booking.aggregate({
          where: {
            studentId: userId,
            startTime: dateFilter,
          },
          _count: true,
          _sum: {
            duration: true,
          },
        })

        const completedLessons = await ctx.db.booking.count({
          where: {
            studentId: userId,
            status: 'COMPLETED',
            startTime: dateFilter,
          },
        })

        const cancelledLessons = await ctx.db.booking.count({
          where: {
            studentId: userId,
            status: 'CANCELLED',
            startTime: dateFilter,
          },
        })

        const totalSpent = await ctx.db.payment.aggregate({
          where: {
            userId,
            status: 'COMPLETED',
            createdAt: dateFilter,
          },
          _sum: {
            amount: true,
          },
        })

        const activePackages = await ctx.db.userPackage.findMany({
          where: {
            userId,
            status: PackageStatus.ACTIVE,
            expiresAt: { gte: new Date() },
          },
          include: {
            package: true,
          },
        })

        stats = {
          ...stats,
          totalLessons: bookingStats._count,
          totalHours: (bookingStats._sum.duration || 0) / 60,
          completedLessons,
          cancelledLessons,
          completionRate: bookingStats._count > 0 
            ? (completedLessons / bookingStats._count) * 100 
            : 0,
          totalSpent: totalSpent._sum.amount || 0,
          activePackages: activePackages.length,
          totalCredits: activePackages.reduce(
            (sum, pkg) => sum + pkg.creditsRemaining, 
            0
          ),
        }
      } else if (user.role === UserRole.INSTRUCTOR) {
        // Instructor statistics
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
          select: {
            studentId: true,
          },
          distinct: ['studentId'],
        })

        const cancellationRate = await ctx.db.booking.count({
          where: {
            instructorId: userId,
            status: 'CANCELLED',
            startTime: dateFilter,
          },
        })

        const noShowRate = await ctx.db.booking.count({
          where: {
            instructorId: userId,
            status: 'NO_SHOW',
            startTime: dateFilter,
          },
        })

        // Monthly comparison
        const lastMonth = subMonths(new Date(), 1)
        const lastMonthStats = await ctx.db.booking.aggregate({
          where: {
            instructorId: userId,
            status: 'COMPLETED',
            startTime: {
              gte: startOfMonth(lastMonth),
              lte: endOfMonth(lastMonth),
            },
          },
          _count: true,
        })

        const thisMonthStats = await ctx.db.booking.aggregate({
          where: {
            instructorId: userId,
            status: 'COMPLETED',
            startTime: {
              gte: startOfMonth(new Date()),
              lte: endOfMonth(new Date()),
            },
          },
          _count: true,
        })

        stats = {
          ...stats,
          totalLessons: bookingStats._count,
          totalHours: (bookingStats._sum.duration || 0) / 60,
          totalRevenue: bookingStats._sum.price || 0,
          uniqueStudents: studentCount.length,
          cancellationRate: bookingStats._count > 0
            ? (cancellationRate / (bookingStats._count + cancellationRate)) * 100
            : 0,
          noShowRate: bookingStats._count > 0
            ? (noShowRate / (bookingStats._count + noShowRate)) * 100
            : 0,
          rating: user.rating || 0,
          successRate: user.successRate || 0,
          monthlyGrowth: lastMonthStats._count > 0
            ? ((thisMonthStats._count - lastMonthStats._count) / lastMonthStats._count) * 100
            : 0,
        }
      }

      return stats
    }),

  // Check email availability
  checkEmail: publicProcedure
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