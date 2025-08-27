// app/[locale]/admin/payments/invoices/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, FileText, Download, Send, Eye, Edit2, Trash2,
  Plus, Filter, Search, Calendar, DollarSign, User, Clock,
  CheckCircle, XCircle, AlertCircle, Printer, Mail, Copy,
  MoreHorizontal, CreditCard, Building, Phone, MapPin,
  ChevronLeft, ChevronRight, RefreshCw, Upload, Loader2
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { uk } from 'date-fns/locale';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  notes?: string;
}

const generateInvoices = (): Invoice[] => {
  const clients = [
    'Олександр Петренко', 'Марія Коваленко', 'Іван Шевченко', 'Юлія Ткаченко',
    'Петро Мельник', 'Оксана Бойко', 'Андрій Кравчук', 'Наталія Савченко',
    'Михайло Гончаренко', 'Тетяна Павленко', 'Василь Романенко', 'Світлана Яковенко'
  ];

  const statuses: Invoice['status'][] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  
  const invoices: Invoice[] = [];
  
  for (let i = 0; i < 100; i++) {
    const issueDate = subDays(new Date(), Math.floor(Math.random() * 60));
    const dueDate = addDays(issueDate, 14);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 5000) + 1500;
    const tax = amount * 0.2;
    
    invoices.push({
      id: `inv-${i + 1}`,
      number: `INV-2024-${String(i + 1).padStart(4, '0')}`,
      clientName: clients[Math.floor(Math.random() * clients.length)],
      clientEmail: `client${i}@example.com`,
      clientPhone: `+380${Math.floor(Math.random() * 900000000 + 100000000)}`,
      clientAddress: `вул. Хрещатик ${Math.floor(Math.random() * 100) + 1}, Київ`,
      amount,
      tax,
      total: amount + tax,
      status,
      issueDate,
      dueDate,
      paidDate: status === 'paid' ? addDays(issueDate, Math.floor(Math.random() * 10)) : undefined,
      items: [
        {
          description: 'Пакет навчання "Стандарт"',
          quantity: 1,
          price: amount * 0.7,
          total: amount * 0.7
        },
        {
          description: 'Додаткові заняття',
          quantity: Math.floor(Math.random() * 3) + 1,
          price: amount * 0.3,
          total: amount * 0.3
        }
      ],
      notes: 'Дякуємо за вашу довіру!'
    });
  }
  
  return invoices;
};

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [invoices] = useState(generateInvoices());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && invoice.issueDate >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDate = matchesDate && invoice.issueDate <= new Date(dateTo);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((acc, i) => acc + i.total, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.total, 0),
    pendingAmount: invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((acc, i) => acc + i.total, 0)
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Edit2, label: 'Чернетка' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Send, label: 'Надіслано' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Оплачено' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Прострочено' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle, label: 'Скасовано' }
    };
    return badges[status];
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === paginatedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(paginatedInvoices.map(i => i.id));
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    if (selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    } else {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    }
  };

  const handleBulkAction = async (action: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Bulk action: ${action} for invoices:`, selectedInvoices);
    setSelectedInvoices([]);
    setLoading(false);
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sending invoice:', invoice.number);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/uk/admin/payments')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Інвойси</h1>
            <p className="text-gray-600 mt-1">Управління рахунками та квитанціями</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Створити інвойс
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Всього</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Edit2 className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Чернетки</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-500">Надіслано</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-500">Оплачено</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-xs text-gray-500">Прострочено</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Загальна сума</p>
          </div>
          <p className="text-lg font-bold text-gray-800">₴{(stats.totalAmount / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-500">Оплачено</p>
          </div>
          <p className="text-lg font-bold text-green-600">₴{(stats.paidAmount / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-gray-500">Очікується</p>
          </div>
          <p className="text-lg font-bold text-orange-600">₴{(stats.pendingAmount / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук за номером, клієнтом..."
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
            <option value="all">Всі статуси</option>
            <option value="draft">Чернетка</option>
            <option value="sent">Надіслано</option>
            <option value="paid">Оплачено</option>
            <option value="overdue">Прострочено</option>
            <option value="cancelled">Скасовано</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Від"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="До"
          />
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Більше
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              Вибрано: {selectedInvoices.length} інвойсів
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('send')}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
              >
                Завантажити
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-white text-red-600 rounded border border-red-300 hover:bg-red-50"
              >
                Видалити
              </button>
              <button 
                onClick={() => setSelectedInvoices([])}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === paginatedInvoices.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клієнт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сума
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата видачі
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Термін оплати
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => {
                const statusBadge = getStatusBadge(invoice.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {invoice.number}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">₴{invoice.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Включно з ПДВ</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(invoice.issueDate, 'dd.MM.yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {format(invoice.dueDate, 'dd.MM.yyyy')}
                      </p>
                      {invoice.status === 'overdue' && (
                        <p className="text-xs text-red-600">
                          Прострочено на {Math.floor((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 3600 * 24))} днів
                        </p>
                      )}
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
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Переглянути"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleSendInvoice(invoice)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Надіслати"
                          >
                            <Send className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => console.log('Download:', invoice.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Завантажити PDF"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => console.log('More:', invoice.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
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
              Показано <span className="font-medium">{startIndex + 1}</span> -{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredInvoices.length)}
              </span>{' '}
              з <span className="font-medium">{filteredInvoices.length}</span> інвойсів
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = currentPage > 3 ? currentPage - 2 + index : index + 1;
                if (pageNumber > totalPages) return null;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Інвойс {selectedInvoice.number}</h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="flex justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Автошкола Драйв</h1>
                  <p className="text-gray-600">вул. Хрещатик 1, Київ, 01001</p>
                  <p className="text-gray-600">Тел: +380 44 123 45 67</p>
                  <p className="text-gray-600">Email: info@drive-school.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">ІНВОЙС</h2>
                  <p className="text-gray-600">№ {selectedInvoice.number}</p>
                  <p className="text-gray-600">Дата: {format(selectedInvoice.issueDate, 'dd.MM.yyyy')}</p>
                  <p className="text-gray-600">Термін оплати: {format(selectedInvoice.dueDate, 'dd.MM.yyyy')}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Клієнт:</h3>
                <p className="text-gray-700">{selectedInvoice.clientName}</p>
                <p className="text-gray-700">{selectedInvoice.clientAddress}</p>
                <p className="text-gray-700">Тел: {selectedInvoice.clientPhone}</p>
                <p className="text-gray-700">Email: {selectedInvoice.clientEmail}</p>
              </div>

              {/* Invoice Items */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Опис</th>
                    <th className="text-right py-2">Кількість</th>
                    <th className="text-right py-2">Ціна</th>
                    <th className="text-right py-2">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">₴{item.price.toLocaleString()}</td>
                      <td className="text-right py-2">₴{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-medium">Сума:</td>
                    <td className="text-right py-2 font-medium">₴{selectedInvoice.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-medium">ПДВ (20%):</td>
                    <td className="text-right py-2 font-medium">₴{selectedInvoice.tax.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="text-right py-3 text-xl font-bold">Всього до сплати:</td>
                    <td className="text-right py-3 text-xl font-bold text-blue-600">₴{selectedInvoice.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Примітки:</h3>
                  <p className="text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" />
                  Друкувати
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Завантажити PDF
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Надіслати email
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Копіювати
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
            <span className="text-gray-700">Обробка...</span>
          </div>
        </div>
      )}
    </div>
  );
}-50"
              >
                Надіслати
              </button>
              <button 
                onClick={() => handleBulkAction('download')}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray