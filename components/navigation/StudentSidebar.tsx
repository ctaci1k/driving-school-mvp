// components/navigation/StudentSidebar.tsx

'use client';

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
  Clock,
  Car,
  Award,
  Settings,
  Bell,
  Home
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface StudentSidebarProps {
  locale: string;
  user: any;
}

export default function StudentSidebar({ locale, user }: StudentSidebarProps) {
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
      badge: 2, // upcoming lessons
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
      badge: 3, // unread messages
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
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <Link href={`/${locale}/student/dashboard`} className="flex items-center gap-2">
          <Car className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">AutoSzkoła</span>
        </Link>
      </div>

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
        {/* Credits/Package Info */}
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Kredyty:</span>
            <span className="font-semibold text-blue-600">12</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Pakiet Standard</span>
            <span>Ważny do: 31.12.2024</span>
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
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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

      {/* Next Lesson Reminder */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-green-50 p-3">
          <div className="flex items-center gap-2 text-green-700">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Następna lekcja</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-green-900">
            Dziś, 14:00
          </p>
          <p className="text-xs text-green-600">
            z Piotr Nowak
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Wyloguj się</span>
        </button>
      </div>
    </div>
  );
}