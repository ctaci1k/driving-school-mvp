// lib/trpc/routers/vehicle.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  VehicleCategory,
  Transmission,
  FuelType,
  VehicleStatus,
  OwnershipType,
  MaintenanceType,
  MaintenanceStatus,
  UserRole
} from '@prisma/client'
import { startOfDay, endOfDay, addDays, isAfter, isBefore } from 'date-fns'

// Validation Schemas
const CreateVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(20),
  vin: z.string().min(17).max(17).optional(),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  category: z.nativeEnum(VehicleCategory),
  transmission: z.nativeEnum(Transmission),
  fuelType: z.nativeEnum(FuelType),
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  assignedInstructorId: z.string().optional(),
  baseLocationId: z.string(),
  currentMileage: z.number().min(0).default(0),
  insuranceExpiry: z.string().datetime(),
  inspectionExpiry: z.string().datetime(),
  insuranceCompany: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().positive().optional(),
  features: z.array(z.string()).default([]),
  notes: z.string().optional(),
})

const UpdateVehicleSchema = z.object({
  id: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  category: z.nativeEnum(VehicleCategory).optional(),
  transmission: z.nativeEnum(Transmission).optional(),
  fuelType: z.nativeEnum(FuelType).optional(),
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  assignedInstructorId: z.string().nullable().optional(),
  baseLocationId: z.string().optional(),
  currentMileage: z.number().min(0).optional(),
  insuranceExpiry: z.string().datetime().optional(),
  inspectionExpiry: z.string().datetime().optional(),
  insuranceCompany: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  features: z.array(z.string()).optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
})

const CreateMaintenanceSchema = z.object({
  vehicleId: z.string(),
  type: z.nativeEnum(MaintenanceType),
  scheduledDate: z.string().datetime(),
  description: z.string().optional(),
  estimatedCost: z.number().positive().optional(),
  servicedBy: z.string().optional(),
  serviceLocation: z.string().optional(),
  notes: z.string().optional(),
})

const UpdateMaintenanceSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(MaintenanceStatus).optional(),
  completedDate: z.string().datetime().optional(),
  mileageAtService: z.number().min(0).optional(),
  nextServiceMileage: z.number().min(0).optional(),
  performedTasks: z.array(z.string()).optional(),
  partsReplaced: z.array(z.string()).optional(),
  cost: z.number().positive().optional(),
  invoiceNumber: z.string().optional(),
  warranty: z.number().min(0).optional(),
  notes: z.string().optional(),
})

// Helper functions
async function checkVehicleAvailability(
  prisma: any,
  vehicleId: string,
  startTime: Date,
  endTime: Date
) {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: {
        notIn: ['CANCELLED', 'RESCHEDULED']
      },
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
      ],
    },
  })

  return !conflictingBooking
}

export const vehicleRouter = router({
  // Create vehicle
  create: protectedProcedure
    .input(CreateVehicleSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can add vehicles',
        })
      }

      // Check if registration number already exists
      const existing = await ctx.db.vehicle.findUnique({
        where: { registrationNumber: input.registrationNumber },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Vehicle with this registration number already exists',
        })
      }

      // Verify location exists
      const location = await ctx.db.location.findUnique({
        where: { id: input.baseLocationId },
      })

      if (!location) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Base location not found',
        })
      }

      // Verify instructor if assigned
      if (input.assignedInstructorId) {
        const instructor = await ctx.db.user.findFirst({
          where: {
            id: input.assignedInstructorId,
            role: UserRole.INSTRUCTOR,
            status: 'ACTIVE',
          },
        })

        if (!instructor) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Instructor not found or not active',
          })
        }
      }

      // Create vehicle
      const vehicle = await ctx.db.vehicle.create({
        data: {
          ...input,
          insuranceExpiry: new Date(input.insuranceExpiry),
          inspectionExpiry: new Date(input.inspectionExpiry),
          purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : undefined,
          status: VehicleStatus.ACTIVE,
        },
        include: {
          assignedInstructor: true,
          baseLocation: true,
        },
      })

      return vehicle
    }),

  // Update vehicle
  update: protectedProcedure
    .input(UpdateVehicleSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can update vehicles',
        })
      }

      const { id, ...data } = input

      // Verify vehicle exists
      const existing = await ctx.db.vehicle.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
        })
      }

      // If changing instructor, verify they exist
      if (data.assignedInstructorId !== undefined) {
        if (data.assignedInstructorId) {
          const instructor = await ctx.db.user.findFirst({
            where: {
              id: data.assignedInstructorId,
              role: UserRole.INSTRUCTOR,
              status: 'ACTIVE',
            },
          })

          if (!instructor) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Instructor not found or not active',
            })
          }
        }
      }

      // Update vehicle
      const vehicle = await ctx.db.vehicle.update({
        where: { id },
        data: {
          ...data,
          insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : undefined,
          inspectionExpiry: data.inspectionExpiry ? new Date(data.inspectionExpiry) : undefined,
        },
        include: {
          assignedInstructor: true,
          baseLocation: true,
          _count: {
            select: {
              bookings: true,
              maintenanceLogs: true,
            },
          },
        },
      })

      return vehicle
    }),

  // Delete vehicle
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can delete vehicles',
        })
      }

      // Check if vehicle has any bookings
      const bookingsCount = await ctx.db.booking.count({
        where: {
          vehicleId: input,
          status: {
            notIn: ['CANCELLED']
          }
        },
      })

      if (bookingsCount > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete vehicle with existing bookings',
        })
      }

      // Soft delete by setting status to INACTIVE
      const vehicle = await ctx.db.vehicle.update({
        where: { id: input },
        data: {
          status: VehicleStatus.INACTIVE,
          assignedInstructorId: null,
        },
      })

      return vehicle
    }),

  // Get all vehicles
  getAll: protectedProcedure
    .input(z.object({
      status: z.nativeEnum(VehicleStatus).optional(),
      category: z.nativeEnum(VehicleCategory).optional(),
      locationId: z.string().optional(),
      assignedInstructorId: z.string().optional(),
      includeInactive: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}

      if (!input.includeInactive) {
        where.status = { not: VehicleStatus.INACTIVE }
      } else if (input.status) {
        where.status = input.status
      }

      if (input.category) {
        where.category = input.category
      }

      if (input.locationId) {
        where.baseLocationId = input.locationId
      }

      if (input.assignedInstructorId) {
        where.assignedInstructorId = input.assignedInstructorId
      }

      const vehicles = await ctx.db.vehicle.findMany({
        where,
        include: {
          assignedInstructor: true,
          baseLocation: true,
          _count: {
            select: {
              bookings: true,
              maintenanceLogs: true,
            },
          },
        },
        orderBy: [
          { status: 'asc' },
          { registrationNumber: 'asc' },
        ],
      })

      return vehicles
    }),

  // Get vehicle by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const vehicle = await ctx.db.vehicle.findUnique({
        where: { id: input },
        include: {
          assignedInstructor: true,
          baseLocation: true,
          bookings: {
            where: {
              startTime: {
                gte: new Date(),
              },
              status: {
                notIn: ['CANCELLED'],
              },
            },
            orderBy: {
              startTime: 'asc',
            },
            take: 10,
            include: {
              student: true,
              instructor: true,
            },
          },
          maintenanceLogs: {
            orderBy: {
              scheduledDate: 'desc',
            },
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

  // Check vehicle availability
  checkAvailability: protectedProcedure
    .input(z.object({
      vehicleId: z.string(),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
    }))
    .query(async ({ ctx, input }) => {
      const available = await checkVehicleAvailability(
        ctx.db,
        input.vehicleId,
        new Date(input.startTime),
        new Date(input.endTime)
      )

      return { available }
    }),

  // Update mileage
  updateMileage: protectedProcedure
    .input(z.object({
      vehicleId: z.string(),
      mileage: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check permissions (instructor can update their assigned vehicle)
      const vehicle = await ctx.db.vehicle.findUnique({
        where: { id: input.vehicleId },
      })

      if (!vehicle) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
        })
      }

      const isAdmin = ctx.session.user.role === UserRole.ADMIN || 
                     ctx.session.user.role === UserRole.BRANCH_MANAGER
      const isAssignedInstructor = vehicle.assignedInstructorId === ctx.session.user.id

      if (!isAdmin && !isAssignedInstructor) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this vehicle',
        })
      }

      if (input.mileage < vehicle.currentMileage) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'New mileage cannot be less than current mileage',
        })
      }

      // Update mileage
      const updatedVehicle = await ctx.db.vehicle.update({
        where: { id: input.vehicleId },
        data: {
          currentMileage: input.mileage,
        },
      })

      // Check if service is needed
      if (vehicle.nextServiceMileage && input.mileage >= vehicle.nextServiceMileage) {
        // Create automatic maintenance reminder
        await ctx.db.maintenanceLog.create({
          data: {
            vehicleId: input.vehicleId,
            type: MaintenanceType.REGULAR_SERVICE,
            status: MaintenanceStatus.SCHEDULED,
            scheduledDate: addDays(new Date(), 7),
            description: `Regular service needed - ${input.mileage} km reached`,
            mileageAtService: input.mileage,
          },
        })
      }

      return updatedVehicle
    }),

  // Create maintenance log
  createMaintenance: protectedProcedure
    .input(CreateMaintenanceSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can schedule maintenance',
        })
      }

      // Verify vehicle exists
      const vehicle = await ctx.db.vehicle.findUnique({
        where: { id: input.vehicleId },
      })

      if (!vehicle) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
        })
      }

      // Create maintenance log
      const maintenance = await ctx.db.maintenanceLog.create({
        data: {
          ...input,
          scheduledDate: new Date(input.scheduledDate),
          status: MaintenanceStatus.SCHEDULED,
        },
      })

      // Update vehicle status if maintenance is immediate
      if (isBefore(new Date(input.scheduledDate), addDays(new Date(), 1))) {
        await ctx.db.vehicle.update({
          where: { id: input.vehicleId },
          data: {
            status: VehicleStatus.MAINTENANCE,
          },
        })
      }

      return maintenance
    }),

  // Update maintenance log
  updateMaintenance: protectedProcedure
    .input(UpdateMaintenanceSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can update maintenance',
        })
      }

      const { id, ...data } = input

      // Update maintenance log
      const maintenance = await ctx.db.maintenanceLog.update({
        where: { id },
        data: {
          ...data,
          completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
          warrantyExpiresAt: data.warranty 
            ? addDays(new Date(data.completedDate || new Date()), data.warranty * 30)
            : undefined,
        },
      })

      // If maintenance completed, update vehicle
      if (data.status === MaintenanceStatus.COMPLETED) {
        const vehicle = await ctx.db.vehicle.findUnique({
          where: { id: maintenance.vehicleId },
        })

        if (vehicle && vehicle.status === VehicleStatus.MAINTENANCE) {
          await ctx.db.vehicle.update({
            where: { id: maintenance.vehicleId },
            data: {
              status: VehicleStatus.ACTIVE,
              lastServiceDate: maintenance.completedDate,
              lastServiceMileage: maintenance.mileageAtService,
              nextServiceMileage: maintenance.nextServiceMileage,
              nextServiceDate: maintenance.nextServiceMileage
                ? undefined
                : addDays(new Date(), 180), // 6 months default
            },
          })
        }
      }

      return maintenance
    }),

  // Get maintenance history
  getMaintenanceHistory: protectedProcedure
    .input(z.object({
      vehicleId: z.string(),
      status: z.nativeEnum(MaintenanceStatus).optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        vehicleId: input.vehicleId,
      }

      if (input.status) {
        where.status = input.status
      }

      const logs = await ctx.db.maintenanceLog.findMany({
        where,
        orderBy: [
          { status: 'asc' },
          { scheduledDate: 'desc' },
        ],
        take: input.limit,
      })

      return logs
    }),

  // Get vehicles needing maintenance
  getMaintenanceAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER &&
          ctx.session.user.role !== UserRole.DISPATCHER) {
        return []
      }

      const vehicles = await ctx.db.vehicle.findMany({
        where: {
          status: { not: VehicleStatus.INACTIVE },
          OR: [
            // Insurance expiring soon (within 30 days)
            {
              insuranceExpiry: {
                lte: addDays(new Date(), 30),
                gte: new Date(),
              },
            },
            // Inspection expiring soon (within 30 days)
            {
              inspectionExpiry: {
                lte: addDays(new Date(), 30),
                gte: new Date(),
              },
            },
            // Service needed based on mileage
            {
              AND: [
                { nextServiceMileage: { not: null } },
                { currentMileage: { gte: ctx.db.vehicle.fields.nextServiceMileage } },
              ],
            },
            // Service needed based on date
            {
              nextServiceDate: {
                lte: addDays(new Date(), 7),
                gte: new Date(),
              },
            },
          ],
        },
        include: {
          assignedInstructor: true,
          baseLocation: true,
        },
      })

      return vehicles.map(vehicle => ({
        vehicle,
        alerts: {
          insuranceExpiring: vehicle.insuranceExpiry && 
            isAfter(addDays(new Date(), 30), vehicle.insuranceExpiry) &&
            isAfter(vehicle.insuranceExpiry, new Date()),
          inspectionExpiring: vehicle.inspectionExpiry &&
            isAfter(addDays(new Date(), 30), vehicle.inspectionExpiry) &&
            isAfter(vehicle.inspectionExpiry, new Date()),
          serviceNeeded: vehicle.nextServiceMileage 
            ? vehicle.currentMileage >= vehicle.nextServiceMileage
            : vehicle.nextServiceDate 
              ? isAfter(addDays(new Date(), 7), vehicle.nextServiceDate)
              : false,
        },
      }))
    }),

  // Get vehicle statistics
  getStatistics: protectedProcedure
    .input(z.object({
      vehicleId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}
      
      if (input.vehicleId) {
        where.id = input.vehicleId
      }

      // Get vehicle stats
      const vehicles = await ctx.db.vehicle.findMany({
        where,
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  status: 'COMPLETED',
                  startTime: {
                    gte: input.from ? new Date(input.from) : undefined,
                    lte: input.to ? new Date(input.to) : undefined,
                  },
                },
              },
              maintenanceLogs: {
                where: {
                  status: 'COMPLETED',
                  completedDate: {
                    gte: input.from ? new Date(input.from) : undefined,
                    lte: input.to ? new Date(input.to) : undefined,
                  },
                },
              },
            },
          },
        },
      })

      // Calculate statistics
      const stats = {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length,
        inMaintenance: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length,
        totalBookings: vehicles.reduce((sum, v) => sum + v._count.bookings, 0),
        totalMaintenance: vehicles.reduce((sum, v) => sum + v._count.maintenanceLogs, 0),
        averageBookingsPerVehicle: vehicles.length > 0 
          ? Math.round(vehicles.reduce((sum, v) => sum + v._count.bookings, 0) / vehicles.length)
          : 0,
        byCategory: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
      }

      // Group by category
      vehicles.forEach(v => {
        stats.byCategory[v.category] = (stats.byCategory[v.category] || 0) + 1
        stats.byStatus[v.status] = (stats.byStatus[v.status] || 0) + 1
      })

      return stats
    }),
})