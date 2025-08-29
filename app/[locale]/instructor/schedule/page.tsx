// app/[locale]/instructor/schedule/page.tsx
// Головна сторінка розкладу інструктора - сучасний дизайн

"use client"

import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Calendar, Copy, AlertCircle, BarChart3, Settings, 
  ChevronLeft, ChevronRight, Plus, Download, Upload,
  Clock, Users, Car, DollarSign, TrendingUp, Filter,
  Search, Menu, X, Bell, Grid3x3, List, CalendarDays
} from 'lucide-react'
import { useScheduleContext } from './providers/ScheduleProvider'
import  ActionButtons  from './components/shared/ActionButtons'
import  WorkingHoursModal  from './components/modals/WorkingHoursModal'
import  ExceptionModal  from './components/modals/ExceptionModal'
import { formatDate, getCurrentWeek } from './utils/dateHelpers'
import { cn } from '@/lib/utils'

// Lazy loading компонентів вкладок
const CalendarTab = lazy(() => import('./components/tabs/CalendarTab'))
const TemplatesTab = lazy(() => import('./components/tabs/TemplatesTab'))
const RequestsTab = lazy(() => import('./components/tabs/RequestsTab'))
const StatsTab = lazy(() => import('./components/tabs/StatsTab'))

// Loading компонент
const TabLoader = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

interface SchedulePageProps {
  params: {
    locale: string
  }
}

export default function SchedulePage({ params }: SchedulePageProps) {
  const t = useTranslations('instructor.schedule.main')
  
  // Локальний стан
  const [activeView, setActiveView] = useState<'calendar' | 'templates' | 'requests' | 'statistics'>('calendar')
  const [viewMode, setViewMode] = useState<'dzień' | 'tydzień' | 'miesiąc'>('tydzień')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [showWorkingHoursModal, setShowWorkingHoursModal] = useState(false)
  const [showExceptionModal, setShowExceptionModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Глобальний контекст
  const { 
    slots, 
    stats,
    cancellationRequests,
    isLoading,
    refreshData 
  } = useScheduleContext()

  // Обчислені значення
  const pendingRequestsCount = cancellationRequests?.filter(r => r.status === 'oczekujący').length || 0
  
  // Навігація дат
  const handleDateNavigation = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate)
    
    if (direction === 'today') {
      setCurrentDate(new Date())
    } else {
      const days = viewMode === 'dzień' ? 1 : viewMode === 'tydzień' ? 7 : 30
      newDate.setDate(newDate.getDate() + (direction === 'next' ? days : -days))
      setCurrentDate(newDate)
    }
  }

  // Формат дати залежно від вигляду
  const getDateLabel = () => {
    const locale = params.locale === 'uk' ? 'uk-UA' : 'pl-PL'
    
    if (viewMode === 'dzień') {
      return currentDate.toLocaleDateString(locale, { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    } else if (viewMode === 'tydzień') {
      const weekDates = getCurrentWeek(currentDate)
      return `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`
    } else {
      return currentDate.toLocaleDateString(locale, { 
        month: 'long', 
        year: 'numeric' 
      })
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Головний контейнер */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        
        {/* Заголовок сторінки - нефіксований, сучасний дизайн */}
        <div className="mb-8">
          {/* Заголовок і дії */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {t('title')}
              </h1>
              <p className="text-gray-500 mt-1">
                {t('subtitle')}
              </p>
            </div>

            {/* Кнопки дій - desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
                title={t('buttons.search')}
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                className="relative p-2.5 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setShowWorkingHoursModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">{t('buttons.workingHours')}</span>
              </button>

              <button
                onClick={() => setShowExceptionModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">{t('buttons.exception')}</span>
              </button>
            </div>

            {/* Мобільне меню */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2.5 hover:bg-white rounded-xl transition-all duration-200"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Рядок пошуку - анімований */}
          {showSearch && (
            <div className="mb-4 animate-in slide-in-from-top duration-200">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Статистика - картки */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">{stats?.totalSlots || 0}</span>
              </div>
              <p className="text-sm text-gray-500">{t('stats.allSlots')}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">{stats?.bookedSlots || 0}</span>
              </div>
              <p className="text-sm text-gray-500">{t('stats.reserved')}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {t('stats.hoursUnit', { hours: stats?.weeklyHours || 0 })}
                </span>
              </div>
              <p className="text-sm text-gray-500">{t('stats.weeklyHours')}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {t('stats.currency', { amount: stats?.monthlyEarnings || 0 })}
                </span>
              </div>
              <p className="text-sm text-gray-500">{t('stats.monthlyIncome')}</p>
            </div>
          </div>

          {/* Навігація видів - сучасні кнопки */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Перемикач видів */}
            <div className="inline-flex bg-white rounded-xl shadow-sm p-1">
              {(['calendar', 'templates', 'requests', 'statistics'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    activeView === view
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {view === 'calendar' && <Calendar className="w-4 h-4" />}
                    {view === 'templates' && <Copy className="w-4 h-4" />}
                    {view === 'requests' && <AlertCircle className="w-4 h-4" />}
                    {view === 'statistics' && <BarChart3 className="w-4 h-4" />}
                    <span className="hidden sm:inline">
                      {t(`tabs.${view}`)}
                    </span>
                  </span>
                  {view === 'requests' && pendingRequestsCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Контролі виду календаря */}
            {activeView === 'calendar' && (
              <div className="flex items-center gap-3">
                {/* Навігація дат */}
                <div className="inline-flex items-center bg-white rounded-xl shadow-sm">
                  <button
                    onClick={() => handleDateNavigation('prev')}
                    className="p-2.5 hover:bg-gray-100 rounded-l-xl transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDateNavigation('today')}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors border-x"
                  >
                    <span className="font-medium text-sm">{t('buttons.today')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDateNavigation('next')}
                    className="p-2.5 hover:bg-gray-100 rounded-r-xl transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Тип виду */}
                <div className="inline-flex bg-white rounded-xl shadow-sm p-1">
                  <button
                    onClick={() => setViewMode('dzień')}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      viewMode === 'dzień' 
                        ? "bg-gray-800 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title={t('viewModes.dayView')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('tydzień')}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      viewMode === 'tydzień' 
                        ? "bg-gray-800 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title={t('viewModes.weekView')}
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('miesiąc')}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      viewMode === 'miesiąc' 
                        ? "bg-gray-800 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title={t('viewModes.monthView')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Дата */}
                <div className="hidden sm:block px-4 py-2 bg-white rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-gray-900">{getDateLabel()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Головний вміст */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <Suspense fallback={<TabLoader />}>
            {activeView === 'calendar' && (
              <CalendarTab
                viewMode={viewMode}
                currentDate={currentDate}
                searchTerm={searchTerm}
                onDateChange={setCurrentDate}
              />
            )}
            
            {activeView === 'templates' && (
              <TemplatesTab searchTerm={searchTerm} />
            )}
            
            {activeView === 'requests' && (
              <RequestsTab searchTerm={searchTerm} />
            )}
            
            {activeView === 'statistics' && (
              <StatsTab currentDate={currentDate} />
            )}
          </Suspense>
        </div>

        {/* Мобільне меню - slide-out */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
            <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t('mobileMenu.title')}</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowWorkingHoursModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">{t('mobileMenu.workingHours')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowExceptionModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">{t('mobileMenu.addException')}</span>
                </button>

                <ActionButtons variant="mobile" />
              </div>
            </div>
          </div>
        )}

        {/* Модали */}
        {showWorkingHoursModal && (
          <WorkingHoursModal
            isOpen={showWorkingHoursModal}
            onClose={() => setShowWorkingHoursModal(false)}
          />
        )}

        {showExceptionModal && (
          <ExceptionModal
            isOpen={showExceptionModal}
            onClose={() => setShowExceptionModal(false)}
          />
        )}
      </div>
    </div>
  )
}