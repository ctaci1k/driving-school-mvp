'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, Calendar, BookOpen, Users, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export function SimpleNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Визначаємо роль по URL
  const isStudent = pathname.startsWith('/student-')
  const isInstructor = pathname.startsWith('/instructor-')
  const isAdmin = pathname.startsWith('/admin-')

  // Визначаємо текст ролі для відображення
  let roleText = ''
  if (isStudent) roleText = 'STUDENT'
  else if (isInstructor) roleText = 'INSTRUCTOR'
  else if (isAdmin) roleText = 'ADMIN'

  const navItems = []

  if (isStudent) {
    navItems.push(
      { href: '/student-dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      { href: '/student-book', label: 'Book Lesson', icon: <Calendar className="w-4 h-4" /> },
      { href: '/student-bookings', label: 'My Bookings', icon: <BookOpen className="w-4 h-4" /> }
    )
  } else if (isInstructor) {
    navItems.push(
      { href: '/instructor-dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      { href: '/instructor-schedule', label: 'My Schedule', icon: <Calendar className="w-4 h-4" /> },
      { href: '/instructor-students', label: 'My Students', icon: <Users className="w-4 h-4" /> }
    )
  } else if (isAdmin) {
    navItems.push(
      { href: '/admin-dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      { href: '/admin-users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
      { href: '/admin-bookings', label: 'All Bookings', icon: <BookOpen className="w-4 h-4" /> }
    )
  }

  if (navItems.length === 0) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              DrivingSchool
            </Link>
            
            <div className="hidden md:flex items-center space-x-4 ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Показуємо роль користувача */}
            {roleText && (
              <span className="text-sm text-gray-600">
                Role: <span className="font-medium">{roleText}</span>
              </span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-2 border-t">
            {/* Показуємо роль в мобільному меню */}
            {roleText && (
              <div className="px-3 py-2 text-sm text-gray-600 border-b">
                Role: <span className="font-medium">{roleText}</span>
              </div>
            )}
            
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full justify-start mt-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}