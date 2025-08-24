// lib/trpc/routers/payment.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { 
  PaymentStatus, 
  PaymentMethod,
  BookingStatus,
  PackageStatus,
  UserRole
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// Helper function to generate session ID
function generateSessionId(): string {
  return `DS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to generate order ID
function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
}

export const paymentRouter = router({
  // Create payment for booking
  createBookingPayment: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      amount: z.number().positive(),
      method: z.nativeEnum(PaymentMethod).default(PaymentMethod.P24),
      useCredits: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get booking details
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          student: true,
          instructor: true,
          payment: true,
          vehicle: true,
          location: true,
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }

      // Check permissions
      if (booking.studentId !== ctx.session.user.id && ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your booking',
        })
      }

      // Check if already paid
      if (booking.isPaid || booking.payment) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Booking already paid',
        })
      }

      // Handle credits payment
      if (input.useCredits) {
        // Check available credits
        const activePackages = await ctx.db.userPackage.findMany({
          where: {
            userId: ctx.session.user.id,
            status: PackageStatus.ACTIVE,
            creditsRemaining: { gt: 0 },
            expiresAt: { gt: new Date() },
          },
          orderBy: { expiresAt: 'asc' }, // Use oldest expiring first
        })

        const totalCredits = activePackages.reduce((sum, pkg) => sum + pkg.creditsRemaining, 0)
        
        if (totalCredits < 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Insufficient credits',
          })
        }

        // Deduct credit from oldest package
        const packageToUse = activePackages[0]
        await ctx.db.userPackage.update({
          where: { id: packageToUse.id },
          data: {
            creditsUsed: { increment: 1 },
            creditsRemaining: { decrement: 1 },
            status: packageToUse.creditsRemaining === 1 ? PackageStatus.DEPLETED : undefined,
          },
        })

        // Create payment record
        const payment = await ctx.db.payment.create({
          data: {
            userId: ctx.session.user.id,
            bookingId: input.bookingId,
            amount: new Decimal(0), // Credits payment
            currency: 'PLN',
            status: PaymentStatus.COMPLETED,
            method: PaymentMethod.CREDITS,
            description: `Lekcja jazdy - ${new Date(booking.startTime).toLocaleDateString('pl-PL')} (kredyty)`,
            completedAt: new Date(),
          },
        })

        // Update booking
        await ctx.db.booking.update({
          where: { id: input.bookingId },
          data: {
            isPaid: true,
            paymentId: payment.id,
            usedCredits: 1,
          },
        })

        return {
          payment,
          redirectUrl: null,
          status: 'completed' as const,
        }
      }

      // Generate P24 session
      const sessionId = generateSessionId()
      const orderId = generateOrderId()

      // Create payment record
      const payment = await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id,
          bookingId: input.bookingId,
          amount: new Decimal(input.amount),
          currency: 'PLN',
          status: PaymentStatus.PENDING,
          method: input.method,
          p24SessionId: sessionId,
          p24OrderId: orderId,
          description: `Lekcja jazdy - ${new Date(booking.startTime).toLocaleDateString('pl-PL')}`,
          metadata: {
            bookingDetails: {
              instructor: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
              date: booking.startTime,
              vehicle: booking.vehicle?.registrationNumber,
              location: booking.location?.name,
            },
          },
        },
      })

      // For MVP - simulate payment URL
      const redirectUrl = `/payment/process?session=${sessionId}&amount=${input.amount}`

      return {
        payment,
        redirectUrl,
        sessionId,
        status: 'pending' as const,
      }
    }),

  // Create payment for package
  createPackagePayment: protectedProcedure
    .input(z.object({
      packageId: z.string(),
      method: z.nativeEnum(PaymentMethod).default(PaymentMethod.P24),
      isGift: z.boolean().default(false),
      giftFrom: z.string().optional(),
      giftMessage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get package details
      const packageData = await ctx.db.package.findUnique({
        where: { id: input.packageId },
      })

      if (!packageData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found',
        })
      }

      if (!packageData.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Package is not active',
        })
      }

      // Generate session
      const sessionId = generateSessionId()
      const orderId = generateOrderId()

      // Create payment record
      const payment = await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id,
          amount: packageData.price,
          currency: packageData.currency,
          status: PaymentStatus.PENDING,
          method: input.method,
          p24SessionId: sessionId,
          p24OrderId: orderId,
          description: `Pakiet: ${packageData.name}`,
          metadata: {
            packageId: packageData.id,
            packageName: packageData.name,
            credits: packageData.credits,
            isGift: input.isGift,
            giftFrom: input.giftFrom,
            giftMessage: input.giftMessage,
          },
        },
      })

      // For MVP - simulate payment URL
      const redirectUrl = `/payment/process?session=${sessionId}&amount=${packageData.price}&type=package`

      return {
        payment,
        redirectUrl,
        sessionId,
        status: 'pending' as const,
      }
    }),

  // Verify payment status
  verifyPayment: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findUnique({
        where: { p24SessionId: input.sessionId },
        include: {
          booking: true,
          userPackage: true,
        },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      // Check permissions
      if (payment.userId !== ctx.session.user.id && ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your payment',
        })
      }

      // In production, this would call P24 API to verify
      // For MVP, we'll simulate verification
      return {
        payment,
        verified: payment.status === PaymentStatus.COMPLETED,
        status: payment.status,
      }
    }),

  // Complete payment (webhook simulation for MVP)
  completePayment: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      p24Token: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findUnique({
        where: { p24SessionId: input.sessionId },
        include: {
          booking: true,
        },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        return { 
          payment, 
          message: 'Payment already completed' 
        }
      }

      // Update payment status
      const updatedPayment = await ctx.db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          completedAt: new Date(),
          p24Token: input.p24Token,
        },
      })

      // If booking payment, update booking
      if (payment.bookingId) {
        await ctx.db.booking.update({
          where: { id: payment.bookingId },
          data: {
            isPaid: true,
            paymentId: payment.id,
          },
        })

        // TODO: Send confirmation notification
      }

      // If package payment, create user package
      if (payment.metadata && (payment.metadata as any).packageId) {
        const metadata = payment.metadata as any
        const packageData = await ctx.db.package.findUnique({
          where: { id: metadata.packageId },
        })

        if (packageData) {
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + packageData.validityDays)

          await ctx.db.userPackage.create({
            data: {
              userId: payment.userId,
              packageId: metadata.packageId,
              creditsTotal: packageData.credits,
              creditsUsed: 0,
              creditsRemaining: packageData.credits,
              purchasedAt: new Date(),
              expiresAt,
              status: PackageStatus.ACTIVE,
              purchasePrice: packageData.price.toNumber(),
              paymentId: payment.id,
              isGift: metadata.isGift || false,
              giftFrom: metadata.giftFrom,
              giftMessage: metadata.giftMessage,
            },
          })
        }
      }

      return { 
        payment: updatedPayment, 
        message: 'Payment completed successfully' 
      }
    }),

  // Cancel payment
  cancelPayment: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findUnique({
        where: { id: input.paymentId },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      // Check permissions
      if (payment.userId !== ctx.session.user.id && ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your payment',
        })
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot cancel completed payment',
        })
      }

      // Cancel payment
      const cancelledPayment = await ctx.db.payment.update({
        where: { id: input.paymentId },
        data: {
          status: PaymentStatus.CANCELLED,
          failedAt: new Date(),
          metadata: {
            ...(payment.metadata as any || {}),
            cancellationReason: input.reason,
          },
        },
      })

      return cancelledPayment
    }),

  // Get user payments history
  getMyPayments: protectedProcedure
    .input(z.object({
      status: z.nativeEnum(PaymentStatus).optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      }

      if (input.status) {
        where.status = input.status
      }

      if (input.from || input.to) {
        where.createdAt = {}
        if (input.from) {
          where.createdAt.gte = new Date(input.from)
        }
        if (input.to) {
          where.createdAt.lte = new Date(input.to)
        }
      }

      const payments = await ctx.db.payment.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            include: {
              instructor: true,
              vehicle: true,
              location: true,
            },
          },
          userPackage: {
            include: {
              package: true,
            },
          },
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (payments.length > input.limit) {
        const nextItem = payments.pop()
        nextCursor = nextItem!.id
      }

      return {
        items: payments,
        nextCursor,
      }
    }),

  // Get payment statistics (for admin/reports)
  getPaymentStats: protectedProcedure
    .input(z.object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Admin access required',
        })
      }

      const where: any = {
        status: PaymentStatus.COMPLETED,
      }

      if (input.from || input.to) {
        where.completedAt = {}
        if (input.from) {
          where.completedAt.gte = new Date(input.from)
        }
        if (input.to) {
          where.completedAt.lte = new Date(input.to)
        }
      }

      // Get aggregated stats
      const stats = await ctx.db.payment.aggregate({
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          amount: true,
        },
      })

      // Get by method breakdown
      const byMethod = await ctx.db.payment.groupBy({
        by: ['method'],
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      })

      // Get by status breakdown
      const byStatus = await ctx.db.payment.groupBy({
        by: ['status'],
        where: input.from || input.to ? {
          createdAt: where.completedAt,
        } : {},
        _count: {
          id: true,
        },
      })

      return {
        total: stats._sum.amount || new Decimal(0),
        count: stats._count.id,
        average: stats._avg.amount || new Decimal(0),
        byMethod,
        byStatus,
      }
    }),
})