// components/payments/PaymentButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PaymentButtonProps {
  bookingId?: string
  packageId?: string
  amount: number
  description: string
  className?: string
  children?: React.ReactNode
}

export function PaymentButton({
  bookingId,
  packageId,
  amount,
  description,
  className = '',
  children = 'Zapłać'
}: PaymentButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payments/p24/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          packageId,
          amount,
          description
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment initialization failed')
      }

      const data = await response.json()
      
      if (data.redirectUrl) {
        // Przekieruj do Przelewy24
        window.location.href = data.redirectUrl
      } else {
        throw new Error('No redirect URL received')
      }
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Nie udało się zainicjować płatności'
      )
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }
        text-white
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Przetwarzanie...
        </>
      ) : (
        children
      )}
    </button>
  )
}