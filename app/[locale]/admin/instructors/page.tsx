// app/[locale]/admin/instructors/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Grid, List, Star, Calendar, Eye, Phone, Mail, MapPin,
  Clock, Users, Car, Award, TrendingUp, AlertCircle,
  Filter, Search, Plus, MoreVertical, Edit2, Shield,
  CheckCircle, XCircle, DollarSign, BarChart3, Target,
  GraduationCap, Activity, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';

// Функція для стабільних значень
const getSeededValue = (index: number, max: number, seed: number = 1) => {
  return ((index * seed + 7) % max);
};

// Generate mock instructors data with stable values
const generateInstructors = () => {
  const names = [
    'Piotr Kowalski', 'Anna Nowak', 'Jan Wiśniewski', 'Katarzyna Wójcik',
    'Tomasz Kamiński', 'Maria Lewandowska', 'Aleksander Zieliński', 'Julia Szymańska',
    'Michał Woźniak', 'Magdalena Dąbrowska', 'Andrzej Kozłowski', 'Natalia Jankowska',
    'Szymon Kwiatkowski', 'Barbara Krawczyk', 'Władysław Piotrowski', 'Irena Grabowska',
    'Bogdan Pawłowski', 'Elżbieta Michalska', 'Roman Nowicki', 'Halina Adamczyk'
  ];

  const specializations = [
    'exams', 'nightDriving', 'highway', 'parking', 
    'maneuvers', 'city', 'beginners', 'theory'
  ];

  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];
  const cities = ['warsaw', 'krakow', 'wroclaw'];

  return names.map((name, index) => {
    const specializationIndices = [
      getSeededValue(index, specializations.length, 2),
      getSeededValue(index, specializations.length, 3),
      getSeededValue(index, specializations.length, 5)
    ].filter((v, i, arr) => arr.indexOf(v) === i); // unique values
    
    const categoryIndices = [
      getSeededValue(index, categories.length, 2),
      getSeededValue(index, categories.length, 7)
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    return {
      id: `instructor-${index + 1}`,
      name,
      email: `${name.split(' ')[1].toLowerCase()}.${name.split(' ')[0].toLowerCase()}@drive-school.com`,
      phone: `+48${500000000 + (index * 12345)}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`,
      rating: (4.0 + (index % 10) / 10).toFixed(1),
      reviews: 20 + (index * 7) % 180,
      experience: (index % 10) + 1,
      specializations: specializationIndices.map(i => specializations[i]),
      categories: categoryIndices.map(i => categories[i]),
      completedLessons: 500 + (index * 83) % 1500,
      successRate: 80 + (index % 20),
      students: 10 + (index * 3) % 40,
      lessonsPerWeek: 10 + (index * 2) % 20,
      nextAvailable: addDays(new Date(), index % 7),
      status: ['available', 'busy', 'offline'][index % 3],
      earnings: 20000 + (index * 1234) % 30000,
      location: cities[index % 3],
      joinedDate: new Date(2020 + (index % 4), index % 12, (index % 28) + 1),
      vehicle: `Toyota Yaris WZ ${10000 + (index * 1111) % 90000}`
    };
  });
};

export default function AdminInstructorsPage() {
  const t = useTranslations('admin.instructors.list');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'uk';
  
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
      available: { bg: 'bg-green-100', text: 'text-green-700', label: t(`status.available`) },
      busy: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: t(`status.busy`) },
      offline: { bg: 'bg-gray-100', text: 'text-gray-700', label: t(`status.offline`) }
    };
    return badges[status as keyof typeof badges] || badges.offline;
  };

  // Navigation functions
  const handleViewInstructor = (instructorId: string) => {
    router.push(`/${locale}/admin/instructors/${instructorId}`);
  };

  const handleViewSchedule = (instructorId: string) => {
    router.push(`/${locale}/admin/instructors/schedule?instructorId=${instructorId}`);
  };

  const handleEditInstructor = (instructorId: string) => {
    router.push(`/${locale}/admin/instructors/${instructorId}/edit`);
  };

  const handleAddInstructor = () => {
    router.push(`/${locale}/admin/instructors/new`);
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
                {instructor.categories.join(', ')} • {t('experience', { years: instructor.experience })}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">{t('card.rating')}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{instructor.rating}</span>
              <span className="text-xs text-gray-500">({instructor.reviews})</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('card.students')}</p>
            <p className="font-semibold">{instructor.students}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('card.lessonsPerWeek')}</p>
            <p className="font-semibold">{instructor.lessonsPerWeek}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('card.passRate')}</p>
            <p className="font-semibold text-green-600">{instructor.successRate}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">{t('card.specializations')}</p>
          <div className="flex flex-wrap gap-1">
            {instructor.specializations.map((spec: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {t(`specializations.${spec}`)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {t(`locations.${instructor.location}`)}
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {instructor.vehicle}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleViewInstructor(instructor.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {t('buttons.view')}
          </button>
          <button
            onClick={() => handleViewSchedule(instructor.id)}
            className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t('buttons.schedule')}
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
          {instructor.earnings.toLocaleString('uk-UA')} zł
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleViewInstructor(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title={t('buttons.view')}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleEditInstructor(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title={t('buttons.edit')}
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleViewSchedule(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title={t('buttons.schedule')}
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
        <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.totalInstructors')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.availableNow')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.averageRating')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.averagePassRate')}</p>
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
                placeholder={t('filters.searchPlaceholder')}
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
              <option value="all">{t('filters.allStatuses')}</option>
              <option value="available">{t('filters.available')}</option>
              <option value="busy">{t('filters.busy')}</option>
              <option value="offline">{t('filters.offline')}</option>
            </select>
            
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allLocations')}</option>
              <option value="warsaw">{t('locations.warsaw')}</option>
              <option value="krakow">{t('locations.krakow')}</option>
              <option value="wroclaw">{t('locations.wroclaw')}</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddInstructor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('buttons.addInstructor')}
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
                    {t('table.instructor')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.rating')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.categories')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.students')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.lessonsPerWeek')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.passRate')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.earnings')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
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