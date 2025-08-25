// lib/trpc/routers/user.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { UserRole } from '@prisma/client'

export const userRouter = router({
  /**
   * Get current user profile
   */
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: true,
          instructorProfile: true,
          location: true
        }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        })
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
        language: user.language,
        timezone: user.timezone,
        location: user.location,
        studentProfile: user.studentProfile,
        instructorProfile: user.instructorProfile,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(2).optional(),
      phone: z.string().optional(),
      dateOfBirth: z.date().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      emergencyContact: z.string().optional(),
      emergencyPhone: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: input
      })

      return updatedUser
    }),

  /**
   * Get user preferences
   */
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const preferences = await ctx.db.studentPreferences.findUnique({
        where: { userId }
      })

      // Return default preferences if none exist
      if (!preferences) {
        return {
          preferredDays: [],
          preferredTimeSlots: [],
          weekendAvailability: false,
          preferredInstructorIds: [],
          avoidInstructorIds: [],
          preferredGender: null,
          preferredVehicleIds: [],
          preferredTransmission: null,
          preferredLocationId: null,
          maxDistanceKm: null,
          communicationStyle: 'DETAILED',
          lessonReminders: true,
          reminderTime: 24,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true
        }
      }

      return preferences
    }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(z.object({
      preferredDays: z.array(z.string()).optional(),
      preferredTimeSlots: z.array(z.string()).optional(),
      weekendAvailability: z.boolean().optional(),
      preferredInstructorIds: z.array(z.string()).optional(),
      avoidInstructorIds: z.array(z.string()).optional(),
      preferredGender: z.enum(['MALE', 'FEMALE']).nullable().optional(),
      preferredVehicleIds: z.array(z.string()).optional(),
      preferredTransmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'DSG']).nullable().optional(),
      preferredLocationId: z.string().nullable().optional(),
      maxDistanceKm: z.number().nullable().optional(),
      communicationStyle: z.enum(['BRIEF', 'DETAILED', 'VISUAL', 'ENCOURAGING']).optional(),
      lessonReminders: z.boolean().optional(),
      reminderTime: z.number().optional(),
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Prepare data with proper types
      const updateData: any = { ...input }
      
      const preferences = await ctx.db.studentPreferences.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          ...updateData
        }
      })

      return preferences
    }),

  /**
   * Get user statistics
   */
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const [
        completedLessons,
        totalHours,
        totalSpent,
        achievements,
        studentProfile
      ] = await Promise.all([
        // Completed lessons count
        ctx.db.booking.count({
          where: {
            studentId: userId,
            status: 'COMPLETED'
          }
        }),

        // Total hours
        ctx.db.booking.aggregate({
          where: {
            studentId: userId,
            status: 'COMPLETED'
          },
          _sum: {
            duration: true
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

        // Achievements count
        ctx.db.userAchievement.count({
          where: {
            userId,
            unlockedAt: { not: null }
          }
        }),

        // Get student profile for rating (if exists)
        ctx.db.studentProfile.findUnique({
          where: { userId },
          select: {
            averageRating: true
          }
        })
      ])

      return {
        completedLessons,
        totalHours: Math.round((totalHours._sum.duration || 0) / 60),
        totalSpent: totalSpent._sum.amount || 0,
        achievementsUnlocked: achievements,
        averageRating: studentProfile?.averageRating || 4.5 // Default rating if not exists
      }
    }),

  /**
   * Upload avatar
   */
  uploadAvatar: protectedProcedure
    .input(z.object({
      avatarUrl: z.string().url()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          avatar: input.avatarUrl
        }
      })

      return {
        success: true,
        avatarUrl: updatedUser.avatar
      }
    }),

  /**
   * Get notification settings
   */
  getNotificationSettings: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          marketingConsent: true
        }
      })

      return user
    }),

  /**
   * Update notification settings
   */
  updateNotificationSettings: protectedProcedure
    .input(z.object({
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      marketingConsent: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: input
      })

      return {
        success: true,
        settings: {
          emailNotifications: updatedUser.emailNotifications,
          smsNotifications: updatedUser.smsNotifications,
          pushNotifications: updatedUser.pushNotifications,
          marketingConsent: updatedUser.marketingConsent
        }
      }
    })
})