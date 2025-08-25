// lib/validations/package.ts
import { z } from 'zod'
import { addDays } from 'date-fns'

export const packageSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana').max(100),
  description: z.string().max(500).optional(),
  credits: z.number().min(1, 'Liczba kredytów musi być większa niż 0').max(100),
  price: z.number().min(0.01, 'Cena musi być większa niż 0'),
  currency: z.enum(['PLN', 'EUR', 'USD']).default('PLN'),
  validityDays: z.number().min(1, 'Okres ważności musi być większy niż 0').max(365),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  maxPurchasesPerUser: z.number().min(1).optional(),
  discount: z.number().min(0).max(100).optional(),
})

export const purchasePackageSchema = z.object({
  packageId: z.string().min(1, 'ID pakietu jest wymagane'),
  paymentMethod: z.enum(['P24', 'TRANSFER', 'CASH']).default('P24'),
  promoCode: z.string().optional(),
})

export const userPackageSchema = z.object({
  userId: z.string().min(1),
  packageId: z.string().min(1),
  creditsTotal: z.number().min(1),
  creditsUsed: z.number().min(0).default(0),
  creditsRemaining: z.number().min(0),
  purchasedAt: z.date(),
  expiresAt: z.date(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'DEPLETED']).default('ACTIVE'),
  isGift: z.boolean().default(false),
  giftedBy: z.string().optional(),
  giftMessage: z.string().max(500).optional(),
})

export const giftPackageSchema = z.object({
  packageId: z.string().min(1),
  recipientEmail: z.string().email('Nieprawidłowy adres email'),
  recipientPhone: z.string()
    .regex(/^(\+48)?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/, 'Nieprawidłowy numer telefonu')
    .optional(),
  message: z.string().max(500).optional(),
  scheduledDelivery: z.date().optional(),
})

export const packageFilterSchema = z.object({
  isActive: z.boolean().optional(),
  minCredits: z.number().optional(),
  maxCredits: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  validityDays: z.number().optional(),
})

export const promoCodeSchema = z.object({
  code: z.string()
    .min(3, 'Kod musi mieć minimum 3 znaki')
    .max(20, 'Kod może mieć maksymalnie 20 znaków')
    .regex(/^[A-Z0-9]+$/, 'Kod może zawierać tylko wielkie litery i cyfry'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(0.01),
  minPurchaseAmount: z.number().min(0).optional(),
  maxUsages: z.number().min(1).optional(),
  validFrom: z.date(),
  validTo: z.date(),
  packageIds: z.array(z.string()).optional(),
})

export type PackageData = z.infer<typeof packageSchema>
export type PurchasePackageData = z.infer<typeof purchasePackageSchema>
export type UserPackageData = z.infer<typeof userPackageSchema>
export type GiftPackageData = z.infer<typeof giftPackageSchema>
export type PackageFilterData = z.infer<typeof packageFilterSchema>
export type PromoCodeData = z.infer<typeof promoCodeSchema>

// Business logic validations
export function validatePackageExpiry(
  expiresAt: Date,
  warningDays = 7
): {
  isExpired: boolean
  isExpiring: boolean
  daysRemaining: number
} {
  const now = new Date()
  const daysRemaining = Math.floor(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return {
    isExpired: daysRemaining < 0,
    isExpiring: daysRemaining >= 0 && daysRemaining <= warningDays,
    daysRemaining: Math.max(0, daysRemaining),
  }
}

export function canUseCredits(userPackage: {
  creditsRemaining: number
  expiresAt: Date
  status: string
}): boolean {
  return (
    userPackage.status === 'ACTIVE' &&
    userPackage.creditsRemaining > 0 &&
    new Date(userPackage.expiresAt) > new Date()
  )
}

export function calculatePackageValue(
  credits: number,
  price: number
): number {
  if (credits === 0) return 0
  return Number((price / credits).toFixed(2))
}

export function calculateDiscount(
  originalPrice: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number
): number {
  if (discountType === 'PERCENTAGE') {
    return originalPrice * (1 - discountValue / 100)
  } else {
    return Math.max(0, originalPrice - discountValue)
  }
}

export function validatePromoCode(
  code: string,
  promoCode: {
    validFrom: Date
    validTo: Date
    maxUsages?: number
    currentUsages: number
    minPurchaseAmount?: number
  },
  purchaseAmount: number
): {
  isValid: boolean
  error?: string
} {
  const now = new Date()
  
  if (now < promoCode.validFrom) {
    return { isValid: false, error: 'Kod promocyjny nie jest jeszcze aktywny' }
  }
  
  if (now > promoCode.validTo) {
    return { isValid: false, error: 'Kod promocyjny wygasł' }
  }
  
  if (promoCode.maxUsages && promoCode.currentUsages >= promoCode.maxUsages) {
    return { isValid: false, error: 'Kod promocyjny został już wykorzystany' }
  }
  
  if (promoCode.minPurchaseAmount && purchaseAmount < promoCode.minPurchaseAmount) {
    return {
      isValid: false,
      error: `Minimalna kwota zakupu to ${promoCode.minPurchaseAmount} PLN`,
    }
  }
  
  return { isValid: true }
}

export function sortPackagesByValue(packages: Array<{
  credits: number
  price: number
  [key: string]: any
}>): typeof packages {
  return packages.sort((a, b) => {
    const valueA = calculatePackageValue(a.credits, a.price)
    const valueB = calculatePackageValue(b.credits, b.price)
    return valueA - valueB // Lower price per credit is better
  })
}

export function getRecommendedPackage(
  packages: Array<{
    id: string
    credits: number
    price: number
    isPopular?: boolean
    [key: string]: any
  }>,
  monthlyUsage: number
): typeof packages[0] | null {
  // Find package that covers 2-3 months of usage
  const targetCredits = monthlyUsage * 2.5
  
  const suitable = packages
    .filter(pkg => pkg.credits >= monthlyUsage * 2 && pkg.credits <= monthlyUsage * 3)
    .sort((a, b) => {
      // Prefer popular packages
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      
      // Then sort by value
      const valueA = calculatePackageValue(a.credits, a.price)
      const valueB = calculatePackageValue(b.credits, b.price)
      return valueA - valueB
    })
  
  return suitable[0] || null
}