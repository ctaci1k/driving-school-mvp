import '../globals.css'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ClientProviders from './client-providers'
import { getMessages } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Driving School Management System',
  description: 'Book your driving lessons online',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AutoSzkoła',
  },
}

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!['pl', 'en', 'uk', 'ru'].includes(locale)) {
    notFound()
  }

  // Використовуємо getMessages від next-intl
  const messages = await getMessages()
  const session = await getServerSession(authOptions)

  return (
    <div className={inter.className}>
      <ClientProviders session={session} locale={locale} messages={messages}>
        {children}
      </ClientProviders>
    </div>
  )
}