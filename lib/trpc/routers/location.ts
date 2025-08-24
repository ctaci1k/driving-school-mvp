// lib/trpc/routers/location.ts

import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  UserRole,
  BookingStatus,
  VehicleStatus
} from '@prisma/client'
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  format
} from 'date-fns'

// Validation Schemas
const CreateLocationSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(2).max(10).toUpperCase(),
  address: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  maxInstructors: z.number().min(1).max(100).default(5),
  maxVehicles: z.number().min(1).max(100).default(10),
  isPrimary: z.boolean().default(false),
})

const UpdateLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  address: z.string().min(1).max(255).optional(),
  city: z.string().min(1).max(100).optional(),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  maxInstructors: z.number().min(1).max(100).optional(),
  maxVehicles: z.number().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
})

const LocationCapacitySchema = z.object({
  locationId: z.string(),
  date: z.string().datetime(),
})

const NearbySearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1).max(100).default(10), // km
})

// Helper functions
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const locationRouter = router({
  // Create location
  create: protectedProcedure
    .input(CreateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can create locations',
        })
      }

      // Check if code already exists
      const existing = await ctx.db.location.findUnique({
        where: { code: input.code },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Location with this code already exists',
        })
      }

      // If setting as primary, unset other primary locations
      if (input.isPrimary) {
        await ctx.db.location.updateMany({
          where: { isPrimary: true },
          data: { isPrimary: false },
        })
      }

      // Create location
      const location = await ctx.db.location.create({
        data: {
          ...input,
          isActive: true,
        },
      })

      return location
    }),

  // Update location
  update: protectedProcedure
    .input(UpdateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can update locations',
        })
      }

      const { id, ...data } = input

      // Check if location exists
      const existing = await ctx.db.location.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Location not found',
        })
      }

      // If setting as primary, unset other primary locations
      if (data.isPrimary === true) {
        await ctx.db.location.updateMany({
          where: { 
            isPrimary: true,
            id: { not: id },
          },
          data: { isPrimary: false },
        })
      }

      // Update location
      const location = await ctx.db.location.update({
        where: { id },
        data,
        include: {
          _count: {
            select: {
              vehicles: true,
              bookings: true,
              instructorSchedules: true,
            },
          },
        },
      })

      return location
    }),

  // Delete location (soft delete by deactivating)
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can delete locations',
        })
      }

      // Check for active bookings
      const activeBookings = await ctx.db.booking.count({
        where: {
          locationId: input,
          startTime: { gte: new Date() },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
      })

      if (activeBookings > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete location with ${activeBookings} active bookings`,
        })
      }

      // Check for assigned vehicles
      const assignedVehicles = await ctx.db.vehicle.count({
        where: {
          baseLocationId: input,
          status: { not: VehicleStatus.INACTIVE },
        },
      })

      if (assignedVehicles > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete location with ${assignedVehicles} assigned vehicles`,
        })
      }

      // Deactivate location
      const location = await ctx.db.location.update({
        where: { id: input },
        data: {
          isActive: false,
          isPrimary: false,
        },
      })

      return location
    }),

  // Get all locations
  getAll: publicProcedure
    .input(z.object({
      includeInactive: z.boolean().default(false),
      city: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}

      if (!input.includeInactive) {
        where.isActive = true
      }

      if (input.city) {
        where.city = {
          contains: input.city,
          mode: 'insensitive',
        }
      }

      const locations = await ctx.db.location.findMany({
        where,
        include: {
          _count: {
            select: {
              vehicles: {
                where: {
                  status: VehicleStatus.ACTIVE,
                },
              },
              bookings: {
                where: {
                  startTime: { gte: new Date() },
                  status: BookingStatus.CONFIRMED,
                },
              },
              instructorSchedules: {
                where: {
                  isAvailable: true,
                },
              },
            },
          },
        },
        orderBy: [
          { isPrimary: 'desc' },
          { city: 'asc' },
          { name: 'asc' },
        ],
      })

      return locations
    }),

  // Get location by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const location = await ctx.db.location.findUnique({
        where: { id: input },
        include: {
          vehicles: {
            where: {
              status: VehicleStatus.ACTIVE,
            },
            include: {
              assignedInstructor: true,
            },
          },
          bookings: {
            where: {
              startTime: {
                gte: new Date(),
                lte: addDays(new Date(), 7),
              },
              status: BookingStatus.CONFIRMED,
            },
            include: {
              student: true,
              instructor: true,
              vehicle: true,
            },
            orderBy: {
              startTime: 'asc',
            },
            take: 20,
          },
          instructorSchedules: {
            where: {
              isAvailable: true,
            },
            include: {
              instructor: true,
            },
          },
          _count: {
            select: {
              vehicles: true,
              bookings: true,
              instructorSchedules: true,
            },
          },
        },
      })

      if (!location) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Location not found',
        })
      }

      return location
    }),

  // Get location capacity
  getCapacity: protectedProcedure
    .input(LocationCapacitySchema)
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      // Get location details
      const location = await ctx.db.location.findUnique({
        where: { id: input.locationId },
      })

      if (!location) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Location not found',
        })
      }

      // Count active instructors at this location
      const activeInstructors = await ctx.db.instructorSchedule.count({
        where: {
          locationId: input.locationId,
          dayOfWeek: date.getDay(),
          isAvailable: true,
        },
      })

      // Count active vehicles at this location
      const activeVehicles = await ctx.db.vehicle.count({
        where: {
          baseLocationId: input.locationId,
          status: VehicleStatus.ACTIVE,
        },
      })

      // Count bookings for the day
      const bookings = await ctx.db.booking.count({
        where: {
          locationId: input.locationId,
          startTime: { gte: dayStart },
          endTime: { lte: dayEnd },
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
        },
      })

      // Calculate capacity
      const instructorCapacity = location.maxInstructors
      const vehicleCapacity = location.maxVehicles
      const instructorUtilization = (activeInstructors / instructorCapacity) * 100
      const vehicleUtilization = (activeVehicles / vehicleCapacity) * 100

      // Estimate available slots (assuming 8 hours of operation, 2-hour lessons)
      const maxSlotsPerInstructor = 4
      const totalPossibleSlots = activeInstructors * maxSlotsPerInstructor
      const availableSlots = totalPossibleSlots - bookings

      return {
        location,
        capacity: {
          instructors: {
            current: activeInstructors,
            max: instructorCapacity,
            utilization: instructorUtilization,
          },
          vehicles: {
            current: activeVehicles,
            max: vehicleCapacity,
            utilization: vehicleUtilization,
          },
        },
        bookings: {
          today: bookings,
          availableSlots,
          utilization: totalPossibleSlots > 0 
            ? (bookings / totalPossibleSlots) * 100 
            : 0,
        },
      }
    }),

  // Search nearby locations
  getNearby: publicProcedure
    .input(NearbySearchSchema)
    .query(async ({ ctx, input }) => {
      // Get all active locations with coordinates
      const locations = await ctx.db.location.findMany({
        where: {
          isActive: true,
          latitude: { not: null },
          longitude: { not: null },
        },
      })

      // Calculate distances and filter by radius
      const nearbyLocations = locations
        .map(location => {
          const distance = calculateDistance(
            input.latitude,
            input.longitude,
            location.latitude!,
            location.longitude!
          )
          return {
            ...location,
            distance,
          }
        })
        .filter(location => location.distance <= input.radius)
        .sort((a, b) => a.distance - b.distance)

      return nearbyLocations
    }),

  // Get location statistics
  getStatistics: protectedProcedure
    .input(z.object({
      locationId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      period: z.enum(['day', 'week', 'month']).default('month'),
    }))
    .query(async ({ ctx, input }) => {
      // Check permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER &&
          ctx.session.user.role !== UserRole.DISPATCHER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view location statistics',
        })
      }

      const now = new Date()
      let dateFrom: Date
      let dateTo: Date

      if (input.from && input.to) {
        dateFrom = new Date(input.from)
        dateTo = new Date(input.to)
      } else {
        switch (input.period) {
          case 'day':
            dateFrom = startOfDay(now)
            dateTo = endOfDay(now)
            break
          case 'week':
            dateFrom = startOfWeek(now, { weekStartsOn: 1 })
            dateTo = endOfWeek(now, { weekStartsOn: 1 })
            break
          case 'month':
          default:
            dateFrom = startOfMonth(now)
            dateTo = endOfMonth(now)
            break
        }
      }

      const where: any = {
        startTime: { gte: dateFrom },
        endTime: { lte: dateTo },
      }

      if (input.locationId) {
        where.locationId = input.locationId
      }

      // Get bookings statistics
      const bookingStats = await ctx.db.booking.groupBy({
        by: ['locationId', 'status'],
        where,
        _count: {
          id: true,
        },
      })

      // Get revenue statistics
      const revenueStats = await ctx.db.booking.aggregate({
        where: {
          ...where,
          status: BookingStatus.COMPLETED,
          isPaid: true,
        },
        _sum: {
          price: true,
        },
        _count: {
          id: true,
        },
      })

      // Get vehicle statistics
      const vehicleStats = await ctx.db.vehicle.groupBy({
        by: ['baseLocationId', 'status'],
        where: input.locationId ? {
          baseLocationId: input.locationId,
        } : {},
        _count: {
          id: true,
        },
      })

      // Get instructor statistics
      const instructorStats = await ctx.db.instructorSchedule.groupBy({
        by: ['locationId'],
        where: input.locationId ? {
          locationId: input.locationId,
        } : {},
        _count: {
          id: true,
        },
      })

      // Process and format statistics
      const locationIds = new Set([
        ...bookingStats.map(b => b.locationId).filter(Boolean),
        ...vehicleStats.map(v => v.baseLocationId),
        ...instructorStats.map(i => i.locationId).filter(Boolean),
      ])

      const statistics = []

      for (const locationId of locationIds) {
        if (!locationId) continue

        const location = await ctx.db.location.findUnique({
          where: { id: locationId as string },
        })

        if (!location) continue

        const locationBookings = bookingStats.filter(b => b.locationId === locationId)
        const locationVehicles = vehicleStats.filter(v => v.baseLocationId === locationId)
        const locationInstructors = instructorStats.filter(i => i.locationId === locationId)

        const totalBookings = locationBookings.reduce((sum, b) => sum + b._count.id, 0)
        const completedBookings = locationBookings
          .filter(b => b.status === BookingStatus.COMPLETED)
          .reduce((sum, b) => sum + b._count.id, 0)
        const cancelledBookings = locationBookings
          .filter(b => b.status === BookingStatus.CANCELLED)
          .reduce((sum, b) => sum + b._count.id, 0)

        const activeVehicles = locationVehicles
          .filter(v => v.status === VehicleStatus.ACTIVE)
          .reduce((sum, v) => sum + v._count.id, 0)

        statistics.push({
          location,
          bookings: {
            total: totalBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
            completionRate: totalBookings > 0 
              ? (completedBookings / totalBookings) * 100 
              : 0,
            cancellationRate: totalBookings > 0 
              ? (cancelledBookings / totalBookings) * 100 
              : 0,
          },
          vehicles: {
            total: locationVehicles.reduce((sum, v) => sum + v._count.id, 0),
            active: activeVehicles,
            inMaintenance: locationVehicles
              .filter(v => v.status === VehicleStatus.MAINTENANCE)
              .reduce((sum, v) => sum + v._count.id, 0),
          },
          instructors: {
            total: locationInstructors.reduce((sum, i) => sum + i._count.id, 0),
          },
          revenue: input.locationId ? revenueStats._sum.price || 0 : 0,
        })
      }

      // Sort by total bookings
      statistics.sort((a, b) => b.bookings.total - a.bookings.total)

      return {
        period: {
          from: dateFrom,
          to: dateTo,
        },
        locations: statistics,
        totals: {
          bookings: statistics.reduce((sum, s) => sum + s.bookings.total, 0),
          completed: statistics.reduce((sum, s) => sum + s.bookings.completed, 0),
          cancelled: statistics.reduce((sum, s) => sum + s.bookings.cancelled, 0),
          revenue: revenueStats._sum.price || 0,
          vehicles: statistics.reduce((sum, s) => sum + s.vehicles.total, 0),
          instructors: statistics.reduce((sum, s) => sum + s.instructors.total, 0),
        },
      }
    }),

  // Get cities with locations
  getCities: publicProcedure
    .query(async ({ ctx }) => {
      const locations = await ctx.db.location.findMany({
        where: { isActive: true },
        select: {
          city: true,
        },
        distinct: ['city'],
        orderBy: {
          city: 'asc',
        },
      })

      const cities = await Promise.all(
        locations.map(async (loc) => {
          const count = await ctx.db.location.count({
            where: {
              city: loc.city,
              isActive: true,
            },
          })

          return {
            city: loc.city,
            locationCount: count,
          }
        })
      )

      return cities
    }),

  // Check location availability
  checkAvailability: protectedProcedure
    .input(z.object({
      locationId: z.string(),
      date: z.string().datetime(),
      duration: z.number().min(60).max(240).default(120),
    }))
    .query(async ({ ctx, input }) => {
      const requestedDate = new Date(input.date)
      const endTime = new Date(requestedDate.getTime() + input.duration * 60 * 1000)

      // Get all bookings at this location for the time period
      const conflictingBookings = await ctx.db.booking.count({
        where: {
          locationId: input.locationId,
          status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
          OR: [
            {
              AND: [
                { startTime: { lte: requestedDate } },
                { endTime: { gt: requestedDate } },
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
                { startTime: { gte: requestedDate } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      })

      // Get available instructors at this location
      const availableInstructors = await ctx.db.instructorSchedule.count({
        where: {
          locationId: input.locationId,
          dayOfWeek: requestedDate.getDay(),
          isAvailable: true,
          // TODO: Add time range check
        },
      })

      // Get available vehicles at this location
      const availableVehicles = await ctx.db.vehicle.count({
        where: {
          baseLocationId: input.locationId,
          status: VehicleStatus.ACTIVE,
          // TODO: Check vehicle bookings
        },
      })

      return {
        available: availableInstructors > conflictingBookings && availableVehicles > 0,
        conflicts: conflictingBookings,
        availableInstructors,
        availableVehicles,
      }
    }),
})