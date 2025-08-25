// lib/trpc/routers/package.ts

import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import {
  UserRole,
  PackageStatus,
  PaymentStatus,
  PaymentMethod
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  isAfter,
  isBefore,
  format
} from 'date-fns'

// Validation Schemas
const CreatePackageSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  credits: z.number().int().min(1).max(100),
  price: z.number().positive(),
  currency: z.string().default('PLN'),
  validityDays: z.number().int().min(1).max(365),
  isPopular: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

const UpdatePackageSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  credits: z.number().int().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  validityDays: z.number().int().min(1).max(365).optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

const PurchasePackageSchema = z.object({
  packageId: z.string(),
  userId: z.string().optional(), // For admin purchasing for someone
  isGift: z.boolean().default(false),
  giftFrom: z.string().optional(),
  giftMessage: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.P24),
})

const TransferCreditsSchema = z.object({
  fromPackageId: z.string(),
  toUserId: z.string(),
  credits: z.number().int().min(1),
  reason: z.string().optional(),
})

const ExtendPackageSchema = z.object({
  userPackageId: z.string(),
  days: z.number().int().min(1).max(365),
  reason: z.string().optional(),
})

const UseCreditsSchema = z.object({
  userId: z.string().optional(),
  credits: z.number().int().min(1),
  bookingId: z.string().optional(),
  description: z.string().optional(),
})

// Helper functions
function calculatePackageValue(credits: number, price: number): number {
  return credits > 0 ? price / credits : 0
}

function getExpiringPackages(packages: any[]): any[] {
  const warningDays = 7
  const warningDate = addDays(new Date(), warningDays)
  
  return packages.filter(pkg => 
    pkg.status === PackageStatus.ACTIVE &&
    pkg.creditsRemaining > 0 &&
    isBefore(new Date(pkg.expiresAt), warningDate)
  )
}

export const packageRouter = router({
  // Create package (admin only)
  create: protectedProcedure
    .input(CreatePackageSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can create packages',
        })
      }

      // If setting as popular, limit to max 3 popular packages
      if (input.isPopular) {
        const popularCount = await ctx.db.package.count({
          where: { isPopular: true, isActive: true },
        })

        if (popularCount >= 3) {
          // Unset the oldest popular package
          const oldestPopular = await ctx.db.package.findFirst({
            where: { isPopular: true, isActive: true },
            orderBy: { updatedAt: 'asc' },
          })

          if (oldestPopular) {
            await ctx.db.package.update({
              where: { id: oldestPopular.id },
              data: { isPopular: false },
            })
          }
        }
      }

      // Create package
      const packageData = await ctx.db.package.create({
        data: {
          ...input,
          price: new Decimal(input.price),
          isActive: true,
        },
      })

      return packageData
    }),

  // Update package
  update: protectedProcedure
    .input(UpdatePackageSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can update packages',
        })
      }

      const { id, ...data } = input

      // Check if package exists
      const existing = await ctx.db.package.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found',
        })
      }

      // If setting as popular, check limit
      if (data.isPopular === true && !existing.isPopular) {
        const popularCount = await ctx.db.package.count({
          where: { 
            isPopular: true, 
            isActive: true,
            id: { not: id },
          },
        })

        if (popularCount >= 3) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Maximum 3 packages can be marked as popular',
          })
        }
      }

      // Update package
      const packageData = await ctx.db.package.update({
        where: { id },
        data: {
          ...data,
          price: data.price ? new Decimal(data.price) : undefined,
        },
        include: {
          _count: {
            select: {
              userPackages: true,
            },
          },
        },
      })

      return packageData
    }),

  // Delete package (soft delete by deactivating)
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can delete packages',
        })
      }

      // Check for active user packages
      const activeUserPackages = await ctx.db.userPackage.count({
        where: {
          packageId: input,
          status: PackageStatus.ACTIVE,
          creditsRemaining: { gt: 0 },
        },
      })

      if (activeUserPackages > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete package with ${activeUserPackages} active subscriptions`,
        })
      }

      // Deactivate package
      const packageData = await ctx.db.package.update({
        where: { id: input },
        data: {
          isActive: false,
          isPopular: false,
        },
      })

      return packageData
    }),

  // Get all packages (public for pricing page)
  getAll: publicProcedure
    .input(z.object({
      includeInactive: z.boolean().default(false),
      sortBy: z.enum(['price', 'credits', 'popular', 'order']).default('order'),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {}

      if (!input.includeInactive) {
        where.isActive = true
      }

      let orderBy: any = []
      switch (input.sortBy) {
        case 'price':
          orderBy = [{ price: 'asc' }]
          break
        case 'credits':
          orderBy = [{ credits: 'desc' }]
          break
        case 'popular':
          orderBy = [{ isPopular: 'desc' }, { sortOrder: 'asc' }]
          break
        case 'order':
        default:
          orderBy = [{ sortOrder: 'asc' }, { price: 'asc' }]
          break
      }

      const packages = await ctx.db.package.findMany({
        where,
        orderBy,
        include: {
          _count: {
            select: {
              userPackages: {
                where: {
                  status: PackageStatus.ACTIVE,
                },
              },
            },
          },
        },
      })

      // Calculate additional metrics
      return packages.map(pkg => ({
        ...pkg,
        pricePerCredit: calculatePackageValue(pkg.credits, pkg.price.toNumber()),
        activeUsers: pkg._count.userPackages,
      }))
    }),

  // Get package by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const packageData = await ctx.db.package.findUnique({
        where: { id: input },
        include: {
          userPackages: {
            where: {
              status: PackageStatus.ACTIVE,
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            take: 10,
            orderBy: {
              purchasedAt: 'desc',
            },
          },
          _count: {
            select: {
              userPackages: true,
            },
          },
        },
      })

      if (!packageData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found',
        })
      }

      return {
        ...packageData,
        pricePerCredit: calculatePackageValue(
          packageData.credits, 
          packageData.price.toNumber()
        ),
        totalPurchases: packageData._count.userPackages,
      }
    }),

  // Purchase package
  purchase: protectedProcedure
    .input(PurchasePackageSchema)
    .mutation(async ({ ctx, input }) => {
      // Determine target user
      const targetUserId = input.userId || ctx.session.user.id

      // Check permissions if purchasing for someone else
      if (targetUserId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot purchase packages for other users',
          })
        }
      }

      // Get package details
      const packageData = await ctx.db.package.findUnique({
        where: { id: input.packageId },
      })

      if (!packageData || !packageData.isActive) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found or inactive',
        })
      }

      // Calculate expiry date
      const expiresAt = addDays(new Date(), packageData.validityDays)

      // Create payment record
      const payment = await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id, // Purchaser
          amount: packageData.price,
          currency: packageData.currency,
          status: input.paymentMethod === PaymentMethod.CREDITS 
            ? PaymentStatus.COMPLETED 
            : PaymentStatus.PENDING,
          method: input.paymentMethod,
          description: `Package: ${packageData.name}`,
          metadata: {
            packageId: packageData.id,
            packageName: packageData.name,
            targetUserId,
            isGift: input.isGift,
            giftFrom: input.giftFrom,
            giftMessage: input.giftMessage,
          },
        },
      })

      // If using credits, deduct immediately
      if (input.paymentMethod === PaymentMethod.CREDITS) {
        // Check if user has enough credits
        const userCredits = await ctx.db.userPackage.aggregate({
          where: {
            userId: ctx.session.user.id,
            status: PackageStatus.ACTIVE,
            expiresAt: { gt: new Date() },
          },
          _sum: {
            creditsRemaining: true,
          },
        })

        const totalCredits = userCredits._sum.creditsRemaining || 0
        const requiredCredits = Math.ceil(packageData.price.toNumber() / 10) // 1 credit = 10 PLN

        if (totalCredits < requiredCredits) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Insufficient credits. Required: ${requiredCredits}, Available: ${totalCredits}`,
          })
        }

        // Deduct credits (oldest first)
        let creditsToDeduct = requiredCredits
        const activePackages = await ctx.db.userPackage.findMany({
          where: {
            userId: ctx.session.user.id,
            status: PackageStatus.ACTIVE,
            creditsRemaining: { gt: 0 },
            expiresAt: { gt: new Date() },
          },
          orderBy: { expiresAt: 'asc' },
        })

        for (const pkg of activePackages) {
          if (creditsToDeduct <= 0) break

          const deduction = Math.min(creditsToDeduct, pkg.creditsRemaining)
          
          await ctx.db.userPackage.update({
            where: { id: pkg.id },
            data: {
              creditsUsed: { increment: deduction },
              creditsRemaining: { decrement: deduction },
              status: pkg.creditsRemaining === deduction 
                ? PackageStatus.DEPLETED 
                : undefined,
            },
          })

          creditsToDeduct -= deduction
        }
      }

      // Create user package
      const userPackage = await ctx.db.userPackage.create({
        data: {
          userId: targetUserId,
          packageId: packageData.id,
          creditsTotal: packageData.credits,
          creditsUsed: 0,
          creditsRemaining: packageData.credits,
          purchasedAt: new Date(),
          expiresAt,
          status: PackageStatus.ACTIVE,
          purchasePrice: packageData.price.toNumber(),
          paymentId: payment.id,
          isGift: input.isGift,
          giftFrom: input.giftFrom,
          giftMessage: input.giftMessage,
        },
        include: {
          package: true,
          user: true,
        },
      })

      // If payment method is credits, mark payment as completed
      if (input.paymentMethod === PaymentMethod.CREDITS) {
        await ctx.db.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
            completedAt: new Date(),
          },
        })
      }

      return {
        userPackage,
        payment,
        redirectUrl: input.paymentMethod !== PaymentMethod.CREDITS 
          ? `/payment/process?session=${payment.p24SessionId}` 
          : null,
      }
    }),

  // Get user's packages
  // getMyPackages: protectedProcedure
  //   .input(z.object({
  //     includeExpired: z.boolean().default(false),
  //     status: z.nativeEnum(PackageStatus).optional(),
  //   }))
  //   .query(async ({ ctx, input }) => {
  //     const where: any = {
  //       userId: ctx.session.user.id,
  //     }

  //     if (!input.includeExpired) {
  //       where.expiresAt = { gte: new Date() }
  //     }

  //     if (input.status) {
  //       where.status = input.status
  //     }

  //     const userPackages = await ctx.db.userPackage.findMany({
  //       where,
  //       include: {
  //         package: true,
  //         payment: true,
  //       },
  //       orderBy: [
  //         { status: 'asc' },
  //         { expiresAt: 'asc' },
  //       ],
  //     })

  //     // Add computed fields
  //     return userPackages.map(up => ({
  //       ...up,
  //       daysRemaining: differenceInDays(new Date(up.expiresAt), new Date()),
  //       isExpiring: differenceInDays(new Date(up.expiresAt), new Date()) <= 7,
  //       usagePercentage: up.creditsTotal > 0 
  //         ? (up.creditsUsed / up.creditsTotal) * 100 
  //         : 0,
  //     }))
  //   }),


  // Get user packages (admin view)

getUserPackages: protectedProcedure
  .input(z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'DEPLETED', 'EXPIRED', 'CANCELLED']).optional()
  }).optional())
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    
    const where: any = {
      userId
    }
    
    if (input?.status) {
      where.status = input.status
    }
    
    const userPackages = await ctx.db.userPackage.findMany({
      where,
      include: {
        package: true,
        payment: true
      },
      orderBy: {
        purchasedAt: 'desc'
      }
    })
    
    return userPackages
  }),

getAvailable: protectedProcedure
  .query(async ({ ctx }) => {
    const packages = await ctx.db.package.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { price: 'asc' }
      ]
    })
    
    return packages
  }),

gift: protectedProcedure
  .input(z.object({
    packageId: z.string(),
    recipientEmail: z.string().email(),
    recipientName: z.string().optional(),
    message: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    
    // Перевірка чи існує пакет
    const pkg = await ctx.db.package.findUnique({
      where: { id: input.packageId }
    })
    
    if (!pkg || !pkg.isActive) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Package not found or inactive'
      })
    }
    
    // Знаходимо або створюємо користувача-отримувача
    let recipient = await ctx.db.user.findUnique({
      where: { email: input.recipientEmail }
    })
    
    if (!recipient) {
      // Створюємо неактивного користувача який активується при першому вході
      recipient = await ctx.db.user.create({
        data: {
          email: input.recipientEmail,
          firstName: input.recipientName || 'Gift',
          lastName: 'Recipient',
          role: 'STUDENT',
          status: 'PENDING',
          passwordHash: '' // Буде встановлено при активації
        }
      })
    }
    
    // Створюємо платіж
    const payment = await ctx.db.payment.create({
      data: {
        userId,
        amount: pkg.price,
        currency: pkg.currency,
        status: 'PENDING',
        method: 'P24',
        description: `Gift package: ${pkg.name} for ${recipient.email}`
      }
    })
    
    // Створюємо пакет для отримувача
    const userPackage = await ctx.db.userPackage.create({
      data: {
        userId: recipient.id,
        packageId: pkg.id,
        creditsTotal: pkg.credits,
        creditsUsed: 0,
        creditsRemaining: pkg.credits,
        expiresAt: new Date(Date.now() + pkg.validityDays * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        purchasePrice: Number(pkg.price),
        paymentId: payment.id,
        isGift: true,
        giftFrom: `${ctx.session.user.email}`,
        giftMessage: input.message
      }
    })
    
    // Генеруємо URL для оплати
    const paymentUrl = `/api/payments/p24/create?paymentId=${payment.id}&type=gift`
    
    return {
      userPackage,
      payment,
      paymentUrl
    }
  }),

  // Use credits
  useCredits: protectedProcedure
    .input(UseCreditsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id

      // Check permissions if using for someone else
      if (userId !== ctx.session.user.id) {
        if (ctx.session.user.role !== UserRole.ADMIN && 
            ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to use credits for other users',
          })
        }
      }

      // Get active packages with credits
      const activePackages = await ctx.db.userPackage.findMany({
        where: {
          userId,
          status: PackageStatus.ACTIVE,
          creditsRemaining: { gt: 0 },
          expiresAt: { gt: new Date() },
        },
        orderBy: { expiresAt: 'asc' }, // Use oldest first
      })

      const totalCredits = activePackages.reduce(
        (sum, pkg) => sum + pkg.creditsRemaining, 
        0
      )

      if (totalCredits < input.credits) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Insufficient credits. Required: ${input.credits}, Available: ${totalCredits}`,
        })
      }

      // Deduct credits
      let creditsToDeduct = input.credits
      const updatedPackages = []

      for (const pkg of activePackages) {
        if (creditsToDeduct <= 0) break

        const deduction = Math.min(creditsToDeduct, pkg.creditsRemaining)
        
        const updated = await ctx.db.userPackage.update({
          where: { id: pkg.id },
          data: {
            creditsUsed: { increment: deduction },
            creditsRemaining: { decrement: deduction },
            status: pkg.creditsRemaining === deduction 
              ? PackageStatus.DEPLETED 
              : undefined,
            notes: input.bookingId 
              ? `Used ${deduction} credits for booking ${input.bookingId}`
              : input.description,
          },
        })

        updatedPackages.push(updated)
        creditsToDeduct -= deduction
      }

      // Update booking if provided
      if (input.bookingId) {
        await ctx.db.booking.update({
          where: { id: input.bookingId },
          data: {
            usedCredits: input.credits,
            isPaid: true,
          },
        })
      }

      return {
        creditsUsed: input.credits,
        remainingCredits: totalCredits - input.credits,
        updatedPackages,
      }
    }),

  // Transfer credits between users (admin only)
  transferCredits: protectedProcedure
    .input(TransferCreditsSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can transfer credits',
        })
      }

      // Get source package
      const sourcePackage = await ctx.db.userPackage.findUnique({
        where: { id: input.fromPackageId },
        include: { user: true },
      })

      if (!sourcePackage) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Source package not found',
        })
      }

      if (sourcePackage.creditsRemaining < input.credits) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Insufficient credits in source package',
        })
      }

      // Check target user exists
      const targetUser = await ctx.db.user.findUnique({
        where: { id: input.toUserId },
      })

      if (!targetUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Target user not found',
        })
      }

      // Deduct from source
      await ctx.db.userPackage.update({
        where: { id: input.fromPackageId },
        data: {
          creditsUsed: { increment: input.credits },
          creditsRemaining: { decrement: input.credits },
          status: sourcePackage.creditsRemaining === input.credits 
            ? PackageStatus.DEPLETED 
            : undefined,
          notes: `Transferred ${input.credits} credits to ${targetUser.firstName} ${targetUser.lastName}`,
        },
      })

      // Find or create target package
      let targetPackage = await ctx.db.userPackage.findFirst({
        where: {
          userId: input.toUserId,
          packageId: sourcePackage.packageId,
          status: PackageStatus.ACTIVE,
          expiresAt: { gt: new Date() },
        },
      })

      if (targetPackage) {
        // Add to existing package
        targetPackage = await ctx.db.userPackage.update({
          where: { id: targetPackage.id },
          data: {
            creditsTotal: { increment: input.credits },
            creditsRemaining: { increment: input.credits },
            notes: `Received ${input.credits} credits from ${sourcePackage.user.firstName} ${sourcePackage.user.lastName}`,
          },
        })
      } else {
        // Create new package
        targetPackage = await ctx.db.userPackage.create({
          data: {
            userId: input.toUserId,
            packageId: sourcePackage.packageId,
            creditsTotal: input.credits,
            creditsUsed: 0,
            creditsRemaining: input.credits,
            purchasedAt: new Date(),
            expiresAt: sourcePackage.expiresAt,
            status: PackageStatus.ACTIVE,
            purchasePrice: 0, // Transfer
            notes: `Transferred from ${sourcePackage.user.firstName} ${sourcePackage.user.lastName}: ${input.reason || 'Admin transfer'}`,
          },
        })
      }

      return {
        sourcePackage: await ctx.db.userPackage.findUnique({
          where: { id: input.fromPackageId },
        }),
        targetPackage,
        transferredCredits: input.credits,
      }
    }),

  // Extend package validity (admin only)
  extendPackage: protectedProcedure
    .input(ExtendPackageSchema)
    .mutation(async ({ ctx, input }) => {
      // Check admin permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only administrators can extend packages',
        })
      }

      // Get package
      const userPackage = await ctx.db.userPackage.findUnique({
        where: { id: input.userPackageId },
      })

      if (!userPackage) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User package not found',
        })
      }

      // Calculate new expiry date
      const currentExpiry = new Date(userPackage.expiresAt)
      const newExpiry = addDays(currentExpiry, input.days)

      // Update package
      const updated = await ctx.db.userPackage.update({
        where: { id: input.userPackageId },
        data: {
          expiresAt: newExpiry,
          status: userPackage.status === PackageStatus.EXPIRED 
            ? PackageStatus.ACTIVE 
            : userPackage.status,
          notes: `Extended by ${input.days} days: ${input.reason || 'Admin extension'}`,
        },
      })

      return updated
    }),

  // Get package statistics
  getStatistics: protectedProcedure
    .input(z.object({
      packageId: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Check permissions
      if (ctx.session.user.role !== UserRole.ADMIN && 
          ctx.session.user.role !== UserRole.BRANCH_MANAGER) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view package statistics',
        })
      }

      const dateFilter = input.from || input.to ? {
        gte: input.from ? new Date(input.from) : undefined,
        lte: input.to ? new Date(input.to) : undefined,
      } : undefined

      const where: any = {
        purchasedAt: dateFilter,
      }

      if (input.packageId) {
        where.packageId = input.packageId
      }

      // Get purchase statistics
      const purchases = await ctx.db.userPackage.aggregate({
        where,
        _count: {
          id: true,
        },
        _sum: {
          creditsTotal: true,
          creditsUsed: true,
          creditsRemaining: true,
          purchasePrice: true,
        },
        _avg: {
          creditsTotal: true,
          creditsUsed: true,
          purchasePrice: true,
        },
      })

      // Get status breakdown
      const statusBreakdown = await ctx.db.userPackage.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true,
        },
      })

      // Get package popularity
      const packagePopularity = await ctx.db.userPackage.groupBy({
        by: ['packageId'],
        where,
        _count: {
          id: true,
        },
        _sum: {
          purchasePrice: true,
        },
      })

      // Get expiring packages
      const expiringPackages = await ctx.db.userPackage.count({
        where: {
          status: PackageStatus.ACTIVE,
          expiresAt: {
            gte: new Date(),
            lte: addDays(new Date(), 7),
          },
        },
      })

      // Get usage patterns
      const usagePatterns = await ctx.db.userPackage.findMany({
        where,
        select: {
          creditsTotal: true,
          creditsUsed: true,
          purchasedAt: true,
          expiresAt: true,
        },
      })

      const averageUsageTime = usagePatterns
        .filter(up => up.creditsUsed > 0)
        .map(up => {
          const daysActive = differenceInDays(new Date(), new Date(up.purchasedAt))
          return daysActive > 0 ? up.creditsUsed / daysActive : 0
        })
        .reduce((sum, rate, _, arr) => sum + rate / arr.length, 0)

      // Format package popularity with names
      const packagesWithNames = await Promise.all(
        packagePopularity.map(async (item) => {
          const pkg = await ctx.db.package.findUnique({
            where: { id: item.packageId },
            select: { name: true },
          })
          return {
            packageId: item.packageId,
            packageName: pkg?.name || 'Unknown',
            purchases: item._count.id,
            revenue: item._sum.purchasePrice || 0,
          }
        })
      )

      return {
        summary: {
          totalPurchases: purchases._count.id,
          totalRevenue: purchases._sum.purchasePrice || 0,
          totalCreditsIssued: purchases._sum.creditsTotal || 0,
          totalCreditsUsed: purchases._sum.creditsUsed || 0,
          totalCreditsRemaining: purchases._sum.creditsRemaining || 0,
          averagePackagePrice: purchases._avg.purchasePrice || 0,
          averageCreditsPerPackage: purchases._avg.creditsTotal || 0,
          creditsUtilization: purchases._sum.creditsTotal 
            ? ((purchases._sum.creditsUsed || 0) / purchases._sum.creditsTotal) * 100 
            : 0,
        },
        statusBreakdown: statusBreakdown.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        packagePopularity: packagesWithNames.sort((a, b) => b.purchases - a.purchases),
        expiringPackages,
        averageCreditsUsedPerDay: averageUsageTime,
      }
    }),

  // Check for expiring packages (for notifications)
  checkExpiring: protectedProcedure
    .query(async ({ ctx }) => {
      const userPackages = await ctx.db.userPackage.findMany({
        where: {
          userId: ctx.session.user.id,
          status: PackageStatus.ACTIVE,
          creditsRemaining: { gt: 0 },
          expiresAt: {
            gte: new Date(),
            lte: addDays(new Date(), 7),
          },
        },
        include: {
          package: true,
        },
      })

      return userPackages.map(up => ({
        ...up,
        daysRemaining: differenceInDays(new Date(up.expiresAt), new Date()),
        message: `Your ${up.package.name} package expires in ${differenceInDays(new Date(up.expiresAt), new Date())} days with ${up.creditsRemaining} credits remaining`,
      }))
    }),

    // Додайте цей метод в кінець packageRouter в файлі lib/trpc/routers/package.ts:

  // Get user's packages
  getMyPackages: protectedProcedure
    .input(z.object({
      status: z.enum(['ACTIVE', 'EXPIRED', 'DEPLETED', 'ALL']).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      }

      // Filter by status if provided
      if (input?.status && input.status !== 'ALL') {
        where.status = input.status
      }

      const packages = await ctx.db.userPackage.findMany({
        where,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              description: true,
              credits: true,
              price: true,
              validityDays: true,
            }
          },
          payment: {
            select: {
              id: true,
              status: true,
              completedAt: true,
            }
          }
        },
        orderBy: [
          { status: 'asc' },
          { expiresAt: 'asc' }
        ],
      })

      // Transform the data
      return packages.map(pkg => ({
        id: pkg.id,
        packageId: pkg.packageId,
        packageName: pkg.package.name,
        packageDescription: pkg.package.description,
        creditsTotal: pkg.creditsTotal,
        creditsUsed: pkg.creditsUsed,
        creditsRemaining: pkg.creditsRemaining,
        purchasedAt: pkg.purchasedAt,
        expiresAt: pkg.expiresAt,
        status: pkg.status,
        purchasePrice: pkg.purchasePrice,
        isGift: pkg.isGift,
        giftFrom: pkg.giftFrom,
        paymentStatus: pkg.payment?.status,
        paymentCompletedAt: pkg.payment?.completedAt,
      }))
    }),
})