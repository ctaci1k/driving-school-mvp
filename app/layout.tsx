// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { TRPCProvider } from '@/components/providers/trpc-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Driving School Management System',
  description: 'Book your driving lessons online',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ⬇️ додаємо ще й tailwind-класи прямо тут */}
      <body className={`${inter.className} bg-background text-foreground`}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
