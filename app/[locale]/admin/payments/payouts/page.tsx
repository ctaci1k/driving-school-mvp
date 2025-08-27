// app/[locale]/admin/payments/payouts/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, DollarSign, Users, Calendar, TrendingUp,
  Download, Send, Eye, Clock, CheckCircle, XCircle,
  AlertCircle, CreditCard, Filter, Search, Plus,
  ChevronLeft, ChevronRight, RefreshCw, Loader2,
  User, GraduationCap, Car, Star, Activity, BarChart3,
  FileText, Calculator, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
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
      name: 'Piotr Kowalski',
      email: 'kowalski@drive-school.pl',
      phone: '+48501234567',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Kowalski&background=10B981&color=fff',
      bankAccount: 'PL61109010140000071219812874',
      taxNumber: '5234567890'
    },
    {
      id: 'inst-2',
      name: 'Anna Nowak',
      email: 'nowak@drive-school.pl',
      phone: '+48509876543',
      avatar: 'https://ui-avatars.com/api/?name=Anna+Nowak&background=10B981&color=fff',
      bankAccount: 'PL27114020040000300201355387',
      taxNumber: '5234567891'
    },
    {
      id: 'inst-3',
      name: 'Jan Wiśniewski',
      email: 'wisniewski@drive-school.pl',
      phone: '+48507654321',
      avatar: 'https://ui-avatars.com/api/?name=Jan+Wiśniewski&background=10B981&color=fff',
      bankAccount: 'PL60102010260000042270201111',
      taxNumber: '5234567892'
    },
    {
      id: 'inst-4',
      name: 'Katarzyna Wójcik',
      email: 'wojcik@drive-school.pl',
      phone: '+48503456789',
      avatar: 'https://ui-avatars.com/api/?name=Katarzyna+Wójcik&background=10B981&color=fff',
      bankAccount: 'PL83101010230000261395100000',
      taxNumber: '5234567893'
    }
  ];

  const payouts: Payout[] = [];
  const statuses: Payout['status'][] = ['pending', 'processing', 'completed', 'failed'];
  const methods: Payout['paymentMethod'][] = ['bank_transfer', 'cash', 'card'];

  // Generate payouts for last 3 months
  for (let month = 0; month < 3; month++) {
    const periodStart = startOfMonth(subMonths(new Date(), month));
    const periodEnd = endOfMonth(periodStart);
    
    instructors.forEach(instructor => {
      const lessons = Math.floor(Math.random() * 40) + 20;
      const hours = lessons * 1.5;
      const hourlyRate = 70 + Math.floor(Math.random() * 50);
      const gross = hours * hourlyRate;
      const commission = gross * 0.2;
      const tax = (gross - commission) * 0.19; // Polish tax rate
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
        notes: status === 'failed' ? 'Nieprawidłowe dane bankowe' : undefined
      });
    });
  }
  
  return payouts;
};

export default function AdminPayoutsPage() {
  const router = useRouter();
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

  // Filter payouts
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.instructor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payout.status === filterStatus;
    const matchesPeriod = format(payout.period.from, 'yyyy-MM') === selectedPeriod;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage);

  // Calculate stats
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

  // Chart data
  const monthlyData = [
    { month: 'Sty', amount: 18500 },
    { month: 'Lut', amount: 19200 },
    { month: 'Mar', amount: 18800 },
    { month: 'Kwi', amount: 19500 },
    { month: 'Maj', amount: 20800 },
    { month: 'Cze', amount: 21200 }
  ];

  const distributionData = [
    { name: 'Wynagrodzenie', value: stats.totalNet, color: '#10B981' },
    { name: 'Prowizja', value: stats.totalCommission, color: '#3B82F6' },
    { name: 'Podatki', value: stats.totalTax, color: '#F59E0B' }
  ];

  const getStatusBadge = (status: Payout['status']) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Oczekuje' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: RefreshCw, label: 'Przetwarzanie' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Wypłacono' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Błąd' }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/pl/admin/payments')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Wypłaty dla instruktorów</h1>
            <p className="text-gray-600 mt-1">Rozliczenia wynagrodzeń</p>
          </div>
        </div>
        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          Oblicz wypłaty
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-500">Suma całkowita</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalPayouts / 1000).toFixed(0)}k zł</p>
          <p className="text-xs text-gray-500 mt-1">Brutto</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-500">Do wypłaty</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalNet / 1000).toFixed(0)}k zł</p>
          <p className="text-xs text-gray-500 mt-1">Netto</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-500">Prowizja</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalCommission / 1000).toFixed(0)}k zł</p>
          <p className="text-xs text-gray-500 mt-1">20%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-500">Podatki</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(stats.totalTax / 1000).toFixed(0)}k zł</p>
          <p className="text-xs text-gray-500 mt-1">19%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <p className="text-sm text-gray-500">Lekcje</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLessons}</p>
          <p className="text-xs text-gray-500 mt-1">W okresie</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <p className="text-sm text-gray-500">Godziny</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalHours.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">Przepracowane</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dynamika wypłat</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} zł`} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Podział wypłat</h3>
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
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} zł`} />
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
                  {item.value.toLocaleString()} zł
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
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
                placeholder="Szukaj instruktora..."
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
            <option value="all">Wszystkie statusy</option>
            <option value="pending">Oczekuje</option>
            <option value="processing">Przetwarzanie</option>
            <option value="completed">Wypłacono</option>
            <option value="failed">Błąd</option>
          </select>
          {selectedPayouts.length > 0 && (
            <button
              onClick={handleBulkProcess}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Przetwórz wybrane ({selectedPayouts.length})
            </button>
          )}
        </div>
      </div>

      {/* Payouts Table */}
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
                  Instruktor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Okres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lekcje/Godziny
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brutto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Netto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
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
                      <p className="text-sm text-gray-900">{payout.lessons} lekcji</p>
                      <p className="text-sm text-gray-500">{payout.hours} godz.</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payout.earnings.gross.toLocaleString()} zł</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-green-600">{payout.earnings.net.toLocaleString()} zł</p>
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
                          title="Szczegóły"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {payout.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayout(payout)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Przetwórz"
                          >
                            <Send className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => console.log('Download:', payout.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Pobierz"
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Pokazano <span className="font-medium">{startIndex + 1}</span> -{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredPayouts.length)}
              </span>{' '}
              z <span className="font-medium">{filteredPayouts.length}</span> wypłat
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

      {/* Payout Details Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Szczegóły wypłaty</h2>
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Instructor Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Instruktor</h3>
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

              {/* Period and Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Okres</p>
                  <p className="font-medium text-gray-900">
                    {format(selectedPayout.period.from, 'dd MMMM', { locale: pl })} - {format(selectedPayout.period.to, 'dd MMMM yyyy', { locale: pl })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Statystyki</p>
                  <p className="font-medium text-gray-900">
                    {selectedPayout.lessons} lekcji / {selectedPayout.hours} godzin
                  </p>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Rozliczenie</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Naliczono (Brutto)</span>
                    <span className="font-medium">{selectedPayout.earnings.gross.toLocaleString()} zł</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Prowizja szkoły (20%)</span>
                    <span className="text-red-600">-{selectedPayout.earnings.commission.toLocaleString()} zł</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Podatek (19%)</span>
                    <span className="text-red-600">-{selectedPayout.earnings.tax.toLocaleString()} zł</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>Do wypłaty (Netto)</span>
                    <span className="text-green-600">{selectedPayout.earnings.net.toLocaleString()} zł</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Informacje płatnicze</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numer konta</span>
                    <span className="font-mono text-sm">{selectedPayout.instructor.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIP</span>
                    <span className="font-mono text-sm">{selectedPayout.instructor.taxNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metoda płatności</span>
                    <span className="text-sm">
                      {selectedPayout.paymentMethod === 'bank_transfer' && 'Przelew bankowy'}
                      {selectedPayout.paymentMethod === 'cash' && 'Gotówka'}
                      {selectedPayout.paymentMethod === 'card' && 'Karta'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedPayout.status === 'pending' && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Przetwórz wypłatę
                  </button>
                )}
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Pobierz raport
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Wygeneruj fakturę
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Przetwarzanie wypłat...</span>
          </div>
        </div>
      )}
    </div>
  );
}