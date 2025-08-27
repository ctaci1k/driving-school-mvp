// components/navigation/StudentMobileNav.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays,
  TrendingUp, 
  CreditCard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  User,
  HeadphonesIcon,
  LogOut,
  Menu,
  X,
  Car,
  Bell,
  Search
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface StudentMobileNavProps {
  locale: string;
  user: any;
}

export default function StudentMobileNav({ locale, user }: StudentMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Panel główny',
      href: `/${locale}/student/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: 'Rezerwacje',
      href: `/${locale}/student/bookings`,
      icon: Calendar,
      badge: 2,
    },
    {
      name: 'Harmonogram',
      href: `/${locale}/student/schedule`,
      icon: CalendarDays,
    },
    {
      name: 'Mój postęp',
      href: `/${locale}/student/progress`,
      icon: TrendingUp,
    },
    {
      name: 'Płatności',
      href: `/${locale}/student/payments`,
      icon: CreditCard,
    },
    {
      name: 'Instruktorzy',
      href: `/${locale}/student/instructors`,
      icon: Users,
    },
    {
      name: 'Teoria',
      href: `/${locale}/student/theory`,
      icon: BookOpen,
    },
    {
      name: 'Wiadomości',
      href: `/${locale}/student/messages`,
      icon: MessageSquare,
      badge: 3,
    },
    {
      name: 'Dokumenty',
      href: `/${locale}/student/documents`,
      icon: FileText,
    },
    {
      name: 'Profil',
      href: `/${locale}/student/profile`,
      icon: User,
    },
    {
      name: 'Wsparcie',
      href: `/${locale}/student/support`,
      icon: HeadphonesIcon,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href={`/${locale}/student/dashboard`} className="flex items-center gap-2">
              <Car className="h-7 w-7 text-blue-600" />
              <span className="font-bold text-gray-900">AutoSzkoła</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* User Info */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            {/* Credits Info */}
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Kredyty:</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Pakiet Standard • Ważny do 31.12.2024
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Wyloguj się</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation (Quick Access) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 lg:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-lg',
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 rounded-full text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}