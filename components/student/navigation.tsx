// components/student/navigation.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  Home,
  Calendar,
  TrendingUp,
  CreditCard,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  BookOpen,
  Car,
  DollarSign,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc/client'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
  children?: NavigationItem[]
}

export default function StudentNavigation({ locale }: { locale: string }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('student.navigation')
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  // Get unread notifications count
  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery()
  
  // Toggle dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Navigation items
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: `/${locale}/student/dashboard`,
      icon: Home,
    },
    {
      name: 'Rezerwacje',
      href: `/${locale}/student/booking`,
      icon: Calendar,
      children: [
        {
          name: 'Nowa rezerwacja',
          href: `/${locale}/student/booking/new`,
          icon: ChevronRight,
        },
        {
          name: 'Moje rezerwacje',
          href: `/${locale}/student/booking/my`,
          icon: ChevronRight,
        },
        {
          name: 'Kalendarz',
          href: `/${locale}/student/booking/calendar`,
          icon: ChevronRight,
        },
      ]
    },
    {
      name: 'Postęp nauki',
      href: `/${locale}/student/progress`,
      icon: TrendingUp,
    },
    {
      name: 'Płatności',
      href: `/${locale}/student/payments`,
      icon: CreditCard,
      children: [
        {
          name: 'Pakiety',
          href: `/${locale}/student/payments/packages`,
          icon: ChevronRight,
        },
        {
          name: 'Moje kredyty',
          href: `/${locale}/student/payments/credits`,
          icon: ChevronRight,
        },
        {
          name: 'Historia',
          href: `/${locale}/student/payments/history`,
          icon: ChevronRight,
        },
      ]
    },
    {
      name: 'Profil',
      href: `/${locale}/student/profile`,
      icon: User,
    },
  ]
  
  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}/login` })
  }
  
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">AutoSzkoła</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-5 h-5" />
              {unreadCount && unreadCount.count > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                  {unreadCount.count}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar - Desktop */}
      <div className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen ? (
            <>
              <Link href={`/${locale}/student/dashboard`} className="flex items-center gap-2">
                <Car className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-xl">AutoSzkoła</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mx-auto p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {/* User Info */}
        {session?.user && (
          <div className={cn(
            "px-4 py-3 border-b border-gray-200 dark:border-gray-700",
            !isSidebarOpen && "px-2"
          )}>
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedItems.includes(item.name) && "rotate-180"
                          )}
                        />
                      )}
                    </button>
                    {isSidebarOpen && expandedItems.includes(item.name) && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              )}
                            >
                              <child.icon className="w-4 h-4" />
                              <span>{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isSidebarOpen && <span>{isDarkMode ? 'Jasny motyw' : 'Ciemny motyw'}</span>}
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Wyloguj</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white dark:bg-gray-800">
            {/* Mobile sidebar content - same as desktop */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
              <Link href={`/${locale}/student/dashboard`} className="flex items-center gap-2">
                <Car className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-xl">AutoSzkoła</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Info */}
            {session?.user && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown 
                            className={cn(
                              "w-4 h-4 transition-transform",
                              expandedItems.includes(item.name) && "rotate-180"
                            )}
                          />
                        </button>
                        {expandedItems.includes(item.name) && (
                          <ul className="mt-1 ml-8 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                    isActive(child.href)
                                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  )}
                                >
                                  <child.icon className="w-4 h-4" />
                                  <span>{child.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  )
}