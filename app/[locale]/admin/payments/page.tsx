// app/[locale]/admin/payments/page.tsx
// Головна сторінка платежів - управління фінансовими транзакціями

"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  CreditCard, CheckCircle, XCircle, Clock, RotateCcw, Download,
  Filter, Search, Calendar, TrendingUp, TrendingDown, DollarSign,
  User, FileText, AlertCircle, MoreHorizontal, Eye, RefreshCw,
  ArrowUpRight, ArrowDownRight, Loader2, Receipt, Send,
  Package, Coins, Wallet, PieChart, BarChart3, Activity
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// Helper functions
const formatCurrency = (amount: number) => {
  return `${Math.abs(amount)} грн`;
};

const formatNumber = (num: number) => {
  return num.toString();
};

// Генерація тестових транзакцій з українськими даними
const generateTransactions = () => {
  const users = [
    'Іван Коваленко', 'Марія Новак', 'Олександр Вишневський', 'Юлія Вовк',
    'Петро Камінський', 'Катерина Левандовська', 'Андрій Зеленський', 'Наталія Шевченко',
    'Михайло Возняк', 'Магдалена Дубровська', 'Тарас Козловський', 'Барбара Яковенко'
  ];
  
  const types = ['package', 'lesson', 'subscription', 'deposit', 'refund'];
  const methods = ['card', 'transfer', 'cash', 'przelewy24', 'paypal'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  const packages = ['standard', 'premium', 'vip', 'basic'];

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
      packageName: packages[i % packages.length],
      amount: isRefund ? -(500 + (i * 30) % 2500) : 
              500 + (i * 45) % 4500,
      currency: 'UAH',
      method: methods[i % methods.length],
      status,
      date: subDays(new Date(), i % 30),
      processingFee: 10 + (i * 7) % 90,
      netAmount: 0, // Will calculate
      invoiceId: status === 'completed' ? `INV-2024-${String(i + 1).padStart(5, '0')}` : null,
      refundReason: status === 'refunded' ? 'Скасування на прохання клієнта' : null
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
  const locale = params.locale || 'uk';
  const t = useTranslations('admin.payments.main');
  
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
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesMethod = filterMethod === 'all' || transaction.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  // Calculate stats
  const stats = {
    totalRevenue: transactions
      .filter(trans => trans.status === 'completed' && trans.amount > 0)
      .reduce((sum, trans) => sum + trans.amount, 0),
    pendingAmount: transactions
      .filter(trans => trans.status === 'pending')
      .reduce((sum, trans) => sum + trans.amount, 0),
    refundedAmount: Math.abs(transactions
      .filter(trans => trans.status === 'refunded' || trans.type === 'refund')
      .reduce((sum, trans) => sum + trans.amount, 0)),
    successRate: Math.round(
      (transactions.filter(trans => trans.status === 'completed').length / transactions.length) * 100
    ),
    avgTransaction: Math.round(
      transactions
        .filter(trans => trans.status === 'completed' && trans.amount > 0)
        .reduce((sum, trans, _, arr) => sum + trans.amount / arr.length, 0)
    ),
    transactionsToday: transactions.filter(trans => 
      format(trans.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length
  };

  // Revenue chart data
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTransactions = transactions.filter(trans => 
      format(trans.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      trans.status === 'completed'
    );
    
    return {
      date: format(date, 'dd.MM'),
      revenue: dayTransactions.filter(trans => trans.amount > 0).reduce((sum, trans) => sum + trans.amount, 0),
      refunds: Math.abs(dayTransactions.filter(trans => trans.amount < 0).reduce((sum, trans) => sum + trans.amount, 0)),
      transactions: dayTransactions.length
    };
  });

  // Define payment methods
  const methods = ['card', 'transfer', 'cash', 'przelewy24', 'paypal'];
  const methodColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  // Payment methods distribution
  const methodsData = methods.map((method, index) => ({
    name: t(`methods.${method}`),
    value: transactions.filter(trans => trans.method === method && trans.status === 'completed').length,
    amount: transactions
      .filter(trans => trans.method === method && trans.status === 'completed')
      .reduce((sum, trans) => sum + trans.amount, 0)
  }));

  const paymentStatuses = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    refunded: { icon: RotateCcw, color: 'text-gray-600', bg: 'bg-gray-100' }
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

  const getTransactionDescription = (transaction: any) => {
    if (transaction.type === 'package') {
      return t('typeDescriptions.package', { name: t(`packages.${transaction.packageName}`) });
    }
    return t(`typeDescriptions.${transaction.type}`);
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
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">{t('dateRange.today')}</option>
            <option value="week">{t('dateRange.week')}</option>
            <option value="month">{t('dateRange.month')}</option>
            <option value="year">{t('dateRange.year')}</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('buttons.export')}
          </button>
          <button 
            onClick={handleCreateInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            {t('buttons.createInvoice')}
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
                {Math.round(stats.totalRevenue / 1000)}k {t('currency')}
              </p>
              <p className="text-xs text-gray-500">{t('stats.totalRevenue')}</p>
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
                {Math.round(stats.pendingAmount / 1000)}k {t('currency')}
              </p>
              <p className="text-xs text-gray-500">{t('stats.pending')}</p>
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
                {Math.round(stats.refundedAmount / 1000)}k {t('currency')}
              </p>
              <p className="text-xs text-gray-500">{t('stats.refunded')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.successRate')}</p>
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
                {stats.avgTransaction} {t('currency')}
              </p>
              <p className="text-xs text-gray-500">{t('stats.avgTransaction')}</p>
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
              <p className="text-xs text-gray-500">{t('stats.todayTransactions')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.revenueDynamics')}</h3>
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
                name={t('charts.revenue')}
                stroke="#3B82F6"
                fill="#93BBFC"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="refunds"
                name={t('charts.refunds')}
                stroke="#EF4444"
                fill="#FCA5A5"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('charts.paymentMethods')}</h3>
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
                  {Math.round(method.amount / 1000)}k {t('currency')}
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
              {t('tabs.transactions')}
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
              {t('tabs.invoices')}
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
              {t('tabs.payouts')}
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
              <option value="completed">{t('status.completed')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="failed">{t('status.failed')}</option>
              <option value="refunded">{t('status.refunded')}</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allTypes')}</option>
              <option value="package">{t('types.package')}</option>
              <option value="lesson">{t('types.lesson')}</option>
              <option value="subscription">{t('types.subscription')}</option>
              <option value="deposit">{t('types.deposit')}</option>
              <option value="refund">{t('types.refund')}</option>
            </select>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('filters.allMethods')}</option>
              {methods.map(method => (
                <option key={method} value={method}>{t(`methods.${method}`)}</option>
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
                    {t('table.transactionId')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.user')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.type')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.amount')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.method')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.date')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">{t('messages.loading')}</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{t('messages.noTransactions')}</p>
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
                            <span className="text-sm text-gray-600">{getTransactionDescription(transaction)}</span>
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
                          {t(`methods.${transaction.method}`)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {t(`status.${transaction.status}`)}
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
                              title={t('buttons.viewDetails')}
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {transaction.status === 'completed' && transaction.amount > 0 && (
                              <>
                                <button
                                  onClick={() => console.log('Download invoice', transaction.id)}
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title={t('buttons.downloadInvoice')}
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleRefund(transaction.id)}
                                  className="p-1 hover:bg-red-50 rounded-lg"
                                  title={t('buttons.refund')}
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