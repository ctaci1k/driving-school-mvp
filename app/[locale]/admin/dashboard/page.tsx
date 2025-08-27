// app/[locale]/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, Calendar, TrendingUp, Car, GraduationCap,
  CreditCard, MapPin, Clock, ArrowUp, ArrowDown, MoreVertical,
  Download, RefreshCw, Filter, ChevronRight, UserPlus,
  FileText, Mail, Activity, Target, Award, AlertCircle,
  CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Mock data
  const stats = [
    {
      title: 'Загальна виручка',
      value: '₴125,450',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green',
      subtitle: 'цього місяця'
    },
    {
      title: 'Активні студенти',
      value: '284',
      change: '+8 цього тижня',
      changeType: 'increase',
      icon: Users,
      color: 'blue',
      subtitle: 'всього зареєстровано: 1,245'
    },
    {
      title: 'Заняття сьогодні',
      value: '18',
      change: '6 завершено',
      changeType: 'neutral',
      icon: Calendar,
      color: 'purple',
      subtitle: '12 ще заплановано'
    },
    {
      title: 'Конверсія',
      value: '72%',
      change: '+5% від минулого місяця',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'orange',
      subtitle: 'від реєстрації до оплати'
    }
  ];

  const secondaryStats = [
    { title: 'Інструкторів онлайн', value: '8/12', icon: GraduationCap, color: 'indigo' },
    { title: 'Доступних авто', value: '14/15', icon: Car, color: 'teal' },
    { title: 'Нових платежів', value: '7', icon: CreditCard, color: 'pink' },
    { title: 'Активних локацій', value: '3', icon: MapPin, color: 'cyan' }
  ];

  // Revenue chart data
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'dd.MM'),
    current: Math.floor(Math.random() * 5000) + 3000,
    previous: Math.floor(Math.random() * 4000) + 2500
  }));

  // Bookings by time
  const bookingsByTime = [
    { time: '08:00', bookings: 12 },
    { time: '10:00', bookings: 18 },
    { time: '12:00', bookings: 8 },
    { time: '14:00', bookings: 22 },
    { time: '16:00', bookings: 19 },
    { time: '18:00', bookings: 15 },
    { time: '20:00', bookings: 6 }
  ];

  // Package distribution
  const packageData = [
    { name: 'Стандарт', value: 45, color: '#3B82F6' },
    { name: 'Преміум', value: 30, color: '#8B5CF6' },
    { name: 'VIP', value: 15, color: '#F59E0B' },
    { name: 'Базовий', value: 10, color: '#10B981' }
  ];

  // Recent activities
  const activities = [
    {
      id: 1,
      type: 'booking_created',
      user: 'Іван Петренко',
      action: 'забронював заняття',
      time: '5 хвилин тому',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 2,
      type: 'payment_received',
      user: 'Марія Коваленко',
      action: 'оплатила пакет "Стандарт"',
      amount: '₴3,500',
      time: '12 хвилин тому',
      icon: CreditCard,
      color: 'green'
    },
    {
      id: 3,
      type: 'instructor_online',
      user: 'Петро Сидоренко',
      action: 'почав робочий день',
      time: '25 хвилин тому',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      id: 4,
      type: 'booking_cancelled',
      user: 'Оксана Мельник',
      action: 'скасувала заняття на 14:00',
      time: '1 годину тому',
      icon: XCircle,
      color: 'red'
    },
    {
      id: 5,
      type: 'vehicle_maintenance',
      user: 'Система',
      action: 'Toyota Yaris WZ 12345 потребує ТО',
      time: '2 години тому',
      icon: Car,
      color: 'yellow'
    },
    {
      id: 6,
      type: 'new_registration',
      user: 'Андрій Кравчук',
      action: 'зареєструвався як новий студент',
      time: '3 години тому',
      icon: UserPlus,
      color: 'indigo'
    },
    {
      id: 7,
      type: 'exam_passed',
      user: 'Юлія Бойко',
      action: 'успішно склала іспит',
      time: '4 години тому',
      icon: Award,
      color: 'green'
    },
    {
      id: 8,
      type: 'review_received',
      user: 'Михайло Ткаченко',
      action: 'залишив відгук 5★',
      time: '5 годин тому',
      icon: Award,
      color: 'yellow'
    }
  ];

  // Top instructors
  const topInstructors = [
    { name: 'Петро Сидоренко', lessons: 142, rating: 4.9, revenue: '₴28,400' },
    { name: 'Анна Коваленко', lessons: 128, rating: 4.8, revenue: '₴25,600' },
    { name: 'Іван Мельник', lessons: 115, rating: 4.7, revenue: '₴23,000' },
    { name: 'Оксана Шевченко', lessons: 98, rating: 4.9, revenue: '₴19,600' }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; lightBg: string }> = {
      green: { bg: 'bg-green-100', text: 'text-green-600', lightBg: 'bg-green-50' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', lightBg: 'bg-blue-50' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', lightBg: 'bg-purple-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', lightBg: 'bg-orange-50' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', lightBg: 'bg-indigo-50' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', lightBg: 'bg-teal-50' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', lightBg: 'bg-pink-50' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', lightBg: 'bg-cyan-50' },
      red: { bg: 'bg-red-100', text: 'text-red-600', lightBg: 'bg-red-50' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', lightBg: 'bg-yellow-50' }
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Завантаження даних...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Ласкаво просимо! Ось огляд вашої автошколи
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Сьогодні</option>
            <option value="week">Цей тиждень</option>
            <option value="month">Цей місяць</option>
            <option value="year">Цей рік</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-5 h-5 inline mr-2" />
            Експорт
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center gap-2">
                  {stat.changeType === 'increase' && (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  )}
                  {stat.changeType === 'decrease' && (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    stat.changeType === 'increase' ? 'text-green-600' :
                    stat.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Динаміка виручки</h3>
              <p className="text-sm text-gray-600">Порівняння з минулим періодом</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Детальніше →
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="current"
                name="Поточний період"
                stroke="#3B82F6"
                fill="#93BBFC"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="previous"
                name="Попередній період"
                stroke="#9CA3AF"
                fill="#D1D5DB"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Розподіл пакетів</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={packageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {packageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {packageData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings by Time & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Бронювання за часом</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Остання активність</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Вся активність →
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {activities.map((activity) => {
              const Icon = activity.icon;
              const colors = getColorClasses(activity.color);
              
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action}</span>
                      {activity.amount && (
                        <span className="font-semibold text-green-600"> {activity.amount}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Instructors & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Instructors */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Топ інструктори</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Всі інструктори →
            </button>
          </div>
          <div className="space-y-3">
            {topInstructors.map((instructor, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{instructor.name}</p>
                    <p className="text-sm text-gray-600">
                      {instructor.lessons} занять • {instructor.rating}★
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">{instructor.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Швидкі дії</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group">
              <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                Додати користувача
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group">
              <Calendar className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                Створити бронювання
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group">
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                Згенерувати звіт
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all group">
              <Mail className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                Масова розсилка
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Потребує уваги</p>
            <ul className="mt-2 space-y-1 text-sm text-yellow-700">
              <li>• 3 платежі очікують підтвердження</li>
              <li>• Toyota Yaris (WZ 12345) потребує технічного огляду через 5 днів</li>
              <li>• 2 інструктори не підтвердили розклад на наступний тиждень</li>
            </ul>
          </div>
          <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            Переглянути всі →
          </button>
        </div>
      </div>
    </div>
  );
}