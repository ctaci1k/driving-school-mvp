import { router, protectedProcedure, adminProcedure } from '../server'
import { z } from 'zod'

export const userRouter = router({
  getInstructors: protectedProcedure
    .query(async ({ ctx }) => {
      const instructors = await ctx.db.user.findMany({
        where: {
          role: 'INSTRUCTOR',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      })

      return instructors
    }),

  getAllUsers: adminProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return users
    }),

  updateRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })

      return user
    }),

  getMe: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      return user
    }),
})