// app/api/webhooks/p24/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { p24Client, P24WebhookSchema } from '@/lib/payment/p24-client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('P24 Webhook received:', body)

    // Validate webhook payload
    const payload = P24WebhookSchema.parse(body)

    // Verify signature
    if (!p24Client.verifyWebhookSignature(payload)) {
      console.error('Invalid P24 webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Get payment from database
    const payment = await db.payment.findUnique({
      where: { p24SessionId: payload.sessionId },
      include: {
        booking: true,
        userPackage: {
          include: { package: true },
        },
        user: true,
      },
    })

    if (!payment) {
      console.error('Payment not found for session:', payload.sessionId)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Verify transaction with P24
    const isValid = await p24Client.verifyTransaction({
      sessionId: payload.sessionId,
      amount: payload.amount,
      currency: 'PLN',
      orderId: payload.orderId,
    })

    if (!isValid) {
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          metadata: {
            ...payment.metadata as any,
            webhookData: payload,
          },
        },
      })
      return NextResponse.json({ error: 'Transaction verification failed' }, { status: 400 })
    }

    // Update payment status
    await db.$transaction(async (tx) => {
      // Update payment
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          p24OrderId: payload.orderId.toString(),
          completedAt: new Date(),
          metadata: {
            ...payment.metadata as any,
            webhookData: payload,
          },
        },
      })

      // Update booking if exists
      if (payment.booking) {
        await tx.booking.update({
          where: { id: payment.booking.id },
          data: { isPaid: true },
        })

        // Create notification
        await tx.notification.create({
          data: {
            userId: payment.userId,
            type: 'BOOKING_CONFIRMATION',
            channel: 'EMAIL',
            subject: 'Potwierdzenie rezerwacji',
            content: `Twoja rezerwacja na ${payment.booking.startTime.toLocaleDateString('pl-PL')} została opłacona.`,
            metadata: {
              bookingId: payment.booking.id,
              paymentId: payment.id,
            },
          },
        })
      }

      // Activate package if exists
      if (payment.userPackage) {
        await tx.userPackage.update({
          where: { id: payment.userPackage.id },
          data: { status: 'ACTIVE' },
        })

        // Create notification
        await tx.notification.create({
          data: {
            userId: payment.userId,
            type: 'PAYMENT_SUCCESS',
            channel: 'EMAIL',
            subject: 'Pakiet aktywowany',
            content: `Twój pakiet "${payment.userPackage.package.name}" został aktywowany.`,
            metadata: {
              packageId: payment.userPackage.id,
              paymentId: payment.id,
            },
          },
        })
      }
    })

    // Send confirmation email (you'll implement this with your email service)
    // await sendPaymentConfirmation(payment)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('P24 webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    )
  }
}