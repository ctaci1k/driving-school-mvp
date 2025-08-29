// app/[locale]/student/layout.tsx
// Student layout як клієнтський компонент (аналогічно admin та instructor)

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard, Calendar, BookOpen, CreditCard, User,
  MessageSquare, Settings, Bell, Menu, X, ChevronDown,
  LogOut, Sun, Moon, Search, Home, ChevronRight,
  GraduationCap, Clock, Target, FileText, HelpCircle,
  Globe, Check, Loader2
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StudentLayoutProps {
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

export default function StudentLayout({ children, params }: StudentLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('student.studentLayout')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === params.locale) || AVAILABLE_LANGUAGES[0]

  const navigation = [
    { name: t('navigation.dashboard'), href: `/${params.locale}/student/dashboard`, icon: LayoutDashboard },
    { name: t('navigation.myLessons'), href: `/${params.locale}/student/lessons`, icon: Calendar },
    { name: t('navigation.booking'), href: `/${params.locale}/student/bookings`, icon: Clock },
    { name: t('navigation.progress'), href: `/${params.locale}/student/progress`, icon: Target },
    { name: t('navigation.materials'), href: `/${params.locale}/student/materials`, icon: BookOpen },
    { name: t('navigation.payments'), href: `/${params.locale}/student/payments`, icon: CreditCard },
    { name: t('navigation.documents'), href: `/${params.locale}/student/documents`, icon: FileText },
    { name: t('navigation.messages'), href: `/${params.locale}/student/messages`, icon: MessageSquare },
    { name: t('navigation.help'), href: `/${params.locale}/student/help`, icon: HelpCircle },
    { name: t('navigation.profile'), href: `/${params.locale}/student/profile`, icon: User }
  ]

  const bottomNavigation = [
    { name: t('bottomNav.home'), href: `/${params.locale}/student/dashboard`, icon: Home },
    { name: t('bottomNav.lessons'), href: `/${params.locale}/student/lessons`, icon: Calendar },
    { name: t('bottomNav.book'), href: `/${params.locale}/student/bookings`, icon: Clock },
    { name: t('bottomNav.progress'), href: `/${params.locale}/student/progress`, icon: Target },
    { name: t('bottomNav.menu'), action: 'menu', icon: Menu }
  ]

  const currentUser = {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
    role: t('role'),
    lessonsCompleted: 12,
    lessonsTotal: 30,
    nextLesson: '15 грудня, 14:00'
  }

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: t('notifications.nextLesson.title'),
      message: t('notifications.nextLesson.message'),
      time: t('notifications.timeAgo.minutes', {count: 10}),
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: t('notifications.newMaterials.title'),
      message: t('notifications.newMaterials.message'),
      time: t('notifications.timeAgo.hours', {count: 1}),
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: t('notifications.paymentReminder.title'),
      message: t('notifications.paymentReminder.message'),
      time: t('notifications.timeAgo.days', {count: 2}),
      read: true,
      type: 'warning'
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
  }, [pathname])

  const isActive = (href: string) => pathname === href

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ name: string; href: string; current: boolean }> = []
    let path = ''

    parts.forEach((part, index) => {
      path += `/${part}`
      if (part !== params.locale && part !== 'student') {
        breadcrumbs.push({
          name: part.charAt(0).toUpperCase() + part.slice(1),
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href={`/${params.locale}/student/dashboard`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-white">DenisDrive</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('portal')}</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User progress */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('courseProgress')}</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {currentUser.lessonsCompleted}/{currentUser.lessonsTotal} {t('lessons')}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentUser.lessonsCompleted / currentUser.lessonsTotal) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('nextLesson')}</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {currentUser.nextLesson}
            </p>
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
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === t('navigation.messages') && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/${params.locale}/student/settings`}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{t('navigation.settings')}</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">{t('userMenu.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
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
                  href={`/${params.locale}/student/dashboard`}
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
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Language Switcher */}
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
                          <Check className="h-4 w-4 ml-2 text-blue-600 dark:text-blue-400" />
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

                {/* Notifications */}
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

                  {notificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{t('notifications.title')}</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <p className="font-medium text-gray-800 dark:text-white text-sm">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User menu */}
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

                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentUser.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentUser.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <Link 
                            href={`/${params.locale}/student/profile`} 
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-sm">{t('navigation.profile')}</span>
                          </Link>
                          <Link 
                            href={`/${params.locale}/student/progress`}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Target className="w-4 h-4" />
                            <span className="text-sm">{t('userMenu.myProgress')}</span>
                          </Link>
                          <Link 
                            href={`/${params.locale}/student/documents`}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{t('navigation.documents')}</span>
                          </Link>
                          <Link 
                            href={`/${params.locale}/student/settings`} 
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">{t('navigation.settings')}</span>
                          </Link>
                        </div>
                        <div className="p-1 border-t border-gray-200 dark:border-gray-700">
                          <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">{t('userMenu.logout')}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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

      {/* Mobile bottom navigation */}
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
                    ? 'text-blue-600 dark:text-blue-400' 
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