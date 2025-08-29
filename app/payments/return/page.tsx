// app/payments/return/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type PaymentStatus = 'checking' | 'success' | 'failed' | 'pending' | 'error'

interface PaymentDetails {
  paymentId: string
  sessionId: string
  status: string
  amount: number
  currency: string
  description: string
  createdAt: string
  completedAt?: string
  booking?: {
    id: string
    startTime: string
    endTime: string
  }
  package?: {
    name: string
    credits: number
  }
}

export default function PaymentReturnPage() {
  const t = useTranslations('common.paymentReturn')
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<PaymentStatus>('checking')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [checkCount, setCheckCount] = useState(0)

  const sessionId = searchParams.get('sessionId')
  const mock = searchParams.get('mock') === 'true'

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    if (mock) {
      // Для trybu testowego - od razu sukces
      setStatus('success')
      setPaymentDetails({
        paymentId: 'mock-payment',
        sessionId: sessionId,
        status: 'COMPLETED',
        amount: 200,
        currency: 'PLN',
        description: t('details.testPayment'),
        createdAt: new Date().toISOString()
      })
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
      
      return
    }

    checkPaymentStatus()
  }, [sessionId, mock])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status?sessionId=${sessionId}`)
      
      if (!response.ok) {
        setStatus('error')
        return
      }
      
      const data: PaymentDetails = await response.json()
      setPaymentDetails(data)

      if (data.status === 'COMPLETED') {
        setStatus('success')
        
        // Przekieruj po 5 sekundach
        setTimeout(() => {
          if (data.booking) {
            router.push('/student/bookings')
          } else if (data.package) {
            router.push('/student/packages')
          } else {
            router.push('/dashboard')
          }
        }, 5000)
        
      } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
        setStatus('failed')
        
      } else {
        // Status PENDING - sprawdź ponownie
        setStatus('pending')
        setCheckCount(prev => prev + 1)
        
        // Sprawdzaj maksymalnie 30 razy (około 60 sekund)
        if (checkCount < 30) {
          setTimeout(checkPaymentStatus, 2000)
        } else {
          setStatus('pending') // Zatrzymaj sprawdzanie ale pokaż status pending
        }
      }
    } catch (error) {
      console.error('Error checking payment:', error)
      setStatus('error')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
      case 'pending':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-orange-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'checking':
        return t('status.checking')
      case 'pending':
        return t('status.pending')
      case 'success':
        return t('status.success')
      case 'failed':
        return t('status.failed')
      case 'error':
        return t('status.error')
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return t('messages.checking')
      case 'pending':
        return t('messages.pending')
      case 'success':
        return paymentDetails?.booking 
          ? t('messages.successBooking')
          : paymentDetails?.package
          ? t('messages.successPackage')
          : t('messages.successDefault')
      case 'failed':
        return t('messages.failed')
      case 'error':
        return sessionId ? t('messages.errorWithSession') : t('messages.errorNoSession')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            {getStatusTitle()}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getStatusMessage()}
          </p>

          {paymentDetails && status === 'success' && (
            <div className="bg-gray-50 rounded p-4 mb-6 text-left">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('details.paymentId')}</span>
                  <span className="font-mono text-xs">{paymentDetails.paymentId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('details.amount')}</span>
                  <span className="font-semibold">{paymentDetails.amount} {paymentDetails.currency}</span>
                </div>
                {paymentDetails.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('details.description')}</span>
                    <span className="text-sm">{paymentDetails.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {status === 'success' && (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {t('buttons.goToDashboard')}
              </Link>
            )}
            
            {status === 'failed' && (
              <>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  {t('buttons.back')}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {t('buttons.mainDashboard')}
                </Link>
              </>
            )}
            
            {status === 'pending' && checkCount >= 30 && (
              <>
                <button
                  onClick={() => {
                    setCheckCount(0)
                    checkPaymentStatus()
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {t('buttons.checkAgain')}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  {t('buttons.returnLater')}
                </Link>
              </>
            )}
            
            {status === 'error' && (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {t('buttons.backToDashboard')}
              </Link>
            )}
          </div>

          {status === 'pending' && checkCount < 30 && (
            <p className="text-xs text-gray-400 mt-4">
              {t('checkingStatus', {count: checkCount})}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}