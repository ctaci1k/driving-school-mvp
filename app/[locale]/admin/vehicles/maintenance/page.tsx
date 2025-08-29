// app/[locale]/admin/vehicles/maintenance/page.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
    Calendar, Clock, Car, Wrench, AlertCircle, CheckCircle,
    Filter, Search, Plus, Download, Eye, Edit, Trash2,
    DollarSign, TrendingUp, AlertTriangle, Info, X,
    ChevronLeft, ChevronRight, Gauge, Battery, Fuel
} from 'lucide-react';
import { format, addDays, subDays, isAfter, isBefore } from 'date-fns';
import { pl, uk } from 'date-fns/locale';

export default function VehicleMaintenancePage() {
    const t = useTranslations('admin.vehicles.maintenance');
    const locale = useLocale();
    const dateLocale = locale === 'uk' ? uk : pl;
    
    const [activeTab, setActiveTab] = useState('scheduled');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterVehicle, setFilterVehicle] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);

    // Mock vehicles data
    const vehicles = [
        { id: '1', make: 'Toyota', model: 'Corolla', registration: 'WZ 12345', currentMileage: 45670 },
        { id: '2', make: 'Volkswagen', model: 'Golf', registration: 'WZ 67890', currentMileage: 38450 },
        { id: '3', make: 'Škoda', model: 'Fabia', registration: 'WZ 11111', currentMileage: 52300 },
        { id: '4', make: 'Honda', model: 'Civic', registration: 'WZ 22222', currentMileage: 29800 },
        { id: '5', make: 'Renault', model: 'Megane', registration: 'WZ 33333', currentMileage: 61200 }
    ];

    // Mock maintenance records
    const maintenanceRecords = [
        {
            id: '1',
            vehicleId: '1',
            vehicle: 'Toyota Corolla WZ 12345',
            type: 'Wymiana oleju',
            status: 'scheduled',
            date: '2024-02-15',
            mileage: 46000,
            cost: 250,
            technician: 'Jan Kowalski',
            description: 'Standardowa wymiana oleju i filtra',
            priority: 'medium'
        },
        {
            id: '2',
            vehicleId: '2',
            vehicle: 'Volkswagen Golf WZ 67890',
            type: 'Przegląd okresowy',
            status: 'scheduled',
            date: '2024-02-20',
            mileage: 40000,
            cost: 450,
            technician: 'Piotr Nowak',
            description: 'Przegląd 40,000 km',
            priority: 'high'
        },
        {
            id: '3',
            vehicleId: '3',
            vehicle: 'Škoda Fabia WZ 11111',
            type: 'Wymiana klocków hamulcowych',
            status: 'in_progress',
            date: '2024-01-30',
            mileage: 52300,
            cost: 650,
            technician: 'Marek Wiśniewski',
            description: 'Wymiana przednich klocków hamulcowych',
            priority: 'high'
        },
        {
            id: '4',
            vehicleId: '1',
            vehicle: 'Toyota Corolla WZ 12345',
            type: 'Wymiana opon',
            status: 'completed',
            date: '2024-01-15',
            mileage: 45000,
            cost: 1200,
            technician: 'Jan Kowalski',
            description: 'Wymiana opon na zimowe',
            priority: 'medium'
        },
        {
            id: '5',
            vehicleId: '4',
            vehicle: 'Honda Civic WZ 22222',
            type: 'Naprawa klimatyzacji',
            status: 'completed',
            date: '2024-01-10',
            mileage: 29500,
            cost: 380,
            technician: 'Tomasz Duda',
            description: 'Uzupełnienie czynnika chłodniczego',
            priority: 'low'
        },
        {
            id: '6',
            vehicleId: '5',
            vehicle: 'Renault Megane WZ 33333',
            type: 'Wymiana świec zapłonowych',
            status: 'scheduled',
            date: '2024-03-01',
            mileage: 62000,
            cost: 180,
            technician: 'Piotr Nowak',
            description: 'Wymiana świec zapłonowych',
            priority: 'low'
        }
    ];

    // Upcoming maintenance alerts
    const upcomingAlerts = [
        { vehicle: 'Toyota Corolla WZ 12345', type: 'Wymiana oleju', dueIn: '330 km', priority: 'high' },
        { vehicle: 'Volkswagen Golf WZ 67890', type: 'Przegląd', dueIn: '1,550 km', priority: 'medium' },
        { vehicle: 'Škoda Fabia WZ 11111', type: 'Wymiana opon', dueIn: '2 tygodnie', priority: 'medium' },
        { vehicle: 'Honda Civic WZ 22222', type: 'Ubezpieczenie', dueIn: '30 dni', priority: 'high' }
    ];

    // Statistics
    const stats = {
        scheduled: maintenanceRecords.filter(r => r.status === 'scheduled').length,
        inProgress: maintenanceRecords.filter(r => r.status === 'in_progress').length,
        completed: maintenanceRecords.filter(r => r.status === 'completed').length,
        totalCost: maintenanceRecords.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.cost, 0),
        avgCost: Math.round(maintenanceRecords.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.cost, 0) / maintenanceRecords.filter(r => r.status === 'completed').length),
        vehiclesInService: 2
    };

    // Filter maintenance records
    const filteredRecords = maintenanceRecords.filter(record => {
        if (filterStatus !== 'all' && record.status !== filterStatus) return false;
        if (filterVehicle !== 'all' && record.vehicleId !== filterVehicle) return false;
        if (searchQuery && !record.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !record.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
                    <p className="text-gray-600 mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {t('buttons.export')}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('buttons.scheduleMaintenance')}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-xs text-gray-500">{t('stats.scheduled')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.scheduled}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Wrench className="w-5 h-5 text-yellow-600" />
                        <span className="text-xs text-gray-500">{t('stats.inProgress')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-gray-500">{t('stats.completed')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Car className="w-5 h-5 text-orange-600" />
                        <span className="text-xs text-gray-500">{t('stats.inService')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.vehiclesInService}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="text-xs text-gray-500">{t('stats.totalCost')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCost} {t('currency')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs text-gray-500">{t('stats.avgCost')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.avgCost} {t('currency')}</p>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{t('alerts.title')}</h2>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {t('alerts.count', { count: upcomingAlerts.length })}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {upcomingAlerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                            <div className="flex items-start justify-between mb-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5" />
                                <span className="text-xs font-semibold">{alert.dueIn}</span>
                            </div>
                            <p className="font-medium text-sm text-gray-800">{alert.vehicle}</p>
                            <p className="text-xs text-gray-600 mt-1">{alert.type}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('filters.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('filters.allStatuses')}</option>
                        <option value="scheduled">{t('filters.scheduled')}</option>
                        <option value="in_progress">{t('filters.inProgress')}</option>
                        <option value="completed">{t('filters.completed')}</option>
                    </select>
                    <select
                        value={filterVehicle}
                        onChange={(e) => setFilterVehicle(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('filters.allVehicles')}</option>
                        {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.make} {vehicle.model} - {vehicle.registration}
                            </option>
                        ))}
                    </select>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {t('buttons.moreFilters')}
                    </button>
                </div>
            </div>

            {/* Maintenance Records Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.vehicle')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.serviceType')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.date')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.mileage')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.technician')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.cost')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.status')}
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Car className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{record.vehicle}</p>
                                                <p className="text-xs text-gray-500">ID: V{record.vehicleId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{record.type}</p>
                                            <p className="text-xs text-gray-500">{record.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-800">
                                            {format(new Date(record.date), 'dd MMM yyyy', { locale: dateLocale })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-800">{record.mileage} {t('km')}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-800">{record.technician}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-semibold text-gray-800">{record.cost} {t('currency')}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                                            {t(`status.${record.status.replace('_', 'P')}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedMaintenance(record)}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Maintenance Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{t('modal.scheduleTitle')}</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.vehicle')}
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">{t('modal.selectVehicle')}</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.make} {vehicle.model} - {vehicle.registration}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.type')}
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">{t('modal.selectType')}</option>
                                        <option value="oil_change">{t('serviceTypes.oilChange')}</option>
                                        <option value="inspection">{t('serviceTypes.periodicInspection')}</option>
                                        <option value="tire_change">{t('serviceTypes.tireChange')}</option>
                                        <option value="brake_service">{t('serviceTypes.brakeService')}</option>
                                        <option value="other">{t('serviceTypes.other')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.date')}
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.mileage')}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder={t('modal.mileagePlaceholder')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.technician')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('modal.technicianPlaceholder')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('modal.estimatedCost')}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder={t('modal.costPlaceholder')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('modal.description')}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder={t('modal.descriptionPlaceholder')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('priority.label')}
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="priority" value="low" className="mr-2" />
                                        <span className="text-sm">{t('priority.low')}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="priority" value="medium" className="mr-2" defaultChecked />
                                        <span className="text-sm">{t('priority.medium')}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="priority" value="high" className="mr-2" />
                                        <span className="text-sm">{t('priority.high')}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {t('buttons.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t('buttons.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Maintenance Details Modal */}
            {selectedMaintenance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{t('modal.detailsTitle')}</h2>
                            <button
                                onClick={() => setSelectedMaintenance(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">{t('modal.vehicle')}</p>
                                <p className="font-semibold text-gray-800">{selectedMaintenance.vehicle}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t('modal.type')}</p>
                                <p className="font-semibold text-gray-800">{selectedMaintenance.type}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">{t('modal.date')}</p>
                                    <p className="font-semibold text-gray-800">
                                        {format(new Date(selectedMaintenance.date), 'dd MMMM yyyy', { locale: dateLocale })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t('modal.mileage')}</p>
                                    <p className="font-semibold text-gray-800">{selectedMaintenance.mileage.toLocaleString()} {t('km')}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">{t('modal.technician')}</p>
                                    <p className="font-semibold text-gray-800">{selectedMaintenance.technician}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t('table.cost')}</p>
                                    <p className="font-semibold text-gray-800">{selectedMaintenance.cost} {t('currency')}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t('modal.description')}</p>
                                <p className="text-gray-800">{selectedMaintenance.description}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t('table.status')}</p>
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedMaintenance.status)}`}>
                                    {t(`status.${selectedMaintenance.status.replace('_', 'P')}`)}
                                </span>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setSelectedMaintenance(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {t('buttons.close')}
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    {t('buttons.edit')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}