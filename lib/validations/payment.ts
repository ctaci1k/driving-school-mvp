// lib/validations/payment.ts
import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Kwota musi być większa niż 0'),
  currency: z.enum(['PLN', 'EUR', 'USD']).default('PLN'),
  description: z.string().min(1, 'Opis jest wymagany').max(255),
  bookingId: z.string().optional(),
  packageId: z.string().optional(),
  paymentMethod: z.enum(['P24', 'CREDITS', 'CASH', 'TRANSFER']).default('P24'),
})

export const p24PaymentSchema = paymentSchema.extend({
  email: z.string().email('Nieprawidłowy adres email'),
  returnUrl: z.string().url('Nieprawidłowy URL powrotu'),
  statusUrl: z.string().url('Nieprawidłowy URL statusu'),
  clientIp: z.string().optional(),
  language: z.enum(['pl', 'en', 'de', 'es', 'it', 'fr']).default('pl'),
})

export const refundSchema = z.object({
  paymentId: z.string().min(1, 'ID płatności jest wymagane'),
  amount: z.number().min(0.01, 'Kwota zwrotu musi być większa niż 0'),
  reason: z.string().min(1, 'Powód zwrotu jest wymagany').max(500),
})

export const paymentFilterSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  paymentMethod: z.enum(['P24', 'CREDITS', 'CASH', 'TRANSFER']).optional(),
  userId: z.string().optional(),
  bookingId: z.string().optional(),
  packageId: z.string().optional(),
})

export const invoiceSchema = z.object({
  paymentId: z.string().min(1),
  companyName: z.string().optional(),
  nip: z.string()
    .regex(/^[0-9]{10}$/, 'NIP musi mieć 10 cyfr')
    .optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string().regex(/^[0-9]{2}-[0-9]{3}$/, 'Format: 00-000'),
    country: z.string().default('Polska'),
  }).optional(),
})

export type PaymentData = z.infer<typeof paymentSchema>
export type P24PaymentData = z.infer<typeof p24PaymentSchema>
export type RefundData = z.infer<typeof refundSchema>
export type PaymentFilterData = z.infer<typeof paymentFilterSchema>
export type InvoiceData = z.infer<typeof invoiceSchema>

// P24 specific validations
export function validateP24Email(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 50
}

export function validateP24Amount(amount: number): boolean {
  // P24 accepts amounts in grosz (1 PLN = 100 grosz)
  // Min: 1 grosz, Max: 999999999 grosz (9,999,999.99 PLN)
  const amountInGrosz = Math.round(amount * 100)
  return amountInGrosz >= 1 && amountInGrosz <= 999999999
}

export function formatAmountForP24(amount: number): number {
  // Convert PLN to grosz for P24
  return Math.round(amount * 100)
}

export function formatAmountFromP24(amountInGrosz: number): number {
  // Convert grosz to PLN
  return amountInGrosz / 100
}

// NIP validation
export function validateNIP(nip: string): boolean {
  const cleaned = nip.replace(/[^0-9]/g, '')
  
  if (cleaned.length !== 10) {
    return false
  }
  
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const digits = cleaned.split('').map(Number)
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * weights[i]
  }
  
  const checksum = sum % 11
  
  if (checksum === 10) {
    return false
  }
  
  return checksum === digits[9]
}

// Invoice number generation
export function generateInvoiceNumber(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  
  return `FV/${year}/${month}/${random}`
}

// Payment validation helpers
export function canRefund(payment: {
  status: string
  createdAt: Date
  amount: number
  refundedAmount?: number
}): boolean {
  if (payment.status !== 'COMPLETED') {
    return false
  }
  
  // Check if payment is not older than 365 days
  const daysSincePayment = Math.floor(
    (Date.now() - payment.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysSincePayment > 365) {
    return false
  }
  
  // Check if there's amount left to refund
  const refundedAmount = payment.refundedAmount || 0
  return refundedAmount < payment.amount
}

export function getMaxRefundAmount(payment: {
  amount: number
  refundedAmount?: number
}): number {
  const refundedAmount = payment.refundedAmount || 0
  return payment.amount - refundedAmount
}