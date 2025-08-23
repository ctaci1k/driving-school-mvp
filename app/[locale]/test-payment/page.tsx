// app/test-payment/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function TestPaymentPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [amount, setAmount] = useState('200')

  const handlePayment = async () => {
    if (!session) {
      alert('Musisz być zalogowany!')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/payments/p24/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: 'Test płatności - lekcja jazdy'
        })
      })

      const data = await response.json()
      setResult(data)

      if (data.redirectUrl) {
        // Перенаправляємо на сторінку результату
        setTimeout(() => {
          window.location.href = data.redirectUrl
        }, 1000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setResult({ error: 'Payment failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Test Płatności Przelewy24</h1>
      
      {!session ? (
        <div style={{ 
          padding: '20px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <p>⚠️ Musisz być zalogowany aby testować płatności</p>
          <a href="/login" style={{ color: '#0066cc' }}>Przejdź do logowania</a>
        </div>
      ) : (
        <div style={{ 
          padding: '20px', 
          background: '#d4edda', 
          border: '1px solid #28a745',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <p>✓ Zalogowany jako: {session.user?.email}</p>
        </div>
      )}

      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Symulacja płatności</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Kwota (PLN):
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || !session}
          style={{
            padding: '10px 20px',
            background: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Przetwarzanie...' : `Zapłać ${amount} PLN`}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '20px', 
          background: result.error ? '#f8d7da' : '#d4edda',
          border: `1px solid ${result.error ? '#dc3545' : '#28a745'}`,
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3 style={{ marginBottom: '10px' }}>
            {result.error ? '❌ Błąd' : '✓ Wynik'}
          </h3>
          <pre style={{ 
            background: 'white', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#e9ecef',
        borderRadius: '5px'
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>ℹ️ Informacje</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>W trybie deweloperskim płatność jest automatycznie symulowana</li>
          <li>W produkcji zostaniesz przekierowany do Przelewy24</li>
          <li>Aby użyć prawdziwego Przelewy24, ustaw zmienne środowiskowe:</li>
        </ul>
        <pre style={{ 
          background: 'white', 
          padding: '10px', 
          marginTop: '10px',
          borderRadius: '3px',
          fontSize: '12px'
        }}>
{`P24_MERCHANT_ID=twój_merchant_id
P24_CRC=twój_crc_key
P24_API_KEY=twój_api_key
P24_SANDBOX=true`}
        </pre>
      </div>
    </div>
  )
}