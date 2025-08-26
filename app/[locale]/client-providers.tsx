'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { TRPCProvider } from '@/app/providers/trpc-provider'
import { AbstractIntlMessages } from 'next-intl'

interface ClientProvidersProps {
  children: React.ReactNode
  session: Session | null
  locale: string
  messages: AbstractIntlMessages
}

export default function ClientProviders({
  children,
  session,
  locale,
  messages
}: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages}
        timeZone="Europe/Warsaw"
      >
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}