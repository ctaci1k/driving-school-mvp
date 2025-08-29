// app/[locale]/instructor/schedule/layout.tsx
// Layout для секції розкладу з Provider, SEO та Error Boundary

import { Metadata } from 'next'
import { ScheduleProvider } from './providers/ScheduleProvider'
import { ErrorBoundaryWrapper } from './components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'

// Metadata для SEO
export const metadata: Metadata = {
  title: 'Розклад інструктора - Панель керування',
  description: 'Керуйте своїм розкладом занять, бронюваннями курсантів та робочими годинами. Система для інструкторів з водіння.',
  keywords: [
    'розклад інструктора',
    'керування часом',
    'бронювання водіння',
    'автошкола',
    'інструктор',
    'графік занять'
  ],
  openGraph: {
    title: 'Розклад інструктора - Система керування',
    description: 'Професійна система керування розкладом для інструкторів з водіння',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Система Автошколи',
  },
  twitter: {
    card: 'summary',
    title: 'Розклад інструктора',
    description: 'Система керування часом для інструкторів з водіння',
  },
  robots: {
    index: false, // Не індексувати панель інструктора
    follow: false,
  },
  alternates: {
    languages: {
      'uk': '/uk/instructor/schedule',
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

// Об'єкт з перекладами для skip link
const skipLinkTranslations = {
  uk: 'Перейти до вмісту',
  pl: 'Przejdź do treści',
  en: 'Skip to content'
}

export default function ScheduleLayout({ 
  children, 
  params 
}: ScheduleLayoutProps) {
  const skipLinkText = skipLinkTranslations[params.locale as keyof typeof skipLinkTranslations] || skipLinkTranslations.uk
  
  return (
    <ErrorBoundaryWrapper locale={params.locale}>
      <ScheduleProvider locale={params.locale}>
        {/* Контейнер головний з адаптивним відступом */}
        <div className="min-h-screen bg-background">
          {/* Skip to content посилання для доступності */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
          >
            {skipLinkText}
          </a>
          
          {/* Головний вміст */}
          <main id="main-content" className="relative">
            {children}
          </main>
          
          {/* Toast повідомлення */}
          <Toaster />
        </div>
      </ScheduleProvider>
    </ErrorBoundaryWrapper>
  )
}