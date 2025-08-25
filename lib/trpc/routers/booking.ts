// lib/trpc/routers/booking.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { BookingStatus, UserRole } from '@prisma/client'

export const bookingRouter = router({
  /**
   * Get next lesson details
   */
  getNextLesson: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const booking = await ctx.db.booking.findFirst({
        where: {
          studentId: userId,
          status: BookingStatus.CONFIRMED,
          date: { gte: new Date() }
        },
        orderBy: { date: 'asc' },
        include: {
          instructor: {
            include: {
              instructorProfile: true
            }
          },
          vehicle: true,
          location: true
        }
      })

      if (!booking) return null

      return {
        id: booking.id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration,
        type: booking.type,
        status: booking.status,
        instructor: {
          id: booking.instructor.id,
          name: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
          avatar: booking.instructor.avatar,
          phone: booking.instructor.phone,
          email: booking.instructor.email,
          rating: booking.instructor.instructorProfile?.rating
        },
        vehicle: booking.vehicle ? {
          id: booking.vehicle.id,
          make: booking.vehicle.make,
          model: booking.vehicle.model,
          registration: booking.vehicle.registrationNumber,
          transmission: booking.vehicle.transmission,
          fuelType: booking.vehicle.fuelType
        } : null,
        location: booking.location ? {
          id: booking.location.id,
          name: booking.location.name,
          address: booking.location.address,
          city: booking.location.city,
          postalCode: booking.location.postalCode
        } : null,
        pickupLocation: booking.pickupLocation,
        pickupLatitude: booking.pickupLatitude,
        pickupLongitude: booking.pickupLongitude,
        notes: booking.notes,
        price: booking.price
      }
    }),

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const bookings = await ctx.db.booking.findMany({
        where: {
          studentId: userId,
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
          },
          date: { gte: new Date() }
        },
        orderBy: { date: 'asc' },
        take: input.limit,
        skip: input.offset,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              instructorProfile: {
                select: {
                  rating: true
                }
              }
            }
          },
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              registrationNumber: true
            }
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        }
      })

      const total = await ctx.db.booking.count({
        where: {
          studentId: userId,
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
          },
          date: { gte: new Date() }
        }
      })

      return {
        bookings: bookings.map(booking => ({
          id: booking.id,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          duration: booking.duration,
          type: booking.type,
          status: booking.status,
          instructor: {
            id: booking.instructor.id,
            name: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
            avatar: booking.instructor.avatar,
            rating: booking.instructor.instructorProfile?.rating
          },
          vehicle: booking.vehicle ? 
            `${booking.vehicle.make} ${booking.vehicle.model}` : 
            null,
          location: booking.location?.address || booking.pickupLocation
        })),
        total,
        hasMore: total > input.offset + input.limit
      }
    }),

  /**
   * Cancel booking
   */
  cancelBooking: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      reason: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Check if booking exists and belongs to user
      const booking = await ctx.db.booking.findFirst({
        where: {
          id: input.bookingId,
          studentId: userId
        }
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found'
        })
      }

      if (booking.status !== BookingStatus.CONFIRMED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only confirmed bookings can be cancelled'
        })
      }

      // Check cancellation policy (24h before)
      const hoursBeforeLesson = Math.floor(
        (booking.date.getTime() - Date.now()) / (1000 * 60 * 60)
      )

      if (hoursBeforeLesson < 24) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Bookings must be cancelled at least 24 hours in advance'
        })
      }

      // Cancel the booking
      const updatedBooking = await ctx.db.booking.update({
        where: { id: input.bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationReason: input.reason,
          cancelledAt: new Date(),
          cancelledBy: userId
        }
      })

      // TODO: Return credits to user package
      // TODO: Send notification to instructor
      // TODO: Create audit log

      return {
        success: true,
        booking: updatedBooking
      }
    }),

  /**
   * Reschedule booking
   */
rescheduleBooking: protectedProcedure
  .input(z.object({
    bookingId: z.string(),
    newDate: z.date(),
    newStartTime: z.string(),
    reason: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    // Check if booking exists and belongs to user
    const booking = await ctx.db.booking.findFirst({
      where: {
        id: input.bookingId,
        studentId: userId
      },
      include: {
        instructor: true
      }
    })

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found'
      })
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only confirmed bookings can be rescheduled'
      })
    }

    // Helper function inside mutation
    const calculateEndTime = (startTime: string, duration: number): string => {
      const [hours, minutes] = startTime.split(':').map(Number)
      const totalMinutes = hours * 60 + minutes + duration
      const endHours = Math.floor(totalMinutes / 60)
      const endMinutes = totalMinutes % 60
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
    }

    // Update the booking
    const updatedBooking = await ctx.db.booking.update({
      where: { id: input.bookingId },
      data: {
        date: input.newDate,
        startTime: input.newStartTime,
        endTime: calculateEndTime(input.newStartTime, booking.duration),
        status: BookingStatus.RESCHEDULED,
        updatedAt: new Date()
      }
    })

    return {
      success: true,
      booking: updatedBooking
    }
  })
})