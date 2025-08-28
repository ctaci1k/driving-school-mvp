// app/[locale]/admin/locations/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  MapPin, Plus, Search, Filter, Edit2, Trash2, Eye,
  Users, Car, Calendar, Clock, Phone, Mail, Globe,
  Navigation, Building, Home, AlertCircle, CheckCircle,
  TrendingUp, Activity, Star, ChevronRight, Loader2,
  Map, Compass, Route, ParkingCircle, Train, Bus,
  GraduationCap, BookOpen, Grid, List, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

// Функція для стабільних значень
const getSeededValue = (index: number, max: number, seed: number = 1) => {
  return ((index * seed + 7) % max);
};

// Генерація mock даних локацій
const generateLocations = () => {
  const locationNames = [
    { name: 'Варшава - Центр', address: 'вул. Маршалківська 1', type: 'main' },
    { name: 'Варшава - Мокотув', address: 'вул. Пулавська 10', type: 'branch' },
    { name: 'Варшава - Прага', address: 'вул. Таргова 24', type: 'branch' },
    { name: 'Варшава - Воля', address: 'вул. Вольська 11', type: 'branch' },
    { name: 'Варшава - Урсинув', address: 'вул. KEN 17', type: 'branch' },
    { name: 'Варшава - Бемово', address: 'вул. Повстанців Сілезьких 5', type: 'branch' },
    { name: 'Краків - Центр', address: 'Ринок Головний 1', type: 'main' },
    { name: 'Краків - Нова Гута', address: 'ос. Центрум A 35', type: 'branch' },
    { name: 'Вроцлав - Старе Місто', address: 'вул. Швидницька 20', type: 'main' },
    { name: 'Познань - Центр', address: 'вул. Святий Марцін 5', type: 'main' },
    { name: 'Гданськ - Головне Місто', address: 'вул. Довга 45', type: 'main' },
    { name: 'Лодзь - Центр', address: 'вул. Пйотрковська 135', type: 'branch' },
    { name: 'Катовіце - Центр', address: 'вул. 3 Травня 87', type: 'branch' },
    { name: 'Щецин - Центр', address: 'ал. Визволення 28', type: 'branch' },
    { name: 'Люблін - Старе Місто', address: 'вул. Краківське Передмістя 53', type: 'branch' }
  ];

  const managers = [
    'Олександр Ковальський', 'Марія Новак', 'Ян Вишневський', 
    'Юлія Вуйцік', 'Петро Камінський', 'Катерина Левандовська'
  ];

  return locationNames.map((location, index) => ({
    id: `location-${index + 1}`,
    name: location.name,
    type: location.type,
    address: location.address,
    city: location.name.split(' - ')[0],
    district: location.name.split(' - ')[1],
    coordinates: {
      lat: 52.2297 + (getSeededValue(index, 20) - 10) * 0.1,
      lng: 21.0122 + (getSeededValue(index, 20) - 10) * 0.1
    },
    phone: `+48 22 ${100 + getSeededValue(index, 900)} ${10 + getSeededValue(index, 90, 3)} ${10 + getSeededValue(index, 90, 5)}`,
    email: `${location.name.split(' - ')[0].toLowerCase()}.${location.name.split(' - ')[1].toLowerCase().replace(/ó/g, 'o').replace(/ł/g, 'l').replace(/ą/g, 'a').replace(/ę/g, 'e').replace(/ś/g, 's').replace(/ń/g, 'n').replace(/ /g, '')}@drive-school.pl`,
    manager: managers[index % managers.length],
    
    // Capacity and resources
    capacity: 10 + getSeededValue(index, 30),
    parkingSpaces: 5 + getSeededValue(index, 20),
    classrooms: 1 + getSeededValue(index, 5),
    simulators: 1 + getSeededValue(index, 3),
    
    // Statistics
    activeStudents: 50 + getSeededValue(index, 200, 11),
    activeInstructors: 3 + getSeededValue(index, 15),
    vehicles: 2 + getSeededValue(index, 10),
    monthlyLessons: 100 + getSeededValue(index, 500, 7),
    
    // Performance
    rating: (4.0 + (index % 10) / 10).toFixed(1),
    utilization: 70 + getSeededValue(index, 30),
    revenue: 50000 + getSeededValue(index, 200000, 123),
    
    // Schedule
    workingHours: {
      weekdays: '08:00 - 20:00',
      saturday: '09:00 - 18:00',
      sunday: 'closed'
    },
    
    // Status
    status: index < 12 ? 'active' : ['active', 'maintenance', 'inactive'][index % 3],
    openedDate: new Date(2020 + (index % 4), index % 12, 1),
    
    // Amenities
    amenities: [
      'parking', 'wifi', 'cafe', 'simulator', 'theory_room', 
      'practice_area', 'waiting_area', 'disabled_access'
    ].filter((_, i) => getSeededValue(index + i, 10) > 3),
    
    // Transport
    publicTransport: {
      metro: index < 6 ? `Станція M${index % 2 + 1} ${['Центр', 'Політехніка', 'Вилановська', 'Кабати', 'Млоцини'][index % 5]}` : null,
      bus: `Лінії: ${100 + getSeededValue(index, 50)}, ${150 + getSeededValue(index, 50, 3)}`,
      tram: getSeededValue(index, 10) > 7 ? `Трамвай ${1 + getSeededValue(index, 20)}` : null
    }
  }));
};

export default function AdminLocationsPage() {
  const t = useTranslations('admin.locations.list');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'uk';
  
  const [locations] = useState(generateLocations());
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [loading, setLoading] = useState(false);

  // Отримати унікальні міста
  const cities = [...new Set(locations.map(l => l.city))];

  // Фільтрація локацій
  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || location.city === filterCity;
    const matchesType = filterType === 'all' || location.type === filterType;
    const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
    
    return matchesSearch && matchesCity && matchesType && matchesStatus;
  });

  // Підрахунок статистики
  const stats = {
    total: locations.length,
    active: locations.filter(l => l.status === 'active').length,
    totalStudents: locations.reduce((acc, l) => acc + l.activeStudents, 0),
    totalInstructors: locations.reduce((acc, l) => acc + l.activeInstructors, 0),
    totalVehicles: locations.reduce((acc, l) => acc + l.vehicles, 0),
    avgUtilization: Math.round(locations.reduce((acc, l) => acc + l.utilization, 0) / locations.length)
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: t('status.active') },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, label: t('status.maintenance') },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: t('status.inactive') }
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      main: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Building, label: t('type.main') },
      branch: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Home, label: t('type.branch') }
    };
    return badges[type as keyof typeof badges] || badges.branch;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      parking: ParkingCircle,
      wifi: Globe,
      cafe: Users,
      simulator: Car,
      theory_room: BookOpen,
      practice_area: Route,
      waiting_area: Clock,
      disabled_access: Users
    };
    return icons[amenity] || MapPin;
  };

  const handleViewLocation = (locationId: string) => {
    router.push(`/${locale}/admin/locations/${locationId}`);
  };

  const handleEditLocation = (locationId: string) => {
    router.push(`/${locale}/admin/locations/${locationId}/`);
  };

  const handleAddLocation = () => {
    router.push(`/${locale}/admin/locations/new`);
  };

  const LocationCard = ({ location }: { location: any }) => {
    const statusBadge = getStatusBadge(location.status);
    const typeBadge = getTypeBadge(location.type);
    const StatusIcon = statusBadge.icon;
    const TypeIcon = typeBadge.icon;

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{location.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {location.address}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              <StatusIcon className="w-3 h-3" />
              {statusBadge.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}>
              <TypeIcon className="w-3 h-3" />
              {typeBadge.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{t('card.students')}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeStudents}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{t('card.instructors')}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeInstructors}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{t('card.vehicles')}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.vehicles}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{t('card.utilization')}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.utilization}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{t('card.manager')}: <span className="font-medium">{location.manager}</span></p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-gray-800">{location.rating}</span>
            <span className="text-sm text-gray-500">• {location.monthlyLessons} {t('card.lessonsPerMonth')}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {location.amenities.slice(0, 4).map((amenity: string, idx: number) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div key={idx} className="p-1.5 bg-gray-100 rounded" title={t(`amenities.${amenity}`)}>
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
            );
          })}
          {location.amenities.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{location.amenities.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleViewLocation(location.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
          >
            {t('buttons.details')}
          </button>
          <button
            onClick={() => handleEditLocation(location.id)}
            className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            {t('buttons.edit')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <button 
          onClick={handleAddLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('buttons.addLocation')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">{t('stats.locations')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500">{t('stats.active')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500">{t('stats.students')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalInstructors}</p>
              <p className="text-xs text-gray-500">{t('stats.instructors')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Car className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVehicles}</p>
              <p className="text-xs text-gray-500">{t('stats.vehicles')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Activity className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgUtilization}%</p>
              <p className="text-xs text-gray-500">{t('stats.utilization')}</p>
            </div>
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
                placeholder={t('filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allCities')}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allTypes')}</option>
              <option value="main">{t('filters.mainOffices')}</option>
              <option value="branch">{t('filters.branches')}</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allStatuses')}</option>
              <option value="active">{t('filters.active')}</option>
              <option value="maintenance">{t('filters.maintenance')}</option>
              <option value="inactive">{t('filters.inactive')}</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Map className="w-5 h-5" />
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
          {filteredLocations.map(location => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.location')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.type')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.manager')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.students')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.instructors')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.utilization')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLocations.map(location => {
                  const statusBadge = getStatusBadge(location.status);
                  const typeBadge = getTypeBadge(location.type);
                  
                  return (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{location.name}</p>
                          <p className="text-sm text-gray-500">{location.address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{location.manager}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{location.activeStudents}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{location.activeInstructors}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                location.utilization > 80 ? 'bg-green-500' :
                                location.utilization > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${location.utilization}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{location.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewLocation(location.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                            title={t('buttons.details')}
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditLocation(location.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                            title={t('buttons.edit')}
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{t('map.placeholder')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}