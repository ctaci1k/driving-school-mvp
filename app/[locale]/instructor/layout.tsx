// app/[locale]/instructor/layout.tsx
// Instructor layout з перемикачем мов

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, CalendarCheck, Users, DollarSign,
  Car, MessageSquare, User, Settings, Bell, Menu, X,
  ChevronDown, LogOut, Shield, Sun, Moon, Search,
  Home, ChevronRight, Clock, Star, FileText, BookOpen,
  ClipboardCheck, UserCheck, TrendingUp, Globe, Check, Loader2
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface InstructorLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

interface Language {
  code: string
  name: string
  flag: string
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export default function InstructorLayout({ children, params }: InstructorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === params.locale) || AVAILABLE_LANGUAGES[0]

  const navigation = [
    { name: 'Panel główny', href: `/${params.locale}/instructor/dashboard`, icon: LayoutDashboard },
    { name: 'Harmonogram', href: `/${params.locale}/instructor/schedule`, icon: Calendar },
    { name: 'Lekcje', href: `/${params.locale}/instructor/lessons`, icon: CalendarCheck },
    { name: 'Dzisiejsze', href: `/${params.locale}/instructor/lessons/today`, icon: Clock },
    { name: 'Kursanci', href: `/${params.locale}/instructor/students`, icon: Users },
    { name: 'Zarobki', href: `/${params.locale}/instructor/earnings`, icon: DollarSign },
    { name: 'Pojazd', href: `/${params.locale}/instructor/vehicle`, icon: Car },
    { name: 'Wiadomości', href: `/${params.locale}/instructor/messages`, icon: MessageSquare },
    { name: 'Materiały', href: `/${params.locale}/instructor/resources`, icon: BookOpen },
    { name: 'Profil', href: `/${params.locale}/instructor/profile`, icon: User }
  ]

  const bottomNavigation = [
    { name: 'Dashboard', href: `/${params.locale}/instructor/dashboard`, icon: Home },
    { name: 'Dzisiaj', href: `/${params.locale}/instructor/lessons/today`, icon: Clock },
    { name: 'Lekcje', href: `/${params.locale}/instructor/lessons`, icon: CalendarCheck },
    { name: 'Kursanci', href: `/${params.locale}/instructor/students`, icon: Users },
    { name: 'Menu', action: 'menu', icon: Menu }
  ]

  const currentUser = {
    name: 'Piotr Nowak',
    email: 'piotr@szkola-jazdy.pl',
    avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
    role: 'Instruktor',
    rating: 4.9,
    todayLessons: 5,
    completedLessons: 3
  }

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nowa lekcja',
      message: 'Maria Kowalska zarezerwowała lekcję na jutro',
      time: '5 min temu',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Przypomnienie',
      message: 'Następna lekcja za 30 minut',
      time: '30 min temu',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Gratulacje!',
      message: 'Twój student zdał egzamin',
      time: '2 godz temu',
      read: true,
      type: 'success'
    }
  ])

  const unreadNotifications = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    setSidebarOpen(false)
    setUserMenuOpen(false)
    setNotificationsOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ name: string; href: string; current: boolean }> = []
    let path = ''

    const nameMap: { [key: string]: string } = {
      'dashboard': 'Panel główny',
      'schedule': 'Harmonogram',
      'availability': 'Dostępność',
      'exceptions': 'Wyjątki',
      'lessons': 'Lekcje',
      'today': 'Dzisiejsze',
      'check-in': 'Check-in',
      'students': 'Kursanci',
      'progress': 'Postępy',
      'feedback': 'Oceny',
      'earnings': 'Zarobki',
      'history': 'Historia',
      'details': 'Szczegóły',
      'vehicle': 'Pojazd',
      'inspection': 'Inspekcja',
      'report-issue': 'Zgłoś problem',
      'messages': 'Wiadomości',
      'resources': 'Materiały',
      'upload': 'Dodaj materiał',
      'profile': 'Profil',
      'documents': 'Dokumenty',
      'settings': 'Ustawienia'
    }

    parts.forEach((part, index) => {
      path += `/${part}`
      if (part !== params.locale && part !== 'instructor') {
        const name = nameMap[part] || part.charAt(0).toUpperCase() + part.slice(1)
        breadcrumbs.push({
          name: name,
          href: path,
          current: index === parts.length - 1
        })
      }
    })

    return breadcrumbs
  }

  const handleLanguageChange = (newLocale: string) => {
    setIsChangingLanguage(true)
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
    router.refresh()
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    setSearchOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - без змін */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href={`/${params.locale}/instructor/dashboard`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-white">SzkołaJazdy</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Portal Instruktora</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User stats */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-12 h-12 rounded-full border-2 border-green-500"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{currentUser.name}</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium dark:text-gray-300">{currentUser.rating}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">• {currentUser.role}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dzisiaj</p>
              <p className="font-semibold dark:text-white">{currentUser.completedLessons}/{currentUser.todayLessons} lekcji</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Następna</p>
              <p className="font-semibold text-green-600 dark:text-green-400">14:30</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Wiadomości' && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/${params.locale}/instructor/profile/settings`}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Ustawienia</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Wyloguj się</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header з перемикачем мов */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden lg:flex items-center gap-2 text-sm">
                <Link 
                  href={`/${params.locale}/instructor/dashboard`}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <Home className="w-4 h-4" />
                </Link>
                {getBreadcrumbs().map((crumb) => (
                  <React.Fragment key={crumb.href}>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {crumb.current ? (
                      <span className="font-medium text-gray-800 dark:text-white">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link 
                        href={crumb.href}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  {searchOpen ? (
                    <form onSubmit={handleSearch} className="absolute right-0 top-0 flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Szukaj..."
                        className="w-48 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setSearchOpen(true)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                </div>

                {/* Language Switcher - НОВЕ */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      disabled={isChangingLanguage}
                    >
                      {isChangingLanguage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
                      ) : (
                        <>
                          <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
                          </span>
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {AVAILABLE_LANGUAGES.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="cursor-pointer"
                        disabled={isChangingLanguage}
                      >
                        <span className="mr-2">{language.flag}</span>
                        <span className="flex-1">{language.name}</span>
                        {language.code === params.locale && (
                          <Check className="h-4 w-4 ml-2 text-green-600 dark:text-green-400" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Notifications - скорочено для місця */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {/* Notifications dropdown - без змін */}
                  {notificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        {/* Вміст повідомлень */}
                      </div>
                    </>
                  )}
                </div>

                {/* User menu - без змін */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation - без змін */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-5 h-16">
          {bottomNavigation.map((item) => {
            const Icon = item.icon
            const isCurrentActive = item.href && isActive(item.href)
            
            return item.action === 'menu' ? (
              <button
                key={item.name}
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href!}
                className={`flex flex-col items-center justify-center gap-1 text-xs ${
                  isCurrentActive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}