// app/api/payments/p24/verify/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { p24Client } from '@/lib/payment/p24-client'
import { z } from 'zod'

const VerifyPaymentSchema = z.object({
  sessionId: z.string(),
  orderId: z.number(),
  amount: z.number(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = VerifyPaymentSchema.parse(body)

    // Get payment from database
    const payment = await db.payment.findUnique({
      where: { p24SessionId: data.sessionId },
      include: {
        booking: true,
        userPackage: {
          include: { package: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Verify with P24
    const isValid = await p24Client.verifyTransaction({
      sessionId: data.sessionId,
      amount: data.amount,
      currency: 'PLN',
      orderId: data.orderId,
    })

    if (!isValid) {
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
        },
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update payment status
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        p24OrderId: data.orderId.toString(),
        completedAt: new Date(),
      },
    })

    // Update related entities
    if (payment.booking) {
      await db.booking.update({
        where: { id: payment.booking.id },
        data: { isPaid: true },
      })
    }

    if (payment.userPackage) {
      await db.userPackage.update({
        where: { id: payment.userPackage.id },
        data: { status: 'ACTIVE' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    )
  }
}
