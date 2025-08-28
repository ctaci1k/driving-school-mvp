// app/[locale]/admin/vehicles/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit, Save, X, Car, Calendar, Users, MapPin,
  Fuel, Settings, Shield, AlertCircle, CheckCircle, DollarSign,
  TrendingUp, Wrench, Clock, FileText, Download, Trash2,
  Eye, MoreVertical, Activity, BarChart3, Gauge, Battery
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock vehicle data
  const vehicle = {
    id: params.id,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    registrationNumber: 'WZ 12345',
    vin: 'JTDBT123456789012',
    category: 'B',
    transmission: 'Manualna',
    fuelType: 'Benzyna',
    color: 'Srebrny',
    status: 'active',
    currentMileage: 45670,
    dailyRate: 250,
    assignedInstructor: {
      id: '1',
      name: 'Jan Kowalski',
      avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=10B981&color=fff'
    },
    location: 'Centrum - ul. Puławska 145',
    purchaseDate: '2022-01-15',
    purchasePrice: 95000,
    insuranceExpiry: '2024-12-31',
    inspectionExpiry: '2024-11-15',
    registrationExpiry: '2025-01-31',
    photos: [
      '/placeholder-car-1.jpg',
      '/placeholder-car-2.jpg',
      '/placeholder-car-3.jpg'
    ],
    features: ['ABS', 'ESP', 'Klimatyzacja', 'Czujniki parkowania', 'Kamera cofania'],
    documents: [
      { id: 1, name: 'Dowód rejestracyjny', type: 'registration', uploadDate: '2024-01-10', status: 'verified' },
      { id: 2, name: 'Polisa ubezpieczeniowa', type: 'insurance', uploadDate: '2024-01-05', status: 'verified' },
      { id: 3, name: 'Przegląd techniczny', type: 'inspection', uploadDate: '2024-01-01', status: 'expiring' }
    ]
  };

  // Performance stats
  const performanceStats = {
    utilizationRate: 78,
    averageRating: 4.8,
    monthlyRevenue: 12500,
    totalLessons: 156,
    fuelConsumption: 6.2,
    maintenanceCost: 2340
  };

  // Maintenance history
  const maintenanceHistory = [
    { id: 1, type: 'Wymiana oleju', date: '2024-01-15', mileage: 45000, cost: 250, status: 'completed' },
    { id: 2, type: 'Wymiana opon', date: '2023-12-01', mileage: 42000, cost: 1200, status: 'completed' },
    { id: 3, type: 'Przegląd okresowy', date: '2023-11-15', mileage: 40000, cost: 450, status: 'completed' },
    { id: 4, type: 'Wymiana klocków hamulcowych', date: '2024-02-01', mileage: 46000, cost: 0, status: 'scheduled' }
  ];

  // Recent bookings
  const recentBookings = [
    { id: 1, student: 'Anna Nowak', instructor: 'Jan Kowalski', date: '2024-01-30', time: '09:00-11:00', status: 'completed' },
    { id: 2, student: 'Piotr Wiśniewski', instructor: 'Jan Kowalski', date: '2024-01-30', time: '14:00-16:00', status: 'completed' },
    { id: 3, student: 'Maria Lewandowska', instructor: 'Jan Kowalski', date: '2024-01-31', time: '08:00-10:00', status: 'scheduled' },
    { id: 4, student: 'Tomasz Duda', instructor: 'Jan Kowalski', date: '2024-01-31', time: '12:00-14:00', status: 'scheduled' }
  ];

  // Weekly schedule
  const weeklySchedule = [
    { day: 'Pon', hours: 8, bookings: 4 },
    { day: 'Wt', hours: 10, bookings: 5 },
    { day: 'Śr', hours: 6, bookings: 3 },
    { day: 'Czw', hours: 8, bookings: 4 },
    { day: 'Pt', hours: 10, bookings: 5 },
    { day: 'Sob', hours: 4, bookings: 2 },
    { day: 'Niedz', hours: 0, bookings: 0 }
  ];

  // Financial data
  const financialData = [
    { month: 'Styczeń 2024', revenue: 12500, expenses: 2340, profit: 10160 },
    { month: 'Grudzień 2023', revenue: 11800, expenses: 450, profit: 11350 },
    { month: 'Listopad 2023', revenue: 13200, expenses: 1650, profit: 11550 },
    { month: 'Październik 2023', revenue: 12900, expenses: 250, profit: 12650 }
  ];

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: Eye },
    { id: 'schedule', label: 'Harmonogram', icon: Calendar },
    { id: 'maintenance', label: 'Serwis', icon: Wrench },
    { id: 'financial', label: 'Finanse', icon: DollarSign },
    { id: 'documents', label: 'Dokumenty', icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Szczegóły pojazdu</h1>
            <p className="text-sm text-gray-600">Informacje i zarządzanie pojazdem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Eksport
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edytuj
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Usuń
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Anuluj
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Zapisz
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src="https://via.placeholder.com/400x300?text=Toyota+Corolla"
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {vehicle.photos.slice(1, 4).map((photo, index) => (
                <img
                  key={index}
                  src="https://via.placeholder.com/150x100?text=Car"
                  alt={`Photo ${index + 2}`}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h2>
                <p className="text-lg text-gray-600 mt-1">{vehicle.registrationNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(vehicle.status)}`}>
                {vehicle.status === 'active' ? 'Aktywny' : 
                 vehicle.status === 'maintenance' ? 'W serwisie' : 'Nieaktywny'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Kategoria</p>
                <p className="font-semibold text-gray-800">{vehicle.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Skrzynia biegów</p>
                <p className="font-semibold text-gray-800">{vehicle.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paliwo</p>
                <p className="font-semibold text-gray-800">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Przebieg</p>
                <p className="font-semibold text-gray-800">{vehicle.currentMileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VIN</p>
                <p className="font-semibold text-gray-800 text-xs">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kolor</p>
                <p className="font-semibold text-gray-800">{vehicle.color}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Przypisany instruktor</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={vehicle.assignedInstructor.avatar}
                        alt={vehicle.assignedInstructor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <p className="font-medium text-gray-800">{vehicle.assignedInstructor.name}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lokalizacja</p>
                  <p className="font-medium text-gray-800">{vehicle.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dzienna stawka</p>
                  <p className="font-semibold text-gray-800">{vehicle.dailyRate} PLN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Wykorzystanie</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.utilizationRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Lekcji/msc</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Przychód/msc</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.monthlyRevenue} PLN</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Fuel className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-500">Spalanie</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.fuelConsumption} L/100km</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500">Koszty serwisu</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.maintenanceCost} PLN</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span className="text-xs text-gray-500">Ocena</span>
          </div>
          <p className="text-xl font-bold text-gray-800">⭐ {performanceStats.averageRating}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vehicle Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informacje o pojeździe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Data zakupu</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.purchaseDate), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Cena zakupu</label>
                    <p className="font-medium text-gray-800">{vehicle.purchasePrice.toLocaleString()} PLN</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ważność ubezpieczenia</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.insuranceExpiry), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ważność przeglądu</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.inspectionExpiry), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ważność rejestracji</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.registrationExpiry), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Wyposażenie</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Zbliża się termin przeglądu</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Przegląd techniczny wygasa {format(new Date(vehicle.inspectionExpiry), 'dd MMMM yyyy', { locale: pl })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-3">
                {weeklySchedule.map((day) => (
                  <div key={day.day} className={`text-center p-3 rounded-lg border ${
                    day.hours === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <p className="font-semibold text-gray-800">{day.day}</p>
                    <p className="text-2xl font-bold text-blue-600 my-2">{day.hours}h</p>
                    <p className="text-xs text-gray-500">{day.bookings} rezerwacji</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Ostatnie rezerwacje</h4>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{booking.student}</p>
                        <p className="text-sm text-gray-600">Instruktor: {booking.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-800">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status === 'completed' ? 'Zakończone' : 'Zaplanowane'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-1">Następny serwis</p>
                  <p className="text-xl font-bold text-gray-800">46,000 km</p>
                  <p className="text-xs text-gray-600">za 330 km</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">Wymiana oleju</p>
                  <p className="text-xl font-bold text-gray-800">50,000 km</p>
                  <p className="text-xs text-gray-600">za 4,330 km</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Stan techniczny</p>
                  <p className="text-xl font-bold text-gray-800">Dobry</p>
                  <p className="text-xs text-gray-600">Ostatni przegląd: 15.01.2024</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Historia serwisowa</h4>
                <div className="space-y-3">
                  {maintenanceHistory.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{service.type}</p>
                        <p className="text-sm text-gray-600">{service.mileage.toLocaleString()} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-800">{format(new Date(service.date), 'dd.MM.yyyy')}</p>
                        <p className="font-semibold text-gray-800">{service.cost} PLN</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        service.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {service.status === 'completed' ? 'Wykonano' : 'Zaplanowane'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">Przychód całkowity</p>
                  <p className="text-2xl font-bold text-gray-800">50,400 PLN</p>
                  <p className="text-sm text-green-600 mt-1">+12% vs poprzedni kwartał</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">Koszty całkowite</p>
                  <p className="text-2xl font-bold text-gray-800">4,690 PLN</p>
                  <p className="text-sm text-gray-600 mt-1">Serwis + Paliwo</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Zysk netto</p>
                  <p className="text-2xl font-bold text-gray-800">45,710 PLN</p>
                  <p className="text-sm text-gray-600 mt-1">ROI: 48%</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Historia finansowa</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-semibold text-gray-700">Miesiąc</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Przychód</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Wydatki</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Zysk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.map((month, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-800">{month.month}</td>
                          <td className="py-3 text-right font-semibold text-green-600">{month.revenue.toLocaleString()} PLN</td>
                          <td className="py-3 text-right text-red-600">{month.expenses.toLocaleString()} PLN</td>
                          <td className="py-3 text-right font-semibold text-gray-800">{month.profit.toLocaleString()} PLN</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {vehicle.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-600">Przesłano: {format(new Date(doc.uploadDate), 'dd.MM.yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'verified' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.status === 'verified' ? 'Zweryfikowane' : 'Wygasa'}
                    </span>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}