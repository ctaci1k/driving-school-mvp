// lib/trpc/routers/notification.ts
import { z } from 'zod'
import { router, protectedProcedure } from '../server'

export const notificationRouter = router({
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      
      const count = await ctx.db.notification.count({
        where: {
          userId,
          read: false
        }
      })
      
      return { count }
    }),
    
  getAll: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      
      const notifications = await ctx.db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset
      })
      
      const total = await ctx.db.notification.count({
        where: { userId }
      })
      
      return {
        notifications,
        total,
        hasMore: total > input.offset + input.limit
      }
    }),
    
  markAsRead: protectedProcedure
    .input(z.object({ 
      id: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      
      return ctx.db.notification.update({
        where: { 
          id: input.id,
          userId 
        },
        data: { read: true }
      })
    }),
    
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id
      
      await ctx.db.notification.updateMany({
        where: { 
          userId,
          read: false 
        },
        data: { read: true }
      })
      
      return { success: true }
    })
})