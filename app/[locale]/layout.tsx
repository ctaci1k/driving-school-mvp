// app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/session-provider'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ClientThemeProvider } from '@/components/client-theme-provider'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <TRPCProvider>
          <SessionProvider>
            <NextIntlClientProvider messages={messages}>
              <ClientThemeProvider>
                {children}
                <Toaster />
              </ClientThemeProvider>
            </NextIntlClientProvider>
          </SessionProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}