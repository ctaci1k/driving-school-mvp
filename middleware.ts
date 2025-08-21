// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './lib/i18n/config'

// Створюємо next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export async function middleware(request: NextRequest) {
  // Спочатку обробляємо i18n
  const pathname = request.nextUrl.pathname
  
  // Перевіряємо чи це не API або статичні файли
  const shouldHandleLocale = !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/_vercel') &&
    !pathname.includes('.') // статичні файли
  
  if (!shouldHandleLocale) {
    return NextResponse.next()
  }

  // Визначаємо поточну локаль
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  // Якщо немає локалі в URL, додаємо її
  if (!pathnameHasLocale) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  // Тепер обробляємо автентифікацію
  const token = await getToken({ req: request })
  const isAuth = !!token
  
  // Отримуємо шлях без локалі для перевірки
  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
  
  const isAuthPage = pathWithoutLocale.startsWith('/login') || 
                     pathWithoutLocale.startsWith('/register')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
    }
    return intlMiddleware(request)
  }

  // Публічні сторінки, які не потребують автентифікації
  const publicPages = ['/', '/about', '/contact', '/pricing']
  if (publicPages.includes(pathWithoutLocale)) {
    return intlMiddleware(request)
  }

  // Перевірка автентифікації для захищених маршрутів
  if (!isAuth) {
    let from = pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/${currentLocale}/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  // Перевірка ролей
  const userRole = token.role as string

  // Student routes
  if (pathWithoutLocale.startsWith('/student-')) {
    if (userRole !== 'STUDENT' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
    }
  }

  // Instructor routes
  if (pathWithoutLocale.startsWith('/instructor-')) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
    }
  }

  // Admin routes
  if (pathWithoutLocale.startsWith('/admin-') || pathWithoutLocale.startsWith('/vehicles')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
    }
  }

  // Якщо всі перевірки пройшли, застосовуємо intl middleware
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Виключаємо API та статичні файли
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Включаємо всі маршрути
    '/',
    '/(pl|uk|en|ru)/:path*',
  ]
}