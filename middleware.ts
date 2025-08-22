// middleware.ts - оновлена версія

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['pl', 'uk', 'en', 'ru']
const defaultLocale = 'pl'

// Створюємо next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// Функція для отримання dashboard path по ролі
function getDashboardPath(role: string): string {
  switch(role) {
    case 'STUDENT': return '/student-dashboard'
    case 'INSTRUCTOR': return '/instructor-dashboard'
    case 'ADMIN': return '/admin-dashboard'
    default: return '/dashboard'
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Спочатку обробляємо статичні файли та API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Перевіряємо чи є локаль в URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Отримуємо токен для перевірки автентифікації
  const token = await getToken({ req: request })
  const isAuth = !!token

  // НОВЕ: Якщо користувач залогінений і немає локалі в URL
  if (!pathnameHasLocale) {
    // Спробуємо отримати збережену мову з cookie
    const savedLocale = request.cookies.get('user-locale')?.value
    
    if (savedLocale && locales.includes(savedLocale)) {
      // Використовуємо збережену мову
      const url = new URL(`/${savedLocale}${pathname}`, request.url)
      return NextResponse.redirect(url)
    }
    
    // Інакше використовуємо стандартний intl middleware
    return intlMiddleware(request)
  }

  // Отримуємо поточну локаль
  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || defaultLocale
  
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
  
  // Перевірка auth сторінок
  const isAuthPage = pathWithoutLocale.startsWith('/login') || 
                     pathWithoutLocale.startsWith('/register')

  if (isAuthPage) {
    if (isAuth) {
      const userRole = token.role as string
      const dashboardPath = getDashboardPath(userRole)
      return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url))
    }
    return intlMiddleware(request)
  }

  // Якщо це /dashboard, редіректимо на правильний
  if (pathWithoutLocale === '/dashboard' && isAuth) {
    const userRole = token.role as string
    const dashboardPath = getDashboardPath(userRole)
    
    if (dashboardPath !== '/dashboard') {
      return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url))
    }
  }

  // Публічні сторінки
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    return intlMiddleware(request)
  }

  // Перевірка автентифікації
  if (!isAuth) {
    const from = pathname + (request.nextUrl.search || '')
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  // Перевірка ролей
  const userRole = token.role as string

  if (pathWithoutLocale.startsWith('/student-')) {
    if (userRole !== 'STUDENT' && userRole !== 'ADMIN') {
      const dashboardPath = getDashboardPath(userRole)
      return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url))
    }
  }

  if (pathWithoutLocale.startsWith('/instructor-')) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      const dashboardPath = getDashboardPath(userRole)
      return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url))
    }
  }

  if (pathWithoutLocale.startsWith('/admin-') || pathWithoutLocale.startsWith('/settings')) {
    if (userRole !== 'ADMIN' && pathWithoutLocale !== '/settings') {
      const dashboardPath = getDashboardPath(userRole)
      return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url))
    }
  }

  // Якщо всі перевірки пройдені, використовуємо intl middleware
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
}