// lib/trpc/routers/location.ts

import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../server'

export const locationRouter = router({
  // Отримати всі локації
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  }),

  // Отримати одну локацію
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.location.findUnique({
        where: { id: input }
      })
    }),

  // Створити локацію (тільки адмін)
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      code: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      postalCode: z.string().min(1),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      maxInstructors: z.number().default(5),
      maxVehicles: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.location.create({
        data: input
      })
    }),

  // Оновити локацію (тільки адмін)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        isActive: z.boolean().optional(),
        maxInstructors: z.number().optional(),
        maxVehicles: z.number().optional(),
      })
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.location.update({
        where: { id: input.id },
        data: input.data
      })
    })
})