// app/not-found.tsx
'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('common.notFound')
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-4 text-xl text-gray-600">{t('description')}</p>
        <Link 
          href="/uk" 
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  )
}