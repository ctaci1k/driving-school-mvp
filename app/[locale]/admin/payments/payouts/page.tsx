// app/[locale]/admin/payments/payouts/page.tsx
// Сторінка виплат - управління виплатами інструкторам

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft, DollarSign, Users, Calendar, TrendingUp,
  Download, Send, Eye, Clock, CheckCircle, XCircle,
  AlertCircle, CreditCard, Filter, Search, Plus,
  ChevronLeft, ChevronRight, RefreshCw, Loader2,
  User, GraduationCap, Car, Star, Activity, BarChart3,
  FileText, Calculator, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bankAccount: string;
  taxNumber: string;
}

interface Payout {
  id: string;
  instructorId: string;
  instructor: Instructor;
  period: {
    from: Date;
    to: Date;
  };
  lessons: number;
  hours: number;
  earnings: {
    gross: number;
    tax: number;
    net: number;
    commission: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'bank_transfer' | 'cash' | 'card';
  paymentDate?: Date;
  notes?: string;
}

const generatePayouts = (): Payout[] => {
  const instructors: Instructor[] = [
    {
      id: 'inst-1',
      name: 'Петро Коваленко',
      email: 'kovalenko@drive-school.ua',
      phone: '+380501234567',
      avatar: 'https://ui-avatars.com/api/?name=Петро+Коваленко&background=10B981&color=fff',
      bankAccount: 'UA61109010140000071219812874',
      taxNumber: '5234567890'
    },
    {
      id: 'inst-2',
      name: 'Анна Новак',
      email: 'novak@drive-school.ua',
      phone: '+380509876543',
      avatar: 'https://ui-avatars.com/api/?name=Анна+Новак&background=10B981&color=fff',
      bankAccount: 'UA27114020040000300201355387',
      taxNumber: '5234567891'
    },
    {
      id: 'inst-3',
      name: 'Іван Вишневський',
      email: 'vyshnevsky@drive-school.ua',
      phone: '+380507654321',
      avatar: 'https://ui-avatars.com/api/?name=Іван+Вишневський&background=10B981&color=fff',
      bankAccount: 'UA60102010260000042270201111',
      taxNumber: '5234567892'
    },
    {
      id: 'inst-4',
      name: 'Катерина Вовк',
      email: 'vovk@drive-school.ua',
      phone: '+380503456789',
      avatar: 'https://ui-avatars.com/api/?name=Катерина+Вовк&background=10B981&color=fff',
      bankAccount: 'UA83101010230000261395100000',
      taxNumber: '5234567893'
    }
  ];

  const payouts: Payout[] = [];
  const statuses: Payout['status'][] = ['pending', 'processing', 'completed', 'failed'];
  const methods: Payout['paymentMethod'][] = ['bank_transfer', 'cash', 'card'];

  // Генерація виплат за останні 3 місяці
  for (let month = 0; month < 3; month++) {
    const periodStart = startOfMonth(subMonths(new Date(), month));
    const periodEnd = endOfMonth(periodStart);
    
    instructors.forEach(instructor => {
      const lessons = Math.floor(Math.random() * 40) + 20;
      const hours = lessons * 1.5;
      const hourlyRate = 70 + Math.floor(Math.random() * 50);
      const gross = hours * hourlyRate;
      const commission = gross * 0.2;
      const tax = (gross - commission) * 0.19; // Польська ставка податку
      const net = gross - commission - tax;
      const status = month === 0 ? 'pending' : statuses[Math.floor(Math.random() * 3) + 1];
      
      payouts.push({
        id: `payout-${month}-${instructor.id}`,
        instructorId: instructor.id,
        instructor,
        period: {
          from: periodStart,
          to: periodEnd
        },
        lessons,
        hours,
        earnings: {
          gross,
          tax,
          net,
          commission
        },
        status,
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        paymentDate: status === 'completed' ? addDays(periodEnd, 5) : undefined,
        notes: status === 'failed' ? 'Неправильні банківські дані' : undefined
      });
    });
  }
  
  return payouts;
};

export default function AdminPayoutsPage() {
  const router = useRouter();
  const t = useTranslations('admin.payments.payouts');
  
  const [payouts] = useState(generatePayouts());
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Фільтрація виплат
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.instructor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payout.status === filterStatus;
    const matchesPeriod = format(payout.period.from, 'yyyy-MM') === selectedPeriod;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Пагінація
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage);

  // Розрахунок статистики
  const currentMonthPayouts = payouts.filter(p => 
    format(p.period.from, 'yyyy-MM') === selectedPeriod
  );
  
  const stats = {
    totalPayouts: currentMonthPayouts.reduce((acc, p) => acc + p.earnings.gross, 0),
    totalNet: currentMonthPayouts.reduce((acc, p) => acc + p.earnings.net, 0),
    totalCommission: currentMonthPayouts.reduce((acc, p) => acc + p.earnings.commission, 0),
    totalTax: currentMonthPayouts.reduce((acc, p) => acc + p.earnings.tax, 0),
    pending: currentMonthPayouts.filter(p => p.status === 'pending').length,
    processing: currentMonthPayouts.filter(p => p.status === 'processing').length,
    completed: currentMonthPayouts.filter(p => p.status === 'completed').length,
    failed: currentMonthPayouts.filter(p => p.status === 'failed').length,
    totalLessons: currentMonthPayouts.reduce((acc, p) => acc + p.lessons, 0),
    totalHours: currentMonthPayouts.reduce((acc, p) => acc + p.hours, 0)
  };

  // Дані для графіків
  const monthlyData = [
    { month: t('months.jan'), amount: 18500 },
    { month: t('months.feb'), amount: 19200 },
    { month: t('months.mar'), amount: 18800 },
    { month: t('months.apr'), amount: 19500 },
    { month: t('months.may'), amount: 20800 },
    { month: t('months.jun'), amount: 21200 }
  ];

  const distributionData = [
    { name: t('charts.salary'), value: stats.totalNet, color: '#10B981' },
    { name: t('charts.commission'), value: stats.totalCommission, color: '#3B82F6' },
    { name: t('charts.taxes'), value: stats.totalTax, color: '#F59E0B' }
  ];

  const getStatusBadge = (status: Payout['status']) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: t('status.pending') },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: RefreshCw, label: t('status.processing') },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: t('status.completed') },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: t('status.failed') }
    };
    return badges[status];
  };

  const handleProcessPayout = async (payout: Payout) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Processing payout:', payout.id);
    setLoading(false);
  };

  const handleBulkProcess = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Processing payouts:', selectedPayouts);
    setSelectedPayouts([]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/uk/admin/payments')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          {t('buttons.calculate')}
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-500">{t('stats.totalAmount')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalPayouts / 1000).toFixed(0)}k {t('currency')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('stats.gross')}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-500">{t('stats.toPay')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalNet / 1000).toFixed(0)}k {t('currency')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('stats.net')}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-500">{t('stats.commission')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalCommission / 1000).toFixed(0)}k {t('currency')}</p>
          <p className="text-xs text-gray-500 mt-1">20%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-500">{t('stats.taxes')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalTax / 1000).toFixed(0)}k {t('currency')}</p>
          <p className="text-xs text-gray-500 mt-1">19%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <p className="text-sm text-gray-500">{t('stats.lessons')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLessons}</p>
          <p className="text-xs text-gray-500 mt-1">{t('stats.inPeriod')}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <p className="text-sm text-gray-500">{t('stats.hours')}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalHours.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{t('stats.worked')}</p>
        </div>
      </div>

      {/* Графіки */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.payoutsDynamics')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ${t('currency')}`} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.payoutsDistribution')}</h3>
          <ResponsiveContainer width="100%" height={200}>
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
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ${t('currency')}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.value.toLocaleString()} {t('currency')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Фільтри */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('filters.allStatuses')}</option>
            <option value="pending">{t('filters.pending')}</option>
            <option value="processing">{t('filters.processing')}</option>
            <option value="completed">{t('filters.completed')}</option>
            <option value="failed">{t('filters.failed')}</option>
          </select>
          {selectedPayouts.length > 0 && (
            <button
              onClick={handleBulkProcess}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {t('buttons.processSelected', { count: selectedPayouts.length })}
            </button>
          )}
        </div>
      </div>

      {/* Таблиця виплат */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPayouts(paginatedPayouts.map(p => p.id));
                      } else {
                        setSelectedPayouts([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.instructor')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.period')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.lessonsHours')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.gross')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.net')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPayouts.map((payout) => {
                const statusBadge = getStatusBadge(payout.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayouts.includes(payout.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayouts([...selectedPayouts, payout.id]);
                          } else {
                            setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={payout.instructor.avatar}
                          alt={payout.instructor.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{payout.instructor.name}</p>
                          <p className="text-sm text-gray-500">{payout.instructor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {format(payout.period.from, 'dd.MM')} - {format(payout.period.to, 'dd.MM.yyyy')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{payout.lessons} {t('table.lessons')}</p>
                      <p className="text-sm text-gray-500">{payout.hours} {t('table.hours')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payout.earnings.gross.toLocaleString()} {t('currency')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-green-600">{payout.earnings.net.toLocaleString()} {t('currency')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayout(payout)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={t('buttons.details')}
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {payout.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayout(payout)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title={t('buttons.process')}
                          >
                            <Send className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => console.log('Download:', payout.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={t('buttons.download')}
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Пагінація */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t('pagination.showing', {
                from: startIndex + 1,
                to: Math.min(startIndex + itemsPerPage, filteredPayouts.length),
                total: filteredPayouts.length
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальне вікно деталей виплати */}
      {selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{t('details.title')}</h2>
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Інформація про інструктора */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('details.instructor')}</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPayout.instructor.avatar}
                    alt={selectedPayout.instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedPayout.instructor.name}</p>
                    <p className="text-sm text-gray-500">{selectedPayout.instructor.email}</p>
                    <p className="text-sm text-gray-500">{selectedPayout.instructor.phone}</p>
                  </div>
                </div>
              </div>

              {/* Період та статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">{t('details.period')}</p>
                  <p className="font-medium text-gray-900">
                    {format(selectedPayout.period.from, 'dd MMMM', { locale: uk })} - {format(selectedPayout.period.to, 'dd MMMM yyyy', { locale: uk })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">{t('details.statistics')}</p>
                  <p className="font-medium text-gray-900">
                    {selectedPayout.lessons} {t('table.lessons')} / {selectedPayout.hours} {t('stats.hours').toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Розрахунок виплат */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('details.settlement')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('details.calculated')}</span>
                    <span className="font-medium">{selectedPayout.earnings.gross.toLocaleString()} {t('currency')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('details.schoolCommission')}</span>
                    <span className="text-red-600">-{selectedPayout.earnings.commission.toLocaleString()} {t('currency')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('details.tax')}</span>
                    <span className="text-red-600">-{selectedPayout.earnings.tax.toLocaleString()} {t('currency')}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>{t('details.toPay')}</span>
                    <span className="text-green-600">{selectedPayout.earnings.net.toLocaleString()} {t('currency')}</span>
                  </div>
                </div>
              </div>

              {/* Платіжна інформація */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('details.paymentInfo')}</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('details.bankAccount')}</span>
                    <span className="font-mono text-sm">{selectedPayout.instructor.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('details.taxNumber')}</span>
                    <span className="font-mono text-sm">{selectedPayout.instructor.taxNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('details.paymentMethod')}</span>
                    <span className="text-sm">
                      {selectedPayout.paymentMethod === 'bank_transfer' && t('details.bankTransfer')}
                      {selectedPayout.paymentMethod === 'cash' && t('details.cash')}
                      {selectedPayout.paymentMethod === 'card' && t('details.card')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Дії */}
              <div className="flex gap-3">
                {selectedPayout.status === 'pending' && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('details.processPayment')}
                  </button>
                )}
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  {t('buttons.downloadReport')}
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('buttons.generateInvoice')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Оверлей завантаження */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-700">{t('loading.processing')}</span>
          </div>
        </div>
      )}
    </div>
  );
}