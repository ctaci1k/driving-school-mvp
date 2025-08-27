// app/[locale]/admin/instructors/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit, Save, X, Star, Calendar, Car, Users, Award,
  Clock, TrendingUp, MapPin, Phone, Mail, Shield, AlertCircle,
  CheckCircle, XCircle, MoreVertical, Download, Send, Trash2,
  DollarSign, Activity, BarChart3, Eye, UserCheck, CreditCard
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function InstructorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock instructor data
  const instructor = {
    id: params.id,
    firstName: 'Piotr',
    lastName: 'Kowalski',
    email: 'piotr.kowalski@driveschool.pl',
    phone: '+48 601 234 567',
    avatar: 'https://ui-avatars.com/api/?name=Piotr+Kowalski&background=10B981&color=fff',
    dateOfBirth: '1985-03-15',
    licenseNumber: 'DL123456',
    categories: ['B', 'C', 'D'],
    hireDate: '2020-01-15',
    status: 'active',
    rating: 4.9,
    totalStudents: 245,
    activeStudents: 18,
    completedLessons: 1847,
    successRate: 94,
    monthlyRevenue: 8500,
    address: 'ul. Marszałkowska 22, Warszawa',
    emergencyContact: {
      name: 'Maria Kowalska',
      relation: 'Żona',
      phone: '+48 601 987 654'
    },
    experience: '12 lat',
    specializations: ['Początkujący', 'Egzaminy', 'Jazda nocna', 'Autostrada'],
    languages: ['Polski', 'Angielski', 'Niemiecki'],
    workingHours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '20:00' },
      saturday: { start: '10:00', end: '16:00' },
      sunday: null
    },
    vehicles: [
      { id: 1, make: 'Toyota', model: 'Corolla', registration: 'WA 1234B', status: 'active' },
      { id: 2, make: 'Volkswagen', model: 'Golf', registration: 'WA 5678C', status: 'maintenance' }
    ],
    documents: [
      { id: 1, name: 'Prawo jazdy', type: 'license', uploadDate: '2024-01-10', status: 'verified' },
      { id: 2, name: 'Zaświadczenie lekarskie', type: 'medical', uploadDate: '2024-01-05', status: 'verified' },
      { id: 3, name: 'Uprawnienia instruktora', type: 'instructor', uploadDate: '2024-01-01', status: 'verified' }
    ]
  };

  // Performance stats
  const performanceStats = [
    { label: 'Średnia ocena', value: instructor.rating, max: 5, type: 'rating' },
    { label: 'Skuteczność kursantów', value: instructor.successRate, max: 100, type: 'percentage' },
    { label: 'Obłożenie', value: 78, max: 100, type: 'percentage' },
    { label: 'Punktualność', value: 96, max: 100, type: 'percentage' }
  ];

  // Recent students
  const recentStudents = [
    { id: 1, name: 'Jan Nowak', avatar: null, lessons: 12, progress: 75, nextLesson: '2024-02-01 10:00' },
    { id: 2, name: 'Maria Wiśniewska', avatar: null, lessons: 8, progress: 60, nextLesson: '2024-02-01 14:00' },
    { id: 3, name: 'Andrzej Lewandowski', avatar: null, lessons: 15, progress: 90, nextLesson: '2024-02-02 08:00' },
    { id: 4, name: 'Oksana Wójcik', avatar: null, lessons: 5, progress: 35, nextLesson: '2024-02-02 16:00' },
    { id: 5, name: 'Piotr Kamiński', avatar: null, lessons: 20, progress: 95, nextLesson: '2024-02-03 12:00' }
  ];

  // Schedule for the week
  const weekSchedule = [
    { day: 'Pon', date: '29.01', lessons: 6, hours: '08:00-18:00', revenue: 720 },
    { day: 'Wt', date: '30.01', lessons: 7, hours: '08:00-18:00', revenue: 840 },
    { day: 'Śr', date: '31.01', lessons: 5, hours: '08:00-16:00', revenue: 600 },
    { day: 'Czw', date: '01.02', lessons: 8, hours: '08:00-20:00', revenue: 960 },
    { day: 'Pt', date: '02.02', lessons: 6, hours: '08:00-18:00', revenue: 720 },
    { day: 'Sob', date: '03.02', lessons: 3, hours: '10:00-16:00', revenue: 360 },
    { day: 'Ndz', date: '04.02', lessons: 0, hours: 'Wolne', revenue: 0 }
  ];

  // Reviews
  const reviews = [
    { id: 1, student: 'Jan Nowak', rating: 5, comment: 'Świetny instruktor! Wszystko tłumaczy bardzo zrozumiale.', date: '2024-01-28' },
    { id: 2, student: 'Maria Wiśniewska', rating: 5, comment: 'Bardzo cierpliwy i uważny. Polecam!', date: '2024-01-25' },
    { id: 3, student: 'Andrzej Lewandowski', rating: 4, comment: 'Profesjonalista w swojej dziedzinie.', date: '2024-01-20' }
  ];

  // Financial history
  const financialHistory = [
    { month: 'Styczeń 2024', revenue: 8500, lessons: 145, averagePrice: 59 },
    { month: 'Grudzień 2023', revenue: 7780, lessons: 132, averagePrice: 59 },
    { month: 'Listopad 2023', revenue: 8240, lessons: 140, averagePrice: 59 },
    { month: 'Październik 2023', revenue: 7960, lessons: 135, averagePrice: 59 }
  ];

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: Eye },
    { id: 'schedule', label: 'Grafik', icon: Calendar },
    { id: 'students', label: 'Kursanci', icon: Users },
    { id: 'performance', label: 'Wydajność', icon: TrendingUp },
    { id: 'financial', label: 'Finanse', icon: DollarSign },
    { id: 'documents', label: 'Dokumenty', icon: Shield }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/instructors')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profil instruktora</h1>
            <p className="text-sm text-gray-600">Szczegółowe informacje i zarządzanie</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Eksport
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Wiadomość
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edytuj
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Anuluj
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Zapisz
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start gap-4">
            <img
              src={instructor.avatar}
              alt={`${instructor.firstName} ${instructor.lastName}`}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {instructor.firstName} {instructor.lastName}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  instructor.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {instructor.status === 'active' ? 'Aktywny' : 'Nieaktywny'}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{instructor.rating}</span>
                  <span className="text-gray-500 text-sm">({instructor.totalStudents} kursantów)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {instructor.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {instructor.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{instructor.activeStudents}</p>
              <p className="text-xs text-gray-600">Aktywni kursanci</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{instructor.completedLessons}</p>
              <p className="text-xs text-gray-600">Przeprowadzonych lekcji</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{instructor.successRate}%</p>
              <p className="text-xs text-gray-600">Skuteczność</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{instructor.monthlyRevenue} zł</p>
              <p className="text-xs text-gray-600">Przychód/miesiąc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Podstawowe informacje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Data urodzenia</label>
                    <p className="font-medium text-gray-800">{format(new Date(instructor.dateOfBirth), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Numer prawa jazdy</label>
                    <p className="font-medium text-gray-800">{instructor.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Kategorie</label>
                    <div className="flex gap-2 mt-1">
                      {instructor.categories.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Data zatrudnienia</label>
                    <p className="font-medium text-gray-800">{format(new Date(instructor.hireDate), 'dd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Doświadczenie</label>
                    <p className="font-medium text-gray-800">{instructor.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Adres</label>
                    <p className="font-medium text-gray-800">{instructor.address}</p>
                  </div>
                </div>
              </div>

              {/* Skills & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Specjalizacje</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specializations.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Języki</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.languages.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Kontakt awaryjny</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Imię i nazwisko</label>
                      <p className="font-medium text-gray-800">{instructor.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Relacja</label>
                      <p className="font-medium text-gray-800">{instructor.emergencyContact.relation}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Telefon</label>
                      <p className="font-medium text-gray-800">{instructor.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-3">
                {weekSchedule.map((day) => (
                  <div key={day.day} className={`text-center p-3 rounded-lg border ${
                    day.lessons === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <p className="font-semibold text-gray-800">{day.day}</p>
                    <p className="text-sm text-gray-600">{day.date}</p>
                    <p className="text-2xl font-bold text-blue-600 my-2">{day.lessons}</p>
                    <p className="text-xs text-gray-500">{day.hours}</p>
                    {day.revenue > 0 && (
                      <p className="text-sm font-semibold text-green-600 mt-2">{day.revenue} zł</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.lessons} lekcji • Postęp: {student.progress}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Następna lekcja</p>
                    <p className="font-medium text-gray-800">{format(new Date(student.nextLesson), 'dd.MM HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceStats.map((stat) => (
                  <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-500">
                        {stat.type === 'rating' ? `/ ${stat.max}` : '%'}
                      </p>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Ostatnie opinie</h4>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.student}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{format(new Date(review.date), 'dd.MM.yyyy')}</p>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-700">Bieżący miesiąc</p>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{instructor.monthlyRevenue} zł</p>
                  <p className="text-sm text-green-600 mt-1">+8.5% od poprzedniego miesiąca</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-blue-700">Średnia cena</p>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">59 zł</p>
                  <p className="text-sm text-gray-600 mt-1">za lekcję</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-purple-700">Zadłużenie</p>
                    <AlertCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">0 zł</p>
                  <p className="text-sm text-green-600 mt-1">Wszystkie rozliczenia przeprowadzone</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Historia przychodów</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-semibold text-gray-700">Miesiąc</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Przychód</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Lekcje</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-700">Średnia cena</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialHistory.map((month, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-800">{month.month}</td>
                          <td className="py-3 text-right font-semibold text-gray-800">{month.revenue.toLocaleString('pl-PL')} zł</td>
                          <td className="py-3 text-right text-gray-600">{month.lessons}</td>
                          <td className="py-3 text-right text-gray-600">{month.averagePrice} zł</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {instructor.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-600">Przesłano: {format(new Date(doc.uploadDate), 'dd.MM.yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.status === 'verified' ? 'Zweryfikowano' : 'W weryfikacji'}
                    </span>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}