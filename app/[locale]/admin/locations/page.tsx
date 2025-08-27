// app/[locale]/admin/locations/page.tsx
"use client";

import React, { useState } from 'react';
import {
  MapPin, Plus, Search, Filter, Edit2, Trash2, Eye,
  Users, Car, Calendar, Clock, Phone, Mail, Globe,
  Navigation, Building, Home, AlertCircle, CheckCircle,
  TrendingUp, Activity, Star, ChevronRight, Loader2,
  Map, Compass, Route, ParkingCircle, Train, Bus
} from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

// Generate mock locations data
const generateLocations = () => {
  const locationNames = [
    { name: 'Київ - Центр', address: 'вул. Хрещатик, 1', type: 'main' },
    { name: 'Київ - Подільський', address: 'вул. Контрактова площа, 10', type: 'branch' },
    { name: 'Київ - Оболонський', address: 'пр-т Героїв Сталінграда, 24', type: 'branch' },
    { name: 'Київ - Дарницький', address: 'вул. Урлівська, 11', type: 'branch' },
    { name: 'Київ - Позняки', address: 'вул. Драгоманова, 17', type: 'branch' },
    { name: 'Київ - Святошинський', address: 'вул. Академіка Корольова, 5', type: 'branch' },
    { name: 'Львів - Центр', address: 'пл. Ринок, 1', type: 'main' },
    { name: 'Львів - Сихівський', address: 'вул. Хуторівка, 35', type: 'branch' },
    { name: 'Одеса - Приморський', address: 'вул. Дерибасівська, 20', type: 'main' },
    { name: 'Харків - Центр', address: 'пл. Свободи, 5', type: 'main' },
    { name: 'Дніпро - Центральний', address: 'пр-т Дмитра Яворницького, 45', type: 'main' },
    { name: 'Запоріжжя - Центр', address: 'пр-т Соборний, 135', type: 'branch' },
    { name: 'Вінниця - Центральний', address: 'вул. Соборна, 87', type: 'branch' },
    { name: 'Полтава - Київський', address: 'вул. Європейська, 28', type: 'branch' },
    { name: 'Чернігів - Деснянський', address: 'пр-т Миру, 53', type: 'branch' }
  ];

  const managers = [
    'Олександр Петренко', 'Марія Коваленко', 'Іван Шевченко', 
    'Юлія Ткаченко', 'Петро Мельник', 'Оксана Бойко'
  ];

  return locationNames.map((location, index) => ({
    id: `location-${index + 1}`,
    name: location.name,
    type: location.type,
    address: location.address,
    city: location.name.split(' - ')[0],
    district: location.name.split(' - ')[1],
    coordinates: {
      lat: 50.4501 + (Math.random() - 0.5) * 2,
      lng: 30.5234 + (Math.random() - 0.5) * 2
    },
    phone: `+380 44 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
    email: `${location.name.split(' - ')[0].toLowerCase()}.${location.name.split(' - ')[1].toLowerCase()}@drive-school.com`.replace(/і/g, 'i').replace(/ї/g, 'i'),
    manager: managers[Math.floor(Math.random() * managers.length)],
    
    // Capacity and resources
    capacity: Math.floor(Math.random() * 30) + 10,
    parkingSpaces: Math.floor(Math.random() * 20) + 5,
    classrooms: Math.floor(Math.random() * 5) + 1,
    simulators: Math.floor(Math.random() * 3) + 1,
    
    // Statistics
    activeStudents: Math.floor(Math.random() * 200) + 50,
    activeInstructors: Math.floor(Math.random() * 15) + 3,
    vehicles: Math.floor(Math.random() * 10) + 2,
    monthlyLessons: Math.floor(Math.random() * 500) + 100,
    
    // Performance
    rating: (4 + Math.random()).toFixed(1),
    utilization: Math.floor(Math.random() * 30) + 70,
    revenue: Math.floor(Math.random() * 200000) + 50000,
    
    // Schedule
    workingHours: {
      weekdays: '08:00 - 20:00',
      saturday: '09:00 - 18:00',
      sunday: 'Вихідний'
    },
    
    // Status
    status: ['active', 'maintenance', 'inactive'][index < 12 ? 0 : Math.floor(Math.random() * 3)],
    openedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
    
    // Amenities
    amenities: [
      'parking', 'wifi', 'cafe', 'simulator', 'theory_room', 
      'practice_area', 'waiting_area', 'disabled_access'
    ].filter(() => Math.random() > 0.3),
    
    // Transport
    publicTransport: {
      metro: Math.random() > 0.5 ? `Станція ${['Хрещатик', 'Майдан Незалежності', 'Золоті ворота', 'Контрактова площа', 'Позняки'][Math.floor(Math.random() * 5)]}` : null,
      bus: `Маршрути: ${Math.floor(Math.random() * 50) + 1}, ${Math.floor(Math.random() * 50) + 50}`,
      tram: Math.random() > 0.7 ? `Трамвай №${Math.floor(Math.random() * 20) + 1}` : null
    }
  }));
};

export default function AdminLocationsPage() {
  const [locations] = useState(generateLocations());
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [loading, setLoading] = useState(false);

  // Get unique cities
  const cities = [...new Set(locations.map(l => l.city))];

  // Filter locations
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

  // Calculate stats
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
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Активна' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, label: 'На обслуговуванні' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Неактивна' }
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      main: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Building, label: 'Головний офіс' },
      branch: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Home, label: 'Філія' }
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
              <span className="text-xs text-gray-500">Студенти</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeStudents}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Інструктори</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeInstructors}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Автомобілі</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.vehicles}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Завантаженість</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.utilization}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Менеджер: <span className="font-medium">{location.manager}</span></p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-gray-800">{location.rating}</span>
            <span className="text-sm text-gray-500">• {location.monthlyLessons} занять/місяць</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {location.amenities.slice(0, 4).map((amenity: string, idx: number) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div key={idx} className="p-1.5 bg-gray-100 rounded" title={amenity}>
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
            onClick={() => setSelectedLocation(location)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
          >
            Деталі
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">
            Редагувати
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
          <h1 className="text-3xl font-bold text-gray-800">Локації</h1>
          <p className="text-gray-600 mt-1">Управління філіями та офісами</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Додати локацію
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
              <p className="text-xs text-gray-500">Локацій</p>
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
              <p className="text-xs text-gray-500">Активних</p>
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
              <p className="text-xs text-gray-500">Студентів</p>
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
              <p className="text-xs text-gray-500">Інструкторів</p>
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
              <p className="text-xs text-gray-500">Автомобілів</p>
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
              <p className="text-xs text-gray-500">Завантаженість</p>
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
                placeholder="Пошук за назвою, адресою або менеджером..."
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
              <option value="all">Всі міста</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі типи</option>
              <option value="main">Головні офіси</option>
              <option value="branch">Філії</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="maintenance">На обслуговуванні</option>
              <option value="inactive">Неактивні</option>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Локація</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Менеджер</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Студенти</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Інструктори</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Завантаженість</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
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
                            onClick={() => setSelectedLocation(location)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg">
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
              <p className="text-gray-500">Інтерактивна карта буде доступна найближчим часом</p>
            </div>
          </div>
        </div>
      )}

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedLocation.name}</h2>
                <p className="text-gray-500">{selectedLocation.address}</p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Контактна інформація</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedLocation.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedLocation.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Менеджер: {selectedLocation.manager}</span>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Графік роботи</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Пн-Пт:</span>
                    <span>{selectedLocation.workingHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Сб:</span>
                    <span>{selectedLocation.workingHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Нд:</span>
                    <span>{selectedLocation.workingHours.sunday}</span>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Ресурси</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Місткість</p>
                    <p className="text-lg font-semibold">{selectedLocation.capacity} осіб</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Паркомісця</p>
                    <p className="text-lg font-semibold">{selectedLocation.parkingSpaces}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Класи</p>
                    <p className="text-lg font-semibold">{selectedLocation.classrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Симулятори</p>
                    <p className="text-lg font-semibold">{selectedLocation.simulators}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Статистика</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Студенти</p>
                    <p className="text-lg font-semibold">{selectedLocation.activeStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Інструктори</p>
                    <p className="text-lg font-semibold">{selectedLocation.activeInstructors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Автомобілі</p>
                    <p className="text-lg font-semibold">{selectedLocation.vehicles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Рейтинг</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-semibold">{selectedLocation.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Громадський транспорт</h3>
              <div className="flex flex-wrap gap-3">
                {selectedLocation.publicTransport.metro && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Train className="w-4 h-4" />
                    {selectedLocation.publicTransport.metro}
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Bus className="w-4 h-4" />
                  {selectedLocation.publicTransport.bus}
                </div>
                {selectedLocation.publicTransport.tram && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <Train className="w-4 h-4" />
                    {selectedLocation.publicTransport.tram}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Редагувати
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Статистика
              </button>
              <button
                onClick={() => setSelectedLocation(null)}
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

// Missing imports
import { GraduationCap, BookOpen, Grid, List, XCircle } from 'lucide-react';