// lib/trpc/routers/payment.ts

import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'

// Тимчасові функції для mock платежів (замінимо на P24 пізніше)
function generateSessionId(): string {
  return `DS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const paymentRouter = router({
  // Створити платіж для бронювання
  createBookingPayment: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      amount: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Отримати деталі бронювання
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          student: true,
          instructor: true,
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }

      if (booking.studentId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your booking',
        })
      }

      if (booking.isPaid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Booking already paid',
        })
      }

      // Генеруємо session ID
      const sessionId = generateSessionId()

      // Створюємо запис платежу
      const payment = await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id,
          bookingId: input.bookingId,
          amount: input.amount,
          currency: 'PLN',
          status: 'PENDING',
          method: 'P24',
          p24SessionId: sessionId,
          description: `Lekcja jazdy - ${new Date(booking.startTime).toLocaleDateString('pl-PL')}`,
        },
      })

      // Оновлюємо бронювання з ціною та платежем
      await ctx.db.booking.update({
        where: { id: input.bookingId },
        data: {
          price: input.amount,
          paymentId: payment.id,
        },
      })

      // Для тесту - одразу підтверджуємо платіж (mock)
      if (process.env.P24_SANDBOX === 'true' || !process.env.P24_MERCHANT_ID) {
        await ctx.db.$transaction([
          ctx.db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          }),
          ctx.db.booking.update({
            where: { id: input.bookingId },
            data: { isPaid: true },
          }),
        ])

        return {
          paymentId: payment.id,
          sessionId,
          mockPayment: true,
          status: 'COMPLETED',
        }
      }

      // Тут буде інтеграція з P24
      return {
        paymentId: payment.id,
        sessionId,
        redirectUrl: `/payments/process?sessionId=${sessionId}`,
      }
    }),

  // Створити платіж для пакету
  createPackagePayment: protectedProcedure
    .input(z.object({
      packageId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Отримати деталі пакету
      const package_ = await ctx.db.package.findUnique({
        where: { id: input.packageId },
      })

      if (!package_ || !package_.isActive) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found or inactive',
        })
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Генеруємо session ID
      const sessionId = generateSessionId()

      // Створюємо запис пакету користувача (неактивний до оплати)
      const userPackage = await ctx.db.userPackage.create({
        data: {
          userId: ctx.session.user.id,
          packageId: input.packageId,
          creditsTotal: package_.credits,
          creditsUsed: 0,
          creditsRemaining: package_.credits,
          expiresAt: new Date(Date.now() + package_.validityDays * 24 * 60 * 60 * 1000),
          status: 'PENDING',
        },
      })

      // Створюємо запис платежу
      const payment = await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id,
          userPackageId: userPackage.id,
          amount: package_.price,
          currency: 'PLN',
          status: 'PENDING',
          method: 'P24',
          p24SessionId: sessionId,
          description: `Pakiet: ${package_.name}`,
          metadata: {
            packageId: package_.id,
            packageName: package_.name,
            credits: package_.credits,
          },
        },
      })

      // Оновлюємо пакет користувача з платежем
      await ctx.db.userPackage.update({
        where: { id: userPackage.id },
        data: { paymentId: payment.id },
      })

      // Для тесту - одразу активуємо пакет (mock)
      if (process.env.P24_SANDBOX === 'true' || !process.env.P24_MERCHANT_ID) {
        await ctx.db.$transaction([
          ctx.db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          }),
          ctx.db.userPackage.update({
            where: { id: userPackage.id },
            data: { status: 'ACTIVE' },
          }),
        ])

        return {
          paymentId: payment.id,
          sessionId,
          mockPayment: true,
          status: 'COMPLETED',
        }
      }

      return {
        paymentId: payment.id,
        sessionId,
        redirectUrl: `/payments/process?sessionId=${sessionId}&type=package`,
      }
    }),

  // Отримати платежі користувача
  getUserPayments: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.payment.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input?.status && { status: input.status }),
        },
        include: {
          booking: {
            include: {
              instructor: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          userPackage: {
            include: {
              package: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  // Отримати статус платежу
  getPaymentStatus: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findUnique({
        where: { p24SessionId: input },
        include: {
          booking: true,
          userPackage: {
            include: {
              package: true,
            },
          },
        },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      if (payment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your payment',
        })
      }

      return payment
    }),
})