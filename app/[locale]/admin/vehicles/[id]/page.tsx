// app/[locale]/admin/vehicles/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
  ArrowLeft, Edit, Save, X, Car, Calendar, Users, MapPin,
  Fuel, Settings, Shield, AlertCircle, CheckCircle, DollarSign,
  TrendingUp, Wrench, Clock, FileText, Download, Trash2,
  Eye, MoreVertical, Activity, BarChart3, Gauge, Battery
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { pl, uk } from 'date-fns/locale';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('admin.vehicles.detail');
  const locale = useLocale();
  const dateLocale = locale === 'uk' ? uk : pl;
  
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
    { id: 'overview', label: t('tabs.overview'), icon: Eye },
    { id: 'schedule', label: t('tabs.schedule'), icon: Calendar },
    { id: 'maintenance', label: t('tabs.maintenance'), icon: Wrench },
    { id: 'financial', label: t('tabs.financial'), icon: DollarSign },
    { id: 'documents', label: t('tabs.documents'), icon: FileText }
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
            onClick={() => router.push(`/${locale}/admin/vehicles`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t('buttons.export')}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {t('buttons.edit')}
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {t('buttons.delete')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t('buttons.cancel')}
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                {t('buttons.save')}
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
                {t(`status.${vehicle.status}`)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">{t('info.category')}</p>
                <p className="font-semibold text-gray-800">{vehicle.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('info.transmission')}</p>
                <p className="font-semibold text-gray-800">{vehicle.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('info.fuel')}</p>
                <p className="font-semibold text-gray-800">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('info.mileage')}</p>
                <p className="font-semibold text-gray-800">{vehicle.currentMileage.toLocaleString()} {t('maintenance.km')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('info.vin')}</p>
                <p className="font-semibold text-gray-800 text-xs">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('info.color')}</p>
                <p className="font-semibold text-gray-800">{vehicle.color}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600">{t('info.assignedInstructor')}</p>
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
                  <p className="text-sm text-gray-600">{t('info.location')}</p>
                  <p className="font-medium text-gray-800">{vehicle.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('info.dailyRate')}</p>
                  <p className="font-semibold text-gray-800">{vehicle.dailyRate} {t('currency')}</p>
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
            <span className="text-xs text-gray-500">{t('stats.utilization')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.utilizationRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">{t('stats.lessonsPerMonth')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">{t('stats.monthlyRevenue')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.monthlyRevenue} {t('currency')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Fuel className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-500">{t('stats.fuelConsumption')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.fuelConsumption} L/100km</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500">{t('stats.maintenanceCost')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{performanceStats.maintenanceCost} {t('currency')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span className="text-xs text-gray-500">{t('stats.rating')}</span>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('overview.vehicleInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">{t('info.purchaseDate')}</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.purchaseDate), 'dd MMMM yyyy', { locale: dateLocale })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{t('info.purchasePrice')}</label>
                    <p className="font-medium text-gray-800">{vehicle.purchasePrice.toLocaleString()} {t('currency')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{t('info.insuranceExpiry')}</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.insuranceExpiry), 'dd MMMM yyyy', { locale: dateLocale })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{t('info.inspectionExpiry')}</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.inspectionExpiry), 'dd MMMM yyyy', { locale: dateLocale })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{t('info.registrationExpiry')}</label>
                    <p className="font-medium text-gray-800">{format(new Date(vehicle.registrationExpiry), 'dd MMMM yyyy', { locale: dateLocale })}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('overview.features')}</h3>
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
                      <p className="font-medium text-gray-800">{t('overview.alertTitle')}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('overview.alertDescription', { 
                          date: format(new Date(vehicle.inspectionExpiry), 'dd MMMM yyyy', { locale: dateLocale })
                        })}
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
                    <p className="text-2xl font-bold text-blue-600 my-2">{day.hours}{t('schedule.hours')}</p>
                    <p className="text-xs text-gray-500">{day.bookings} {t('schedule.bookings')}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('schedule.recentBookings')}</h4>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{booking.student}</p>
                        <p className="text-sm text-gray-600">{t('schedule.instructor')} {booking.instructor}</p>
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
                        {t(`schedule.${booking.status}`)}
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
                  <p className="text-sm text-red-700 mb-1">{t('maintenance.nextService')}</p>
                  <p className="text-xl font-bold text-gray-800">46,000 {t('maintenance.km')}</p>
                  <p className="text-xs text-gray-600">{t('maintenance.in')} 330 {t('maintenance.km')}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">{t('maintenance.oilChange')}</p>
                  <p className="text-xl font-bold text-gray-800">50,000 {t('maintenance.km')}</p>
                  <p className="text-xs text-gray-600">{t('maintenance.in')} 4,330 {t('maintenance.km')}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-1">{t('maintenance.technicalCondition')}</p>
                  <p className="text-xl font-bold text-gray-800">{t('maintenance.good')}</p>
                  <p className="text-xs text-gray-600">{t('maintenance.lastInspection')} 15.01.2024</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('maintenance.serviceHistory')}</h4>
                <div className="space-y-3">
                  {maintenanceHistory.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{service.type}</p>
                        <p className="text-sm text-gray-600">{service.mileage.toLocaleString()} {t('maintenance.km')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-800">{format(new Date(service.date), 'dd.MM.yyyy')}</p>
                        <p className="font-semibold text-gray-800">{service.cost} {t('currency')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        service.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t(`maintenance.${service.status}`)}
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
                  <p className="text-sm text-green-700">{t('financial.totalRevenue')}</p>
                  <p className="text-2xl font-bold text-gray-800">50,400 {t('currency')}</p>
                  <p className="text-sm text-green-600 mt-1">{t('financial.vsLastQuarter', { percent: 12 })}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">{t('financial.totalCosts')}</p>
                  <p className="text-2xl font-bold text-gray-800">4,690 {t('currency')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('financial.maintenanceFuel')}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">{t('financial.netProfit')}</p>
                  <p className="text-2xl font-bold text-gray-800">45,710 {t('currency')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('financial.roi', { percent: 48 })}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('financial.financialHistory')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-semibold text-gray-700">{t('financial.month')}</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">{t('financial.revenue')}</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">{t('financial.expenses')}</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">{t('financial.profit')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.map((month, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-800">{month.month}</td>
                          <td className="py-3 text-right font-semibold text-green-600">{month.revenue.toLocaleString()} {t('currency')}</td>
                          <td className="py-3 text-right text-red-600">{month.expenses.toLocaleString()} {t('currency')}</td>
                          <td className="py-3 text-right font-semibold text-gray-800">{month.profit.toLocaleString()} {t('currency')}</td>
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
                      <p className="text-sm text-gray-600">{t('documents.uploaded')} {format(new Date(doc.uploadDate), 'dd.MM.yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'verified' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t(`documents.${doc.status}`)}
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