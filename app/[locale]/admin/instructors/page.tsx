// app/[locale]/admin/instructors/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Grid, List, Star, Calendar, Eye, Phone, Mail, MapPin,
  Clock, Users, Car, Award, TrendingUp, AlertCircle,
  Filter, Search, Plus, MoreVertical, Edit2, Shield,
  CheckCircle, XCircle, DollarSign, BarChart3, Target,
  GraduationCap, Activity, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';

// Generate mock instructors data
const generateInstructors = () => {
  const names = [
    'Петро Сидоренко', 'Анна Коваленко', 'Іван Мельник', 'Оксана Шевченко',
    'Василь Бондаренко', 'Марія Ткаченко', 'Олександр Кравчук', 'Юлія Павленко',
    'Михайло Левченко', 'Тетяна Захарченко', 'Андрій Романенко', 'Наталія Литвиненко',
    'Сергій Гончаренко', 'Людмила Дорошенко', 'Володимир Яковенко', 'Ірина Савченко',
    'Богдан Кузьменко', 'Олена Білоус', 'Роман Харченко', 'Галина Мороз'
  ];

  const specializations = [
    'Егзамени', 'Jazda nocna', 'Autostrady', 'Parkowanie', 
    'Manewry', 'Miasto', 'Początkujący', 'Teoria'
  ];

  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];

  return names.map((name, index) => ({
    id: `instructor-${index + 1}`,
    name,
    email: `${name.split(' ')[1].toLowerCase()}.${name.split(' ')[0].toLowerCase()}@drive-school.com`,
    phone: `+380${Math.floor(Math.random() * 900000000 + 100000000)}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`,
    rating: (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 20,
    experience: `${Math.floor(Math.random() * 10) + 1} років`,
    specializations: specializations.sort(() => 0.5 - Math.random()).slice(0, 3),
    categories: categories.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
    completedLessons: Math.floor(Math.random() * 2000) + 500,
    successRate: Math.floor(Math.random() * 20) + 80,
    students: Math.floor(Math.random() * 50) + 10,
    lessonsPerWeek: Math.floor(Math.random() * 30) + 10,
    nextAvailable: addDays(new Date(), Math.floor(Math.random() * 7)),
    status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)],
    earnings: Math.floor(Math.random() * 30000) + 20000,
    location: ['Київ', 'Львів', 'Одеса'][Math.floor(Math.random() * 3)],
    joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    vehicle: `Toyota Yaris WZ ${Math.floor(Math.random() * 90000) + 10000}`
  }));
};

export default function AdminInstructorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [instructors] = useState(generateInstructors());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || instructor.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || instructor.location === filterLocation;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Доступний' },
      busy: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Зайнятий' },
      offline: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Офлайн' }
    };
    return badges[status as keyof typeof badges] || badges.offline;
  };

  const InstructorCard = ({ instructor }: { instructor: any }) => {
    const statusBadge = getStatusBadge(instructor.status);
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={instructor.avatar} alt={instructor.name} className="w-16 h-16 rounded-full" />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                instructor.status === 'available' ? 'bg-green-500' :
                instructor.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{instructor.name}</h3>
              <p className="text-sm text-gray-600">
                {instructor.categories.join(', ')} • {instructor.experience}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Рейтинг</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{instructor.rating}</span>
              <span className="text-xs text-gray-500">({instructor.reviews})</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Студентів</p>
            <p className="font-semibold">{instructor.students}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Занять/тиждень</p>
            <p className="font-semibold">{instructor.lessonsPerWeek}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Успішність</p>
            <p className="font-semibold text-green-600">{instructor.successRate}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Спеціалізації:</p>
          <div className="flex flex-wrap gap-1">
            {instructor.specializations.map((spec: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {instructor.location}
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {instructor.vehicle}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => console.log('View instructor', instructor.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Переглянути
          </button>
          <button
            onClick={() => console.log('View schedule', instructor.id)}
            className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Розклад
          </button>
        </div>
      </div>
    );
  };

  const InstructorRow = ({ instructor }: { instructor: any }) => {
    const statusBadge = getStatusBadge(instructor.status);
    
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={instructor.avatar} alt={instructor.name} className="w-10 h-10 rounded-full" />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                instructor.status === 'available' ? 'bg-green-500' :
                instructor.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-800">{instructor.name}</p>
              <p className="text-sm text-gray-500">{instructor.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{instructor.rating}</span>
            <span className="text-sm text-gray-500">({instructor.reviews})</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex gap-1">
            {instructor.categories.map((cat: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {cat}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {instructor.students}
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {instructor.lessonsPerWeek}
        </td>
        <td className="px-4 py-4">
          <span className="text-sm font-medium text-green-600">{instructor.successRate}%</span>
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          ₴{instructor.earnings.toLocaleString()}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => console.log('View instructor', instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => console.log('Edit instructor', instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => console.log('View schedule', instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Інструктори</h1>
        <p className="text-gray-600 mt-1">Управління інструкторами автошколи</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{instructors.length}</p>
              <p className="text-xs text-gray-500">Всього інструкторів</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {instructors.filter(i => i.status === 'available').length}
              </p>
              <p className="text-xs text-gray-500">Доступно зараз</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">4.8</p>
              <p className="text-xs text-gray-500">Середній рейтинг</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">89%</p>
              <p className="text-xs text-gray-500">Середня успішність</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук за іменем..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі статуси</option>
              <option value="available">Доступні</option>
              <option value="busy">Зайняті</option>
              <option value="offline">Офлайн</option>
            </select>
            
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі локації</option>
              <option value="Київ">Київ</option>
              <option value="Львів">Львів</option>
              <option value="Одеса">Одеса</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Додати інструктора
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInstructors.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Інструктор
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Рейтинг
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категорії
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Студентів
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Занять/тиждень
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Успішність
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заробіток
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInstructors.map(instructor => (
                  <InstructorRow key={instructor.id} instructor={instructor} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}