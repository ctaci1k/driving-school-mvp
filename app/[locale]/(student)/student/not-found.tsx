// File: /app/[locale]/(student)/student/not-found.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, ArrowLeft, Search, HelpCircle, AlertTriangle,
  Car, MapPin, BookOpen, MessageSquare, Phone, Mail
} from 'lucide-react';

export default function StudentNotFoundPage() {
  // Mock data for suggestions
  const popularPages = [
    {
      title: 'Dashboard',
      description: 'Wróć do strony głównej',
      href: '/student/dashboard',
      icon: Home,
      color: 'blue'
    },
    {
      title: 'Zarezerwuj lekcję',
      description: 'Umów się na następną jazdę',
      href: '/student/booking',
      icon: Car,
      color: 'green'
    },
    {
      title: 'Mój kalendarz',
      description: 'Sprawdź swoje lekcje',
      href: '/student/calendar',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Centrum pomocy',
      description: 'Znajdź odpowiedzi na pytania',
      href: '/student/help',
      icon: HelpCircle,
      color: 'orange'
    }
  ];

  const recentActivities = [
    'Rezerwacja lekcji',
    'Sprawdzenie postępów',
    'Płatności i pakiety',
    'Wiadomości od instruktora'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Animated Car Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <Car className="w-16 h-16 text-blue-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Ups! Zgubiliśmy się na drodze
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Strona, której szukasz, nie istnieje lub została przeniesiona. 
            Może warto zawrócić i spróbować innej trasy?
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Czego szukasz?"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Szukaj
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Strona główna
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Wróć
            </button>
          </div>
        </div>

        {/* Suggested Pages */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Może szukasz jednej z tych stron?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularPages.map((page, index) => {
              const Icon = page.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                green: 'bg-green-100 text-green-600 hover:bg-green-200',
                purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
                orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              };
              
              return (
                <Link
                  key={index}
                  href={page.href}
                  className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[page.color as keyof typeof colorClasses]} transition-colors`}>
  <Icon className="w-6 h-6" />
</div>
<div className="flex-1">
  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
    {page.title}
  </h4>
  <p className="text-sm text-gray-600">{page.description}</p>
</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Ostatnio odwiedzane</h3>
          <div className="flex flex-wrap gap-2">
            {recentActivities.map((activity, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Czy wiesz, że...</h4>
              <p className="text-sm opacity-90">
                Nawet najlepsi kierowcy czasem gubią drogę! GPS został wynaleziony właśnie po to, 
                aby pomóc nam znaleźć właściwą trasę. Nie martw się, zaraz znajdziemy dla Ciebie 
                odpowiednią stronę!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Potrzebujesz pomocy?</h3>
          <p className="text-gray-600 mb-6">
            Jeśli uważasz, że to błąd lub potrzebujesz pomocy, skontaktuj się z nami:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:+48123456789"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Zadzwoń</p>
                <p className="text-sm text-gray-600">+48 123 456 789</p>
              </div>
            </a>

            <a
              href="mailto:pomoc@autoszkola.pl"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-600">pomoc@autoszkola.pl</p>
              </div>
            </a>

            <Link
              href="/student/messages"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Czat</p>
                <p className="text-sm text-gray-600">Napisz do nas</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Error Code Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Kod błędu: 404 | Strona nie znaleziona</p>
          <p className="mt-1">
            Jeśli problem się powtarza, zapisz ten kod: 
            <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
              ERR_PAGE_NOT_FOUND_{new Date().getTime()}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

// Add missing import
import { Calendar } from 'lucide-react';