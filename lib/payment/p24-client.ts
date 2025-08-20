// lib/payment/p24-client.ts

import crypto from 'crypto'
import { z } from 'zod'

// Przelewy24 Configuration
export const P24Config = {
  merchantId: process.env.P24_MERCHANT_ID!,
  posId: process.env.P24_POS_ID || process.env.P24_MERCHANT_ID!,
  crc: process.env.P24_CRC!,
  apiKey: process.env.P24_API_KEY!,
  sandbox: process.env.P24_SANDBOX === 'true',
  
  get baseUrl() {
    return this.sandbox 
      ? 'https://sandbox.przelewy24.pl'
      : 'https://secure.przelewy24.pl'
  }
}

// Types
export interface P24TransactionParams {
  sessionId: string
  amount: number // in grosz (1 PLN = 100 grosz)
  currency: 'PLN'
  description: string
  email: string
  client?: string
  address?: string
  zip?: string
  city?: string
  country?: string
  phone?: string
  language?: 'pl' | 'en' | 'de' | 'es' | 'it' | 'fr'
  urlReturn: string
  urlStatus: string
  timeLimit?: number // in minutes, 0 = no limit
  channel?: number
  shipping?: number
  transferLabel?: string
  methodRefId?: string
}

export interface P24TransactionResponse {
  token: string
  redirectUrl: string
}

export interface P24VerifyParams {
  sessionId: string
  amount: number
  currency: 'PLN'
  orderId: number
}

export interface P24WebhookPayload {
  merchantId: string
  posId: string
  sessionId: string
  amount: number
  originAmount: number
  currency: string
  orderId: number
  methodId: number
  statement: string
  sign: string
}

// Validation schemas
export const P24WebhookSchema = z.object({
  merchantId: z.string(),
  posId: z.string(),
  sessionId: z.string(),
  amount: z.number(),
  originAmount: z.number(),
  currency: z.string(),
  orderId: z.number(),
  methodId: z.number(),
  statement: z.string(),
  sign: z.string(),
})

// P24 Client Class
export class P24Client {
  private config: typeof P24Config

  constructor(config?: Partial<typeof P24Config>) {
    this.config = { ...P24Config, ...config }
  }

  // Generate CRC checksum
  private generateSign(data: Record<string, any>): string {
    const { sessionId, merchantId, amount, currency, crc } = data
    const signString = `${sessionId}|${merchantId}|${amount}|${currency}|${crc}`
    
    return crypto
      .createHash('sha384')
      .update(signString)
      .digest('hex')
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: P24WebhookPayload): boolean {
    const { sessionId, orderId, amount, currency, sign } = payload
    const signString = `${sessionId}|${orderId}|${amount}|${currency}|${this.config.crc}`
    
    const expectedSign = crypto
      .createHash('sha384')
      .update(signString)
      .digest('hex')
    
    return sign === expectedSign
  }

  // Register new transaction
  async registerTransaction(params: P24TransactionParams): Promise<P24TransactionResponse> {
    const sign = this.generateSign({
      sessionId: params.sessionId,
      merchantId: this.config.merchantId,
      amount: params.amount,
      currency: params.currency,
      crc: this.config.crc,
    })

    const requestData = {
      merchantId: parseInt(this.config.merchantId),
      posId: parseInt(this.config.posId),
      sessionId: params.sessionId,
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      email: params.email,
      client: params.client,
      address: params.address,
      zip: params.zip,
      city: params.city,
      country: params.country || 'PL',
      phone: params.phone,
      language: params.language || 'pl',
      urlReturn: params.urlReturn,
      urlStatus: params.urlStatus,
      timeLimit: params.timeLimit || 15,
      sign,
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/transaction/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`P24 Error: ${error.error || 'Transaction registration failed'}`)
      }

      const data = await response.json()
      
      return {
        token: data.data.token,
        redirectUrl: `${this.config.baseUrl}/trnRequest/${data.data.token}`,
      }
    } catch (error) {
      console.error('P24 register transaction error:', error)
      throw error
    }
  }

  // Verify transaction
  async verifyTransaction(params: P24VerifyParams): Promise<boolean> {
    const sign = this.generateSign({
      sessionId: params.sessionId,
      orderId: params.orderId,
      amount: params.amount,
      currency: params.currency,
      crc: this.config.crc,
    })

    const requestData = {
      merchantId: parseInt(this.config.merchantId),
      posId: parseInt(this.config.posId),
      sessionId: params.sessionId,
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
      sign,
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/transaction/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('P24 verify error:', error)
        return false
      }

      const data = await response.json()
      return data.data.status === 'success'
    } catch (error) {
      console.error('P24 verify transaction error:', error)
      return false
    }
  }

  // Get transaction details
  async getTransaction(sessionId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/transaction/by/sessionId/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get transaction details')
      }

      return await response.json()
    } catch (error) {
      console.error('P24 get transaction error:', error)
      throw error
    }
  }

  // Get available payment methods
  async getPaymentMethods(lang: 'pl' | 'en' = 'pl'): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/payment/methods/${lang}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get payment methods')
      }

      return await response.json()
    } catch (error) {
      console.error('P24 get payment methods error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const p24Client = new P24Client()

// Helper functions
export function formatAmountToGrosze(amount: number): number {
  return Math.round(amount * 100)
}

export function formatGroszeToAmount(grosze: number): number {
  return grosze / 100
}

export function generateSessionId(): string {
  return `DS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}