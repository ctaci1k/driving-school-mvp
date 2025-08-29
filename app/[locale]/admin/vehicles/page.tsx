// app/[locale]/admin/vehicles/page.tsx
"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Car, Grid, List, Filter, Search, Plus, MoreVertical,
  Edit2, Trash2, Eye, MapPin, Users, Calendar, Settings,
  AlertTriangle, CheckCircle, XCircle, Clock, Wrench,
  Fuel, Activity, Shield, FileText, DollarSign, TrendingUp,
  Info, Download, RefreshCw, Loader2, ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// Generate mock vehicles data - Polish data remains unchanged
const generateVehicles = () => {
  const vehicles = [
    { make: 'Toyota', model: 'Yaris', year: 2023, image: 'https://placehold.co/400x250?text=Toyota+Yaris' },
    { make: 'Volkswagen', model: 'Golf', year: 2022, image: 'https://placehold.co/400x250?text=VW+Golf' },
    { make: 'Škoda', model: 'Fabia', year: 2023, image: 'https://placehold.co/400x250?text=Skoda+Fabia' },
    { make: 'Renault', model: 'Clio', year: 2022, image: 'https://placehold.co/400x250?text=Renault+Clio' },
    { make: 'Ford', model: 'Fiesta', year: 2021, image: 'https://placehold.co/400x250?text=Ford+Fiesta' },
    { make: 'Opel', model: 'Corsa', year: 2023, image: 'https://placehold.co/400x250?text=Opel+Corsa' },
    { make: 'Peugeot', model: '208', year: 2022, image: 'https://placehold.co/400x250?text=Peugeot+208' },
    { make: 'Nissan', model: 'Micra', year: 2021, image: 'https://placehold.co/400x250?text=Nissan+Micra' },
    { make: 'Hyundai', model: 'i20', year: 2023, image: 'https://placehold.co/400x250?text=Hyundai+i20' },
    { make: 'Mazda', model: '2', year: 2022, image: 'https://placehold.co/400x250?text=Mazda+2' },
    { make: 'Suzuki', model: 'Swift', year: 2023, image: 'https://placehold.co/400x250?text=Suzuki+Swift' },
    { make: 'Honda', model: 'Jazz', year: 2021, image: 'https://placehold.co/400x250?text=Honda+Jazz' },
    { make: 'Kia', model: 'Rio', year: 2022, image: 'https://placehold.co/400x250?text=Kia+Rio' },
    { make: 'Seat', model: 'Ibiza', year: 2023, image: 'https://placehold.co/400x250?text=Seat+Ibiza' },
    { make: 'Fiat', model: '500', year: 2022, image: 'https://placehold.co/400x250?text=Fiat+500' }
  ];

  const instructorNames = [
    'Piotr Kowalski', 'Anna Nowak', 'Jan Wiśniewski', 'Katarzyna Wójcik',
    'Marek Kowalczyk', 'Maria Kamińska', 'Aleksander Lewandowski'
  ];

  const statuses = ['active', 'maintenance', 'reserved', 'inactive'];
  const transmissions = ['Manual', 'Automatic'];
  const fuelTypes = ['Benzyna', 'Diesel', 'Hybrid', 'Elektryczny'];
  const categories = ['B', 'B+E', 'C'];
  const locations = ['Warszawa - Centrum', 'Warszawa - Mokotów', 'Warszawa - Wola'];

  return vehicles.map((vehicle, index) => ({
    id: `vehicle-${index + 1}`,
    ...vehicle,
    registrationNumber: `WZ ${Math.floor(Math.random() * 90000) + 10000}`,
    vin: `VF1RFB00${Math.floor(Math.random() * 900000000) + 100000000}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
    fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    mileage: Math.floor(Math.random() * 50000) + 10000,
    instructor: Math.random() > 0.3 ? instructorNames[Math.floor(Math.random() * instructorNames.length)] : null,
    location: locations[Math.floor(Math.random() * locations.length)],
    insuranceExpiry: addDays(new Date(), Math.floor(Math.random() * 365)),
    inspectionExpiry: addDays(new Date(), Math.floor(Math.random() * 365)),
    lastService: addDays(new Date(), -Math.floor(Math.random() * 90)),
    nextService: addDays(new Date(), Math.floor(Math.random() * 90)),
    fuelLevel: Math.floor(Math.random() * 100),
    dailyRate: Math.floor(Math.random() * 1000) + 500,
    utilizationRate: Math.floor(Math.random() * 100),
    totalLessons: Math.floor(Math.random() * 1000) + 100,
    weeklyLessons: Math.floor(Math.random() * 30) + 5,
    issues: Math.floor(Math.random() * 5),
    documents: {
      insurance: true,
      registration: true,
      inspection: Math.random() > 0.2
    }
  }));
};

export default function AdminVehiclesPage() {
  const t = useTranslations('admin.vehicles');
  const [vehicles] = useState(generateVehicles());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTransmission, setFilterTransmission] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const router = useRouter();

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    const matchesTransmission = filterTransmission === 'all' || vehicle.transmission === filterTransmission;
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesTransmission && matchesCategory;
  });

  const vehicleStatuses = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: t('status.active'), icon: CheckCircle },
    maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: t('status.maintenance'), icon: Wrench },
    reserved: { bg: 'bg-blue-100', text: 'text-blue-700', label: t('status.reserved'), icon: Calendar },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: t('status.inactive'), icon: XCircle }
  };

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgUtilization: Math.round(vehicles.reduce((acc, v) => acc + v.utilizationRate, 0) / vehicles.length),
    needsService: vehicles.filter(v => v.nextService < new Date()).length,
    documentsExpiring: vehicles.filter(v => 
      v.insuranceExpiry < addDays(new Date(), 30) || 
      v.inspectionExpiry < addDays(new Date(), 30)
    ).length
  };

  const VehicleCard = ({ vehicle }: { vehicle: any }) => {
    const status = vehicleStatuses[vehicle.status as keyof typeof vehicleStatuses];
    const StatusIcon = status.icon;
    
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <img 
            src={vehicle.image} 
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${status.bg} ${status.text} text-xs font-medium flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
          {vehicle.issues > 0 && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t('card.issues', { count: vehicle.issues })}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600">{vehicle.registrationNumber}</p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('card.category')}</span>
              <span className="font-medium">{vehicle.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('card.transmission')}</span>
              <span className="font-medium">
                {vehicle.transmission === 'Manual' ? t('transmissionTypes.manual') : t('transmissionTypes.automatic')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('card.instructor')}</span>
              <span className="font-medium">{vehicle.instructor || t('card.unassigned')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('card.mileage')}</span>
              <span className="font-medium">{vehicle.mileage.toLocaleString()} {t('units.km')}</span>
            </div>
          </div>

          {/* Utilization bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">{t('card.utilization')}</span>
              <span className="font-medium">{vehicle.utilizationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  vehicle.utilizationRate > 80 ? 'bg-green-500' :
                  vehicle.utilizationRate > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${vehicle.utilizationRate}%` }}
              />
            </div>
          </div>

          {/* Warnings */}
          {(vehicle.insuranceExpiry < addDays(new Date(), 30) || 
            vehicle.inspectionExpiry < addDays(new Date(), 30)) && (
            <div className="mb-4 p-2 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {vehicle.insuranceExpiry < addDays(new Date(), 30) && t('card.insuranceExpiring')} 
                {vehicle.inspectionExpiry < addDays(new Date(), 30) && t('card.inspectionNeeded')}
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedVehicle(vehicle)}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              {t('buttons.details')}
            </button>
            <button
              onClick={() => console.log('History', vehicle.id)}
              className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              {t('buttons.history')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VehicleRow = ({ vehicle }: { vehicle: any }) => {
    const status = vehicleStatuses[vehicle.status as keyof typeof vehicleStatuses];
    const StatusIcon = status.icon;
    
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={vehicle.image} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-12 h-8 object-cover rounded"
            />
            <div>
              <p className="font-medium text-gray-800">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-sm text-gray-500">{vehicle.registrationNumber}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${status.bg} ${status.text} text-xs font-medium`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">{vehicle.category}</td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {vehicle.transmission === 'Manual' ? t('transmissionTypes.manual') : t('transmissionTypes.automatic')}
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {vehicle.instructor || <span className="text-gray-400">—</span>}
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">{vehicle.location}</td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {vehicle.mileage.toLocaleString()} {t('units.km')}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  vehicle.utilizationRate > 80 ? 'bg-green-500' :
                  vehicle.utilizationRate > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${vehicle.utilizationRate}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{vehicle.utilizationRate}%</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedVehicle(vehicle)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => console.log('Edit', vehicle.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => console.log('Settings', vehicle.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-4 h-4 text-gray-600" />
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">{t('stats.total')}</p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wrench className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.maintenance}</p>
              <p className="text-xs text-gray-500">{t('stats.maintenance')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgUtilization}%</p>
              <p className="text-xs text-gray-500">{t('stats.utilization')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.needsService}</p>
              <p className="text-xs text-gray-500">{t('stats.needsService')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.documentsExpiring}</p>
              <p className="text-xs text-gray-500">{t('stats.documentsExpiring')}</p>
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allStatuses')}</option>
              <option value="active">{t('filters.active')}</option>
              <option value="maintenance">{t('filters.inService')}</option>
              <option value="reserved">{t('filters.reserved')}</option>
              <option value="inactive">{t('filters.inactive')}</option>
            </select>
            
            <select
              value={filterTransmission}
              onChange={(e) => setFilterTransmission(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allTransmissions')}</option>
              <option value="Manual">{t('filters.manual')}</option>
              <option value="Automatic">{t('filters.automatic')}</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allCategories')}</option>
              <option value="B">B</option>
              <option value="B+E">B+E</option>
              <option value="C">C</option>
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
              {t('buttons.addVehicle')}
            </button>
            <button 
              onClick={() => router.push('/admin/vehicles/maintenance')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              {t('buttons.service')}
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
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.vehicle')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.category')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.transmission')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.instructor')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.location')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.mileage')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.utilization')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map(vehicle => (
                  <VehicleRow key={vehicle.id} vehicle={vehicle} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedVehicle.make} {selectedVehicle.model}
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <img 
                src={selectedVehicle.image} 
                alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('modal.registrationNumber')}</p>
                  <p className="font-medium">{selectedVehicle.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('modal.vin')}</p>
                  <p className="font-medium font-mono text-sm">{selectedVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('modal.year')}</p>
                  <p className="font-medium">{selectedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('modal.mileage')}</p>
                  <p className="font-medium">{selectedVehicle.mileage.toLocaleString()} {t('units.km')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('modal.fuel')}</p>
                  <p className="font-medium">{selectedVehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('modal.fuelLevel')}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedVehicle.fuelLevel > 50 ? 'bg-green-500' :
                          selectedVehicle.fuelLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedVehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedVehicle.fuelLevel}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-3">{t('modal.documentsAndDeadlines')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{t('modal.insurance')}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {t('modal.until')} {format(selectedVehicle.insuranceExpiry, 'dd.MM.yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{t('modal.inspection')}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {t('modal.until')} {format(selectedVehicle.inspectionExpiry, 'dd.MM.yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{t('modal.nextService')}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {format(selectedVehicle.nextService, 'dd.MM.yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {t('buttons.edit')}
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {t('buttons.serviceHistory')}
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  {t('buttons.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}