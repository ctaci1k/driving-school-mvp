// app/[locale]/instructor/layout.tsx
// Основний layout для інструкторського порталу з навігацією та mobile-first дизайном

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Calendar, CalendarCheck, Users, DollarSign, 
  Car, MessageSquare, User, Menu, X, Bell, LogOut,
  Clock, Star, TrendingUp, MapPin, Settings, FileText,
  ChevronLeft, Plus, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface InstructorLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function InstructorLayout({ children, params: { locale } }: InstructorLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(3)
  const [nextLessonTime, setNextLessonTime] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  // Mock instructor data
  const instructor = {
    id: '1',
    name: 'Петро Водій',
    email: 'petro@autoshkola.ua',
    avatar: 'https://ui-avatars.com/api/?name=Petro+Vodiy&background=10B981&color=fff',
    rating: 4.9,
    todayEarnings: 1850,
    todayLessons: 5,
    completedLessons: 3
  }

  // Navigation items
  const navigation = [
    { 
      name: 'Головна', 
      href: `/${locale}/instructor/dashboard`, 
      icon: Home,
      badge: null 
    },
    { 
      name: 'Сьогодні', 
      href: `/${locale}/instructor/today`, 
      icon: CalendarCheck,
      badge: `${5 - instructor.completedLessons}` 
    },
    { 
      name: 'Розклад', 
      href: `/${locale}/instructor/schedule`, 
      icon: Calendar,
      badge: null 
    },
    { 
      name: 'Студенти', 
      href: `/${locale}/instructor/students`, 
      icon: Users,
      badge: '15' 
    },
    { 
      name: 'Заробіток', 
      href: `/${locale}/instructor/earnings`, 
      icon: DollarSign,
      badge: null 
    },
    { 
      name: 'Авто', 
      href: `/${locale}/instructor/vehicle`, 
      icon: Car,
      badge: null 
    },
    { 
      name: 'Повідомлення', 
      href: `/${locale}/instructor/messages`, 
      icon: MessageSquare,
      badge: unreadMessages > 0 ? String(unreadMessages) : null 
    },
    { 
      name: 'Профіль', 
      href: `/${locale}/instructor/profile`, 
      icon: User,
      badge: null 
    }
  ]

  // Mobile bottom navigation (most used)
  const bottomNavigation = [
    { name: 'Головна', href: `/${locale}/instructor/dashboard`, icon: Home },
    { name: 'Сьогодні', href: `/${locale}/instructor/today`, icon: CalendarCheck },
    { name: 'Check-in', href: `/${locale}/instructor/check-in`, icon: Plus },
    { name: 'Студенти', href: `/${locale}/instructor/students`, icon: Users },
    { name: 'Ще', href: '#', icon: Menu, action: 'menu' }
  ]

  // Update next lesson timer
  useEffect(() => {
    const timer = setInterval(() => {
      const next = new Date()
      next.setHours(14, 30, 0) // Mock next lesson at 14:30
      const now = new Date()
      const diff = next.getTime() - now.getTime()
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setNextLessonTime(`${hours}г ${minutes}хв`)
      } else {
        setNextLessonTime('Зараз')
      }
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const isActive = (href: string) => {
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">АвтоШкола</span>
            </div>
            <Badge variant={isOnline ? 'success' : 'secondary'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Instructor info */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={instructor.avatar} />
                <AvatarFallback>ПВ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{instructor.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{instructor.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/20 rounded-lg p-2">
                <p className="opacity-90">Сьогодні</p>
                <p className="font-semibold">₴{instructor.todayEarnings}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <p className="opacity-90">Занять</p>
                <p className="font-semibold">{instructor.completedLessons}/{instructor.todayLessons}</p>
              </div>
            </div>
          </div>

          {/* Next lesson alert */}
          {nextLessonTime && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Наступне заняття
                  </span>
                </div>
                <span className="text-sm font-bold text-yellow-600">
                  {nextLessonTime}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${isActive(item.href)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                        {item.badge && (
                          <Badge 
                            variant={isActive(item.href) ? 'default' : 'secondary'}
                            className="ml-auto"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Bottom section */}
              <li className="mt-auto">
                <Link
                  href={`/${locale}/instructor/settings`}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <Settings className="h-6 w-6 shrink-0" />
                  Налаштування
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Меню</SheetTitle>
            </SheetHeader>
            <nav className="mt-6">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                        ${isActive(item.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Інструктор</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={instructor.avatar} />
                    <AvatarFallback>ПВ</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Мій акаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Профіль
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Налаштування
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Вийти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.action === 'menu' ? '#' : item.href}
              onClick={(e) => {
                if (item.action === 'menu') {
                  e.preventDefault()
                  setIsMobileMenuOpen(true)
                }
              }}
              className={`
                flex flex-col items-center justify-center gap-1 text-xs
                ${isActive(item.href) ? 'text-blue-600' : 'text-gray-600'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}