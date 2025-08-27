// app/[locale]/admin/locations/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  MapPin, Plus, Search, Filter, Edit2, Trash2, Eye,
  Users, Car, Calendar, Clock, Phone, Mail, Globe,
  Navigation, Building, Home, AlertCircle, CheckCircle,
  TrendingUp, Activity, Star, ChevronRight, Loader2,
  Map, Compass, Route, ParkingCircle, Train, Bus,
  GraduationCap, BookOpen, Grid, List, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Funkcja dla stabilnych wartości
const getSeededValue = (index: number, max: number, seed: number = 1) => {
  return ((index * seed + 7) % max);
};

// Generate mock locations data with Polish cities
const generateLocations = () => {
  const locationNames = [
    { name: 'Warszawa - Centrum', address: 'ul. Marszałkowska 1', type: 'main' },
    { name: 'Warszawa - Mokotów', address: 'ul. Puławska 10', type: 'branch' },
    { name: 'Warszawa - Praga', address: 'ul. Targowa 24', type: 'branch' },
    { name: 'Warszawa - Wola', address: 'ul. Wolska 11', type: 'branch' },
    { name: 'Warszawa - Ursynów', address: 'ul. KEN 17', type: 'branch' },
    { name: 'Warszawa - Bemowo', address: 'ul. Powstańców Śląskich 5', type: 'branch' },
    { name: 'Kraków - Centrum', address: 'Rynek Główny 1', type: 'main' },
    { name: 'Kraków - Nowa Huta', address: 'os. Centrum A 35', type: 'branch' },
    { name: 'Wrocław - Stare Miasto', address: 'ul. Świdnicka 20', type: 'main' },
    { name: 'Poznań - Centrum', address: 'ul. Święty Marcin 5', type: 'main' },
    { name: 'Gdańsk - Główne Miasto', address: 'ul. Długa 45', type: 'main' },
    { name: 'Łódź - Śródmieście', address: 'ul. Piotrkowska 135', type: 'branch' },
    { name: 'Katowice - Centrum', address: 'ul. 3 Maja 87', type: 'branch' },
    { name: 'Szczecin - Centrum', address: 'al. Wyzwolenia 28', type: 'branch' },
    { name: 'Lublin - Stare Miasto', address: 'ul. Krakowskie Przedmieście 53', type: 'branch' }
  ];

  const managers = [
    'Aleksander Kowalski', 'Maria Nowak', 'Jan Wiśniewski', 
    'Julia Wójcik', 'Piotr Kamiński', 'Katarzyna Lewandowska'
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
      sunday: 'Zamknięte'
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
      metro: index < 6 ? `Stacja M${index % 2 + 1} ${['Centrum', 'Politechnika', 'Wilanowska', 'Kabaty', 'Młociny'][index % 5]}` : null,
      bus: `Linie: ${100 + getSeededValue(index, 50)}, ${150 + getSeededValue(index, 50, 3)}`,
      tram: getSeededValue(index, 10) > 7 ? `Tramwaj ${1 + getSeededValue(index, 20)}` : null
    }
  }));
};

export default function AdminLocationsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'pl';
  
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
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Aktywna' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, label: 'W konserwacji' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Nieaktywna' }
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      main: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Building, label: 'Główne biuro' },
      branch: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Home, label: 'Filia' }
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
              <span className="text-xs text-gray-500">Kursanci</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeStudents}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Instruktorzy</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.activeInstructors}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Pojazdy</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.vehicles}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Wykorzystanie</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{location.utilization}%</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Menedżer: <span className="font-medium">{location.manager}</span></p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-gray-800">{location.rating}</span>
            <span className="text-sm text-gray-500">• {location.monthlyLessons} zajęć/miesiąc</span>
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
            onClick={() => handleViewLocation(location.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
          >
            Szczegóły
          </button>
          <button
            onClick={() => handleEditLocation(location.id)}
            className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Edytuj
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
          <h1 className="text-3xl font-bold text-gray-800">Lokalizacje</h1>
          <p className="text-gray-600 mt-1">Zarządzanie filiami i biurami</p>
        </div>
        <button 
          onClick={handleAddLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Dodaj lokalizację
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
              <p className="text-xs text-gray-500">Lokalizacji</p>
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
              <p className="text-xs text-gray-500">Aktywnych</p>
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
              <p className="text-xs text-gray-500">Kursantów</p>
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
              <p className="text-xs text-gray-500">Instruktorów</p>
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
              <p className="text-xs text-gray-500">Pojazdów</p>
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
              <p className="text-xs text-gray-500">Wykorzystanie</p>
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
                placeholder="Szukaj po nazwie, adresie lub menedżerze..."
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
              <option value="all">Wszystkie miasta</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie typy</option>
              <option value="main">Główne biura</option>
              <option value="branch">Filie</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywne</option>
              <option value="maintenance">W konserwacji</option>
              <option value="inactive">Nieaktywne</option>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokalizacja</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Menedżer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursanci</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instruktorzy</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wykorzystanie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
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
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditLocation(location.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
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
              <p className="text-gray-500">Interaktywna mapa będzie dostępna wkrótce</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}