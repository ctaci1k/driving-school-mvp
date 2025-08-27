// app/[locale]/admin/instructors/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Grid, List, Star, Calendar, Eye, Phone, Mail, MapPin,
  Clock, Users, Car, Award, TrendingUp, AlertCircle,
  Filter, Search, Plus, MoreVertical, Edit2, Shield,
  CheckCircle, XCircle, DollarSign, BarChart3, Target,
  GraduationCap, Activity, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';

// Funkcja dla stabilnych wartości
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
    'Egzaminy', 'Jazda nocna', 'Autostrady', 'Parkowanie', 
    'Manewry', 'Miasto', 'Początkujący', 'Teoria'
  ];

  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];
  const cities = ['Warszawa', 'Kraków', 'Wrocław'];

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
      experience: `${(index % 10) + 1} lat`,
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
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'pl';
  
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
      available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Dostępny' },
      busy: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Zajęty' },
      offline: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Offline' }
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
            <p className="text-sm text-gray-500">Ocena</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{instructor.rating}</span>
              <span className="text-xs text-gray-500">({instructor.reviews})</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kursanci</p>
            <p className="font-semibold">{instructor.students}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Zajęć/tydzień</p>
            <p className="font-semibold">{instructor.lessonsPerWeek}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Zdawalność</p>
            <p className="font-semibold text-green-600">{instructor.successRate}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Specjalizacje:</p>
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
            onClick={() => handleViewInstructor(instructor.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Podgląd
          </button>
          <button
            onClick={() => handleViewSchedule(instructor.id)}
            className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Harmonogram
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
          {instructor.earnings.toLocaleString()} zł
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleViewInstructor(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Podgląd"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleEditInstructor(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Edytuj"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleViewSchedule(instructor.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Harmonogram"
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
        <h1 className="text-3xl font-bold text-gray-800">Instruktorzy</h1>
        <p className="text-gray-600 mt-1">Zarządzanie instruktorami szkoły jazdy</p>
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
              <p className="text-xs text-gray-500">Łącznie instruktorów</p>
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
              <p className="text-xs text-gray-500">Dostępnych teraz</p>
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
              <p className="text-xs text-gray-500">Średnia ocena</p>
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
              <p className="text-xs text-gray-500">Średnia zdawalność</p>
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
                placeholder="Szukaj po nazwisku..."
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
              <option value="all">Wszystkie statusy</option>
              <option value="available">Dostępni</option>
              <option value="busy">Zajęci</option>
              <option value="offline">Offline</option>
            </select>
            
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie lokalizacje</option>
              <option value="Warszawa">Warszawa</option>
              <option value="Kraków">Kraków</option>
              <option value="Wrocław">Wrocław</option>
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
            
            <button 
              onClick={handleAddInstructor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Dodaj instruktora
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
                    Instruktor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocena
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kursanci
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zajęć/tydzień
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zdawalność
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zarobki
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
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