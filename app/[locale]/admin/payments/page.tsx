// app/[locale]/admin/payments/page.tsx
"use client";

import React, { useState } from 'react';
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

// Generate mock transactions
const generateTransactions = () => {
  const users = [
    'Іван Петренко', 'Марія Коваленко', 'Олександр Шевченко', 'Юлія Ткаченко',
    'Петро Мельник', 'Оксана Бойко', 'Андрій Кравчук', 'Наталія Савченко',
    'Михайло Гончаренко', 'Тетяна Павленко', 'Василь Романенко', 'Світлана Яковенко'
  ];
  
  const types = ['package', 'lesson', 'subscription', 'deposit', 'refund'];
  const methods = ['Card', 'Bank Transfer', 'Cash', 'Przelewy24', 'PayPal'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  const packages = ['Стандарт', 'Преміум', 'VIP', 'Базовий'];

  const transactions = [];
  
  for (let i = 0; i < 100; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const isRefund = type === 'refund';
    
    transactions.push({
      id: `TRX-2024-${String(i + 1).padStart(5, '0')}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      userName: users[Math.floor(Math.random() * users.length)],
      userEmail: `user${i}@example.com`,
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(users[i % users.length])}&background=3B82F6&color=fff`,
      type,
      description: type === 'package' ? `Пакет "${packages[Math.floor(Math.random() * packages.length)]}"` :
                   type === 'lesson' ? 'Одноразове заняття' :
                   type === 'subscription' ? 'Місячна підписка' :
                   type === 'deposit' ? 'Депозит на рахунок' :
                   'Повернення коштів',
      amount: isRefund ? -(Math.floor(Math.random() * 3000) + 500) : 
              Math.floor(Math.random() * 5000) + 500,
      currency: 'UAH',
      method: methods[Math.floor(Math.random() * methods.length)],
      status,
      date: subDays(new Date(), Math.floor(Math.random() * 30)),
      processingFee: Math.floor(Math.random() * 100) + 10,
      netAmount: 0, // Will calculate
      invoiceId: status === 'completed' ? `INV-2024-${String(i + 1).padStart(5, '0')}` : null,
      refundReason: status === 'refunded' ? 'Скасування за запитом клієнта' : null
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
  const [transactions] = useState(generateTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

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
  const methods = ['Card', 'Bank Transfer', 'Cash', 'Przelewy24', 'PayPal'];
  const methodColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  // Payment methods distribution
  const methodsData = methods.map(method => ({
    name: method,
    value: transactions.filter(t => t.method === method && t.status === 'completed').length,
    amount: transactions
      .filter(t => t.method === method && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  }));

  const paymentStatuses = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Завершено' },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Очікується' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Невдало' },
    refunded: { icon: RotateCcw, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Повернено' }
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
    // Implementation for CSV export
  };

  const handleRefund = (transactionId: string) => {
    console.log('Processing refund for:', transactionId);
    // Implementation for refund
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Платежі</h1>
          <p className="text-gray-600 mt-1">Управління фінансовими транзакціями</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Сьогодні</option>
            <option value="week">Цей тиждень</option>
            <option value="month">Цей місяць</option>
            <option value="year">Цей рік</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Експорт
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Створити інвойс
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
                ₴{(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Загальний дохід</p>
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
                ₴{(stats.pendingAmount / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Очікується</p>
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
                ₴{(stats.refundedAmount / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Повернено</p>
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
              <p className="text-xs text-gray-500">Успішність</p>
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
                ₴{stats.avgTransaction}
              </p>
              <p className="text-xs text-gray-500">Середній чек</p>
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
              <p className="text-xs text-gray-500">Сьогодні</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Динаміка доходів</h3>
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
                name="Дохід"
                stroke="#3B82F6"
                fill="#93BBFC"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="refunds"
                name="Повернення"
                stroke="#EF4444"
                fill="#FCA5A5"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Методи оплати</h3>
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
                  ₴{(method.amount / 1000).toFixed(1)}k
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
              Транзакції
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Інвойси
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payouts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Виплати інструкторам
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
                placeholder="Пошук за ID, користувачем..."
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
              <option value="all">Всі статуси</option>
              <option value="completed">Завершено</option>
              <option value="pending">Очікується</option>
              <option value="failed">Невдало</option>
              <option value="refunded">Повернено</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі типи</option>
              <option value="package">Пакети</option>
              <option value="lesson">Заняття</option>
              <option value="subscription">Підписка</option>
              <option value="deposit">Депозит</option>
              <option value="refund">Повернення</option>
            </select>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі методи</option>
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
                    ID транзакції
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Користувач
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сума
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Метод
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Завантаження...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Транзакцій не знайдено</p>
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
                              ₴{Math.abs(transaction.amount).toLocaleString()}
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
                              title="Переглянути"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {transaction.status === 'completed' && transaction.amount > 0 && (
                              <>
                                <button
                                  onClick={() => console.log('Download invoice', transaction.id)}
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title="Завантажити квитанцію"
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleRefund(transaction.id)}
                                  className="p-1 hover:bg-red-50 rounded-lg"
                                  title="Повернути кошти"
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

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="p-6 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Модуль інвойсів буде доступний найближчим часом</p>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="p-6 text-center">
            <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Модуль виплат інструкторам буде доступний найближчим часом</p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Деталі транзакції
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID транзакції</p>
                  <p className="font-mono font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Статус</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    paymentStatuses[selectedTransaction.status as keyof typeof paymentStatuses].bg
                  } ${paymentStatuses[selectedTransaction.status as keyof typeof paymentStatuses].color}`}>
                    {paymentStatuses[selectedTransaction.status as keyof typeof paymentStatuses].label}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Сума</p>
                  <p className={`font-semibold text-lg ${
                    selectedTransaction.amount < 0 ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    ₴{Math.abs(selectedTransaction.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Комісія</p>
                  <p className="font-medium">₴{selectedTransaction.processingFee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Чиста сума</p>
                  <p className="font-medium">₴{selectedTransaction.netAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Метод оплати</p>
                  <p className="font-medium">{selectedTransaction.method}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Користувач</p>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTransaction.userAvatar}
                    alt={selectedTransaction.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{selectedTransaction.userName}</p>
                    <p className="text-sm text-gray-500">{selectedTransaction.userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Опис</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Дата та час</p>
                <p className="font-medium">
                  {format(selectedTransaction.date, 'dd MMMM yyyy, HH:mm', { locale: uk })}
                </p>
              </div>

              {selectedTransaction.invoiceId && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Інвойс</p>
                  <p className="font-mono font-medium">{selectedTransaction.invoiceId}</p>
                </div>
              )}

              {selectedTransaction.refundReason && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Причина повернення</p>
                  <p className="text-sm">{selectedTransaction.refundReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {selectedTransaction.status === 'completed' && selectedTransaction.amount > 0 && (
                <>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Завантажити квитанцію
                  </button>
                  <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                    Повернути кошти
                  </button>
                </>
              )}
              {selectedTransaction.status === 'pending' && (
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Підтвердити платіж
                </button>
              )}
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}