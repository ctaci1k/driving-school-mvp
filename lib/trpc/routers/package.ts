// lib/trpc/routers/package.ts

import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../server'
import { TRPCError } from '@trpc/server'

export const packageRouter = router({
  // Отримати всі активні пакети (публічно)
  getActive: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  }),

  // Отримати пакети користувача
  getUserPackages: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userPackage.findMany({
      where: {
        userId: ctx.session.user.id,
        status: 'ACTIVE',
      },
      include: {
        package: true,
        payment: {
          select: {
            completedAt: true,
            amount: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    })
  }),

  // Отримати активні кредити користувача
  getUserCredits: protectedProcedure.query(async ({ ctx }) => {
    const packages = await ctx.db.userPackage.findMany({
      where: {
        userId: ctx.session.user.id,
        status: 'ACTIVE',
        creditsRemaining: { gt: 0 },
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        creditsRemaining: true,
        expiresAt: true,
        package: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { expiresAt: 'asc' }, // Використовуємо пакети що закінчуються першими
    })

    const totalCredits = packages.reduce((sum, p) => sum + p.creditsRemaining, 0)

    return {
      totalCredits,
      packages,
    }
  }),

  // Використати кредити для бронювання
  useCredits: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      creditsToUse: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Отримати бронювання
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      })

      if (!booking || booking.studentId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }

      if (booking.isPaid || booking.usedCredits > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Booking already paid or credits already used',
        })
      }

      // Отримати активні пакети користувача з кредитами
      const packages = await ctx.db.userPackage.findMany({
        where: {
          userId: ctx.session.user.id,
          status: 'ACTIVE',
          creditsRemaining: { gt: 0 },
          expiresAt: { gt: new Date() },
        },
        orderBy: { expiresAt: 'asc' }, // FIFO - використовуємо пакети що закінчуються першими
      })

      const totalAvailable = packages.reduce((sum, p) => sum + p.creditsRemaining, 0)

      if (totalAvailable < input.creditsToUse) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Not enough credits. Available: ${totalAvailable}`,
        })
      }

      // Віднімаємо кредити з пакетів (FIFO)
      let creditsToDeduct = input.creditsToUse
      const updates = []

      for (const pkg of packages) {
        if (creditsToDeduct <= 0) break

        const deduct = Math.min(creditsToDeduct, pkg.creditsRemaining)
        
        updates.push(
          ctx.db.userPackage.update({
            where: { id: pkg.id },
            data: {
              creditsUsed: pkg.creditsUsed + deduct,
              creditsRemaining: pkg.creditsRemaining - deduct,
              status: pkg.creditsRemaining - deduct === 0 ? 'DEPLETED' : 'ACTIVE',
            },
          })
        )

        creditsToDeduct -= deduct
      }

      // Оновлюємо бронювання
      updates.push(
        ctx.db.booking.update({
          where: { id: input.bookingId },
          data: {
            usedCredits: input.creditsToUse,
            isPaid: true, // Позначаємо як оплачене кредитами
          },
        })
      )

      // Виконуємо всі оновлення в транзакції
      await ctx.db.$transaction(updates)

      return { success: true, creditsUsed: input.creditsToUse }
    }),

  // Адмін: Створити пакет
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      credits: z.number().positive(),
      price: z.number().positive(),
      validityDays: z.number().positive(),
      isPopular: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.package.create({
        data: input,
      })
    }),

  // Адмін: Оновити пакет
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        isActive: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.package.update({
        where: { id: input.id },
        data: input.data,
      })
    }),

  // Адмін: Отримати всі пакети
  getAll: adminProcedure.query(async ({ ctx }) => {
    const packages = await ctx.db.package.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    // Підрахунок кількості користувачів для кожного пакету
    const packagesWithCount = await Promise.all(
      packages.map(async (pkg) => {
        const count = await ctx.db.userPackage.count({
          where: { packageId: pkg.id },
        })
        return { ...pkg, userCount: count }
      })
    )

    return packagesWithCount
  }),
})