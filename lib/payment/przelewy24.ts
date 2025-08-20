// lib/payment/przelewy24.ts

import crypto from 'crypto'

// Konfiguracja Przelewy24
export const p24Config = {
  merchantId: process.env.P24_MERCHANT_ID || '27290',  // testowy merchant ID
  posId: process.env.P24_POS_ID || '27290',
  crc: process.env.P24_CRC || 'b36103b3f74181c8',  // testowy CRC
  apiKey: process.env.P24_API_KEY || 'test',
  sandbox: process.env.P24_SANDBOX !== 'false',
  
  get baseUrl() {
    return this.sandbox 
      ? 'https://sandbox.przelewy24.pl'
      : 'https://secure.przelewy24.pl'
  }
}

// Generuj unikalny session ID
export function generateSessionId(): string {
  return `DS-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Konwertuj PLN na grosze
export function toGrosze(amount: number): number {
  return Math.round(amount * 100)
}

// Generuj podpis CRC
export function generateSign(sessionId: string, amount: number): string {
  const signString = `{"sessionId":"${sessionId}","merchantId":${p24Config.merchantId},"amount":${amount},"currency":"PLN","crc":"${p24Config.crc}"}`
  
  return crypto
    .createHash('sha384')
    .update(signString)
    .digest('hex')
}

// Przygotuj dane transakcji
export interface P24Transaction {
  sessionId: string
  amount: number  // w groszach
  description: string
  email: string
  urlReturn: string
  urlStatus: string
  client?: string
  phone?: string
}

// Zarejestruj transakcję
export async function registerTransaction(data: P24Transaction) {
  const sign = generateSign(data.sessionId, data.amount)
  
  const payload = {
    merchantId: parseInt(p24Config.merchantId),
    posId: parseInt(p24Config.posId),
    sessionId: data.sessionId,
    amount: data.amount,
    currency: 'PLN',
    description: data.description,
    email: data.email,
    client: data.client || '',
    address: '',
    zip: '',
    city: '',
    country: 'PL',
    phone: data.phone || '',
    language: 'pl',
    method: 24,
    urlReturn: data.urlReturn,
    urlStatus: data.urlStatus,
    timeLimit: 15,
    channel: 16,
    shipping: 0,
    transferLabel: data.sessionId,
    sign
  }

  try {
    const response = await fetch(`${p24Config.baseUrl}/api/v1/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${p24Config.posId}:${p24Config.apiKey}`).toString('base64')}`
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    console.log('P24 Response:', result) // Для дебагу

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to register transaction')
    }

    return {
      token: result.data.token,
      redirectUrl: `${p24Config.baseUrl}/trnRequest/${result.data.token}`
    }
  } catch (error) {
    console.error('P24 register error:', error)
    throw error
  }
}

// Weryfikuj transakcję
export async function verifyTransaction(sessionId: string, amount: number, orderId: number) {
  const sign = generateSign(sessionId, amount)
  
  const payload = {
    merchantId: parseInt(p24Config.merchantId),
    posId: parseInt(p24Config.posId),
    sessionId: sessionId,
    amount: amount,
    currency: 'PLN',
    orderId: orderId,
    sign
  }

  try {
    const response = await fetch(`${p24Config.baseUrl}/api/v1/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${p24Config.posId}:${p24Config.apiKey}`).toString('base64')}`
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    return result.data?.status === 'success'
  } catch (error) {
    console.error('P24 verify error:', error)
    // W trybie testowym zawsze zwróć sukces
    return p24Config.sandbox
  }
}