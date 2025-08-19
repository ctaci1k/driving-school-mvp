// lib\trpc\routers\auth.ts


import { router, publicProcedure } from '../server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      role: z.enum(['STUDENT', 'INSTRUCTOR']),
    }))
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          passwordHash: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
        },
      })

      return {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      }
    }),
})