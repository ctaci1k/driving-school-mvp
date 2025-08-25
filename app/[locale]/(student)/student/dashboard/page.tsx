
// app\[locale]\(student)\student\dashboard\page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home, Calendar, CalendarPlus, CreditCard, MessageSquare,
  BookOpen, TrendingUp, Bell, Moon, Sun, Menu, X, Plus,
  Bot, MapPin, Phone, Clock, Star, Check, Coins,
  GraduationCap, Car, Lightbulb, ChevronRight,
  ClipboardCheck, HelpCircle, Users, Cloud
} from 'lucide-react';

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications] = useState(3);
  const [userCredits] = useState(12);
  const [fabOpen, setFabOpen] = useState(false);
  const handleShowMap = () => {
    // Відкриваємо Google Maps з адресою
    window.open(`https://maps.google.com/?q=${encodeURIComponent(nextLesson.location)}`, '_blank');
  };
  const handleContact = () => {
    // Відкриваємо модалку або телефон
    if (window.confirm('Zadzwonić do instruktora Piotr Nowak?')) {
      window.location.href = 'tel:+48123456789';
    }
  };
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };
  const [showCancelModal, setShowCancelModal] = useState(false);
const handleCancel = () => {
  setShowCancelModal(true);
};




  // Mock data
  const user = {
    name: 'Jan Kowalski',
    avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
    role: 'Student',
    completedLessons: 24,
    examReadiness: 75,
    rating: 4.8
  };

  const nextLesson = {
    date: 'Poniedziałek, 26 Sierpnia',
    time: '14:00',
    instructor: {
      name: 'Piotr Nowak',
      rating: 4.9,
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
    },
    vehicle: 'Toyota Yaris • WZ 12345',
    location: 'ul. Puławska 145',
    daysLeft: 2,
    hoursLeft: 14,
    minutesLeft: 32
  };

  const skills = [
    { name: 'Parkowanie równoległe', progress: 90, color: 'bg-green-500' },
    { name: 'Jazda w ruchu miejskim', progress: 85, color: 'bg-green-500' },
    { name: 'Manewry', progress: 70, color: 'bg-yellow-500' },
    { name: 'Jazda autostradą', progress: 60, color: 'bg-orange-500' },
    { name: 'Jazda nocna', progress: 40, color: 'bg-red-500' }
  ];

  const activities = [
    {
      type: 'completed',
      title: 'Lekcja ukończona',
      description: 'Parkowanie równoległe z Piotrem Nowakiem',
      time: '2 dni temu',
      icon: Check,
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'booked',
      title: 'Lekcja zarezerwowana',
      description: 'Poniedziałek, 26 Sierpnia - 14:00',
      time: '3 dni temu',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'payment',
      title: 'Pakiet zakupiony',
      description: '20 kredytów - Pakiet Premium',
      time: 'Tydzień temu',
      icon: Coins,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'rating',
      title: 'Ocena wystawiona',
      description: '5.0 ⭐ dla instruktora Piotr Nowak',
      time: '2 tygodnie temu',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const stats = [
    {
      title: 'Ukończone lekcje',
      value: 24,
      icon: Car,
      trend: '+15%',
      trendUp: true,
      color: 'blue'
    },
    {
      title: 'Gotowość do egzaminu',
      value: '75%',
      icon: GraduationCap,
      trend: '75%',
      trendUp: true,
      color: 'green'
    },
    {
      title: 'Aktywne kredyty',
      value: 12,
      icon: Coins,
      trend: '12 left',
      trendUp: false,
      color: 'purple'
    },
    {
      title: 'Średnia ocena',
      value: 4.8,
      icon: Star,
      trend: 'Świetnie!',
      trendUp: true,
      color: 'orange'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'booking', label: 'Zarezerwuj lekcję', icon: CalendarPlus },
    { id: 'schedule', label: 'Mój kalendarz', icon: Calendar },
    { id: 'progress', label: 'Postępy', icon: TrendingUp },
    { id: 'payments', label: 'Płatności', icon: CreditCard },
    { id: 'messages', label: 'Wiadomości', icon: MessageSquare, badge: 2 },
    { id: 'resources', label: 'Materiały', icon: BookOpen }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cześć, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Świetnie Ci idzie! Jeszcze tylko 8 lekcji do egzaminu.
          </p>

          {/* Motivational Quote & Progress */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 italic mb-3">
              "Każda podróż tysiąca mil zaczyna się od pierwszego kroku"
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">Postęp do egzaminu:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }} />
              </div>
              <span className="text-sm font-bold text-gray-800">75%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            };

            return (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            );
          })}
        </div>

{/* Next Lesson Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm opacity-90">Następna lekcja</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                {nextLesson.date} - {nextLesson.time}
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                {/* Instructor */}
                <div className="flex items-center space-x-2">
                  <img src={nextLesson.instructor.avatar} className="w-8 h-8 rounded-full" alt="Instructor" />
                  <div>
                    <p className="text-sm font-semibold">{nextLesson.instructor.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{nextLesson.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">{nextLesson.vehicle}</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{nextLesson.location}</span>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="flex items-center gap-2 mt-3 p-2 bg-white/10 rounded-lg">
                <Cloud className="w-4 h-4" />
                <span className="text-sm">Pochmurno, 18°C</span>
                <span className="text-xs opacity-75">• Dobra widoczność</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <div className="flex gap-2">
                <button 
                  onClick={handleShowMap}
                  className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Pokaż na mapie
                </button>
                <button 
                  onClick={handleContact}
                  className="flex-1 px-4 py-2 bg-white/90 text-blue-600 rounded-lg font-semibold hover:bg-white transition-colors flex items-center justify-center border border-white/50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Kontakt
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleReschedule}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Przełóż
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </button>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Pozostało:</span>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{nextLesson.daysLeft}</div>
                  <div className="text-xs opacity-90">DNI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{nextLesson.hoursLeft}</div>
                  <div className="text-xs opacity-90">GODZ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{nextLesson.minutesLeft}</div>
                  <div className="text-xs opacity-90">MIN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Progress & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Postępy w nauce</h3>
              <button className="text-blue-600 text-sm hover:underline flex items-center">
                Zobacz wszystkie <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Skills Progress */}
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{skill.name}</span>
                    <span className={`text-sm font-semibold ${skill.progress >= 80 ? 'text-green-600' :
                      skill.progress >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${skill.color}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Rekomendacja instruktora</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Skup się na jeździe nocnej i autostradowej przed egzaminem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ostatnia aktywność</h3>
              <Link
                href="/student/activity"
                className="text-blue-600 text-sm hover:underline flex items-center"
              >
                Zobacz wszystkie <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex space-x-3 transition-all duration-500 ease-out"
                    style={{
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Link href="/student/booking" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CalendarPlus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Zarezerwuj lekcję</span>
            </div>
          </Link>

          <Link href="/student/resources?tab=tests" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Test próbny</span>
            </div>
          </Link>

          <Link href="/student/resources" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Materiały</span>
            </div>
          </Link>

          <Link href="/student/help" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Pomoc</span>
            </div>
          </Link>
        </div>
      </div>


      {/* Floating Action Button with Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {fabOpen && (
          <div className="absolute bottom-16 right-0 space-y-2">
            <button 
              onClick={() => window.location.href = 'tel:112'}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white shadow-lg rounded-lg hover:bg-red-600 transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Kontakt awaryjny</span>
            </button>
            <button 
              onClick={() => window.location.href = '/student/calendar'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white shadow-lg rounded-lg hover:bg-blue-600 transition-all whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Kalendarz</span>
            </button>
            <button 
              onClick={() => window.location.href = '/student/booking'}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white shadow-lg rounded-lg hover:bg-green-600 transition-all whitespace-nowrap"
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Rezerwuj</span>
            </button>
          </div>
        )}
        <button 
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-200 ${fabOpen ? 'rotate-45' : ''}`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Przełóż lekcję</h3>
            <p className="text-gray-600 mb-4">Wybierz nowy termin dla swojej lekcji</p>
            <div className="space-y-3">
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-gray-800" />
              <input type="time" className="w-full p-2 border border-gray-300 rounded-lg text-gray-800" />
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button 
                onClick={() => {
                  alert('Lekcja została przełożona!');
                  setShowRescheduleModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Anuluj lekcję</h3>
            <p className="text-gray-600 mb-4">
              Czy na pewno chcesz anulować lekcję? 
              <br />
              <span className="text-sm text-orange-600 mt-2 block">
                ⚠️ Anulowanie mniej niż 24h przed lekcją może skutkować utratą kredytów
              </span>
            </p>
            <textarea 
              placeholder="Powód anulowania (opcjonalnie)"
              className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none text-gray-800"
            />
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Wróć
              </button>
              <button 
                onClick={() => {
                  alert('Lekcja została anulowana');
                  setShowCancelModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Anuluj lekcję
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}