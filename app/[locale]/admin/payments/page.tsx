// app/[locale]/admin/payments/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  CreditCard, CheckCircle, XCircle, Clock, RotateCcw, Download,
  Filter, Search, Calendar, TrendingUp, TrendingDown, DollarSign,
  User, FileText, AlertCircle, MoreHorizontal, Eye, RefreshCw,
  ArrowUpRight, ArrowDownRight, Loader2, Receipt, Send,
  Package, Coins, Wallet, PieChart, BarChart3, Activity
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// Helper function to format numbers consistently
const formatCurrency = (amount: number) => {
  return `${Math.abs(amount)} zł`;
};

const formatNumber = (num: number) => {
  return num.toString();
};

// Generate mock transactions with Polish data
const generateTransactions = () => {
  const users = [
    'Jan Kowalski', 'Maria Nowak', 'Aleksander Wiśniewski', 'Julia Wójcik',
    'Piotr Kamiński', 'Katarzyna Lewandowska', 'Andrzej Zieliński', 'Natalia Szymańska',
    'Michał Woźniak', 'Magdalena Dąbrowska', 'Tomasz Kozłowski', 'Barbara Jankowska'
  ];
  
  const types = ['package', 'lesson', 'subscription', 'deposit', 'refund'];
  const methods = ['Karta', 'Przelew', 'Gotówka', 'Przelewy24', 'PayPal'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  const packages = ['Standard', 'Premium', 'VIP', 'Podstawowy'];

  const transactions = [];
  
  for (let i = 0; i < 100; i++) {
    const statusIndex = i % 4;
    const typeIndex = i % 5;
    const status = statuses[statusIndex];
    const type = types[typeIndex];
    const isRefund = type === 'refund';
    
    transactions.push({
      id: `TRX-2024-${String(i + 1).padStart(5, '0')}`,
      userId: `user-${(i % 50) + 1}`,
      userName: users[i % users.length],
      userEmail: `user${i}@example.com`,
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(users[i % users.length])}&background=3B82F6&color=fff`,
      type,
      description: type === 'package' ? `Pakiet "${packages[i % packages.length]}"` :
                   type === 'lesson' ? 'Pojedyncze zajęcia' :
                   type === 'subscription' ? 'Miesięczna subskrypcja' :
                   type === 'deposit' ? 'Depozyt na konto' :
                   'Zwrot środków',
      amount: isRefund ? -(500 + (i * 30) % 2500) : 
              500 + (i * 45) % 4500,
      currency: 'PLN',
      method: methods[i % methods.length],
      status,
      date: subDays(new Date(), i % 30),
      processingFee: 10 + (i * 7) % 90,
      netAmount: 0, // Will calculate
      invoiceId: status === 'completed' ? `INV-2024-${String(i + 1).padStart(5, '0')}` : null,
      refundReason: status === 'refunded' ? 'Anulowanie na prośbę klienta' : null
    });
  }
  
  // Calculate net amounts
  transactions.forEach(t => {
    t.netAmount = t.amount > 0 ? t.amount - t.processingFee : t.amount;
  });
  
  // Sort by date (newest first)
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return transactions;
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'pl';
  
  const [transactions] = useState(generateTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  // Navigation handlers
  const handleCreateInvoice = () => {
    router.push(`/${locale}/admin/payments/invoices`);
  };

  const handleViewPayouts = () => {
    router.push(`/${locale}/admin/payments/payouts`);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesMethod = filterMethod === 'all' || t.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  // Calculate stats
  const stats = {
    totalRevenue: transactions
      .filter(t => t.status === 'completed' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0),
    refundedAmount: Math.abs(transactions
      .filter(t => t.status === 'refunded' || t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0)),
    successRate: Math.round(
      (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100
    ),
    avgTransaction: Math.round(
      transactions
        .filter(t => t.status === 'completed' && t.amount > 0)
        .reduce((sum, t, _, arr) => sum + t.amount / arr.length, 0)
    ),
    transactionsToday: transactions.filter(t => 
      format(t.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length
  };

  // Revenue chart data
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTransactions = transactions.filter(t => 
      format(t.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      t.status === 'completed'
    );
    
    return {
      date: format(date, 'dd.MM'),
      revenue: dayTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      refunds: Math.abs(dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
      transactions: dayTransactions.length
    };
  });

  // Define payment methods
  const methods = ['Karta', 'Przelew', 'Gotówka', 'Przelewy24', 'PayPal'];
  const methodColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  // Payment methods distribution
  const methodsData = methods.map((method, index) => ({
    name: method,
    value: transactions.filter(t => t.method === method && t.status === 'completed').length,
    amount: transactions
      .filter(t => t.method === method && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  }));

  const paymentStatuses = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Zakończona' },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Oczekująca' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Nieudana' },
    refunded: { icon: RotateCcw, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Zwrócona' }
  };

  const typeIcons = {
    package: Package,
    lesson: Calendar,
    subscription: CreditCard,
    deposit: Wallet,
    refund: RotateCcw
  };

  const handleExport = () => {
    console.log('Exporting transactions...');
  };

  const handleRefund = (transactionId: string) => {
    console.log('Processing refund for:', transactionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Płatności</h1>
          <p className="text-gray-600 mt-1">Zarządzanie transakcjami finansowymi</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Dzisiaj</option>
            <option value="week">Ten tydzień</option>
            <option value="month">Ten miesiąc</option>
            <option value="year">Ten rok</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Eksport
          </button>
          <button 
            onClick={handleCreateInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Utwórz fakturę
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.totalRevenue / 1000)}k zł
              </p>
              <p className="text-xs text-gray-500">Całkowity przychód</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.pendingAmount / 1000)}k zł
              </p>
              <p className="text-xs text-gray-500">Oczekujące</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <RotateCcw className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.refundedAmount / 1000)}k zł
              </p>
              <p className="text-xs text-gray-500">Zwrócone</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.successRate}%</p>
              <p className="text-xs text-gray-500">Sukces</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.avgTransaction} zł
              </p>
              <p className="text-xs text-gray-500">Średnia kwota</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.transactionsToday}</p>
              <p className="text-xs text-gray-500">Dzisiaj</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dynamika przychodów</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Przychód"
                stroke="#3B82F6"
                fill="#93BBFC"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="refunds"
                name="Zwroty"
                stroke="#EF4444"
                fill="#FCA5A5"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Metody płatności</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={methodsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {methodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={methodColors[index % methodColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {methodsData.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: methodColors[index % methodColors.length] }}
                  />
                  <span className="text-sm text-gray-600">{method.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {Math.round(method.amount / 1000)}k zł
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transakcje
            </button>
            <button
              onClick={() => {
                setActiveTab('invoices');
                handleCreateInvoice();
              }}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Faktury
            </button>
            <button
              onClick={() => {
                setActiveTab('payouts');
                handleViewPayouts();
              }}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payouts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Wypłaty instruktorom
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj po ID, użytkowniku..."
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
              <option value="all">Wszystkie statusy</option>
              <option value="completed">Zakończone</option>
              <option value="pending">Oczekujące</option>
              <option value="failed">Nieudane</option>
              <option value="refunded">Zwrócone</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie typy</option>
              <option value="package">Pakiety</option>
              <option value="lesson">Zajęcia</option>
              <option value="subscription">Subskrypcja</option>
              <option value="deposit">Depozyt</option>
              <option value="refund">Zwrot</option>
            </select>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie metody</option>
              {methods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID transakcji
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Użytkownik
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kwota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metoda
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Ładowanie...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nie znaleziono transakcji</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.slice(0, 20).map((transaction) => {
                    const status = paymentStatuses[transaction.status as keyof typeof paymentStatuses];
                    const StatusIcon = status.icon;
                    const TypeIcon = typeIcons[transaction.type as keyof typeof typeIcons];
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-mono text-sm text-gray-800">{transaction.id}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={transaction.userAvatar}
                              alt={transaction.userName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{transaction.userName}</p>
                              <p className="text-xs text-gray-500">{transaction.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{transaction.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {transaction.amount < 0 ? (
                              <ArrowDownRight className="w-4 h-4 text-red-500" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                            )}
                            <span className={`font-semibold ${
                              transaction.amount < 0 ? 'text-red-600' : 'text-gray-800'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {transaction.method}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {format(transaction.date, 'dd.MM.yyyy HH:mm')}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedTransaction(transaction)}
                              className="p-1 hover:bg-gray-100 rounded-lg"
                              title="Podgląd"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {transaction.status === 'completed' && transaction.amount > 0 && (
                              <>
                                <button
                                  onClick={() => console.log('Download invoice', transaction.id)}
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title="Pobierz fakturę"
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleRefund(transaction.id)}
                                  className="p-1 hover:bg-red-50 rounded-lg"
                                  title="Zwrot środków"
                                >
                                  <RotateCcw className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}