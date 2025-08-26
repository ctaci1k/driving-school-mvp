// app\[locale]\student\dashboard\page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, CalendarPlus, CreditCard, MessageSquare,
  BookOpen, TrendingUp, Bell, MapPin, Phone, Clock, 
  Star, Check, Coins, GraduationCap, Car, ChevronRight,
  ClipboardCheck, Users, AlertCircle, RefreshCw, Loader2,
  Award, Target, Activity, BookOpenCheck, Timer,
  Trophy, Zap, Shield, Brain, BarChart3, User,
  CheckCircle, XCircle, Info, ArrowUp, ArrowDown
} from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { format, formatDistanceToNow, addDays, isToday, isTomorrow } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function StudentDashboard() {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    error,
    refetch 
  } = trpc.dashboard.getStudentDashboard.useQuery(undefined, {
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch quick stats
  const { data: quickStats } = trpc.dashboard.getQuickStats.useQuery();

  // Cancel booking mutation - safely handle if method doesn't exist
  const cancelBookingMutation = (trpc as any).booking?.cancelBooking?.useMutation({
    onSuccess: () => {
      setShowCancelModal(false);
      setSelectedBookingId(null);
      setCancelReason('');
      refetch();
    },
    onError: (error: any) => {
      alert(error.message || 'Wystąpił błąd podczas anulowania');
    }
  }) || {
    mutate: () => console.warn('Cancel booking method not available'),
    isLoading: false
  };

  // Mark dashboard as viewed
  const markViewedMutation = trpc.dashboard.markDashboardViewed.useMutation();

  useEffect(() => {
    markViewedMutation.mutate();
  }, []);

  // Helper functions
const handleShowMap = () => {
  const address = dashboardData?.nextLesson?.location?.address || dashboardData?.nextLesson?.pickupLocation;
  if (address) {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  }
};

  const handleContact = () => {
    if (dashboardData?.nextLesson?.instructor?.phone) {
      if (window.confirm(`Zadzwonić do ${dashboardData.nextLesson.instructor.name}?`)) {
        window.location.href = `tel:${dashboardData.nextLesson.instructor.phone}`;
      }
    }
  };

  const handleCancel = () => {
    if (selectedBookingId && cancelReason) {
      cancelBookingMutation.mutate({
        bookingId: selectedBookingId,
        reason: cancelReason
      });
    }
  };

  const formatLessonDate = (date: Date) => {
    if (isToday(date)) return 'Dzisiaj';
    if (isTomorrow(date)) return 'Jutro';
    return format(date, 'EEEE, d MMMM', { locale: pl });
  };

  const getExamReadinessColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExamReadinessMessage = (percentage: number) => {
    if (percentage >= 90) return 'Jesteś gotowy na egzamin! 🎯';
    if (percentage >= 75) return 'Prawie gotowy, jeszcze trochę praktyki';
    if (percentage >= 50) return 'Na dobrej drodze, kontynuuj naukę';
    return 'Potrzebujesz więcej praktyki';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie pulpitu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Wystąpił błąd
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Nie udało się załadować danych pulpitu'}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // Destructure data
  const {
    user,
    stats,
    nextLesson,
    upcomingLessons = [],
    packages = [],
    achievements = [],
    notifications,
    progress,
    instructors = [],
    examResults = []
  } = dashboardData || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Witaj z powrotem33, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          {nextLesson ? (
            <>
              Twoja następna lekcja: <span className="font-semibold">{formatLessonDate(new Date(nextLesson.date))}</span> o {nextLesson.startTime}
            </>
          ) : (
            'Nie masz zaplanowanych lekcji. Zarezerwuj swoją następną jazdę!'
          )}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/student/booking"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <CalendarPlus className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">Zarezerwuj</h3>
          <p className="text-sm opacity-90">Nowa lekcja</p>
        </Link>

        <Link
          href="/student/calendar"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Calendar className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">Kalendarz</h3>
          <p className="text-sm opacity-90">{upcomingLessons.length} lekcji</p>
        </Link>

        <Link
          href="/student/progress"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <TrendingUp className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">Postępy</h3>
          <p className="text-sm opacity-90">{stats?.examReadiness || 0}%</p>
        </Link>

        <Link
          href="/student/payments"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
        >
          <Coins className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">Kredyty</h3>
          <p className="text-sm opacity-90">{stats?.totalCredits || 0} dostępne</p>
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Completed Lessons */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {stats?.completedLessons || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Ukończone lekcje</h3>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {stats?.totalHours || 0} godzin jazdy
            </span>
          </div>
        </div>

        {/* Exam Readiness */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-3xl font-bold ${getExamReadinessColor(stats?.examReadiness || 0)}`}>
              {stats?.examReadiness || 0}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Gotowość do egzaminu</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                stats?.examReadiness >= 80 ? 'bg-green-500' :
                stats?.examReadiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${stats?.examReadiness || 0}%` }}
            />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {stats?.averageRating || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Średnia ocena</h3>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats?.averageRating || 0)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Theory & Practice */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Teoria</p>
              <span className="text-2xl font-bold text-gray-800">
                {stats?.theoryProgress || 0}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Praktyka</span>
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {stats?.practicalProgress || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Next Lesson Card */}
      {nextLesson && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-1">
            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Następna lekcja
                    </h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {nextLesson.type}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatLessonDate(new Date(nextLesson.date))}
                    <Clock className="w-4 h-4 ml-2" />
                    {nextLesson.startTime} - {nextLesson.endTime}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedBookingId(nextLesson.id);
                      setShowRescheduleModal(true);
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Przełóż
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBookingId(nextLesson.id);
                      setShowCancelModal(true);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Instructor */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Instruktor
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={nextLesson.instructor.avatar || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(nextLesson.instructor.name)}&background=10B981&color=fff`}
                      alt={nextLesson.instructor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {nextLesson.instructor.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-gray-600">
                            {nextLesson.instructor.rating || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleContact}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Zadzwoń"
                    >
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Pojazd
                  </h3>
                  {nextLesson.vehicle ? (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Car className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {nextLesson.vehicle.make} {nextLesson.vehicle.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {nextLesson.vehicle.registration} • {nextLesson.vehicle.transmission}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Do ustalenia</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Lokalizacja
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {nextLesson.location?.name || 'Miejsce spotkania'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {nextLesson.location?.address || nextLesson.pickupLocation}
                      </p>
                    </div>
                    <button
                      onClick={handleShowMap}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Pokaż na mapie"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {nextLesson.notes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Notatka:</span> {nextLesson.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Lessons */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Nadchodzące lekcje
            </h3>
            <Link
              href="/student/calendar"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zobacz wszystkie
            </Link>
          </div>
          {upcomingLessons.length > 0 ? (
            <div className="space-y-3">
              {upcomingLessons.slice(0, 4).map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {format(new Date(lesson.date), 'd MMM', { locale: pl })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.startTime} • {lesson.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {lesson.instructorName.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Brak zaplanowanych lekcji</p>
              <Link
                href="/student/booking"
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700"
              >
                Zarezerwuj lekcję →
              </Link>
            </div>
          )}
        </div>

        {/* Active Packages */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Twoje pakiety
            </h3>
            <Link
              href="/student/payments"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zarządzaj
            </Link>
          </div>
          {packages.length > 0 ? (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{pkg.name}</p>
                      <p className="text-sm text-gray-600">
                        {pkg.creditsRemaining} z {pkg.creditsTotal} kredytów
                      </p>
                    </div>
                    {pkg.daysRemaining <= 7 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        {pkg.daysRemaining} dni
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pkg.progress > 75 ? 'bg-red-500' :
                        pkg.progress > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${pkg.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              {notifications?.expiringCredits > 0 && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Masz {notifications.expiringCredits} pakiet(y) wygasające wkrótce
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Brak aktywnych pakietów</p>
              <Link
                href="/student/payments"
                className="mt-3 inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Kup kredyty
              </Link>
            </div>
          )}
        </div>

        {/* Progress & Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Twoje postępy
            </h3>
            <Link
              href="/student/progress"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Szczegóły
            </Link>
          </div>
          
          {/* Current Skill */}
          {progress?.currentSkill && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Aktualny cel: {progress.currentSkill}
              </p>
            </div>
          )}

          {/* Exam Readiness Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Gotowość do egzaminu</p>
            <p className={`font-medium ${getExamReadinessColor(stats?.examReadiness || 0)}`}>
              {getExamReadinessMessage(stats?.examReadiness || 0)}
            </p>
          </div>

          {/* Recent Achievements */}
          {achievements.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Ostatnie osiągnięcia:</p>
              {achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon || '🏆'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      +{achievement.points} pkt
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Kontynuuj naukę, aby zdobyć osiągnięcia!
            </p>
          )}
        </div>
      </div>

      {/* Available Instructors */}
      {instructors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Dostępni instruktorzy
            </h3>
            <Link
              href="/student/booking"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zobacz wszystkich
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <img
                  src={instructor.avatar || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=10B981&color=fff`}
                  alt={instructor.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                />
                <p className="font-medium text-sm text-gray-800">
                  {instructor.name.split(' ')[0]}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-gray-600">
                    {instructor.rating || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {quickStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Dzisiaj</p>
            <p className="text-2xl font-bold text-gray-800">
              {quickStats.todayBookings}
            </p>
            <p className="text-xs text-gray-500">lekcji</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Ten tydzień</p>
            <p className="text-2xl font-bold text-gray-800">
              {quickStats.weekBookings}
            </p>
            <p className="text-xs text-gray-500">lekcji</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Ten miesiąc</p>
            <p className="text-2xl font-bold text-gray-800">
              {quickStats.hoursThisMonth}
            </p>
            <p className="text-xs text-gray-500">godzin</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Wydano</p>
            <p className="text-2xl font-bold text-gray-800">
              {quickStats.totalSpent.toFixed(0)} zł
            </p>
            <p className="text-xs text-gray-500">łącznie</p>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Anuluj lekcję
            </h3>
            <div className="mb-4">
              <div className="p-3 bg-amber-50 rounded-lg mb-4">
                <p className="text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Pamiętaj, że anulowanie musi nastąpić co najmniej 24 godziny przed lekcją.
                </p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powód anulowania
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Podaj powód anulowania..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Nie, zachowaj
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason || cancelBookingMutation.isLoading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelBookingMutation.isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Tak, anuluj'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Przełóż lekcję
            </h3>
            <p className="text-gray-600 mb-6">
              Funkcja przełożenia lekcji będzie dostępna wkrótce. Skontaktuj się z instruktorem, aby ustalić nowy termin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Zamknij
              </button>
              <button
                onClick={handleContact}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zadzwoń do instruktora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}