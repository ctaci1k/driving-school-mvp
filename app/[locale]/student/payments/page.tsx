// File: /app/[locale]/(student)/student/payments/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  CreditCard, Coins, TrendingUp, Package, Clock, CheckCircle,
  AlertCircle, Download, ChevronRight, Plus, Zap, Star,
  Gift, Shield, Calendar, Receipt, Filter, Search, 
  ArrowUpRight, ArrowDownRight, Wallet, Tag, Sparkles
} from 'lucide-react';

export default function StudentPaymentsPage() {
  const [activeTab, setActiveTab] = useState('packages'); // packages, credits, history
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const userCredits = {
    available: 12,
    used: 24,
    expiring: 2,
    expiryDate: '2024-09-15',
    totalPurchased: 36
  };

  const packages = [
    {
      id: 1,
      name: 'Pakiet Startowy',
      credits: 5,
      price: 450,
      pricePerCredit: 90,
      savings: 0,
      validityDays: 30,
      features: [
        'Ważność 30 dni',
        'Dowolny instruktor',
        'Wszystkie typy lekcji',
        'Anulowanie do 24h'
      ],
      color: 'bg-gray-100',
      borderColor: 'border-gray-300',
      popular: false
    },
    {
      id: 2,
      name: 'Pakiet Standardowy',
      credits: 10,
      price: 850,
      pricePerCredit: 85,
      savings: 50,
      validityDays: 60,
      features: [
        'Ważność 60 dni',
        'Dowolny instruktor',
        'Wszystkie typy lekcji',
        'Anulowanie do 24h',
        '1 lekcja próbna gratis'
      ],
      color: 'bg-blue-50',
      borderColor: 'border-blue-500',
      popular: true,
      badge: 'POPULARNY'
    },
    {
      id: 3,
      name: 'Pakiet Premium',
      credits: 20,
      price: 1600,
      pricePerCredit: 80,
      savings: 200,
      validityDays: 90,
      features: [
        'Ważność 90 dni',
        'Priorytetowa rezerwacja',
        'Wszystkie typy lekcji',
        'Anulowanie do 12h',
        '2 lekcje próbne gratis',
        'Materiały szkoleniowe'
      ],
      color: 'bg-purple-50',
      borderColor: 'border-purple-500',
      popular: false,
      badge: 'NAJLEPSZA WARTOŚĆ'
    },
    {
      id: 4,
      name: 'Pakiet Intensywny',
      credits: 30,
      price: 2250,
      pricePerCredit: 75,
      savings: 450,
      validityDays: 120,
      features: [
        'Ważność 120 dni',
        'Priorytetowa rezerwacja',
        'Dedykowany instruktor',
        'Anulowanie do 6h',
        '3 lekcje próbne gratis',
        'Materiały szkoleniowe',
        'Egzamin próbny'
      ],
      color: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      borderColor: 'border-orange-500',
      popular: false,
      badge: 'EKSKLUZYWNY'
    }
  ];

  const specialOffers = [
    {
      id: 1,
      type: 'discount',
      title: 'Zniżka dla studentów',
      description: '15% rabatu na wszystkie pakiety',
      code: 'STUDENT15',
      validUntil: '2024-09-30'
    },
    {
      id: 2,
      type: 'bonus',
      title: 'Polecaj i zyskuj',
      description: 'Otrzymaj 2 darmowe kredyty za każdego poleconego znajomego',
      code: 'REF2024',
      validUntil: '2024-12-31'
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-08-20',
      type: 'package',
      description: 'Pakiet Standardowy - 10 kredytów',
      amount: 850,
      status: 'completed',
      method: 'Przelewy24',
      invoice: 'FV/2024/08/001'
    },
    {
      id: 2,
      date: '2024-07-15',
      type: 'package',
      description: 'Pakiet Startowy - 5 kredytów',
      amount: 450,
      status: 'completed',
      method: 'Karta kredytowa',
      invoice: 'FV/2024/07/023'
    },
    {
      id: 3,
      date: '2024-06-10',
      type: 'single',
      description: 'Pojedyncza lekcja',
      amount: 100,
      status: 'completed',
      method: 'BLIK',
      invoice: 'FV/2024/06/045'
    },
    {
      id: 4,
      date: '2024-08-25',
      type: 'refund',
      description: 'Zwrot - anulowana lekcja',
      amount: -100,
      status: 'completed',
      method: 'Zwrot na konto',
      invoice: 'KOR/2024/08/002'
    }
  ];

  const creditHistory = [
    {
      date: '2024-08-24',
      description: 'Lekcja jazdy - Jazda w mieście',
      credits: -1,
      balance: 12,
      instructor: 'Piotr Nowak'
    },
    {
      date: '2024-08-22',
      description: 'Lekcja jazdy - Parkowanie',
      credits: -1,
      balance: 13,
      instructor: 'Anna Kowalczyk'
    },
    {
      date: '2024-08-20',
      description: 'Zakup pakietu - Pakiet Standardowy',
      credits: +10,
      balance: 14,
      instructor: null
    },
    {
      date: '2024-08-18',
      description: 'Lekcja jazdy - Jazda nocna',
      credits: -2,
      balance: 4,
      instructor: 'Piotr Nowak'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Zrealizowane';
      case 'pending': return 'Oczekujące';
      case 'failed': return 'Anulowane';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Płatności i pakiety</h1>
        <p className="text-gray-600">Zarządzaj kredytami i historią płatności</p>
      </div>

      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{userCredits.available}</span>
          </div>
          <p className="text-sm text-gray-500">Dostępne kredyty</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{userCredits.used}</span>
          </div>
          <p className="text-sm text-gray-500">Wykorzystane</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{userCredits.expiring}</span>
          </div>
          <p className="text-sm text-gray-500">Wygasają do {userCredits.expiryDate.split('-')[2]}.{userCredits.expiryDate.split('-')[1]}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{userCredits.totalPurchased}</span>
          </div>
          <p className="text-sm text-gray-500">Łącznie zakupione</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'packages', label: 'Pakiety', icon: Package },
              { id: 'credits', label: 'Historia kredytów', icon: Coins },
              { id: 'history', label: 'Historia płatności', icon: Receipt }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              {/* Special Offers */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Oferty specjalne</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialOffers.map(offer => (
                    <div key={offer.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {offer.type === 'discount' ? (
                              <Tag className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Gift className="w-5 h-5 text-purple-600" />
                            )}
                            <h3 className="font-semibold text-gray-800">{offer.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          <div className="flex items-center gap-4">
                            <code className="px-2 py-1 bg-white rounded text-sm font-mono text-blue-600">
                              {offer.code}
                            </code>
                            <span className="text-xs text-gray-500">Ważne do {offer.validUntil}</span>
                          </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packages Grid */}
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Dostępne pakiety</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-xl p-6 border-2 transition-all hover:shadow-lg cursor-pointer ${
                      pkg.popular ? 'border-blue-500 shadow-md' : pkg.borderColor
                    } ${pkg.color}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
                          pkg.popular ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{pkg.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-gray-800">{pkg.credits}</span>
                        <span className="text-gray-600">kredytów</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {pkg.price} zł
                      </div>
                      <div className="text-sm text-gray-500">
                        {pkg.pricePerCredit} zł/kredyt
                      </div>
                      {pkg.savings > 0 && (
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                            Oszczędzasz {pkg.savings} zł
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                        setShowPaymentModal(true);
                      }}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        pkg.popular
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      Kup pakiet
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credits History Tab */}
          {activeTab === 'credits' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Historia wykorzystania kredytów</h2>
                <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Eksportuj
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Opis</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Instruktor</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Kredyty</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditHistory.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.instructor || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 font-semibold text-sm ${
                            item.credits > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.credits > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {Math.abs(item.credits)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-sm text-gray-800">{item.balance}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Historia płatności</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="completed">Zrealizowane</option>
                    <option value="pending">Oczekujące</option>
                    <option value="failed">Anulowane</option>
                  </select>
                  <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Eksportuj
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {paymentHistory
                  .filter(payment => filterStatus === 'all' || payment.status === filterStatus)
                  .map(payment => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              payment.type === 'refund' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {payment.type === 'refund' ? (
                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{payment.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">{payment.date}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {getStatusLabel(payment.status)}
                                </span>
                                <span className="text-sm text-gray-500">{payment.method}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            payment.amount < 0 ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            {payment.amount < 0 ? '' : '+'}{payment.amount} zł
                          </p>
                          {payment.invoice && (
                            <button className="text-sm text-blue-600 hover:underline mt-1">
                              {payment.invoice}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Kup pakiet</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedPackage.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Liczba kredytów:</span>
                <span className="font-semibold">{selectedPackage.credits}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Ważność:</span>
                <span className="font-semibold">{selectedPackage.validityDays} dni</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
                <span>Do zapłaty:</span>
                <span className="text-blue-600">{selectedPackage.price} zł</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <label className="flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="p24"
                    checked={paymentMethod === 'p24'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Przelewy24</span>
                </div>
              </label>
              
              <label className="flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="blik"
                    checked={paymentMethod === 'blik'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">BLIK</span>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Zapłać bezpiecznie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}