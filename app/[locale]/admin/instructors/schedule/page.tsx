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
import { uk } from 'date-fns/locale';

export default function InstructorsSchedulePage() {
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock instructors
  const instructors = [
    { id: '1', name: 'Олег Коваль', avatar: 'https://ui-avatars.com/api/?name=Олег+Коваль&background=10B981&color=fff', color: 'bg-green-500' },
    { id: '2', name: 'Анна Лисенко', avatar: 'https://ui-avatars.com/api/?name=Анна+Лисенко&background=8B5CF6&color=fff', color: 'bg-purple-500' },
    { id: '3', name: 'Михайло Ткаченко', avatar: 'https://ui-avatars.com/api/?name=Михайло+Ткаченко&background=F59E0B&color=fff', color: 'bg-yellow-500' },
    { id: '4', name: 'Юлія Савченко', avatar: 'https://ui-avatars.com/api/?name=Юлія+Савченко&background=EC4899&color=fff', color: 'bg-pink-500' },
    { id: '5', name: 'Віктор Бондар', avatar: 'https://ui-avatars.com/api/?name=Віктор+Бондар&background=3B82F6&color=fff', color: 'bg-blue-500' }
  ];

  // Mock schedule data
  const scheduleData = [
    {
      id: '1',
      instructorId: '1',
      instructorName: 'Олег Коваль',
      date: currentDate,
      startTime: '08:00',
      endTime: '10:00',
      studentName: 'Іван Петренко',
      lessonType: 'Практика',
      vehicleId: 'Toyota Corolla AA 1234 BB',
      location: 'Центр',
      status: 'confirmed'
    },
    {
      id: '2',
      instructorId: '1',
      instructorName: 'Олег Коваль',
      date: currentDate,
      startTime: '10:00',
      endTime: '12:00',
      studentName: 'Марія Коваленко',
      lessonType: 'Автодром',
      vehicleId: 'Toyota Corolla AA 1234 BB',
      location: 'Автодром Північний',
      status: 'confirmed'
    },
    {
      id: '3',
      instructorId: '2',
      instructorName: 'Анна Лисенко',
      date: currentDate,
      startTime: '09:00',
      endTime: '11:00',
      studentName: 'Андрій Шевченко',
      lessonType: 'Місто',
      vehicleId: 'VW Golf AA 5678 CC',
      location: 'Центр',
      status: 'confirmed'
    },
    {
      id: '4',
      instructorId: '2',
      instructorName: 'Анна Лисенко',
      date: currentDate,
      startTime: '14:00',
      endTime: '16:00',
      studentName: 'Оксана Мельник',
      lessonType: 'Паркування',
      vehicleId: 'VW Golf AA 5678 CC',
      location: 'Центр',
      status: 'pending'
    },
    {
      id: '5',
      instructorId: '3',
      instructorName: 'Михайло Ткаченко',
      date: currentDate,
      startTime: '08:00',
      endTime: '10:00',
      studentName: 'Петро Сидоренко',
      lessonType: 'Екзамен',
      vehicleId: 'Škoda Fabia AA 9012 DD',
      location: 'Сервісний центр МВС',
      status: 'confirmed'
    },
    {
      id: '6',
      instructorId: '3',
      instructorName: 'Михайло Ткаченко',
      date: addDays(currentDate, 1),
      startTime: '12:00',
      endTime: '14:00',
      studentName: 'Наталія Козак',
      lessonType: 'Практика',
      vehicleId: 'Škoda Fabia AA 9012 DD',
      location: 'Центр',
      status: 'confirmed'
    },
    {
      id: '7',
      instructorId: '4',
      instructorName: 'Юлія Савченко',
      date: currentDate,
      startTime: '10:00',
      endTime: '12:00',
      studentName: 'Богдан Кравчук',
      lessonType: 'Нічна їзда',
      vehicleId: 'Renault Megane AA 3456 EE',
      location: 'Центр',
      status: 'cancelled'
    },
    {
      id: '8',
      instructorId: '5',
      instructorName: 'Віктор Бондар',
      date: addDays(currentDate, 2),
      startTime: '16:00',
      endTime: '18:00',
      studentName: 'Тетяна Морозова',
      lessonType: 'Автострада',
      vehicleId: 'Honda Civic AA 7890 FF',
      location: 'Збір: Центр',
      status: 'confirmed'
    }
  ];

  // Generate time slots for the schedule grid
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Generate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(weekStart, i));
  }

  // Filter schedule data
  const filteredSchedule = scheduleData.filter(lesson => {
    if (selectedInstructor !== 'all' && lesson.instructorId !== selectedInstructor) return false;
    if (selectedLocation !== 'all' && !lesson.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (searchQuery && !lesson.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get lessons for specific instructor and time
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

  const locations = ['Центр', 'Автодром Північний', 'Автодром Південний', 'Сервісний центр МВС'];

  // Statistics
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
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Розклад інструкторів</h1>
          <p className="text-gray-600 mt-1">Управління розкладом всіх інструкторів</p>
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
            Додати заняття
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Всього занять</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Підтверджено</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Очікують</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Скасовано</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Годин заплановано</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">
                {format(weekStart, 'd MMMM', { locale: uk })} - {format(addDays(weekStart, 6), 'd MMMM yyyy', { locale: uk })}
              </h3>
              <p className="text-sm text-gray-600">Тиждень {format(currentDate, 'w', { locale: uk })}</p>
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
              Сьогодні
            </button>
          </div>

          {/* View Mode Toggle */}
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
              Тиждень
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
              День
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
              Список
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі інструктори</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі локації</option>
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

      {/* Schedule Views */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="sticky left-0 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-700 w-40">
                    Інструктор
                  </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="p-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200">
                      <div>{format(day, 'EEEE', { locale: uk })}</div>
                      <div className="text-xs text-gray-500">{format(day, 'd MMM', { locale: uk })}</div>
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
                                Вільно
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
                    Час
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
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Час</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Інструктор</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Студент</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Тип заняття</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Транспорт</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Локація</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Статус</th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">Дії</th>
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
                            src={instructors.find(i => i.id === lesson.instructorId)?.avatar}
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
                            {lesson.status === 'confirmed' ? 'Підтверджено' :
                             lesson.status === 'pending' ? 'Очікує' :
                             'Скасовано'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
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