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
  FileText,
  TrendingUp
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function Navigation({ userRole }: { userRole?: string }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const params = useParams()
  const locale = params.locale as string
  
  // Додаємо переклади
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')
  const tUser = useTranslations('user')
  
  const isActive = (path: string) => pathname === path

  const studentLinks = [
    { href: `/${locale}/student/dashboard`, label: t('dashboard'), icon: Home },
    { href: `/${locale}/student/book`, label: t('bookLesson'), icon: Calendar },
    { href: `/${locale}/student/bookings`, label: t('myBookings'), icon: FileText },
    { href: `/${locale}/student/reports`, label: t('myReports'), icon: TrendingUp },
    { href: `/${locale}/packages`, label: t('packages'), icon: Package },
    { href: `/${locale}/payments`, label: t('payments'), icon: CreditCard },
  ]

  const instructorLinks = [
    { href: `/${locale}/instructor-dashboard`, label: t('dashboard'), icon: Home },
    { href: `/${locale}/instructor-schedule`, label: t('schedule'), icon: Calendar },
    { href: `/${locale}/instructor-students`, label: t('students'), icon: Users },
    { href: `/${locale}/instructor-reports`, label: t('myReports'), icon: TrendingUp },
  ]

  const adminLinks = [
    { href: `/${locale}/admin-dashboard`, label: t('dashboard'), icon: Home },
    { href: `/${locale}/admin-bookings`, label: t('allBookings'), icon: Calendar },
    { href: `/${locale}/admin-users`, label: t('users'), icon: Users },
    { href: `/${locale}/admin-vehicles`, label: t('vehicles'), icon: Car },
    { href: `/${locale}/admin-reports`, label: t('reports'), icon: TrendingUp },
    { href: `/${locale}/packages-admin`, label: t('packages'), icon: Package },
    { href: `/${locale}/settings`, label: t('settings'), icon: Settings },
  ]

  const links = 
    userRole === 'ADMIN' ? adminLinks :
    userRole === 'INSTRUCTOR' ? instructorLinks :
    studentLinks

  // Функція для отримання назви ролі
  const getRoleName = (role: string) => {
    switch(role) {
      case 'STUDENT': return tUser('role.student')
      case 'INSTRUCTOR': return tUser('role.instructor')
      case 'ADMIN': return tUser('role.admin')
      default: return role
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={`/${locale}/dashboard`} className="text-xl font-bold text-blue-600">
              {tCommon('appName')}
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
                  <p className="text-gray-500 text-xs">{getRoleName(userRole || '')}</p>
                </div>
                
                <LanguageSwitcher currentLocale={locale} />
                
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  {tCommon('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}