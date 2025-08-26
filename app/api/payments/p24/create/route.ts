// app/api/payments/p24/create/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { p24Client, formatAmountToGrosze, generateSessionId } from '@/lib/payment/p24-client'
import { z } from 'zod'

const CreatePaymentSchema = z.object({
  bookingId: z.string().optional(),
  packageId: z.string().optional(),
  amount: z.number().positive(),
  description: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = CreatePaymentSchema.parse(body)

    // Get user details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate session ID
    const sessionId = generateSessionId()

    // Create payment record in database
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        bookingId: data.bookingId,
        amount: data.amount,
        currency: 'PLN',
        status: 'PENDING',
        method: 'P24',
        p24SessionId: sessionId,
        description: data.description,
        metadata: {
          packageId: data.packageId,
          timestamp: new Date().toISOString(),
        },
      },
    })

    // Prepare P24 transaction
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const transaction = await p24Client.registerTransaction({
      sessionId,
      amount: formatAmountToGrosze(data.amount),
      currency: 'PLN',
      description: data.description,
      email: user.email,
      client: `${user.firstName} ${user.lastName}`,
      phone: user.phone || undefined,
      address: user.address || undefined,
      zip: user.postalCode || undefined,
      city: user.city || undefined,
      country: 'PL',
      language: user.language === 'pl' ? 'pl' : 'en',
urlReturn: `${baseUrl}/pl/payments/return?sessionId=${sessionId}`,
urlStatus: `${baseUrl}/api/webhooks/p24`,
      timeLimit: 15,
    })

    // Update payment with P24 token
    await db.payment.update({
      where: { id: payment.id },
      data: { p24Token: transaction.token },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      sessionId,
      redirectUrl: transaction.redirectUrl,
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    )
  }
}
