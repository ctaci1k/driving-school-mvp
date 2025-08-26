// app\[locale]\(student)\student\calendar\page.tsx
"use client";

import React, { useState } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User, Car,
  Filter, Search, Download, Plus, MoreVertical, X, Edit2,
  AlertCircle, CheckCircle, XCircle, RefreshCw, Eye, Star
} from 'lucide-react';

export default function StudentCalendarPage() {
  const [currentView, setCurrentView] = useState('month'); // month, week, day
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 26)); // August 26, 2024
const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Jazda w mieście',
      type: 'STANDARD',
      status: 'CONFIRMED',
      date: '2024-08-26',
      startTime: '14:00',
      endTime: '15:30',
      instructor: { name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff' },
      vehicle: 'Toyota Yaris • WZ 12345',
      location: 'ul. Puławska 145',
      notes: 'Ćwiczenie parkowania równoległego',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Jazda nocna',
      type: 'NIGHT',
      status: 'CONFIRMED',
      date: '2024-08-28',
      startTime: '20:00',
      endTime: '21:30',
      instructor: { name: 'Anna Kowalczyk', avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff' },
      vehicle: 'VW Golf • WZ 67890',
      location: 'ul. Wilanowska 89',
      notes: 'Jazda w warunkach ograniczonej widoczności',
      color: 'bg-indigo-500'
    },
    {
      id: 3,
      title: 'Egzamin próbny',
      type: 'EXAM_PREP',
      status: 'CONFIRMED',
      date: '2024-08-30',
      startTime: '10:00',
      endTime: '12:00',
      instructor: { name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff' },
      vehicle: 'Toyota Yaris • WZ 12345',
      location: 'ul. Puławska 145',
      notes: 'Symulacja egzaminu państwowego',
      color: 'bg-red-500'
    },
    {
      id: 4,
      title: 'Parkowanie',
      type: 'PARKING',
      status: 'COMPLETED',
      date: '2024-08-23',
      startTime: '16:00',
      endTime: '17:30',
      instructor: { name: 'Katarzyna Nowak', avatar: 'https://ui-avatars.com/api/?name=Katarzyna+Nowak&background=EC4899&color=fff' },
      vehicle: 'Škoda Fabia • WZ 11111',
      location: 'al. KEN 36',
      notes: 'Ukończone - ocena: 5/5',
      color: 'bg-green-500'
    },
    {
      id: 5,
      title: 'Jazda autostradą',
      type: 'HIGHWAY',
      status: 'CANCELLED',
      date: '2024-08-25',
      startTime: '12:00',
      endTime: '14:00',
      instructor: { name: 'Tomasz Wiśniewski', avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff' },
      vehicle: 'VW Golf • WZ 67890',
      location: 'ul. Puławska 145',
      notes: 'Anulowane - choroba instruktora',
      color: 'bg-gray-400'
    }
  ];

  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
  const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay() || 7;
  
  const days = [];
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 2; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - i)
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }
  
  return days;
};
const getWeekDays = (date: Date) => {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => 
      event.date === dateStr &&
      (filterType === 'all' || event.type === filterType) &&
      (filterStatus === 'all' || event.status === filterStatus)
    );
  };

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'COMPLETED':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'CANCELLED':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

  const getStatusBadge = (status: string) => {
    const badges = {
      'CONFIRMED': 'bg-green-100 text-green-700',
      'COMPLETED': 'bg-blue-100 text-blue-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'PENDING': 'bg-yellow-100 text-yellow-700'
    };
    
    const labels = {
      'CONFIRMED': 'Potwierdzone',
      'COMPLETED': 'Ukończone',
      'CANCELLED': 'Anulowane',
      'PENDING': 'Oczekujące'
    };
    
return (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
    {labels[status as keyof typeof labels]}
  </span>
);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mój kalendarz</h1>
        <p className="text-gray-600">Zarządzaj swoimi lekcjami jazdy</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* View Selector */}
          <div className="flex items-center gap-2">
            {['month', 'week', 'day'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === view
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view === 'month' ? 'Miesiąc' : view === 'week' ? 'Tydzień' : 'Dzień'}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (currentView === 'month') {
                  newDate.setMonth(newDate.getMonth() - 1);
                } else if (currentView === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setDate(newDate.getDate() - 1);
                }
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Dziś
            </button>
            
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (currentView === 'month') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else if (currentView === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setDate(newDate.getDate() + 1);
                }
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Date Display */}
          <div className="text-lg font-semibold text-gray-800">
            {currentView === 'month' && `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {currentView === 'week' && `Tydzień ${Math.ceil(currentDate.getDate() / 7)}, ${months[currentDate.getMonth()]}`}
            {currentView === 'day' && `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5" />
            </button>
<button 
  onClick={() => window.location.href = '/student/booking'}
  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
>
  <Plus className="w-4 h-4" />
  Nowa lekcja
</button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie typy</option>
                <option value="STANDARD">Jazda standardowa</option>
                <option value="HIGHWAY">Autostrada</option>
                <option value="PARKING">Parkowanie</option>
                <option value="NIGHT">Jazda nocna</option>
                <option value="EXAM_PREP">Egzamin próbny</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="CONFIRMED">Potwierdzone</option>
                <option value="COMPLETED">Ukończone</option>
                <option value="CANCELLED">Anulowane</option>
              </select>
            </div>
          </div>
        )}
      </div>

{/* Calendar View */}
<div className="bg-white rounded-xl shadow-sm p-4">
<div className="relative">
  <div>


        {/* Month View */}
        {currentView === 'month' && (
          <div>
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getMonthDays(currentDate).map((day, index) => {
                const dayEvents = getEventsForDate(day.date);
                const isToday = formatDate(new Date()) === formatDate(day.date);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded-lg transition-all ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'} hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                      } ${isToday ? 'text-blue-600' : ''}`}>
                        {day.day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left px-2 py-1 rounded text-xs text-white ${event.color} hover:opacity-90 transition-opacity`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.startTime}</span>
                          </div>
                          <p className="truncate font-medium">{event.title}</p>
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <button 
                          className="w-full text-xs text-gray-500 hover:text-gray-700"
                          onClick={() => setSelectedEvent(dayEvents[0])}
                        >
                          +{dayEvents.length - 2} więcej
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

{/* Week View */}
{currentView === 'week' && (
  <div>
    <div className="min-w-[800px]">
      <div className="grid grid-cols-8 gap-2">
        {/* Time Column */}
        <div className="pt-12">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(time => (
            <div key={time} className="h-20 text-xs text-gray-500 text-right pr-2">
              {time}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        {getWeekDays(currentDate).map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = formatDate(new Date()) === formatDate(day);
          
          return (
            <div key={index} className="border-l border-gray-200">
              <div className={`text-center py-2 mb-2 sticky top-0 bg-white z-10 ${isToday ? 'bg-blue-50' : ''}`}>
                <p className="text-xs text-gray-500">{weekDays[index]}</p>
                <p className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                  {day.getDate()}
                </p>
              </div>
              
              <div className="relative" style={{ minHeight: '640px' }}>
                {/* Hour grid lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(hour => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-gray-100"
                    style={{ top: `${hour * 80}px`, height: '80px' }}
                  />
                ))}
                
                {/* Events */}
                {dayEvents.map((event) => {
const startHour = parseInt(event.startTime.split(':')[0]);
const startMinute = parseInt(event.startTime.split(':')[1]);
const endHour = parseInt(event.endTime.split(':')[0]);
const endMinute = parseInt(event.endTime.split(':')[1]);

// Розрахунок позиції (8:00 = 0px, кожна 2 години = 80px)
const startIndex = Math.floor((startHour - 8) / 2);
const endIndex = Math.floor((endHour - 8) / 2);
const top = (startIndex * 80) + ((startHour % 2) * 40) + (startMinute / 60 * 40);
const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
const height = duration * 40; // 40px за годину
                  // Перевірка чи подія не виходить за межі
                  const maxHeight = 640 - top; // максимальна висота до кінця дня
                  const actualHeight = Math.min(height, maxHeight);
                  
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`absolute left-1 right-1 rounded-lg p-2 text-white text-xs ${event.color} hover:opacity-90 transition-opacity overflow-hidden`}
                      style={{ 
                        top: `${Math.max(0, top)}px`, 
                        height: `${actualHeight}px`,
                        minHeight: '40px',
                        zIndex: 1
                      }}
                    >
                      <p className="font-semibold truncate">{event.title}</p>
                      <p className="truncate">{event.startTime} - {event.endTime}</p>
                      {actualHeight > 50 && (
                        <p className="truncate opacity-90">{event.instructor.name}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

        {/* Day View */}
        {currentView === 'day' && (
          <div className="space-y-4">
            {getEventsForDate(currentDate).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Brak lekcji w tym dniu</p>
              </div>
            ) : (
              getEventsForDate(currentDate).map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-1 h-12 rounded-full ${event.color}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{event.instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>{event.vehicle}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {event.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{event.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      
    </div>
  </div>





      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                {getStatusBadge(selectedEvent.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{selectedEvent.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Godzina:</span>
                <span className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Instruktor:</span>
                <div className="flex items-center gap-2">
                  <img src={selectedEvent.instructor.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{selectedEvent.instructor.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pojazd:</span>
                <span className="font-medium">{selectedEvent.vehicle}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lokalizacja:</span>
                <span className="font-medium">{selectedEvent.location}</span>
              </div>

              {selectedEvent.notes && (
                <div>
                  <span className="text-gray-600">Notatki:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selectedEvent.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                {selectedEvent.status === 'CONFIRMED' && (
                  <>
                    <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Przełóż
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Anuluj
                    </button>
                  </>
                )}
                {selectedEvent.status === 'COMPLETED' && (
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Oceń lekcję
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}