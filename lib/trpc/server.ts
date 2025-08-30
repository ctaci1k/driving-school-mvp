// lib/trpc/server.ts

import { initTRPC, TRPCError } from '@trpc/server'
import { type Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ZodError } from 'zod'
import { UserRole } from '@prisma/client'
import superjson from 'superjson'

/**
 * Context for tRPC procedures
 */
interface CreateContextOptions {
  session: Session | null
}

/**
 * Create context for tRPC
 */
export const createTRPCContext = async (opts?: CreateContextOptions) => {
  const session = opts?.session ?? (await getServerSession(authOptions))
  
  return {
    db,
    session,
  }
}

/**
 * Initialize tRPC backend with superjson transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Protected procedure - requires authentication
 */
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

/**
 * Admin procedure - requires admin role
 */
const enforceUserIsAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  const userRole = ctx.session.user.role as UserRole
  
  if (userRole !== UserRole.admin && userRole !== UserRole.BRANCH_MANAGER) {
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

/**
 * Instructor procedure - requires instructor role
 */
const enforceUserIsInstructor = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  const userRole = ctx.session.user.role as UserRole
  
  if (userRole !== UserRole.instructor && 
      userRole !== UserRole.admin && 
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

/**
 * Dispatcher procedure - requires dispatcher role
 */
const enforceUserIsDispatcher = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action'
    })
  }
  
  const userRole = ctx.session.user.role as UserRole
  
  if (userRole !== UserRole.DISPATCHER && 
      userRole !== UserRole.admin && 
      userRole !== UserRole.BRANCH_MANAGER) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Dispatcher access required' 
    })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session,
    },
  })
})

export const dispatcherProcedure = t.procedure.use(enforceUserIsDispatcher)