// app/[locale]/admin/packages/page.tsx
// Сторінка списку пакетів - управління тарифними планами автошколи

"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Package, Plus, Edit2, Trash2, Eye, Copy, Archive,
  TrendingUp, Users, DollarSign, Clock, Calendar,
  CheckCircle, XCircle, AlertCircle, Info, Star,
  Zap, Award, Target, Gift, Coins, CreditCard,
  BarChart3, Activity, Filter, Search, Download,
  ChevronRight, Loader2, Shield, Sparkles, Crown
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Generate mock packages data
const generatePackages = () => {
  return [
    {
      id: 'package-1',
      name: 'basic',
      icon: Shield,
      color: 'gray',
      credits: 10,
      price: 1200,
      originalPrice: null,
      discount: 0,
      validity: 30,
      popular: false,
      recommended: false,
      new: false,
      active: true,
      priority: 1,
      purchaseCount: 145,
      activeUsers: 42,
      revenue: 174000,
      avgRating: 4.3,
      renewalRate: 65,
      category: 'beginner'
    },
    {
      id: 'package-2',
      name: 'standard',
      icon: Star,
      color: 'blue',
      credits: 20,
      price: 2200,
      originalPrice: 2500,
      discount: 10,
      validity: 60,
      popular: true,
      recommended: true,
      new: false,
      active: true,
      priority: 2,
      purchaseCount: 523,
      activeUsers: 186,
      revenue: 1150600,
      avgRating: 4.6,
      renewalRate: 78,
      category: 'standard'
    },
    {
      id: 'package-3',
      name: 'premium',
      icon: Zap,
      color: 'purple',
      credits: 30,
      price: 3200,
      originalPrice: 3800,
      discount: 13,
      validity: 90,
      popular: false,
      recommended: false,
      new: false,
      active: true,
      priority: 3,
      purchaseCount: 234,
      activeUsers: 89,
      revenue: 748800,
      avgRating: 4.8,
      renewalRate: 85,
      category: 'premium'
    },
    {
      id: 'package-4',
      name: 'vip',
      icon: Crown,
      color: 'gold',
      credits: 50,
      price: 5500,
      originalPrice: 7000,
      discount: 20,
      validity: 180,
      popular: false,
      recommended: false,
      new: true,
      active: true,
      priority: 4,
      purchaseCount: 67,
      activeUsers: 34,
      revenue: 368500,
      avgRating: 4.9,
      renewalRate: 92,
      category: 'vip'
    },
    {
      id: 'package-5',
      name: 'intensive',
      icon: Sparkles,
      color: 'orange',
      credits: 15,
      price: 1900,
      originalPrice: null,
      discount: 0,
      validity: 14,
      popular: false,
      recommended: false,
      new: true,
      active: true,
      priority: 5,
      purchaseCount: 89,
      activeUsers: 23,
      revenue: 169100,
      avgRating: 4.4,
      renewalRate: 45,
      category: 'intensive'
    },
    {
      id: 'package-6',
      name: 'student',
      icon: Award,
      color: 'green',
      credits: 20,
      price: 1800,
      originalPrice: 2200,
      discount: 15,
      validity: 90,
      popular: false,
      recommended: false,
      new: false,
      active: true,
      priority: 6,
      purchaseCount: 178,
      activeUsers: 67,
      revenue: 320400,
      avgRating: 4.5,
      renewalRate: 70,
      category: 'special'
    },
    {
      id: 'package-7',
      name: 'corporate',
      icon: Users,
      color: 'indigo',
      credits: 100,
      price: 9500,
      originalPrice: 12000,
      discount: 20,
      validity: 365,
      popular: false,
      recommended: false,
      new: false,
      active: true,
      priority: 7,
      purchaseCount: 12,
      activeUsers: 45,
      revenue: 114000,
      avgRating: 4.7,
      renewalRate: 88,
      category: 'corporate'
    },
    {
      id: 'package-8',
      name: 'trial',
      icon: Gift,
      color: 'pink',
      credits: 3,
      price: 299,
      originalPrice: null,
      discount: 0,
      validity: 7,
      popular: false,
      recommended: false,
      new: false,
      active: false,
      priority: 8,
      purchaseCount: 456,
      activeUsers: 0,
      revenue: 136344,
      avgRating: 4.2,
      renewalRate: 95,
      category: 'trial'
    }
  ];
};

export default function AdminPackagesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'uk';
  const t = useTranslations('admin.packages.list');
  
  const [packages] = useState(generatePackages());
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const handleViewPackage = (packageId: string) => {
    router.push(`/${locale}/admin/packages/${packageId}`);
  };

  const handleEditPackage = (packageId: string) => {
    router.push(`/${locale}/admin/packages/${packageId}/`);
  };

  const handleAddPackage = () => {
    router.push(`/${locale}/admin/packages/new`);
  };

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const packageName = t(`packages.${pkg.name}.name`);
    const packageDescription = t(`packages.${pkg.name}.description`);
    
    const matchesSearch = 
      packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && pkg.active) ||
      (filterStatus === 'inactive' && !pkg.active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => a.priority - b.priority);

  // Calculate stats
  const stats = {
    totalPackages: packages.length,
    activePackages: packages.filter(p => p.active).length,
    totalRevenue: packages.reduce((acc, p) => acc + p.revenue, 0),
    totalUsers: packages.reduce((acc, p) => acc + p.activeUsers, 0),
    avgRating: (packages.reduce((acc, p) => acc + p.avgRating, 0) / packages.length).toFixed(1),
    avgRenewal: Math.round(packages.reduce((acc, p) => acc + p.renewalRate, 0) / packages.length)
  };

  // Sales data for chart
  const salesData = [
    { month: t('charts.months.jan'), sales: 45000 },
    { month: t('charts.months.feb'), sales: 52000 },
    { month: t('charts.months.mar'), sales: 48000 },
    { month: t('charts.months.apr'), sales: 61000 },
    { month: t('charts.months.may'), sales: 58000 },
    { month: t('charts.months.jun'), sales: 65000 }
  ];

  // Distribution data for pie chart
  const distributionData = packages
    .filter(p => p.active)
    .map(p => ({
      name: t(`packages.${p.name}.name`),
      value: p.activeUsers,
      color: getColorValue(p.color)
    }));

  function getColorValue(color: string): string {
    const colors: Record<string, string> = {
      gray: '#6B7280',
      blue: '#3B82F6',
      purple: '#8B5CF6',
      gold: '#F59E0B',
      orange: '#FB923C',
      green: '#10B981',
      indigo: '#6366F1',
      pink: '#EC4899'
    };
    return colors[color] || '#3B82F6';
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
      gold: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-300' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300' }
    };
    return colors[color] || colors.blue;
  };

  const PackageCard = ({ pkg }: { pkg: any }) => {
    const Icon = pkg.icon;
    const colorClasses = getColorClasses(pkg.color);
    const packageFeatures = t.raw(`packages.${pkg.name}.features`) as string[];

    return (
      <div className={`bg-white rounded-xl shadow-sm border-2 ${pkg.popular ? 'border-blue-500' : 'border-gray-100'} hover:shadow-lg transition-shadow relative`}>
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {pkg.popular && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              {t('badges.popular')}
            </span>
          )}
          {pkg.recommended && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              {t('badges.recommended')}
            </span>
          )}
          {pkg.new && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
              {t('badges.new')}
            </span>
          )}
          {!pkg.active && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
              {t('badges.inactive')}
            </span>
          )}
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
              <Icon className={`w-8 h-8 ${colorClasses.text}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{t(`packages.${pkg.name}.name`)}</h3>
              <p className="text-sm text-gray-600 mt-1">{t(`packages.${pkg.name}.description`)}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-800">{pkg.price} {t('currency')}</span>
              {pkg.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{pkg.originalPrice} {t('currency')}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                    {t('discount', { percent: pkg.discount })}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span>{pkg.credits} {t('packageCard.credits')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{pkg.validity} {t('packageCard.days')}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{t('packageCard.contains')}</p>
            <ul className="space-y-1">
              {packageFeatures.slice(0, 3).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
              {packageFeatures.length > 3 && (
                <li className="text-sm text-blue-600 font-medium">
                  {t('packageCard.more', { count: packageFeatures.length - 3 })}
                </li>
              )}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">{t('packageCard.users')}</p>
              <p className="text-lg font-semibold text-gray-800">{pkg.activeUsers}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">{t('packageCard.rating')}</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">{pkg.avgRating}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">{t('packageCard.renewals')}</p>
              <p className="text-lg font-semibold text-gray-800">{pkg.renewalRate}%</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewPackage(pkg.id)}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
            >
              {t('buttons.details')}
            </button>
            <button
              onClick={() => handleEditPackage(pkg.id)}
              className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
            >
              {t('buttons.edit')}
            </button>
            <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
              <Copy className="w-4 h-4" />
            </button>
          </div>
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
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('buttons.export')}
          </button>
          <button 
            onClick={handleAddPackage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('buttons.newPackage')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPackages}</p>
              <p className="text-xs text-gray-500">{t('stats.totalPackages')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.activePackages}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500">{t('stats.users')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{(stats.totalRevenue / 1000).toFixed(0)}k {t('currency')}</p>
              <p className="text-xs text-gray-500">{t('stats.revenue')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
              <p className="text-xs text-gray-500">{t('stats.avgRating')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgRenewal}%</p>
              <p className="text-xs text-gray-500">{t('stats.renewals')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.monthlySales')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.userDistribution')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {distributionData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allCategories')}</option>
              <option value="beginner">{t('categories.beginner')}</option>
              <option value="standard">{t('categories.standard')}</option>
              <option value="premium">{t('categories.premium')}</option>
              <option value="vip">{t('categories.vip')}</option>
              <option value="intensive">{t('categories.intensive')}</option>
              <option value="special">{t('categories.special')}</option>
              <option value="corporate">{t('categories.corporate')}</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allStatuses')}</option>
              <option value="active">{t('filters.active')}</option>
              <option value="inactive">{t('filters.inactive')}</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.package')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.price')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.credits')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.users')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.sales')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.revenue')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.rating')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <pkg.icon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-800">{t(`packages.${pkg.name}.name`)}</p>
                          <p className="text-sm text-gray-500">{t(`categories.${pkg.category}`)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{pkg.price} {t('currency')}</p>
                      {pkg.discount > 0 && (
                        <span className="text-xs text-red-600">{t('discount', { percent: pkg.discount })}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{pkg.credits}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{pkg.activeUsers}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{pkg.purchaseCount}</td>
                    <td className="px-4 py-4 text-sm font-semibold">{(pkg.revenue / 1000).toFixed(0)}k {t('currency')}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{pkg.avgRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {pkg.active ? t('table.statusActive') : t('table.statusInactive')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewPackage(pkg.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleEditPackage(pkg.id)} 
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                          {pkg.active ? (
                            <Archive className="w-4 h-4 text-gray-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}