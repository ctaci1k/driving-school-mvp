// app/[locale]/admin/users/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, UserPlus, MoreHorizontal, Edit2, Trash2, Eye,
  Download, Mail, Shield, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Users, GraduationCap, UserCheck, ShieldCheck, AlertCircle,
  Calendar, MapPin, Phone, Loader2, RefreshCw,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useParams, useRouter} from 'next/navigation';

// Funkcja dla pseudolosowych wartości na podstawie indeksu
const getSeededValue = (index: number, max: number, seed: number = 1) => {
  return ((index * seed + 7) % max);
};

// Generowanie przykładowych danych ze stabilnymi wartościami
const generateMockUsers = () => {
const polishNames = [
    'Aleksander Nowak', 'Maria Kowalska', 'Jan Wiśniewski', 'Anna Wójcik',
    'Piotr Kowalczyk', 'Julia Kamińska', 'Andrzej Lewandowski', 'Natalia Dąbrowska',
    'Michał Zieliński', 'Teresa Szymańska', 'Wojciech Woźniak', 'Światłana Kozłowska',
    'Bogdan Jankowski', 'Irena Mazur', 'Olaf Krawczyk', 'Katarzyna Piotrowski',
    'Szymon Grabowski', 'Lucyna Nowakowski', 'Władysław Pawłowski', 'Halina Michalski',
    'Eugeniusz Adamczyk', 'Walentyna Dudek', 'Anatol Zając', 'Nadzieja Król',
    'Igor Wieczorek', 'Larisa Majewski', 'Wiktor Olszewski', 'Olga Jaworski',
    'Roman Stępień', 'Alla Malinowski', 'Jerzy Górski', 'Rozalia Sikora'
  ];

  const cities = ['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Szczecin', 'Łódź', 'Lublin'];
  const roles = ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'MANAGER'];
  const statuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'];

  return Array.from({ length: 50 }, (_, i) => {
    const name = polishNames[i % polishNames.length] + (i >= polishNames.length ? ` ${Math.floor(i / polishNames.length)}` : '');
    const nameParts = name.split(' ');
    const email = `${nameParts[1].toLowerCase()}.${nameParts[0].toLowerCase()}${i}@example.com`;
    
    // Używamy deterministycznych wartości na podstawie indeksu
    const roleIndex = getSeededValue(i, roles.length);
    const role = roles[roleIndex];
    const statusIndex = getSeededValue(i, statuses.length, 3);
    const status = statuses[statusIndex];
    const cityIndex = getSeededValue(i, cities.length, 5);
    
    // Stabilne numery telefonów
    const phoneBase = 500000000 + (i * 12345);
    
    return {
      id: `user-${i + 1}`,
      name,
      email,
      phone: `+48${phoneBase}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${
        role === 'ADMIN' ? '6366F1' : 
        role === 'INSTRUCTOR' ? '10B981' : 
        role === 'MANAGER' ? 'F59E0B' : '3B82F6'
      }&color=fff`,
      role,
      status,
      location: cities[cityIndex],
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      lastLogin: new Date(2024, 11, (i % 28) + 1),
      emailVerified: i % 5 !== 0, // 80% zweryfikowane
      phoneVerified: i % 3 !== 0, // ~66% zweryfikowane
      completedLessons: role === 'STUDENT' ? ((i * 7) % 50) : null,
      totalStudents: role === 'INSTRUCTOR' ? 20 + ((i * 11) % 80) : null,
      rating: role === 'INSTRUCTOR' ? (4.0 + ((i % 10) / 10)).toFixed(1) : null
    };
  });
};

// Reszta kodu pozostaje bez zmian
export default function AdminUsersPage() {
  const [users] = useState(generateMockUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
    const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'pl';
    const handleAddUser = () => {
    router.push(`/${locale}/admin/users/new`);
  };

  // Filtrowanie użytkowników
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      const matchesLocation = selectedLocation === 'all' || user.location === selectedLocation;
      
      return matchesSearch && matchesRole && matchesStatus && matchesLocation;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, selectedLocation]);

  // Paginacja
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Statystyki
  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    pending: users.filter(u => u.status === 'PENDING').length
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkAction = async (action: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Akcja grupowa: ${action} dla użytkowników:`, selectedUsers);
    setSelectedUsers([]);
    setLoading(false);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Administrator' },
      INSTRUCTOR: { bg: 'bg-green-100', text: 'text-green-700', label: 'Instruktor' },
      STUDENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Student' },
      MANAGER: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Menedżer' }
    };
    return badges[role as keyof typeof badges] || badges.STUDENT;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Aktywny' },
      INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle, label: 'Nieaktywny' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Oczekuje' },
      SUSPENDED: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Zablokowany' }
    };
    return badges[status as keyof typeof badges] || badges.INACTIVE;
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Użytkownicy</h1>
        <p className="text-gray-600 mt-1">Zarządzanie użytkownikami systemu</p>
      </div>

      {/* Karty ze statystykami */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">Łącznie</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.students}</p>
              <p className="text-xs text-gray-500">Studentów</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.instructors}</p>
              <p className="text-xs text-gray-500">Instruktorów</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.admins}</p>
              <p className="text-xs text-gray-500">Administratorów</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500">Aktywnych</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-xs text-gray-500">Oczekują</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pasek filtrów */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Wyszukaj po imieniu lub email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie role</option>
              <option value="STUDENT">Studenci</option>
              <option value="INSTRUCTOR">Instruktorzy</option>
              <option value="ADMIN">Administratorzy</option>
              <option value="MANAGER">Menedżerowie</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="ACTIVE">Aktywni</option>
              <option value="INACTIVE">Nieaktywni</option>
              <option value="PENDING">Oczekują</option>
              <option value="SUSPENDED">Zablokowani</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Więcej filtrów
            </button>
          </div>
          

                      <button onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Dodaj użytkownika
            </button>
        </div>

        {/* Rozszerzone filtry */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie lokalizacje</option>
              <option value="Warszawa">Warszawa</option>
              <option value="Kraków">Kraków</option>
              <option value="Wrocław">Wrocław</option>
              <option value="Gdańsk">Gdańsk</option>
              <option value="Poznań">Poznań</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Weryfikacja email</option>
              <option>Potwierdzone</option>
              <option>Niepotwierdzone</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Weryfikacja telefonu</option>
              <option>Potwierdzone</option>
              <option>Niepotwierdzone</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Data rejestracji</option>
              <option>Ostatnie 7 dni</option>
              <option>Ostatnie 30 dni</option>
              <option>Ostatnie 90 dni</option>
            </select>
          </div>
        )}
      </div>

      {/* Akcje grupowe */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              Zaznaczono {selectedUsers.length} użytkownik(ów)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Aktywuj
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Dezaktywuj
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Usuń
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela użytkowników */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rola
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokalizacja
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dołączył
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ostatnie logowanie
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
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nie znaleziono użytkowników</p>
                    <p className="text-sm text-gray-400 mt-1">Spróbuj zmienić filtry wyszukiwania</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {user.emailVerified && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  Email
                                </span>
                              )}
                              {user.phoneVerified && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  Telefon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                          {roleBadge.label}
                        </span>
                        {user.role === 'INSTRUCTOR' && user.rating && (
                          <p className="text-xs text-gray-500 mt-1">
                            Ocena: {user.rating}★
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {format(user.createdAt, 'dd MMM yyyy', { locale: pl })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {format(user.lastLogin, 'dd MMM, HH:mm', { locale: pl })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => console.log('Wyświetl użytkownika', user.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Wyświetl"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => console.log('Edytuj użytkownika', user.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edytuj"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => console.log('Usuń użytkownika', user.id)}
                            className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                            title="Usuń"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
       </div>
    </div>
      );
}