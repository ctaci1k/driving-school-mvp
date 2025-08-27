// app/[locale]/admin/instructors/schedule/page.tsx
"use client";

import React, { useState } from 'react';
import { 
  Calendar, Clock, Users, Car, MapPin, Filter, Search, 
  ChevronLeft, ChevronRight, Download, Printer, RefreshCw,
  AlertCircle, CheckCircle, XCircle, Edit, Plus, Eye,
  Grid, List, CalendarDays, User, Star
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function InstructorsSchedulePage() {
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Instruktorzy (mock)
  const instructors = [
    { id: '1', name: 'Oleh Kowal', avatar: 'https://ui-avatars.com/api/?name=Oleh+Kowal&background=10B981&color=fff', color: 'bg-green-500' },
    { id: '2', name: 'Anna Lisenko', avatar: 'https://ui-avatars.com/api/?name=Anna+Lisenko&background=8B5CF6&color=fff', color: 'bg-purple-500' },
    { id: '3', name: 'Michał Tkaczenko', avatar: 'https://ui-avatars.com/api/?name=Michał+Tkaczenko&background=F59E0B&color=fff', color: 'bg-yellow-500' },
    { id: '4', name: 'Julia Sawczenko', avatar: 'https://ui-avatars.com/api/?name=Julia+Sawczenko&background=EC4899&color=fff', color: 'bg-pink-500' },
    { id: '5', name: 'Wiktor Bondar', avatar: 'https://ui-avatars.com/api/?name=Wiktor+Bondar&background=3B82F6&color=fff', color: 'bg-blue-500' }
  ];

  // Dane harmonogramu (mock)
  const scheduleData = [
    {
      id: '1',
      instructorId: '1',
      instructorName: 'Oleh Kowal',
      date: currentDate,
      startTime: '08:00',
      endTime: '10:00',
      studentName: 'Jan Petrenko',
      lessonType: 'Praktyka',
      vehicleId: 'Toyota Corolla AA 1234 BB',
      location: 'Warszawa',
      status: 'confirmed'
    },
    {
      id: '2',
      instructorId: '1',
      instructorName: 'Oleh Kowal',
      date: currentDate,
      startTime: '10:00',
      endTime: '12:00',
      studentName: 'Maria Kowalenko',
      lessonType: 'Tor',
      vehicleId: 'Toyota Corolla AA 1234 BB',
      location: 'Tor Kraków',
      status: 'confirmed'
    },
    {
      id: '3',
      instructorId: '2',
      instructorName: 'Anna Lisenko',
      date: currentDate,
      startTime: '09:00',
      endTime: '11:00',
      studentName: 'Andrzej Szewczenko',
      lessonType: 'Miasto',
      vehicleId: 'VW Golf AA 5678 CC',
      location: 'Warszawa',
      status: 'confirmed'
    },
    {
      id: '4',
      instructorId: '2',
      instructorName: 'Anna Lisenko',
      date: currentDate,
      startTime: '14:00',
      endTime: '16:00',
      studentName: 'Oksana Melnyk',
      lessonType: 'Parkowanie',
      vehicleId: 'VW Golf AA 5678 CC',
      location: 'Warszawa',
      status: 'pending'
    },
    {
      id: '5',
      instructorId: '3',
      instructorName: 'Michał Tkaczenko',
      date: currentDate,
      startTime: '08:00',
      endTime: '10:00',
      studentName: 'Piotr Sydorenko',
      lessonType: 'Egzamin',
      vehicleId: 'Škoda Fabia AA 9012 DD',
      location: 'Ośrodek egzaminacyjny',
      status: 'confirmed'
    },
    {
      id: '6',
      instructorId: '3',
      instructorName: 'Michał Tkaczenko',
      date: addDays(currentDate, 1),
      startTime: '12:00',
      endTime: '14:00',
      studentName: 'Natalia Kozak',
      lessonType: 'Praktyka',
      vehicleId: 'Škoda Fabia AA 9012 DD',
      location: 'Warszawa',
      status: 'confirmed'
    },
    {
      id: '7',
      instructorId: '4',
      instructorName: 'Julia Sawczenko',
      date: currentDate,
      startTime: '10:00',
      endTime: '12:00',
      studentName: 'Bogdan Krawczuk',
      lessonType: 'Jazda nocna',
      vehicleId: 'Renault Megane AA 3456 EE',
      location: 'Warszawa',
      status: 'cancelled'
    },
    {
      id: '8',
      instructorId: '5',
      instructorName: 'Wiktor Bondar',
      date: addDays(currentDate, 2),
      startTime: '16:00',
      endTime: '18:00',
      studentName: 'Tatiana Morozowa',
      lessonType: 'Autostrada',
      vehicleId: 'Honda Civic AA 7890 FF',
      location: 'Zbiórka: Warszawa',
      status: 'confirmed'
    }
  ];

  // Generowanie przedziałów czasowych do siatki harmonogramu
  const timeSlots: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Generowanie dni tygodnia
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(weekStart, i));
  }

  // Filtrowanie danych harmonogramu
  const filteredSchedule = scheduleData.filter(lesson => {
    if (selectedInstructor !== 'all' && lesson.instructorId !== selectedInstructor) return false;
    if (selectedLocation !== 'all' && !lesson.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (searchQuery && !lesson.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Pobieranie zajęć dla konkretnego instruktora, dnia i godziny
  const getLessonsForSlot = (instructorId: string, day: Date, time: string) => {
    return filteredSchedule.filter(lesson => {
      const lessonDate = format(lesson.date, 'yyyy-MM-dd');
      const dayDate = format(day, 'yyyy-MM-dd');
      return lesson.instructorId === instructorId && 
             lessonDate === dayDate && 
             lesson.startTime === time;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return AlertCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const locations = ['Warszawa', 'Tor Kraków', 'Tor Gdańsk', 'Ośrodek egzaminacyjny'];

  // Statystyki
  const stats = {
    totalLessons: filteredSchedule.length,
    confirmed: filteredSchedule.filter(l => l.status === 'confirmed').length,
    pending: filteredSchedule.filter(l => l.status === 'pending').length,
    cancelled: filteredSchedule.filter(l => l.status === 'cancelled').length,
    totalHours: filteredSchedule.reduce((acc, l) => {
      const start = parseInt(l.startTime.split(':')[0]);
      const end = parseInt(l.endTime.split(':')[0]);
      return acc + (end - start);
    }, 0)
  };

  return (
    <div className="max-w-full">
      {/* Nagłówek */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Harmonogram instruktorów</h1>
          <p className="text-gray-600 mt-1">Zarządzanie harmonogramem wszystkich instruktorów</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Dodaj zajęcia
          </button>
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Łącznie zajęć</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Potwierdzone</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Oczekujące</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Anulowane</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Zaplanowane godziny</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
        </div>
      </div>

      {/* Sterowanie */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Nawigacja po datach */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">
                {format(weekStart, 'd MMMM', { locale: pl })} - {format(addDays(weekStart, 6), 'd MMMM yyyy', { locale: pl })}
              </h3>
              <p className="text-sm text-gray-600">Tydzień {format(currentDate, 'w', { locale: pl })}</p>
            </div>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200"
            >
              Dziś
            </button>
          </div>

          {/* Przełącznik widoku */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarDays className="w-4 h-4 inline mr-1" />
              Tydzień
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Dzień
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Lista
            </button>
          </div>

          {/* Filtry */}
          <div className="flex items-center gap-3">
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszyscy instruktorzy</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie lokalizacje</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Widoki harmonogramu */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="sticky left-0 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-700 w-40">
                    Instruktor
                  </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="p-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200">
                      <div>{format(day, 'EEEE', { locale: pl })}</div>
                      <div className="text-xs text-gray-500">{format(day, 'd MMM', { locale: pl })}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {instructors.filter(i => selectedInstructor === 'all' || i.id === selectedInstructor).map((instructor) => (
                  <tr key={instructor.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="sticky left-0 bg-white p-3 border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={instructor.avatar}
                          alt={instructor.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{instructor.name}</p>
                          <p className="text-xs text-gray-500">ID: {instructor.id}</p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day, dayIndex) => {
                      const dayLessons = filteredSchedule.filter(lesson => {
                        const lessonDate = format(lesson.date, 'yyyy-MM-dd');
                        const dayDate = format(day, 'yyyy-MM-dd');
                        return lesson.instructorId === instructor.id && lessonDate === dayDate;
                      });

                      return (
                        <td key={dayIndex} className="p-2 align-top border-l border-gray-200 min-h-[120px]">
                          <div className="space-y-1">
                            {dayLessons.map(lesson => (
                              <div
                                key={lesson.id}
                                className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(lesson.status)}`}
                              >
                                <div className="font-semibold">{lesson.startTime} - {lesson.endTime}</div>
                                <div className="mt-1">{lesson.studentName}</div>
                                <div className="text-xs opacity-75">{lesson.lessonType}</div>
                                <div className="flex items-center justify-between mt-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="text-xs">{lesson.location}</span>
                                </div>
                              </div>
                            ))}
                            {dayLessons.length === 0 && (
                              <div className="text-center text-gray-400 text-xs py-8">
                                Wolne
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="sticky left-0 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-700 w-20">
                    Godzina
                  </th>
                  {instructors.filter(i => selectedInstructor === 'all' || i.id === selectedInstructor).map((instructor) => (
                    <th key={instructor.id} className="p-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <img
                          src={instructor.avatar}
                          alt={instructor.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{instructor.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className="border-b border-gray-200">
                    <td className="sticky left-0 bg-gray-50 p-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                      {time}
                    </td>
                    {instructors.filter(i => selectedInstructor === 'all' || i.id === selectedInstructor).map((instructor) => {
                      const lessons = getLessonsForSlot(instructor.id, currentDate, time);
                      
                      return (
                        <td key={instructor.id} className="p-2 border-l border-gray-200 min-w-[200px]">
                          {lessons.length > 0 ? (
                            <div className="space-y-1">
                              {lessons.map(lesson => (
                                <div
                                  key={lesson.id}
                                  className={`p-2 rounded-lg border text-xs ${getStatusColor(lesson.status)}`}
                                >
                                  <div className="font-semibold">{lesson.studentName}</div>
                                  <div>{lesson.lessonType}</div>
                                  <div className="opacity-75">{lesson.vehicleId}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-16 flex items-center justify-center text-gray-300 text-xs">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Godzina</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Instruktor</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Kursant</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Typ zajęć</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Pojazd</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Lokalizacja</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((lesson) => {
                  const StatusIcon = getStatusIcon(lesson.status);
                  
                  return (
                    <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-800">{lesson.startTime} - {lesson.endTime}</p>
                          <p className="text-xs text-gray-500">{format(lesson.date, 'dd.MM.yyyy')}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={instructors.find(i => i.id === lesson.instructorId)?.avatar || ''}
                            alt={lesson.instructorName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-800">{lesson.instructorName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-800">{lesson.studentName}</td>
                      <td className="p-3 text-sm text-gray-800">{lesson.lessonType}</td>
                      <td className="p-3 text-sm text-gray-600">{lesson.vehicleId}</td>
                      <td className="p-3 text-sm text-gray-600">{lesson.location}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`text-sm font-medium ${
                            lesson.status === 'confirmed' ? 'text-green-600' :
                            lesson.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {lesson.status === 'confirmed' ? 'Potwierdzone' :
                             lesson.status === 'pending' ? 'Oczekujące' :
                             'Anulowane'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors" aria-label="Pokaż szczegóły">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors" aria-label="Edytuj">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
