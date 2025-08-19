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

  // Role-based access control для специфічних шляхів
  const userRole = token.role as string
  const path = request.nextUrl.pathname

  // Студенти можуть доступитись до /book, /bookings
  if ((path === '/book' || path === '/bookings') && userRole !== 'STUDENT' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Інструктори можуть доступитись до /schedule, /students
  if ((path === '/schedule' || path === '/students') && userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Тільки адміни можуть доступитись до /users та адмін /bookings
  if (path === '/users' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/book',
    '/bookings', 
    '/schedule',
    '/students',
    '/users',
  ],
}