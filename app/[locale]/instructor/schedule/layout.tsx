// app/[locale]/instructor/schedule/layout.tsx
// Layout dla sekcji harmonogramu z Provider, SEO i Error Boundary

import { Metadata } from 'next'
import { ScheduleProvider } from './providers/ScheduleProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'

// Metadata dla SEO
export const metadata: Metadata = {
  title: 'Harmonogram Instruktora - Panel Zarządzania',
  description: 'Zarządzaj swoim harmonogramem zajęć, rezerwacjami kursantów i godzinami pracy. System dla instruktorów nauki jazdy.',
  keywords: [
    'harmonogram instruktora',
    'zarządzanie czasem',
    'rezerwacje jazdy',
    'szkoła jazdy',
    'instruktor',
    'grafik zajęć'
  ],
  openGraph: {
    title: 'Harmonogram Instruktora - System Zarządzania',
    description: 'Profesjonalny system zarządzania harmonogramem dla instruktorów nauki jazdy',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'System Szkoły Jazdy',
  },
  twitter: {
    card: 'summary',
    title: 'Harmonogram Instruktora',
    description: 'System zarządzania czasem dla instruktorów nauki jazdy',
  },
  robots: {
    index: false, // Nie indeksuj panelu instruktora
    follow: false,
  },
  alternates: {
    languages: {
      'pl': '/pl/instructor/schedule',
      'en': '/en/instructor/schedule',
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

interface ScheduleLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default function ScheduleLayout({ 
  children, 
  params 
}: ScheduleLayoutProps) {
  return (
    <ErrorBoundary>
      <ScheduleProvider locale={params.locale}>
        {/* Kontener główny z responsywnym paddingiem */}
        <div className="min-h-screen bg-background">
          {/* Skip to content link dla dostępności */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
          >
            Przejdź do treści
          </a>
          
          {/* Główna treść */}
          <main id="main-content" className="relative">
            {children}
          </main>
          
          {/* Toast notifications */}
          <Toaster />
        </div>
      </ScheduleProvider>
    </ErrorBoundary>
  )
}