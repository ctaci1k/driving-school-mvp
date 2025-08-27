// app/[locale]/admin/students/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Users, Search, Filter, Plus, Eye, Mail, Phone, MapPin,
  Calendar, GraduationCap, Car, Award, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Clock, Target, BookOpen, Activity,
  Download, Upload, MoreHorizontal, Edit2, Trash2, UserCheck,
  ChevronLeft, ChevronRight, Star, CreditCard, BarChart3,
  Loader2, RefreshCw
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';

// Generate mock students data
const generateStudents = () => {
  const names = [
    'Aleksander Kowalski', 'Maria Nowak', 'Jan Wiśniewski', 'Katarzyna Wójcik',
    'Piotr Kamiński', 'Julia Lewandowska', 'Andrzej Zieliński', 'Natalia Szymańska',
    'Michał Woźniak', 'Agnieszka Dąbrowska', 'Tomasz Kozłowski', 'Magdalena Jankowska',
    'Paweł Mazur', 'Monika Krawczyk', 'Krzysztof Kaczmarek', 'Anna Piotrowska',
    'Marcin Grabowski', 'Ewa Pawłowska', 'Łukasz Michalski', 'Joanna Król',
    'Rafał Wieczorek', 'Beata Jabłońska', 'Adam Nowakowski', 'Małgorzata Wróbel',
    'Bartosz Majewski', 'Dorota Adamczyk', 'Kamil Olszewski', 'Aleksandra Jaworska',
    'Robert Malinowski', 'Izabela Dudek', 'Mateusz Stępień', 'Karolina Górska',
    'Dariusz Pawlak', 'Sylwia Witkowska', 'Artur Walczak', 'Paulina Sikora',
    'Maciej Baran', 'Patrycja Rutkowska', 'Damian Sokołowski', 'Justyna Łukasik',
    'Sebastian Zalewski', 'Weronika Czerwińska', 'Jakub Marciniak', 'Klaudia Brzeziń​ska',
    'Wojciech Konieczny', 'Martyna Szulc', 'Marek Czarnecki', 'Dominika Wasilewska'
  ];

  const cities = ['Warszawa', 'Kraków', 'Gdańsk', 'Poznań', 'Wrocław', 'Katowice', 'Lublin'];
  const packages = ['Podstawowy', 'Standard', 'Premium', 'VIP', 'Intensywny'];
  const instructors = ['Piotr Kowalski', 'Anna Nowak', 'Jan Wiśniewski', 'Katarzyna Wójcik'];
  const statuses = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'DROPPED'];
  const categories = ['B', 'B+E', 'C'];

  return names.map((name, index) => ({
    id: `student-${index + 1}`,
    name,
    email: `${name.split(' ')[1].toLowerCase()}.${name.split(' ')[0].toLowerCase()}@example.com`.replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z'),
    phone: `+48${Math.floor(Math.random() * 900000000 + 100000000)}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
    location: cities[Math.floor(Math.random() * cities.length)],
    registeredDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    package: packages[Math.floor(Math.random() * packages.length)],
    instructor: instructors[Math.floor(Math.random() * instructors.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    theoryProgress: Math.floor(Math.random() * 100),
    practicalLessons: {
      completed: Math.floor(Math.random() * 30),
      total: 30
    },
    nextLesson: addDays(new Date(), Math.floor(Math.random() * 7)),
    examDate: addDays(new Date(), Math.floor(Math.random() * 30) + 7),
    payments: {
      paid: Math.floor(Math.random() * 1000) + 1500,
      total: 2800,
      nextDue: addDays(new Date(), Math.floor(Math.random() * 14))
    },
    averageScore: (Math.random() * 2 + 3).toFixed(1),
    attendance: Math.floor(Math.random() * 20) + 80,
    notes: Math.floor(Math.random() * 5)
  }));
};

export default function AdminStudentsPage() {
  const [students] = useState(generateStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  const [filterInstructor, setFilterInstructor] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesPackage = filterPackage === 'all' || student.package === filterPackage;
    const matchesInstructor = filterInstructor === 'all' || student.instructor === filterInstructor;
    
    return matchesSearch && matchesStatus && matchesPackage && matchesInstructor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'ACTIVE').length,
    completed: students.filter(s => s.status === 'COMPLETED').length,
    avgProgress: Math.round(students.reduce((acc, s) => acc + s.theoryProgress, 0) / students.length),
    avgAttendance: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length),
    totalRevenue: students.reduce((acc, s) => acc + s.payments.paid, 0)
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Aktywny' },
      ON_HOLD: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Wstrzymany' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Award, label: 'Ukończony' },
      DROPPED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rezygnacja' }
    };
    return badges[status as keyof typeof badges] || badges.ACTIVE;
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleBulkAction = async (action: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Bulk action: ${action} for students:`, selectedStudents);
    setSelectedStudents([]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kursanci</h1>
          <p className="text-gray-600 mt-1">Zarządzanie kursantami szkoły jazdy</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Eksport
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Dodaj kursanta
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">Łącznie</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500">Aktywni</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              <p className="text-xs text-gray-500">Ukończyli</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgProgress}%</p>
              <p className="text-xs text-gray-500">Śr. postęp</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgAttendance}%</p>
              <p className="text-xs text-gray-500">Frekwencja</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} zł</p>
              <p className="text-xs text-gray-500">Przychód</p>
            </div>
          </div>
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
                placeholder="Szukaj kursantów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="ACTIVE">Aktywni</option>
            <option value="ON_HOLD">Wstrzymani</option>
            <option value="COMPLETED">Ukończeni</option>
            <option value="DROPPED">Rezygnacje</option>
          </select>
          <select
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie pakiety</option>
            <option value="Podstawowy">Podstawowy</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
            <option value="Intensywny">Intensywny</option>
          </select>
          <select
            value={filterInstructor}
            onChange={(e) => setFilterInstructor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszyscy instruktorzy</option>
            <option value="Piotr Kowalski">Piotr Kowalski</option>
            <option value="Anna Nowak">Anna Nowak</option>
            <option value="Jan Wiśniewski">Jan Wiśniewski</option>
            <option value="Katarzyna Wójcik">Katarzyna Wójcik</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Więcej filtrów
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              Wybrano: {selectedStudents.length} kursantów
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('message')}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
              >
                Wyślij wiadomość
              </button>
              <button 
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
              >
                Eksportuj
              </button>
              <button 
                onClick={() => setSelectedStudents([])}
                className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === paginatedStudents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kursant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pakiet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instruktor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Postęp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Następna lekcja
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
              {paginatedStudents.map((student) => {
                const statusBadge = getStatusBadge(student.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.package}</p>
                        <p className="text-sm text-gray-500">Kategoria {student.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{student.instructor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Teoria</span>
                            <span className="font-medium">{student.theoryProgress}%</span>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${student.theoryProgress}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Praktyka</span>
                            <span className="font-medium">{student.practicalLessons.completed}/{student.practicalLessons.total}</span>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(student.practicalLessons.completed / student.practicalLessons.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{format(student.nextLesson, 'dd MMM yyyy', { locale: pl })}</p>
                      <p className="text-sm text-gray-500">14:00-15:30</p>
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
                          onClick={() => console.log('View student:', student.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => console.log('Edit student:', student.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => console.log('More actions:', student.id)}
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
              Pokazano <span className="font-medium">{startIndex + 1}</span> -{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredStudents.length)}
              </span>{' '}
              z <span className="font-medium">{filteredStudents.length}</span> kursantów
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Przetwarzanie...</span>
          </div>
        </div>
      )}
    </div>
  );
}