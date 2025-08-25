// components/student/student-sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Car,
  Trophy,
  Package,
  CreditCard,
  FileText,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Target,
  BarChart3,
  MessageSquare,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StudentSidebarProps {
  locale: string
  user: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

const navigationItems = [
  {
    title: 'Główne',
    items: [
      { 
        href: '/dashboard', 
        label: 'Dashboard', 
        icon: Home,
        description: 'Przegląd postępów'
      },
      { 
        href: '/book', 
        label: 'Zarezerwuj lekcję', 
        icon: Calendar,
        description: 'Nowa rezerwacja'
      },
      { 
        href: '/bookings', 
        label: 'Moje rezerwacje', 
        icon: FileText,
        description: 'Historia lekcji'
      }
    ]
  },
  {
    title: 'Nauka',
    items: [
      { 
        href: '/theory-classes', 
        label: 'Zajęcia teoretyczne', 
        icon: BookOpen,
        description: 'Teoria jazdy'
      },
      { 
        href: '/exams', 
        label: 'Egzaminy', 
        icon: GraduationCap,
        description: 'Testy i egzaminy'
      },
      { 
        href: '/progress', 
        label: 'Mój postęp', 
        icon: BarChart3,
        description: 'Umiejętności'
      },
      { 
        href: '/achievements', 
        label: 'Osiągnięcia', 
        icon: Trophy,
        description: 'Odznaki i nagrody'
      }
    ]
  },
  {
    title: 'Płatności',
    items: [
      { 
        href: '/packages', 
        label: 'Pakiety', 
        icon: Package,
        description: 'Kup kredyty'
      },
      { 
        href: '/payments', 
        label: 'Płatności', 
        icon: CreditCard,
        description: 'Historia płatności'
      }
    ]
  },
  {
    title: 'Konto',
    items: [
      { 
        href: '/profile', 
        label: 'Profil', 
        icon: User,
        description: 'Dane osobowe'
      },
      { 
        href: '/messages', 
        label: 'Wiadomości', 
        icon: MessageSquare,
        description: 'Komunikacja',
        badge: '3'
      },
      { 
        href: '/help', 
        label: 'Pomoc', 
        icon: HelpCircle,
        description: 'FAQ i wsparcie'
      }
    ]
  }
]

export function StudentSidebar({ locale, user }: StudentSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    const fullPath = `/${locale}/student${href}`
    return pathname === fullPath || pathname.startsWith(fullPath + '/')
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AutoSzkoła</h2>
            <p className="text-xs text-gray-500">Panel Ucznia</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}/student${item.href}`}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${active 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className={`
                      flex-shrink-0 w-5 h-5 mr-3
                      ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-t bg-gray-50">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Ukończone lekcje:</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Postęp:</span>
            <span className="font-medium text-blue-600">68%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </Button>
      </div>
    </div>
  )
}