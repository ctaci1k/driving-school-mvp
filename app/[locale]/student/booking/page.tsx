// app/[locale]/(student)/student/booking/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Car, MapPin, Star, ChevronRight, ChevronLeft,
  Check, X, AlertCircle, Filter, Search, User, Award,
  Zap, Moon, Sun, Mountain, RotateCw, Navigation, Circle,
  GraduationCap, AlertTriangle, CheckCircle, CreditCard, Coins,
  Info, CalendarDays, Loader2
} from 'lucide-react';

export default function StudentBookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [useCredits, setUseCredits] = useState(true);
  const [searchInstructor, setSearchInstructor] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  
  // Нові state для календаря
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [instructorBusyDates] = useState(['2024-08-18', '2024-08-22', '2024-08-25', '2024-08-29']);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const userCredits = 12;
  const lessonPrice = 180;

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                     'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  // Helper функції для календаря
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7;
    
    const days = [];
    
    // Попередній місяць
    for (let i = startingDayOfWeek - 2; i >= 0; i--) {
      days.push({ day: 0, isCurrentMonth: false, date: null, dateString: '' });
    }
    
    // Поточний місяць
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    return days;
  };

  const isDateAvailable = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Не можна бронювати в минулому
    if (date < today) return false;
    
    // Не можна бронювати менше ніж за 24 години
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date < tomorrow) return false;
    
    // Перевірка зайнятості інструктора
    if (instructorBusyDates.includes(dateString)) return false;
    
    // Не можна бронювати на неділю
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return false;
    
    return true;
  };

  // Динамічні time slots залежно від інструктора
  const getTimeSlots = () => {
    if (!selectedInstructor || !selectedDate) {
      return [
        { time: '08:00', available: false },
        { time: '10:00', available: false },
        { time: '12:00', available: false },
        { time: '14:00', available: false },
        { time: '16:00', available: false },
        { time: '18:00', available: false },
        { time: '20:00', available: false }
      ];
    }
    
    // Симуляція доступності
    return [
      { time: '08:00', available: true },
      { time: '10:00', available: true },
      { time: '12:00', available: false },
      { time: '14:00', available: true },
      { time: '16:00', available: selectedInstructor === '1' },
      { time: '18:00', available: false },
      { time: '20:00', available: selectedInstructor === '2' }
    ];
  };

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    
    // Симуляція API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConfirming(false);
    setBookingSuccess(true);
    
    // Redirect після 3 секунд
    setTimeout(() => {
      window.location.href = '/student/calendar';
    }, 3000);
  };

  const lessonTypes = [
    {
      id: 'STANDARD',
      name: 'Jazda standardowa',
      description: 'Podstawowa lekcja jazdy w mieście',
      icon: Car,
      duration: '90 min',
      credits: 1,
      price: 180,
      recommended: false,
      color: 'blue'
    },
    {
      id: 'HIGHWAY',
      name: 'Jazda autostradą',
      description: 'Nauka jazdy z wysokimi prędkościami',
      icon: Zap,
      duration: '120 min',
      credits: 2,
      price: 360,
      recommended: false,
      color: 'purple'
    },
    {
      id: 'PARKING',
      name: 'Parkowanie',
      description: 'Parkowanie równoległe i prostopadłe',
      icon: Circle,
      duration: '60 min',
      credits: 1,
      price: 120,
      recommended: false,
      color: 'green'
    },
    {
      id: 'NIGHT',
      name: 'Jazda nocna',
      description: 'Jazda w warunkach ograniczonej widoczności',
      icon: Moon,
      duration: '90 min',
      credits: 2,
      price: 360,
      recommended: true,
      color: 'indigo'
    },
    {
      id: 'EXAM_PREP',
      name: 'Przygotowanie do egzaminu',
      description: 'Symulacja egzaminu państwowego',
      icon: GraduationCap,
      duration: '120 min',
      credits: 2,
      price: 400,
      recommended: true,
      color: 'red'
    },
    {
      id: 'MANEUVERS',
      name: 'Manewry',
      description: 'Zawracanie, cofanie, podjazd pod górkę',
      icon: RotateCw,
      duration: '90 min',
      credits: 1,
      price: 180,
      recommended: false,
      color: 'teal'
    }
  ];

  const instructors = [
    {
      id: '1',
      name: 'Piotr Nowak',
      rating: 4.9,
      reviews: 124,
      experience: '8 lat',
      specializations: ['Egzaminy', 'Jazda nocna', 'Autostrady'],
      completedLessons: 1250,
      successRate: 94,
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      nextAvailable: 'Jutro 14:00',
      favorite: true
    },
    {
      id: '2',
      name: 'Anna Kowalczyk',
      rating: 4.8,
      reviews: 98,
      experience: '5 lat',
      specializations: ['Parkowanie', 'Manewry', 'Miasto'],
      completedLessons: 890,
      successRate: 92,
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff',
      nextAvailable: 'Dziś 18:00',
      favorite: false
    },
    {
      id: '3',
      name: 'Tomasz Wiśniewski',
      rating: 4.7,
      reviews: 156,
      experience: '10 lat',
      specializations: ['Początkujący', 'Manewry', 'Egzaminy'],
      completedLessons: 2100,
      successRate: 89,
      avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff',
      nextAvailable: 'Poniedziałek 10:00',
      favorite: false
    },
    {
      id: '4',
      name: 'Katarzyna Nowak',
      rating: 5.0,
      reviews: 67,
      experience: '3 lata',
      specializations: ['Jazda nocna', 'Miasto', 'Parkowanie'],
      completedLessons: 450,
      successRate: 96,
      avatar: 'https://ui-avatars.com/api/?name=Katarzyna+Nowak&background=EC4899&color=fff',
      nextAvailable: 'Jutro 8:00',
      favorite: true
    }
  ];

  const vehicles = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Yaris',
      year: 2023,
      transmission: 'Manual',
      fuel: 'Benzyna',
      registration: 'WZ 12345',
      image: 'https://via.placeholder.com/300x200?text=Toyota+Yaris',
      features: ['ABS', 'ESP', 'Klimatyzacja', 'Parking sensors']
    },
    {
      id: '2',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      transmission: 'Manual',
      fuel: 'Diesel',
      registration: 'WZ 67890',
      image: 'https://via.placeholder.com/300x200?text=VW+Golf',
      features: ['ABS', 'ESP', 'Klimatyzacja', 'Kamera cofania']
    },
    {
      id: '3',
      make: 'Škoda',
      model: 'Fabia',
      year: 2023,
      transmission: 'Automatic',
      fuel: 'Benzyna',
      registration: 'WZ 11111',
      image: 'https://via.placeholder.com/300x200?text=Skoda+Fabia',
      features: ['ABS', 'ESP', 'Klimatyzacja', 'Apple CarPlay']
    }
  ];

  const locations = [
    { id: '1', name: 'Centrum - ul. Puławska 145', distance: '2.3 km' },
    { id: '2', name: 'Mokotów - ul. Wilanowska 89', distance: '4.1 km' },
    { id: '3', name: 'Ursynów - al. KEN 36', distance: '0.8 km' }
  ];

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchInstructor.toLowerCase()) &&
    instructor.rating >= filterRating
  );

  const steps = [
    { id: 1, name: 'Typ lekcji', icon: Car },
    { id: 2, name: 'Instruktor', icon: User },
    { id: 3, name: 'Data i czas', icon: Calendar },
    { id: 4, name: 'Pojazd i miejsce', icon: MapPin },
    { id: 5, name: 'Potwierdzenie', icon: Check }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Success Modal
  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rezerwacja potwierdzona!</h2>
          <p className="text-gray-600 mb-4">
            Twoja lekcja została zarezerwowana pomyślnie. 
            Otrzymasz potwierdzenie na email.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Data:</strong> {selectedDate}<br />
              <strong>Godzina:</strong> {selectedTime}<br />
              <strong>Instruktor:</strong> {instructors.find(i => i.id === selectedInstructor)?.name}
            </p>
          </div>
          <p className="text-sm text-gray-500">Przekierowanie do kalendarza...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Zarezerwuj lekcję jazdy</h1>
          <p className="text-gray-600">Wybierz odpowiedni termin i instruktora</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-blue-500 text-white' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-blue-600' :
                      isCompleted ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 lg:w-32 h-1 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Step 1: Lesson Type */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Wybierz typ lekcji</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonTypes.map((type) => {
                  const Icon = type.icon;
                  const colorClasses = getColorClasses(type.color);

                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {type.recommended && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Polecane
                        </span>
                      )}
                      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{type.duration}</span>
                        <div className="text-right">
                          <span className="font-semibold text-blue-600">{type.credits} kredyt</span>
                          <span className="text-xs text-gray-500 block">lub {type.price} PLN</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Select Instructor */}
          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Wybierz instruktora</h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Szukaj instruktora..."
                      value={searchInstructor}
                      onChange={(e) => setSearchInstructor(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Wszystkie oceny</option>
                    <option value={4}>4.0+</option>
                    <option value={4.5}>4.5+</option>
                    <option value={4.8}>4.8+</option>
                  </select>
                </div>
              </div>

              {/* Instructors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInstructors.map((instructor) => (
                  <button
                    key={instructor.id}
                    onClick={() => setSelectedInstructor(instructor.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedInstructor === instructor.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={instructor.avatar} alt={instructor.name} className="w-14 h-14 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">{instructor.name}</h3>
                            {instructor.favorite && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold">{instructor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({instructor.reviews} opinii)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Doświadczenie</p>
                        <p className="text-sm font-semibold">{instructor.experience}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Skuteczność</p>
                        <p className="text-sm font-semibold text-green-600">{instructor.successRate}%</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Specjalizacje:</p>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specializations.map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Najbliższy termin: {instructor.nextAvailable}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time - ОНОВЛЕНО */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Wybierz datę i godzinę</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Wybierz dzień</h3>
                  
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
                    <button
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() - 1);
                        setCurrentMonth(newMonth);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentMonth.getMonth() === new Date().getMonth() && 
                               currentMonth.getFullYear() === new Date().getFullYear()}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      {selectedInstructor && (
                        <p className="text-xs text-gray-500 mt-1">
                          Instruktor: {instructors.find(i => i.id === selectedInstructor)?.name}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() + 1);
                        setCurrentMonth(newMonth);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {generateCalendarDays(currentMonth).map((day, index) => {
                        const isToday = day.dateString === new Date().toISOString().split('T')[0];
                        const isSelected = selectedDate === day.dateString;
                        const isAvailable = day.date && day.isCurrentMonth && isDateAvailable(day.dateString);
                        const isBusy = day.dateString && instructorBusyDates.includes(day.dateString);
                        
                        return (
                          <button
                            key={index}
                            onClick={() => isAvailable && setSelectedDate(day.dateString)}
                            disabled={!isAvailable || !day.isCurrentMonth}
                            className={`
                              p-2 rounded-lg text-sm font-medium transition-all relative
                              ${!day.isCurrentMonth ? 'invisible' : ''}
                              ${isSelected ? 'bg-blue-500 text-white shadow-lg' : ''}
                              ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                              ${isAvailable && !isSelected && !isToday ? 'hover:bg-gray-200 text-gray-700' : ''}
                              ${!isAvailable && day.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : ''}
                              ${isBusy ? 'bg-red-50 text-red-300 cursor-not-allowed' : ''}
                            `}
                          >
                            {day.day || ''}
                            {isBusy && day.isCurrentMonth && (
                              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-100 rounded"></div>
                        <span className="text-gray-600">Dziś</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                        <span className="text-gray-600">Dostępny</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-50 rounded relative">
                          <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
                        </div>
                        <span className="text-gray-600">Zajęty</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Alert */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p className="text-xs text-blue-700">
                        Minimalne wyprzedzenie rezerwacji to 24 godziny. 
                        Zajętość instruktora jest aktualizowana na bieżąco.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Wybierz godzinę</h3>
                  
                  {!selectedDate ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Najpierw wybierz datę</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {getTimeSlots().map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedTime === slot.time
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : slot.available
                                  ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            {!slot.available && (
                              <span className="text-xs text-gray-400 mt-1 block">Zajęte</span>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Selected DateTime Summary */}
                      {selectedTime && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700">
                              Wybrano: <strong>{selectedDate}, {selectedTime}</strong>
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vehicle & Location */}
          {currentStep === 4 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Wybierz pojazd i miejsce</h2>

              {/* Vehicles */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Dostępne pojazdy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedVehicle === vehicle.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-800">
                        {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.registration}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{vehicle.year}</span>
                        <span>•</span>
                        <span>{vehicle.transmission}</span>
                        <span>•</span>
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{vehicle.features.length - 2}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Miejsce rozpoczęcia</h3>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        selectedLocation === location.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-800">{location.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{location.distance}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Podsumowanie rezerwacji</h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Typ lekcji</span>
                    <span className="font-semibold">
                      {lessonTypes.find(t => t.id === selectedType)?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Instruktor</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={instructors.find(i => i.id === selectedInstructor)?.avatar}
                        alt="Instructor"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold">
                        {instructors.find(i => i.id === selectedInstructor)?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Data i godzina</span>
                    <span className="font-semibold">{selectedDate}, {selectedTime}</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Pojazd</span>
                    <span className="font-semibold">
                      {vehicles.find(v => v.id === selectedVehicle)?.make} {vehicles.find(v => v.id === selectedVehicle)?.model}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Miejsce</span>
                    <span className="font-semibold">
                      {locations.find(l => l.id === selectedLocation)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Metoda płatności</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setUseCredits(true)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      useCredits ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Użyj kredytów</p>
                        <p className="text-sm text-gray-600">Dostępne: {userCredits} kredytów</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {lessonTypes.find(t => t.id === selectedType)?.credits || 0} kredyty
                      </p>
                      <p className="text-xs text-gray-500">
                        Pozostanie: {userCredits - (lessonTypes.find(t => t.id === selectedType)?.credits || 0)}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUseCredits(false)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      !useCredits ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Zapłać online</p>
                        <p className="text-sm text-gray-600">Przelewy24</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">
                      {lessonTypes.find(t => t.id === selectedType)?.price || 0} PLN
                    </p>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 mb-1">Warunki anulowania</p>
                    <p className="text-gray-600">
                      Możesz anulować lub przełożyć lekcję do 24h przed jej rozpoczęciem bez utraty kredytów.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Wstecz
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !selectedType) ||
                  (currentStep === 2 && !selectedInstructor) ||
                  (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 4 && (!selectedVehicle || !selectedLocation))
                }
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  ((currentStep === 1 && !selectedType) ||
                   (currentStep === 2 && !selectedInstructor) ||
                   (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                   (currentStep === 4 && (!selectedVehicle || !selectedLocation)))
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Dalej
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isConfirming}
                className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Potwierdzanie...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Potwierdź rezerwację
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}