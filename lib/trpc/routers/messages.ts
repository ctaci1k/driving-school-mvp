// lib/trpc/routers/messages.ts
import { router, protectedProcedure } from '../server'

export const messagesRouter = router({
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      
      const count = await ctx.db.message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      })
      
      return count
    })
})