// lib/trpc/routers/vehicle.ts

import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../server'
import { TRPCError } from '@trpc/server'

export const vehicleRouter = router({
  // Отримати всі автомобілі
  list: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      locationId: z.string().optional(),
      category: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.vehicle.findMany({
        where: {
          ...(input?.status && { status: input.status }),
          ...(input?.locationId && { baseLocationId: input.locationId }),
          ...(input?.category && { category: input.category }),
        },
        include: {
          assignedInstructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          baseLocation: true,
        },
        orderBy: { registrationNumber: 'asc' },
      })
    }),

  // Отримати один автомобіль
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const vehicle = await ctx.db.vehicle.findUnique({
        where: { id: input },
        include: {
          assignedInstructor: true,
          baseLocation: true,
        },
      })

      if (!vehicle) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
        })
      }

      return vehicle
    }),

  // Створити новий автомобіль (тільки адмін)
  create: adminProcedure
    .input(z.object({
      registrationNumber: z.string().min(1),
      vin: z.string().optional(),
      make: z.string().min(1),
      model: z.string().min(1),
      year: z.number().min(2000).max(new Date().getFullYear() + 1),
      color: z.string().optional(),
      category: z.string(),
      transmission: z.string(),
      fuelType: z.string(),
      assignedInstructorId: z.string().optional(),
      baseLocationId: z.string(),
      insuranceExpiry: z.string().transform(str => new Date(str)),
      inspectionExpiry: z.string().transform(str => new Date(str)),
    }))
    .mutation(async ({ ctx, input }) => {
      // Перевірка чи номер вже існує
      const existing = await ctx.db.vehicle.findUnique({
        where: { registrationNumber: input.registrationNumber },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Vehicle with this registration number already exists',
        })
      }

      return ctx.db.vehicle.create({
        data: {
          ...input,
          insuranceExpiry: new Date(input.insuranceExpiry),
          inspectionExpiry: new Date(input.inspectionExpiry),
        },
      })
    }),

  // Оновити автомобіль (тільки адмін)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        assignedInstructorId: z.string().nullable().optional(),
        baseLocationId: z.string().optional(),
        status: z.string().optional(),
        currentMileage: z.number().optional(),
        insuranceExpiry: z.string().optional(),
        inspectionExpiry: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const updateData: any = { ...input.data }
      
      if (input.data.insuranceExpiry) {
        updateData.insuranceExpiry = new Date(input.data.insuranceExpiry)
      }
      if (input.data.inspectionExpiry) {
        updateData.inspectionExpiry = new Date(input.data.inspectionExpiry)
      }

      return ctx.db.vehicle.update({
        where: { id: input.id },
        data: updateData,
      })
    }),

  // Отримати доступні автомобілі для бронювання
  getAvailable: protectedProcedure
    .input(z.object({
      startTime: z.string().transform(str => new Date(str)),
      endTime: z.string().transform(str => new Date(str)),
      locationId: z.string().optional(),
      category: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const startTime = new Date(input.startTime)
      const endTime = new Date(input.endTime)

      // Отримати всі активні автомобілі
      const vehicles = await ctx.db.vehicle.findMany({
        where: {
          status: 'ACTIVE',
          ...(input.locationId && { baseLocationId: input.locationId }),
          ...(input.category && { category: input.category }),
        },
        include: {
          assignedInstructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          baseLocation: true,
        },
      })

      // Отримати бронювання які перетинаються з запитаним часом
      const bookings = await ctx.db.booking.findMany({
        where: {
          vehicleId: { in: vehicles.map(v => v.id) },
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
        select: { vehicleId: true },
      })

      const bookedVehicleIds = new Set(bookings.map(b => b.vehicleId))
      
      return vehicles.filter(v => !bookedVehicleIds.has(v.id))
    }),
})