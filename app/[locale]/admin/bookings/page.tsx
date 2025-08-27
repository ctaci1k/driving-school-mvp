// app/[locale]/admin/bookings/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Calendar, Clock, User, Car, MapPin, CheckCircle,
  XCircle, AlertCircle, Filter, Search, Download,
  Eye, Edit2, Trash2, Phone, Mail, MessageSquare,
  TrendingUp, Users, DollarSign, Activity, ChevronLeft,
  ChevronRight, CalendarDays, Timer, Star, Navigation,
  RefreshCw, Loader2, FileText, CreditCard, Info
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Generate mock bookings data
const generateBookings = () => {
  const studentNames = [
    'Олександр Петренко', 'Марія Коваленко', 'Іван Шевченко', 'Юлія Ткаченко',
    'Петро Мельник', 'Оксана Бойко', 'Андрій Кравчук', 'Наталія Савченко',
    'Михайло Гончаренко', 'Тетяна Павленко', 'Василь Романенко', 'Світлана Яковенко'
  ];
  
  const instructorNames = [
    'Петро Сидоренко', 'Анна Коваленко', 'Іван Мельник', 'Оксана Шевченко',
    'Василь Бондаренко', 'Марія Ткаченко'
  ];
  
  const vehicles = [
    'Toyota Yaris WZ 12345', 'VW Golf WZ 67890', 'Škoda Fabia WZ 11111',
    'Renault Clio WZ 22222', 'Ford Fiesta WZ 33333'
  ];
  
  const locations = [
    'Київ - Центр, вул. Хрещатик 1',
    'Київ - Оболонь, пр-т Героїв Сталінграда 24',
    'Київ - Позняки, вул. Драгоманова 17',
    'Львів - Центр, пл. Ринок 1'
  ];
  
  const lessonTypes = ['Стандартна', 'Автострада', 'Паркування', 'Нічна', 'Іспит', 'Маневри'];
  const statuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  
  const bookings = [];
  const today = new Date();
  
  // Generate 200 bookings
  for (let i = 0; i < 200; i++) {
    const date = addDays(today, Math.floor(Math.random() * 60) - 30); // -30 to +30 days
    const hour = 8 + Math.floor(Math.random() * 12); // 8:00 to 20:00
    const minutes = Math.random() > 0.5 ? '00' : '30';
    
    const status = date < today ? 
      statuses[Math.floor(Math.random() * 3) + 2] : // past: completed, cancelled, no_show
      date.toDateString() === today.toDateString() && hour < today.getHours() ?
        'IN_PROGRESS' :
        statuses[0]; // future: scheduled
    
    bookings.push({
      id: `BK-2024-${String(i + 1).padStart(5, '0')}`,
      studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
      studentPhone: `+380${Math.floor(Math.random() * 900000000 + 100000000)}`,
      studentEmail: `student${i}@example.com`,
      instructorName: instructorNames[Math.floor(Math.random() * instructorNames.length)],
      instructorPhone: `+380${Math.floor(Math.random() * 900000000 + 100000000)}`,
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      date: date,
      startTime: `${hour}:${minutes}`,
      endTime: `${hour + 2}:${minutes}`,
      duration: 120,
      type: lessonTypes[Math.floor(Math.random() * lessonTypes.length)],
      status: status,
      price: 180 + Math.floor(Math.random() * 4) * 50,
      paid: status === 'COMPLETED' || Math.random() > 0.3,
      rating: status === 'COMPLETED' ? (4 + Math.random()).toFixed(1) : null,
      notes: Math.random() > 0.7 ? 'Додаткові нотатки про заняття' : null,
      cancelReason: status === 'CANCELLED' ? 'Хвороба студента' : null,
      createdAt: addDays(date, -Math.floor(Math.random() * 7) - 1)
    });
  }
  
  return bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function AdminBookingsPage() {
  const [bookings] = useState(generateBookings());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInstructor, setFilterInstructor] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Get unique instructors
  const instructors = [...new Set(bookings.map(b => b.instructorName))];
  const lessonTypes = [...new Set(bookings.map(b => b.type))];

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesInstructor = filterInstructor === 'all' || booking.instructorName === filterInstructor;
    const matchesType = filterType === 'all' || booking.type === filterType;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = isToday(booking.date);
    } else if (dateFilter === 'tomorrow') {
      matchesDate = isTomorrow(booking.date);
    } else if (dateFilter === 'week') {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      matchesDate = booking.date >= weekStart && booking.date <= weekEnd;
    }
    
    return matchesSearch && matchesStatus && matchesInstructor && matchesType && matchesDate;
  });

  // Calculate stats
  const today = new Date();
  const todayBookings = bookings.filter(b => isToday(b.date));
  const weekBookings = bookings.filter(b => {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    return b.date >= weekStart && b.date <= weekEnd;
  });

  const stats = {
    todayTotal: todayBookings.length,
    todayCompleted: todayBookings.filter(b => b.status === 'COMPLETED').length,
    weekTotal: weekBookings.length,
    weekRevenue: weekBookings.filter(b => b.paid).reduce((sum, b) => sum + b.price, 0),
    cancellationRate: Math.round((bookings.filter(b => b.status === 'CANCELLED').length / bookings.length) * 100),
    avgRating: (bookings.filter(b => b.rating).reduce((sum, b) => sum + parseFloat(b.rating || '0'), 0) / 
                bookings.filter(b => b.rating).length || 0).toFixed(1)
  };

  // Chart data
  const bookingsByDay = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(today, { weekStartsOn: 1 }), i);
    const dayBookings = bookings.filter(b => 
      b.date.toDateString() === date.toDateString()
    );
    return {
      day: format(date, 'EEE', { locale: uk }),
      bookings: dayBookings.length,
      revenue: dayBookings.filter(b => b.paid).reduce((sum, b) => sum + b.price, 0)
    };
  });

  const bookingsByStatus = [
    { name: 'Заплановано', value: bookings.filter(b => b.status === 'SCHEDULED').length, color: '#3B82F6' },
    { name: 'В процесі', value: bookings.filter(b => b.status === 'IN_PROGRESS').length, color: '#F59E0B' },
    { name: 'Завершено', value: bookings.filter(b => b.status === 'COMPLETED').length, color: '#10B981' },
    { name: 'Скасовано', value: bookings.filter(b => b.status === 'CANCELLED').length, color: '#EF4444' },
    { name: 'Неявка', value: bookings.filter(b => b.status === 'NO_SHOW').length, color: '#6B7280' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar, label: 'Заплановано' },
      IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Timer, label: 'В процесі' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Завершено' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Скасовано' },
      NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle, label: 'Неявка' }
    };
    return badges[status as keyof typeof badges] || badges.SCHEDULED;
  };

  // Calendar view helpers
  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getTimeSlots = () => {
    return Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
  };

  const getBookingForSlot = (date: Date, time: string) => {
    return filteredBookings.find(b => 
      b.date.toDateString() === date.toDateString() && 
      b.startTime === time
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Бронювання</h1>
          <p className="text-gray-600 mt-1">Управління всіма бронюваннями та заняттями</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Експорт
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Нове бронювання
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.todayTotal}</p>
              <p className="text-xs text-gray-500">Сьогодні</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.todayCompleted}</p>
              <p className="text-xs text-gray-500">Завершено сьогодні</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.weekTotal}</p>
              <p className="text-xs text-gray-500">Цей тиждень</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">₴{(stats.weekRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-500">Дохід тижня</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.cancellationRate}%</p>
              <p className="text-xs text-gray-500">Скасування</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
              <p className="text-xs text-gray-500">Сер. рейтинг</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings by Day */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Бронювання за тиждень</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" name="Бронювання" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Розподіл за статусами</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={bookingsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {bookingsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {bookingsByStatus.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук за ID, студентом або інструктором..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі дати</option>
              <option value="today">Сьогодні</option>
              <option value="tomorrow">Завтра</option>
              <option value="week">Цей тиждень</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі статуси</option>
              <option value="SCHEDULED">Заплановано</option>
              <option value="IN_PROGRESS">В процесі</option>
              <option value="COMPLETED">Завершено</option>
              <option value="CANCELLED">Скасовано</option>
              <option value="NO_SHOW">Неявка</option>
            </select>
            
            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі інструктори</option>
              {instructors.map(instructor => (
                <option key={instructor} value={instructor}>{instructor}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <CalendarDays className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Студент</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Інструктор</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата і час</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Оплата</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.slice(0, 20).map(booking => {
                  const statusBadge = getStatusBadge(booking.status);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-mono text-sm text-gray-800">{booking.id}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.studentName}</p>
                          <p className="text-xs text-gray-500">{booking.studentPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{booking.instructorName}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-gray-800">
                            {format(booking.date, 'dd.MM.yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {booking.paid ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">₴{booking.price}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Очікується</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded-lg">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Calendar View */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800">
              {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM')} - 
              {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-1">
                <div className="p-2"></div>
                {getWeekDays().map(day => (
                  <div key={day.toString()} className="p-2 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {format(day, 'EEE', { locale: uk })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(day, 'dd MMM')}
                    </p>
                  </div>
                ))}
              </div>

              {getTimeSlots().map(time => (
                <div key={time} className="grid grid-cols-8 gap-1">
                  <div className="p-2 text-right">
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  {getWeekDays().map(day => {
                    const booking = getBookingForSlot(day, time);
                    if (booking) {
                      const statusBadge = getStatusBadge(booking.status);
                      return (
                        <div
                          key={day.toString()}
                          className={`p-2 rounded cursor-pointer hover:opacity-80 ${statusBadge.bg}`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <p className="text-xs font-medium truncate">{booking.studentName}</p>
                          <p className="text-xs truncate">{booking.type}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={day.toString()} className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <p className="text-xs text-gray-400 text-center">—</p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Деталі бронювання {selectedBooking.id}
                </h2>
                <p className="text-gray-500">
                  {format(selectedBooking.date, 'dd MMMM yyyy', { locale: uk })}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Студент</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.studentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.studentEmail}</span>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Інструктор</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.instructorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.instructorPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedBooking.vehicle}</span>
                  </div>
                </div>
              </div>

              {/* Lesson Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Деталі заняття</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Тип:</span>
                    <span className="text-sm font-medium">{selectedBooking.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Час:</span>
                    <span className="text-sm font-medium">
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Тривалість:</span>
                    <span className="text-sm font-medium">{selectedBooking.duration} хв</span>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Оплата та статус</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Статус:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusBadge(selectedBooking.status).bg
                    } ${getStatusBadge(selectedBooking.status).text}`}>
                      {getStatusBadge(selectedBooking.status).label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ціна:</span>
                    <span className="text-sm font-medium">₴{selectedBooking.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Оплата:</span>
                    <span className={`text-sm font-medium ${
                      selectedBooking.paid ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {selectedBooking.paid ? 'Оплачено' : 'Очікується'}
                    </span>
                  </div>
                  {selectedBooking.rating && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Рейтинг:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{selectedBooking.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Локація</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="text-sm">{selectedBooking.location}</span>
              </div>
            </div>

            {/* Notes */}
            {(selectedBooking.notes || selectedBooking.cancelReason) && (
              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Примітки</h3>
                {selectedBooking.notes && <p className="text-sm text-gray-700">{selectedBooking.notes}</p>}
                {selectedBooking.cancelReason && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>Причина скасування:</strong> {selectedBooking.cancelReason}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Редагувати
              </button>
              {selectedBooking.status === 'SCHEDULED' && (
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Скасувати
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
