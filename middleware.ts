// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['pl', 'uk', 'en']
const publicPages = [
  '/',
  '/auth/login',           // Змінено з /auth/login
  '/auth/register',        // Змінено з /auth/register
  '/auth/forgot-password', // Змінено з /auth/forgot-password
  '/auth/reset-password',  // Змінено з /auth/reset-password
  '/auth/verify',          // Змінено з /auth/verify
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy'
]

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'pl',
  localePrefix: 'always'
})

const authMiddleware = withAuth(
  function middleware(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname
        
        // Remove locale prefix for checking
        const pathnameWithoutLocale = locales.reduce((path, locale) => {
          return path.replace(`/${locale}`, '') || '/'
        }, pathname)
        
        // Check if it's a public page
        const isPublicPage = publicPages.some(page => 
          pathnameWithoutLocale === page || 
          pathnameWithoutLocale.startsWith(`${page}/`)
        )
        
        if (isPublicPage) {
          return true
        }
        
        // Require authentication for all other pages
        if (!token) {
          return false
        }
        
        // Role-based access control
        if (pathnameWithoutLocale.startsWith('/admin')) {
          return token.role === 'ADMIN'
        }
        
        if (pathnameWithoutLocale.startsWith('/instructor')) {
          return token.role === 'INSTRUCTOR' || token.role === 'ADMIN'
        }
        
        if (pathnameWithoutLocale.startsWith('/student')) {
          return token.role === 'STUDENT' || token.role === 'ADMIN'
        }
        
        return true
      }
    },
    pages: {
      signIn: '/auth/login',  // Змінено з /auth/login
      error: '/auth/error'    // Змінено з /auth/error
    }
  }
)

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Handle API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // Handle static files
  if (pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Check if pathname is missing locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  // Redirect to default locale if missing
  if (pathnameIsMissingLocale) {
    const locale = 'pl' // Default locale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, req.url)
    )
  }
  
  // Apply auth middleware for protected routes
  const locale = pathname.split('/')[1]
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  
  const isPublicPage = publicPages.some(page => 
    pathnameWithoutLocale === page || 
    pathnameWithoutLocale.startsWith(`${page}/`)
  )
  
  if (!isPublicPage) {
    return (authMiddleware as any)(req)
  }
  
  return intlMiddleware(req)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public|api).*)',
    '/',
    '/(pl|uk|en)/:path*'
  ]
}