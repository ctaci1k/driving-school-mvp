import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return null
  }

  if (!isAuth) {
    let from = request.nextUrl.pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  const userRole = token.role as string
  const path = request.nextUrl.pathname

  // Student routes
  if (path.startsWith('/student-')) {
    if (userRole !== 'STUDENT' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Instructor routes
  if (path.startsWith('/instructor-')) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Admin routes
  if (path.startsWith('/admin-')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/student-dashboard',
    '/student-book',
    '/student-bookings',
    '/instructor-dashboard',
    '/instructor-schedule',
    '/instructor-students',
    '/admin-dashboard',
    '/admin-users',
    '/admin-bookings',
  ],
}