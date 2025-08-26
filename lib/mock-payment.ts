// Mock payment system for MVP
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  createdAt: Date
}

export async function createPaymentIntent(amount: number): Promise<PaymentIntent> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: `pi_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency: 'PLN',
    status: 'pending',
    createdAt: new Date()
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock 95% success rate
  const success = Math.random() > 0.05
  
  return {
    id: paymentIntentId,
    amount: 200, // Fixed price for MVP
    currency: 'PLN',
    status: success ? 'succeeded' : 'failed',
    createdAt: new Date()
  }
}

export function formatPrice(amount: number, currency: string = 'PLN'): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}