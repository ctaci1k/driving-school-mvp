// app/api/webhooks/p24/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { p24Client } from '@/lib/payment/p24-client'
import { P24WebhookSchema } from '@/lib/payment/p24-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('P24 Webhook received:', body)
    
    // Валідація даних
    const webhookData = P24WebhookSchema.parse(body)
    
    // Перевірка підпису
    const isValidSignature = p24Client.verifyWebhookSignature(webhookData)
    
    if (!isValidSignature) {
      console.error('Invalid P24 webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Знайти платіж
    const payment = await db.payment.findUnique({
      where: { p24SessionId: webhookData.sessionId },
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
      console.error('Payment not found:', webhookData.sessionId)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }
    
    // Якщо платіж вже оброблений
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({ status: 'OK' })
    }
    
    // Верифікація транзакції
    const isVerified = await p24Client.verifyTransaction({
      sessionId: webhookData.sessionId,
      amount: webhookData.amount,
      currency: 'PLN' as const,
      orderId: webhookData.orderId
    })
    
    if (isVerified) {
      // Оновити платіж
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          p24OrderId: webhookData.orderId.toString(),
          completedAt: new Date(),
          metadata: {
            ...payment.metadata as any,
            p24MethodId: webhookData.methodId,
            p24Statement: webhookData.statement
          }
        }
      })
      
      // Якщо це платіж за бронювання
      if (payment.booking) {
        await db.booking.update({
          where: { id: payment.booking.id },
          data: { 
            isPaid: true,
            paymentId: payment.id
          }
        })
        
        // Створити повідомлення
        await db.notification.create({
          data: {
            userId: payment.userId,
            type: 'PAYMENT_COMPLETED',
            channel: 'EMAIL',
            subject: 'Potwierdzenie płatności za lekcję',
            content: `Płatność za lekcję ${new Date(payment.booking.startTime).toLocaleDateString('pl-PL')} została zarejestrowana.`,
            metadata: {
              paymentId: payment.id,
              bookingId: payment.bookingId,
              orderId: webhookData.orderId
            },
            status: 'PENDING'
          }
        })
      }
      
      // Якщо це платіж за пакет
      if (payment.userPackage) {
        await db.userPackage.update({
  where: { id: payment.userPackage.id },
  data: {
    status: 'ACTIVE'
  }
})
        
        
        // Створити повідомлення
        await db.notification.create({
          data: {
            userId: payment.userId,
            type: 'PACKAGE_ACTIVATED',
            channel: 'EMAIL',
            subject: 'Pakiet został aktywowany',
            content: `Twój pakiet "${payment.userPackage.package.name}" został aktywowany. Masz ${payment.userPackage.creditsTotal} kredytów do wykorzystania.`,
            metadata: {
              paymentId: payment.id,
              packageId: payment.userPackage.packageId,
              orderId: webhookData.orderId
            },
            status: 'PENDING'
          }
        })
      }
      
      console.log('Payment verified and updated:', payment.id)
      return NextResponse.json({ status: 'OK' })
      
    } else {
      // Верифікація не вдалась
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          metadata: {
            ...payment.metadata as any,
            failureReason: 'Verification failed',
            orderId: webhookData.orderId
          }
        }
      })
      
      console.error('Payment verification failed:', payment.id)
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('P24 webhook error:', error)
    
    // Zwróć OK żeby P24 nie powtarzało webhooka
    return NextResponse.json({ status: 'OK' })
  }
}