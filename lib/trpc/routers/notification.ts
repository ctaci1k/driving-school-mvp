// lib/trpc/routers/notification.ts

import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  UserRole,
  BookingStatus
} from '@prisma/client'
import { 
  addMinutes, 
  addHours, 
  addDays,
  isBefore,
  isAfter,
  format
} from 'date-fns'

// Validation Schemas
const CreateNotificationSchema = z.object({
  userId: z.string().optional(),
  type: z.nativeEnum(NotificationType),
  channel: z.nativeEnum(NotificationChannel).default(NotificationChannel.IN_APP),
  subject: z.string().optional(),
  message: z.string().min(1).max(1000),
  title: z.string().optional(),
  priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.MEDIUM),
  scheduledFor: z.string().datetime().optional(),
  isBroadcast: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
})

const UpdateNotificationSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(NotificationStatus).optional(),
  readAt: z.string().datetime().optional(),
})

const BroadcastNotificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  channel: z.nativeEnum(NotificationChannel).default(NotificationChannel.IN_APP),
  subject: z.string(),
  message: z.string().min(1).max(1000),
  title: z.string(),
  priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.MEDIUM),
  targetRole: z.nativeEnum(UserRole).optional(),
  targetLocationId: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
})

const NotificationListSchema = z.object({
  status: z.nativeEnum(NotificationStatus).optional(),
  type: z.nativeEnum(NotificationType).optional(),
  channel: z.nativeEnum(NotificationChannel).optional(),
  unreadOnly: z.boolean().default(false),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

// Helper functions
async function sendEmailNotification(
  to: string,
  subject: string,
  message: string,
  metadata?: any
) {
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
  console.log('Sending email:', { to, subject, message })
  return true
}

async function sendSmsNotification(
  to: string,
  message: string,
  metadata?: any
) {
  // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
  console.log('Sending SMS:', { to, message })
  return true
}

async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  metadata?: any
) {
  // TODO: Integrate with push notification service (FCM, OneSignal, etc.)
  console.log('Sending push notification:', { userId, title, message })
  return true
}

// Додаємо в кінець файлу lib/trpc/routers/index.ts:
// import { notificationRouter } from './notification'
// додати в appRouter: notification: notificationRouter,

export const notificationRouter = router({
  // Create notification
  create: protectedProcedure
    .input(CreateNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      const targetUserId = input.userId || ctx.session.user.id

      // Check permissions if creating for another user
      if (targetUserId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot create notifications for other users',
          })
        }
      }

      // Get user details for email/SMS
      const user = await ctx.db.user.findUnique({
        where: { id: targetUserId },
        select: {
          email: true,
          phone: true,
          emailNotifications: true,
          smsNotifications: true,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Create notification record
      const notification = await ctx.db.notification.create({
        data: {
          userId: targetUserId,
          type: input.type,
          channel: input.channel,
          subject: input.subject,
          message: input.message,
          title: input.title,
          priority: input.priority,
          scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
          isBroadcast: input.isBroadcast,
          metadata: input.metadata,
          status: input.scheduledFor ? NotificationStatus.PENDING : NotificationStatus.SENT,
          sentAt: input.scheduledFor ? null : new Date(),
        },
      })

      // Send notification based on channel
      if (!input.scheduledFor) {
        switch (input.channel) {
          case NotificationChannel.EMAIL:
            if (user.emailNotifications && user.email) {
              await sendEmailNotification(
                user.email,
                input.subject || input.title || 'Notification',
                input.message,
                input.metadata
              )
            }
            break

          case NotificationChannel.SMS:
            if (user.smsNotifications && user.phone) {
              await sendSmsNotification(
                user.phone,
                input.message,
                input.metadata
              )
            }
            break

          case NotificationChannel.PUSH:
            await sendPushNotification(
              targetUserId,
              input.title || 'Notification',
              input.message,
              input.metadata
            )
            break

          case NotificationChannel.IN_APP:
            // Already created in database, no additional action needed
            break
        }
      }

      return notification
    }),

  // Broadcast notification (admin only)
  broadcast: adminProcedure
    .input(BroadcastNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      // Build user filter
      const userFilter: any = {
        status: 'ACTIVE',
      }

      if (input.targetRole) {
        userFilter.role = input.targetRole
      }

      if (input.targetLocationId) {
        userFilter.locationId = input.targetLocationId
      }

      // Get target users
      const users = await ctx.db.user.findMany({
        where: userFilter,
        select: {
          id: true,
          email: true,
          phone: true,
          emailNotifications: true,
          smsNotifications: true,
        },
      })

      if (users.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No users found matching criteria',
        })
      }

      // Create notifications for all users
      const notifications = await ctx.db.notification.createMany({
        data: users.map(user => ({
          userId: user.id,
          type: input.type,
          channel: input.channel,
          subject: input.subject,
          message: input.message,
          title: input.title,
          priority: input.priority,
          scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
          isBroadcast: true,
          status: input.scheduledFor ? NotificationStatus.PENDING : NotificationStatus.SENT,
          sentAt: input.scheduledFor ? null : new Date(),
        })),
      })

      // Send notifications if not scheduled
      if (!input.scheduledFor) {
        for (const user of users) {
          switch (input.channel) {
            case NotificationChannel.EMAIL:
              if (user.emailNotifications && user.email) {
                await sendEmailNotification(
                  user.email,
                  input.subject,
                  input.message,
                  null
                )
              }
              break

            case NotificationChannel.SMS:
              if (user.smsNotifications && user.phone) {
                await sendSmsNotification(
                  user.phone,
                  input.message,
                  null
                )
              }
              break

            case NotificationChannel.PUSH:
              await sendPushNotification(
                user.id,
                input.title,
                input.message,
                null
              )
              break
          }
        }
      }

      return {
        count: notifications.count,
        message: `Broadcast sent to ${notifications.count} users`,
      }
    }),

  // Get user notifications
  list: protectedProcedure
    .input(NotificationListSchema)
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      }

      if (input.status) {
        where.status = input.status
      }

      if (input.type) {
        where.type = input.type
      }

      if (input.channel) {
        where.channel = input.channel
      }

      if (input.unreadOnly) {
        where.readAt = null
      }

      const notifications = await ctx.db.notification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      })

      let nextCursor: string | undefined = undefined
      if (notifications.length > input.limit) {
        const nextItem = notifications.pop()
        nextCursor = nextItem!.id
      }

      return {
        notifications,
        nextCursor,
      }
    }),

  // Mark as read
  markAsRead: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findUnique({
        where: { id: input.id },
      })

      if (!notification) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found',
        })
      }

      if (notification.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your notification',
        })
      }

      const updated = await ctx.db.notification.update({
        where: { id: input.id },
        data: {
          status: NotificationStatus.READ,
          readAt: new Date(),
        },
      })

      return updated
    }),

  // Mark all as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const result = await ctx.db.notification.updateMany({
        where: {
          userId: ctx.session.user.id,
          readAt: null,
        },
        data: {
          status: NotificationStatus.READ,
          readAt: new Date(),
        },
      })

      return {
        count: result.count,
        message: `Marked ${result.count} notifications as read`,
      }
    }),

  // Get unread count
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await ctx.db.notification.count({
        where: {
          userId: ctx.session.user.id,
          readAt: null,
        },
      })

      return { count }
    }),

  // Delete notification
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findUnique({
        where: { id: input },
      })

      if (!notification) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found',
        })
      }

      if (notification.userId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to delete this notification',
          })
        }
      }

      await ctx.db.notification.delete({
        where: { id: input },
      })

      return { success: true }
    }),

  // Send booking reminder
  sendBookingReminder: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      hoursBeforeLesson: z.number().min(1).max(48).default(24),
    }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          student: true,
          instructor: true,
          vehicle: true,
          location: true,
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }

      // Check permissions
      if (booking.studentId !== ctx.session.user.id && 
          booking.instructorId !== ctx.session.user.id &&
          ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized for this booking',
        })
      }

      const lessonTime = format(new Date(booking.startTime), 'HH:mm')
      const lessonDate = format(new Date(booking.startTime), 'dd.MM.yyyy')

      // Create reminder for student
      await ctx.db.notification.create({
        data: {
          userId: booking.studentId,
          type: NotificationType.BOOKING_REMINDER,
          channel: NotificationChannel.IN_APP,
          priority: NotificationPriority.HIGH,
          title: 'Przypomnienie o lekcji',
          message: `Masz lekcję ${lessonDate} o ${lessonTime} z instruktorem ${booking.instructor.firstName} ${booking.instructor.lastName}`,
          metadata: {
            bookingId: booking.id,
            instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
            vehicleInfo: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : null,
            locationName: booking.location?.name,
          },
          scheduledFor: addHours(new Date(booking.startTime), -input.hoursBeforeLesson),
        },
      })

      return { 
        success: true, 
        message: 'Reminder scheduled' 
      }
    }),

  // Process scheduled notifications (should be called by cron job)
  processScheduled: adminProcedure
    .mutation(async ({ ctx }) => {
      const now = new Date()

      // Get pending notifications that should be sent
      const pendingNotifications = await ctx.db.notification.findMany({
        where: {
          status: NotificationStatus.PENDING,
          scheduledFor: {
            lte: now,
          },
        },
        include: {
          user: true,
        },
        take: 100, // Process in batches
      })

      let sentCount = 0
      let failedCount = 0

      for (const notification of pendingNotifications) {
        try {
          // Send based on channel
          switch (notification.channel) {
            case NotificationChannel.EMAIL:
              if (notification.user.emailNotifications && notification.user.email) {
                await sendEmailNotification(
                  notification.user.email,
                  notification.subject || notification.title || 'Notification',
                  notification.message,
                  notification.metadata
                )
              }
              break

            case NotificationChannel.SMS:
              if (notification.user.smsNotifications && notification.user.phone) {
                await sendSmsNotification(
                  notification.user.phone,
                  notification.message,
                  notification.metadata
                )
              }
              break

            case NotificationChannel.PUSH:
              await sendPushNotification(
                notification.userId,
                notification.title || 'Notification',
                notification.message,
                notification.metadata
              )
              break
          }

          // Update status
          await ctx.db.notification.update({
            where: { id: notification.id },
            data: {
              status: NotificationStatus.SENT,
              sentAt: new Date(),
            },
          })

          sentCount++
        } catch (error) {
          // Update as failed
          await ctx.db.notification.update({
            where: { id: notification.id },
            data: {
              status: NotificationStatus.FAILED,
              failedAt: new Date(),
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
            },
          })

          failedCount++
        }
      }

      return {
        processed: pendingNotifications.length,
        sent: sentCount,
        failed: failedCount,
      }
    }),
})