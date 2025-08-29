// app/[locale]/admin/layout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard, Users, GraduationCap, UserCheck, Car,
  MapPin, Package, Calendar, CreditCard, FileText, Settings,
  Bell, Menu, X, ChevronDown, LogOut, User, Shield,
  Sun, Moon, Search, Home, ChevronRight, Globe, Check, Loader2
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// Mock data - Polish names and locations
const CURRENT_USER = {
  name: 'Administrator Systemu',
  email: 'admin@drive-school.com',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff'
};

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const t = useTranslations('admin.layout');
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === params.locale) || AVAILABLE_LANGUAGES[0];

  const navigation = [
    { name: t('navigation.dashboard'), href: `/${params.locale}/admin/dashboard`, icon: LayoutDashboard },
    { name: t('navigation.users'), href: `/${params.locale}/admin/users`, icon: Users },
    { name: t('navigation.instructors'), href: `/${params.locale}/admin/instructors`, icon: GraduationCap },
    { name: t('navigation.students'), href: `/${params.locale}/admin/students`, icon: UserCheck },
    { name: t('navigation.vehicles'), href: `/${params.locale}/admin/vehicles`, icon: Car },
    { name: t('navigation.locations'), href: `/${params.locale}/admin/locations`, icon: MapPin },
    { name: t('navigation.packages'), href: `/${params.locale}/admin/packages`, icon: Package },
    { name: t('navigation.bookings'), href: `/${params.locale}/admin/bookings`, icon: Calendar },
    { name: t('navigation.payments'), href: `/${params.locale}/admin/payments`, icon: CreditCard },
    { name: t('navigation.reports'), href: `/${params.locale}/admin/reports`, icon: FileText },
    { name: t('navigation.settings'), href: `/${params.locale}/admin/settings`, icon: Settings }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const isActive = (href: string) => pathname === href;

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ name: string; href: string; current: boolean }> = [];
    let path = '';

    const breadcrumbKeys = [
      'admin', 'dashboard', 'users', 'instructors', 'students',
      'vehicles', 'locations', 'packages', 'bookings', 'payments',
      'reports', 'settings', 'maintenance', 'new', 'edit'
    ];

    parts.forEach((part, index) => {
      path += `/${part}`;
      if (part !== params.locale) {
        const isKnownKey = breadcrumbKeys.includes(part);
        const translatedName = isKnownKey 
          ? t(`breadcrumbs.${part}`) 
          : part.charAt(0).toUpperCase() + part.slice(1);
        
        breadcrumbs.push({
          name: translatedName,
          href: path,
          current: index === parts.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const handleLanguageChange = (newLocale: string) => {
    setIsChangingLanguage(true);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href={`/${params.locale}/admin/dashboard`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">{t('title')}</h1>
              <p className="text-xs text-gray-500">{t('subtitle')}</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            aria-label={t('mobile.closeMenu')}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isPayments = item.href.includes('/payments');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isPayments && notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {notifications}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <img 
              src={CURRENT_USER.avatar} 
              alt={CURRENT_USER.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {CURRENT_USER.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {t('user.role')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label={t('mobile.openMenu')}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden lg:flex items-center gap-2 text-sm">
                <Link 
                  href={`/${params.locale}/admin/dashboard`}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={t('breadcrumbs.home')}
                >
                  <Home className="w-4 h-4" />
                </Link>
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {crumb.current ? (
                      <span className="font-medium text-gray-800">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link 
                        href={crumb.href}
                        className="text-gray-500 hover:text-gray-700"
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
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label={t('search.button')}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>

                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={isChangingLanguage}
                    >
                      {isChangingLanguage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      ) : (
                        <>
                          <Globe className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
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
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label={t('theme.toggle')}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Notifications */}
                <button 
                  className="relative p-2 rounded-lg hover:bg-gray-100"
                  aria-label={t('notifications.label')}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <img 
                      src={CURRENT_USER.avatar} 
                      alt={CURRENT_USER.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-3 border-b border-gray-200">
                          <p className="font-medium text-gray-800">
                            {CURRENT_USER.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {CURRENT_USER.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{t('user.profile')}</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">{t('user.security')}</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">{t('user.settings')}</span>
                          </button>
                        </div>
                        <div className="p-1 border-t border-gray-200">
                          <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">{t('user.logout')}</span>
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
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}