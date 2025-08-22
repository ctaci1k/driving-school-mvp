// app/[locale]/layout.tsx

import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import React from 'react'

const locales = ['pl', 'uk', 'en', 'ru']

// ТІЛЬКИ ОДИН export default!
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <PWAInstallPrompt />
    </NextIntlClientProvider>
  )
}