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
          maintenanceLogs: {
            orderBy: { performedAt: 'desc' },
            take: 5,
          },
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
      insuranceExpiry: z.string(),
      inspectionExpiry: z.string(),
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
          registrationNumber: input.registrationNumber,
          vin: input.vin,
          make: input.make,
          model: input.model,
          year: input.year,
          color: input.color,
          category: input.category,
          transmission: input.transmission,
          fuelType: input.fuelType,
          assignedInstructorId: input.assignedInstructorId,
          baseLocationId: input.baseLocationId,
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
      const updateData: any = {}
      
      if (input.data.assignedInstructorId !== undefined) {
        updateData.assignedInstructorId = input.data.assignedInstructorId
      }
      if (input.data.baseLocationId) {
        updateData.baseLocationId = input.data.baseLocationId
      }
      if (input.data.status) {
        updateData.status = input.data.status
      }
      if (input.data.currentMileage !== undefined) {
        updateData.currentMileage = input.data.currentMileage
      }
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

  // Видалити автомобіль (тільки адмін)
  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Перевірити чи немає активних бронювань
      const activeBookings = await ctx.db.booking.count({
        where: {
          vehicleId: input,
          status: 'CONFIRMED',
          startTime: { gte: new Date() }
        }
      })

      if (activeBookings > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Cannot delete vehicle with active bookings',
        })
      }

      return ctx.db.vehicle.delete({
        where: { id: input }
      })
    }),

  // Отримати доступні автомобілі для бронювання
  getAvailable: protectedProcedure
    .input(z.object({
      startTime: z.string(),
      endTime: z.string(),
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
          vehicleId: { in: vehicles.map(v => v.id).filter(Boolean) as string[] },
          status: 'CONFIRMED',
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

      const bookedVehicleIds = new Set(bookings.map(b => b.vehicleId).filter(Boolean))
      
      return vehicles.filter(v => !bookedVehicleIds.has(v.id))
    }),

  // Отримати історію обслуговування
  getMaintenanceHistory: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.maintenanceLog.findMany({
        where: { vehicleId: input },
        orderBy: { performedAt: 'desc' }
      })
    }),

  // Записати обслуговування
  logMaintenance: adminProcedure
    .input(z.object({
      vehicleId: z.string(),
      type: z.string(),
      description: z.string(),
      cost: z.number().optional(),
      mileage: z.number(),
      performedAt: z.string(),
      performedBy: z.string().optional(),
      nextDueDate: z.string().optional(),
      nextDueMileage: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Створити запис обслуговування
      const log = await ctx.db.maintenanceLog.create({
        data: {
          vehicleId: input.vehicleId,
          type: input.type,
          description: input.description,
          cost: input.cost,
          mileage: input.mileage,
          performedAt: new Date(input.performedAt),
          performedBy: input.performedBy,
          nextDueDate: input.nextDueDate ? new Date(input.nextDueDate) : null,
          nextDueMileage: input.nextDueMileage,
        }
      })

      // Оновити автомобіль якщо це сервіс
      if (input.type === 'SERVICE') {
        await ctx.db.vehicle.update({
          where: { id: input.vehicleId },
          data: {
            lastServiceDate: new Date(input.performedAt),
            nextServiceDate: input.nextDueDate ? new Date(input.nextDueDate) : null,
            currentMileage: Math.max(input.mileage, 0),
          }
        })
      } else {
        // Для інших типів просто оновлюємо пробіг
        await ctx.db.vehicle.update({
          where: { id: input.vehicleId },
          data: {
            currentMileage: Math.max(input.mileage, 0),
          }
        })
      }

      return log
    }),
})