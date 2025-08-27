// components/navigation/StudentHeader.tsx

'use client';

import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  Sun,
  Moon,
  Settings,
  ChevronDown,
  User,
  LogOut,
  CreditCard,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface StudentHeaderProps {
  user: any;
  locale: string;
}

export default function StudentHeader({ user, locale }: StudentHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const notifications = [
    {
      id: 1,
      title: 'Przypomnienie o lekcji',
      message: 'Masz lekcję jutro o 10:00',
      time: '5 min temu',
      read: false,
      type: 'reminder'
    },
    {
      id: 2,
      title: 'Płatność potwierdzona',
      message: 'Twoja płatność została przetworzona',
      time: '2 godz. temu',
      read: false,
      type: 'payment'
    },
    {
      id: 3,
      title: 'Nowa wiadomość',
      message: 'Instruktor Piotr Nowak wysłał wiadomość',
      time: '1 dzień temu',
      read: true,
      type: 'message'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj lekcji, instruktorów..."
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Powiadomienia</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-600">{unreadCount} nowe</span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100',
                        !notification.read && 'bg-blue-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'h-2 w-2 rounded-full mt-2',
                          !notification.read ? 'bg-blue-600' : 'bg-transparent'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200">
                  <Link
                    href={`/${locale}/student/notifications`}
                    className="block w-full text-center text-sm text-blue-600 hover:text-blue-500 py-2"
                  >
                    Zobacz wszystkie
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href={`/${locale}/student/profile`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <User className="h-4 w-4" />
                    Mój profil
                  </Link>
                  <Link
                    href={`/${locale}/student/payments`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <CreditCard className="h-4 w-4" />
                    Płatności
                  </Link>
                  <Link
                    href={`/${locale}/student/bookings`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Calendar className="h-4 w-4" />
                    Moje lekcje
                  </Link>
                  <Link
                    href={`/${locale}/student/profile/settings`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Settings className="h-4 w-4" />
                    Ustawienia
                  </Link>
                  <Link
                    href={`/${locale}/student/support`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Pomoc
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Wyloguj się
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}