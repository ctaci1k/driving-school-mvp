// app/api/payments/create/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSessionId, toGrosze, registerTransaction } from '@/lib/payment/przelewy24'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { bookingId, amount, description } = body

    // Pobierz dane użytkownika
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generuj session ID
    const sessionId = generateSessionId()

    // Zapisz płatność w bazie
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        bookingId: bookingId || null,
        amount: amount,
        currency: 'PLN',
        status: 'PENDING',
        method: 'P24',
        p24SessionId: sessionId,
        description: description || 'Płatność za lekcję jazdy'
      }
    })

    // Jeśli to płatność za rezerwację, zaktualizuj ją
    if (bookingId) {
      await db.booking.update({
        where: { id: bookingId },
        data: {
          price: amount,
          paymentId: payment.id
        }
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

    // Zarejestruj transakcję w P24
    try {
      const p24Result = await registerTransaction({
        sessionId,
        amount: toGrosze(amount),
        description: payment.description || '',
        email: user.email,
        client: `${user.firstName} ${user.lastName}`,
        phone: user.phone || undefined,
        urlReturn: `${baseUrl}/payments/return?sessionId=${sessionId}`,
        urlStatus: `${baseUrl}/api/payments/webhook`
      })

      // Zaktualizuj płatność z tokenem
      await db.payment.update({
        where: { id: payment.id },
        data: { p24Token: p24Result.token }
      })

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        sessionId,
        redirectUrl: p24Result.redirectUrl
      })
    } catch (error) {
      // W trybie deweloperskim - symuluj sukces
      if (process.env.NODE_ENV === 'development') {
        // Automatycznie oznacz jako opłacone (dla testów)
        await db.$transaction([
          db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date()
            }
          }),
          ...(bookingId ? [
            db.booking.update({
              where: { id: bookingId },
              data: { isPaid: true }
            })
          ] : [])
        ])

        return NextResponse.json({
          success: true,
          paymentId: payment.id,
          sessionId,
          mockPayment: true,
          redirectUrl: `/payments/return?sessionId=${sessionId}&mock=true`,
          message: 'Payment simulated (dev mode)'
        })
      }
      
      throw error
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}