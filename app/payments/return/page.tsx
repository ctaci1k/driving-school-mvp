// app/payments/return/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaymentReturnPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'error'>('checking')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  const sessionId = searchParams.get('sessionId')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    checkPaymentStatus()
  }, [sessionId])

  const checkPaymentStatus = async () => {
    try {
      // Перевіряємо статус платежу
      const response = await fetch(`/api/payments/status?sessionId=${sessionId}`)
      const data = await response.json()

      if (data.status === 'COMPLETED') {
        setStatus('success')
        setPaymentDetails(data)
        
        // Через 3 секунди перенаправляємо на дашборд
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
        setStatus('failed')
        setPaymentDetails(data)
      } else {
        // Платіж ще обробляється
        setStatus('checking')
        // Перевіряємо знову через 2 секунди
        setTimeout(checkPaymentStatus, 2000)
      }
    } catch (error) {
      console.error('Error checking payment:', error)
      setStatus('error')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {status === 'checking' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid #f0f0f0',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }} />
              <h2 style={{ marginBottom: '10px' }}>Перевіряємо платіж...</h2>
              <p style={{ color: '#666' }}>Зачекайте, перевіряємо статус вашої оплати</p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '30px' }}>✓</span>
              </div>
              <h2 style={{ marginBottom: '10px', color: '#28a745' }}>Платіж успішний!</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Дякуємо за оплату. Ваше бронювання підтверджено.
              </p>
              {paymentDetails && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  <p><strong>ID платежу:</strong> {paymentDetails.paymentId}</p>
                  <p><strong>Сума:</strong> {paymentDetails.amount} PLN</p>
                  <p><strong>Дата:</strong> {new Date().toLocaleString('uk-UA')}</p>
                </div>
              )}
              <p style={{ fontSize: '14px', color: '#666' }}>
                Перенаправлення через 3 секунди...
              </p>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '30px' }}>✕</span>
              </div>
              <h2 style={{ marginBottom: '10px', color: '#dc3545' }}>Платіж не вдався</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                На жаль, не вдалося обробити ваш платіж.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Link href="/dashboard" style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}>
                  На головну
                </Link>
                <button onClick={() => window.history.back()} style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  Спробувати знову
                </button>
              </div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: '10px', color: '#dc3545' }}>Помилка</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Щось пішло не так. Спробуйте пізніше.
              </p>
              <Link href="/dashboard" style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block'
              }}>
                На головну
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}