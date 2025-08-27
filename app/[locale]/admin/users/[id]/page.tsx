// app/[locale]/admin/users/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield,
  Clock, Activity, CreditCard, Car, GraduationCap, Award,
  Edit2, Trash2, Lock, Unlock, Ban, CheckCircle, XCircle,
  AlertTriangle, FileText, Download, Send, MoreHorizontal,
  Star, TrendingUp, DollarSign, Users, Eye, EyeOff, Save,
  X, Camera, Upload, RefreshCw, History, Settings, Loader2
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface UserActivity {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
  device: string;
}

interface Payment {
  id: string;
  amount: number;
  date: Date;
  method: string;
  status: string;
  description: string;
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    id: params.id,
    name: 'Олександр Петренко',
    email: 'petrenko.oleksandr@example.com',
    phone: '+380501234567',
    avatar: 'https://ui-avatars.com/api/?name=Олександр+Петренко&background=6366F1&color=fff',
    role: 'STUDENT',
    status: 'ACTIVE',
    location: 'Київ',
    address: 'вул. Хрещатик, 15, кв. 42',
    birthDate: new Date(1995, 5, 15),
    registeredDate: new Date(2024, 0, 15),
    lastLogin: new Date(2024, 11, 20, 14, 30),
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    
    // Student specific data
    instructor: 'Петро Сидоренко',
    package: 'Стандарт',
    category: 'B',
    theoryProgress: 75,
    practicalLessons: {
      completed: 18,
      total: 30
    },
    examAttempts: 1,
    nextLesson: addDays(new Date(), 2),
    
    // Financial data
    totalPaid: 6500,
    totalDue: 2000,
    discount: 10,
    
    // Emergency contact
    emergencyContact: {
      name: 'Марія Петренко',
      relation: 'Дружина',
      phone: '+380509876543'
    },
    
    // Documents
    documents: {
      idCard: true,
      medicalCertificate: true,
      studentCard: true,
      contract: true
    }
  });

  // Mock activity log
  const activities: UserActivity[] = [
    {
      id: '1',
      action: 'Вхід в систему',
      timestamp: new Date(),
      details: 'Успішний вхід',
      ipAddress: '192.168.1.100',
      device: 'Chrome, Windows'
    },
    {
      id: '2',
      action: 'Бронювання заняття',
      timestamp: subDays(new Date(), 1),
      details: 'Заняття на 25.12.2024, 14:00',
      ipAddress: '192.168.1.100',
      device: 'Mobile App, iOS'
    },
    {
      id: '3',
      action: 'Оплата',
      timestamp: subDays(new Date(), 3),
      details: 'Оплата ₴1500',
      ipAddress: '192.168.1.100',
      device: 'Chrome, Windows'
    },
    {
      id: '4',
      action: 'Завершення заняття',
      timestamp: subDays(new Date(), 5),
      details: 'Оцінка: 4.5/5',
      ipAddress: '192.168.1.100',
      device: 'Instructor App'
    },
    {
      id: '5',
      action: 'Зміна пароля',
      timestamp: subDays(new Date(), 10),
      details: 'Пароль успішно змінено',
      ipAddress: '192.168.1.101',
      device: 'Chrome, Windows'
    }
  ];

  // Mock payments
  const payments: Payment[] = [
    {
      id: 'pay-1',
      amount: 1500,
      date: subDays(new Date(), 3),
      method: 'Картка',
      status: 'completed',
      description: 'Оплата за заняття'
    },
    {
      id: 'pay-2',
      amount: 3500,
      date: subDays(new Date(), 15),
      method: 'Переказ',
      status: 'completed',
      description: 'Оплата пакету "Стандарт"'
    },
    {
      id: 'pay-3',
      amount: 1500,
      date: subDays(new Date(), 30),
      method: 'Готівка',
      status: 'completed',
      description: 'Перший внесок'
    },
    {
      id: 'pay-4',
      amount: 2000,
      date: addDays(new Date(), 5),
      method: 'Картка',
      status: 'pending',
      description: 'Наступний платіж'
    }
  ];

  // Progress chart data
  const progressData = [
    { month: 'Січ', theory: 20, practice: 0 },
    { month: 'Лют', theory: 35, practice: 10 },
    { month: 'Бер', theory: 50, practice: 25 },
    { month: 'Кві', theory: 65, practice: 40 },
    { month: 'Тра', theory: 75, practice: 60 },
  ];

  // Attendance data
  const attendanceData = [
    { name: 'Присутній', value: 18, color: '#10B981' },
    { name: 'Відсутній', value: 2, color: '#EF4444' },
    { name: 'Перенесено', value: 3, color: '#F59E0B' },
  ];

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/uk/admin/users');
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowPasswordModal(false);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserData({ ...userData, status: newStatus });
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Активний' },
      INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle, label: 'Неактивний' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Очікує' },
      SUSPENDED: { bg: 'bg-red-100', text: 'text-red-700', icon: Ban, label: 'Заблокований' }
    };
    return badges[status as keyof typeof badges] || badges.INACTIVE;
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Shield, label: 'Адміністратор' },
      INSTRUCTOR: { bg: 'bg-green-100', text: 'text-green-700', icon: GraduationCap, label: 'Інструктор' },
      STUDENT: { bg: 'bg-blue-100', text: 'text-blue-700', icon: User, label: 'Студент' },
      MANAGER: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Users, label: 'Менеджер' }
    };
    return badges[role as keyof typeof badges] || badges.STUDENT;
  };

  const statusBadge = getStatusBadge(userData.status);
  const roleBadge = getRoleBadge(userData.role);
  const StatusIcon = statusBadge.icon;
  const RoleIcon = roleBadge.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/uk/admin/users')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Профіль користувача</h1>
            <p className="text-gray-600 mt-1">ID: {userData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Редагувати
              </button>
              <div className="relative group">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Скинути пароль
                  </button>
                  <button
                    onClick={() => handleStatusChange(userData.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    {userData.status === 'ACTIVE' ? (
                      <>
                        <Ban className="w-4 h-4" />
                        Заблокувати
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Розблокувати
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Видалити
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Зберегти
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Скасувати
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-24 h-24 rounded-full"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="text-2xl font-bold px-3 py-1 border border-gray-300 rounded-lg"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
              )}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                <StatusIcon className="w-3 h-3" />
                {statusBadge.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                <RoleIcon className="w-3 h-3" />
                {roleBadge.label}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {userData.email}
                    {userData.emailVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {userData.phone}
                    {userData.phoneVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Локація</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userData.location}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Дата народження</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(userData.birthDate, 'dd.MM.yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Огляд', icon: Activity },
              { id: 'progress', label: 'Прогрес', icon: TrendingUp },
              { id: 'payments', label: 'Платежі', icon: CreditCard },
              { id: 'documents', label: 'Документи', icon: FileText },
              { id: 'activity', label: 'Активність', icon: History },
              { id: 'settings', label: 'Налаштування', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Основна інформація</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Адреса</dt>
                      <dd className="text-sm font-medium text-gray-900">{userData.address}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Зареєстрований</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {format(userData.registeredDate, 'dd MMMM yyyy', { locale: uk })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Останній вхід</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {format(userData.lastLogin, 'dd.MM.yyyy HH:mm')}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Двофакторна автентифікація</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {userData.twoFactorEnabled ? (
                          <span className="text-green-600">Увімкнена</span>
                        ) : (
                          <span className="text-gray-500">Вимкнена</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                {userData.role === 'STUDENT' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Навчальна інформація</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Інструктор</dt>
                        <dd className="text-sm font-medium text-gray-900">{userData.instructor}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Пакет</dt>
                        <dd className="text-sm font-medium text-gray-900">{userData.package}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Категорія</dt>
                        <dd className="text-sm font-medium text-gray-900">{userData.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Наступне заняття</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {format(userData.nextLesson, 'dd.MM.yyyy о HH:mm')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Екстрений контакт</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ім'я</p>
                      <p className="text-sm font-medium text-gray-900">{userData.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Відношення</p>
                      <p className="text-sm font-medium text-gray-900">{userData.emergencyContact.relation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="text-sm font-medium text-gray-900">{userData.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && userData.role === 'STUDENT' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Прогрес навчання</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="theory" stroke="#3B82F6" name="Теорія" strokeWidth={2} />
                      <Line type="monotone" dataKey="practice" stroke="#10B981" name="Практика" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Відвідуваність</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {attendanceData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Теорія</p>
                  <p className="text-2xl font-bold text-blue-700">{userData.theoryProgress}%</p>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${userData.theoryProgress}%` }} />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Практика</p>
                  <p className="text-2xl font-bold text-green-700">
                    {userData.practicalLessons.completed}/{userData.practicalLessons.total}
                  </p>
                  <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(userData.practicalLessons.completed / userData.practicalLessons.total) * 100}%` }} />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Спроби іспиту</p>
                  <p className="text-2xl font-bold text-purple-700">{userData.examAttempts}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">Середня оцінка</p>
                  <p className="text-2xl font-bold text-orange-700">4.5/5</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= 4.5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Сплачено</p>
                  <p className="text-2xl font-bold text-green-700">₴{userData.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">До сплати</p>
                  <p className="text-2xl font-bold text-orange-700">₴{userData.totalDue.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Знижка</p>
                  <p className="text-2xl font-bold text-blue-700">{userData.discount}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Історія платежів</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Опис
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Метод
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сума
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
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(payment.date, 'dd.MM.yyyy')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {payment.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₴{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {payment.status === 'completed' ? 'Сплачено' : 'Очікує'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Документи</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userData.documents).map(([key, hasDocument]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${hasDocument ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {key === 'idCard' && 'Паспорт'}
                          {key === 'medicalCertificate' && 'Медична довідка'}
                          {key === 'studentCard' && 'Студентська картка'}
                          {key === 'contract' && 'Договір'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {hasDocument ? 'Завантажено' : 'Не завантажено'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasDocument ? (
                        <>
                          <button className="p-2 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </>
                      ) : (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1">
                          <Upload className="w-4 h-4" />
                          Завантажити
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Журнал активності</h3>
              <div className="space-y-3">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Activity className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {activity.device} • IP: {activity.ipAddress}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(activity.timestamp, 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Налаштування безпеки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Двофакторна автентифікація</p>
                      <p className="text-sm text-gray-500">Додатковий рівень безпеки для входу</p>
                    </div>
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      userData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        userData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email сповіщення</p>
                      <p className="text-sm text-gray-500">Отримувати сповіщення на email</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS сповіщення</p>
                      <p className="text-sm text-gray-500">Отримувати сповіщення через SMS</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Видалити користувача?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Ви впевнені, що хочете видалити користувача {userData.name}? Ця дія не може бути скасована.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Видалення...' : 'Видалити'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Скинути пароль</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Новий пароль буде надіслано на email користувача: {userData.email}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Надсилання...' : 'Надіслати пароль'}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Скасувати
              </button>
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
}