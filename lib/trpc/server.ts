// lib/trpc/server.ts

import { initTRPC, TRPCError } from '@trpc/server'
import { type Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface CreateContextOptions {
  session: Session | null
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  }
}

export const createTRPCContext = async (opts?: { 
  req?: Request
}) => {
  let session: Session | null = null
  
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Error getting session in TRPC context:', error)
  }
  
  return createInnerTRPCContext({
    session,
  })
}

// Export type for use in routers
export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure - requires authentication
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session, // Type assertion since we checked above
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

// Admin procedure - requires admin role
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  const userRole = ctx.session.user.role as UserRole
  
  if (userRole !== UserRole.ADMIN && userRole !== UserRole.BRANCH_MANAGER) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required' 
    })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session,
    },
  })
})

export const adminProcedure = t.procedure.use(enforceUserIsAdmin)

// Instructor procedure - requires instructor role
const enforceUserIsInstructor = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  const userRole = ctx.session.user.role as UserRole
  
  if (userRole !== UserRole.INSTRUCTOR && 
      userRole !== UserRole.ADMIN && 
      userRole !== UserRole.BRANCH_MANAGER) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Instructor access required' 
    })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session,
    },
  })
})

export const instructorProcedure = t.procedure.use(enforceUserIsInstructor)