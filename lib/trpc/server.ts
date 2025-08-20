// lib\trpc\server.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import superjson from 'superjson'

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
})

export const createContext = async () => {
  const session = await getServerSession(authOptions)

  return {
    db,
    session,
  }
}

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({ ctx })
})

export const instructorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (
    ctx.session.user.role !== 'INSTRUCTOR' &&
    ctx.session.user.role !== 'ADMIN'
  ) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({ ctx })
})
