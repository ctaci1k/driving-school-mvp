// File: /app/(student)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Calendar, CalendarPlus, CreditCard, MessageSquare, 
  BookOpen, TrendingUp, Bell, Moon, Sun, Menu, X, 
  ChevronDown, User, Settings, LogOut, HelpCircle,
  Car, Coins, Clock, Star, Shield, Users, ChevronRight
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [creditsMenuOpen, setCreditsMenuOpen] = useState(false);



useEffect(() => {
  // Завантажуємо тему при старті
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  }
}, []);


  // Mock user data
  const user = {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
    role: 'Student',
    credits: 12,
    nextLesson: {
      date: '26.08.2024',
      time: '14:00',
      instructor: 'Piotr Nowak'
    }
  };

  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: Home,
      badge: null
    },
    {
      name: 'Zarezerwuj lekcję',
      href: '/student/booking',
      icon: CalendarPlus,
      badge: null
    },
    {
      name: 'Mój kalendarz',
      href: '/student/calendar',
      icon: Calendar,
      badge: null
    },
    {
      name: 'Postępy',
      href: '/student/progress',
      icon: TrendingUp,
      badge: null
    },
    {
      name: 'Płatności',
      href: '/student/payments',
      icon: CreditCard,
      badge: null
    },
    {
      name: 'Wiadomości',
      href: '/student/messages',
      icon: MessageSquare,
      badge: 2
    },
    {
      name: 'Materiały',
      href: '/student/resources',
      icon: BookOpen,
      badge: 'NEW'
    }
  ];

  // Quick stats for mobile
  const quickStats = [
    { label: 'Kredyty', value: user.credits, icon: Coins, color: 'text-green-600' },
    { label: 'Następna lekcja', value: user.nextLesson.time, icon: Clock, color: 'text-blue-600' },
    { label: 'Ocena', value: '4.8', icon: Star, color: 'text-yellow-600' }
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
      if (!target.closest('.credits-menu')) {
        setCreditsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href="/student/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:block">AutoSzkoła</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 ml-8">
              {navigationItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        typeof item.badge === 'number' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Credits Display */}
            <div className="credits-menu relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreditsMenuOpen(!creditsMenuOpen);
                }}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Coins className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">{user.credits}</span>
                <ChevronDown className="w-3 h-3 text-green-600" />
              </button>

              {creditsMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">Twoje kredyty</p>
                    <p className="text-2xl font-bold text-green-600">{user.credits} dostępnych</p>
                  </div>
                  <Link
                    href="/student/payments"
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Kup więcej kredytów</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/student/payments#history"
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Historia kredytów</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* User Menu */}
            <div className="user-menu relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center space-x-3 pl-3 border-l border-gray-200"
              >
                <img src={user.avatar} className="w-9 h-9 rounded-full" alt="User" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/student/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Mój profil</span>
                  </Link>
                  <Link
                    href="/student/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Ustawienia</span>
                  </Link>
                  <Link
                    href="/student/help"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Pomoc</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100">
                    <LogOut className="w-4 h-4" />
                    <span>Wyloguj się</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setMobileMenuOpen(false)} />
      
      <aside className={`fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-gray-200 z-40 transform transition-transform lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
            <img src={user.avatar} className="w-12 h-12 rounded-full" alt="User" />
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                      typeof item.badge === 'number' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Link
              href="/student/help"
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Pomoc</span>
            </Link>
            <button className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Wyloguj się</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform hidden lg:block ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 h-full flex flex-col">
          {/* Next Lesson Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">Następna lekcja</span>
            </div>
            <p className="text-lg font-bold">{user.nextLesson.date}</p>
            <p className="text-sm opacity-90">{user.nextLesson.time} • {user.nextLesson.instructor}</p>
            <Link
              href="/student/calendar"
              className="mt-3 block w-full py-1.5 bg-white text-blue-600 text-center text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Zobacz szczegóły
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                      typeof item.badge === 'number' 
                        ? isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                        : isActive ? 'bg-white text-blue-600' : 'bg-green-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Promo Box */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Poleć znajomego!</span>
            </div>
            <p className="text-xs mb-3 opacity-90">Otrzymaj darmową lekcję za każde polecenie</p>
            <button className="w-full bg-white text-orange-600 text-sm font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 min-h-[calc(100vh-64px)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 relative ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name.split(' ')[0]}</span>
                {item.badge && typeof item.badge === 'number' && (
                  <span className="absolute top-1 right-4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}