// components/layouts/navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Home, 
  Calendar, 
  Car, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  CreditCard,
  FileText
} from 'lucide-react'

export function Navigation({ userRole }: { userRole?: string }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  const isActive = (path: string) => pathname === path

  const studentLinks = [
    { href: '/student-dashboard', label: 'Панель', icon: Home },
    { href: '/student-book', label: 'Забронювати урок', icon: Calendar },
    { href: '/student-bookings', label: 'Мої бронювання', icon: FileText },
    { href: '/packages', label: 'Пакети', icon: Package },
    { href: '/payments', label: 'Платежі', icon: CreditCard },
  ]

  const instructorLinks = [
    { href: '/instructor-dashboard', label: 'Панель', icon: Home },
    { href: '/instructor-schedule', label: 'Розклад', icon: Calendar },
    { href: '/instructor-students', label: 'Студенти', icon: Users },
  ]

  const adminLinks = [
    { href: '/admin-dashboard', label: 'Панель', icon: Home },
    { href: '/admin-bookings', label: 'Всі бронювання', icon: Calendar },
    { href: '/admin-users', label: 'Користувачі', icon: Users },
    { href: '/admin-vehicles', label: 'Автомобілі', icon: Car },
    { href: '/packages-admin', label: 'Управління пакетами', icon: Package },
    { href: '/reports', label: 'Звіти', icon: FileText },
    { href: '/settings', label: 'Налаштування', icon: Settings },
  ]

  const links = 
    userRole === 'ADMIN' ? adminLinks :
    userRole === 'INSTRUCTOR' ? instructorLinks :
    studentLinks

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Автошкола
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-right">
                  <p className="font-medium">{session.user.email}</p>
                  <p className="text-gray-500 text-xs">{userRole}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Вийти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}