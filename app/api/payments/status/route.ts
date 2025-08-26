// app/api/payments/status/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Знайти платіж по session ID
    const payment = await db.payment.findUnique({
      where: { p24SessionId: sessionId },
      include: {
        booking: true,
        userPackage: {
          include: {
            package: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Перевірити що це платіж поточного користувача
    if (payment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      paymentId: payment.id,
      sessionId: payment.p24SessionId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt,
      booking: payment.booking ? {
        id: payment.booking.id,
        startTime: payment.booking.startTime,
        endTime: payment.booking.endTime
      } : null,
      package: payment.userPackage ? {
        name: payment.userPackage.package.name,
        credits: payment.userPackage.package.credits
      } : null
    })
  } catch (error) {
    console.error('Get payment status error:', error)
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    )
  }
}