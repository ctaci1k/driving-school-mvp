// app/[locale]/instructor/schedule/page.tsx
// Główna strona harmonogramu instruktora - zarządzanie zakładkami i nawigacją

"use client"

import React, { useState, useEffect, Suspense, lazy } from 'react'
import { 
  Calendar, Copy, AlertCircle, BarChart3, Settings, 
  ChevronLeft, ChevronRight, Plus, Download, Upload,
  Clock, Users, Car, DollarSign, TrendingUp, Filter
} from 'lucide-react'
import { useScheduleContext } from './providers/ScheduleProvider'
import { QuickStats } from './components/shared/QuickStats'
import { SearchBar } from './components/shared/SearchBar'
import { ActionButtons } from './components/shared/ActionButtons'
import { TabValue, ViewMode } from './types/enums'
import { formatDate, getCurrentWeek } from './utils/dateHelpers'
import { cn } from '@/lib/utils'

// Lazy loading komponentów zakładek
const CalendarTab = lazy(() => import('./components/tabs/CalendarTab'))
const TemplatesTab = lazy(() => import('./components/tabs/TemplatesTab'))
const RequestsTab = lazy(() => import('./components/tabs/RequestsTab'))
const StatsTab = lazy(() => import('./components/tabs/StatsTab'))

// Loading component dla Suspense
const TabLoader = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export default function SchedulePage() {
  // Stan lokalny dla UI
  const [activeTab, setActiveTab] = useState<TabValue>('kalendarz')
  const [viewMode, setViewMode] = useState<ViewMode>('tydzień')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Kontekst globalny
  const { 
    slots, 
    workingHours, 
    templates, 
    exceptions,
    cancellationRequests,
    stats,
    isLoading,
    refreshData 
  } = useScheduleContext()

  // Obliczone wartości
  const weekDates = getCurrentWeek(currentDate)
  const weekLabel = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`
  const pendingRequestsCount = cancellationRequests?.filter(r => r.status === 'oczekujący').length || 0

  // Efekty
  useEffect(() => {
    // Odświeżanie danych przy montowaniu
    refreshData()
  }, [])

  useEffect(() => {
    // Zamknięcie mobilnego menu przy zmianie zakładki
    setIsMobileMenuOpen(false)
  }, [activeTab])

  // Handlery nawigacji
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Handler dla wyszukiwania
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Logika wyszukiwania zostanie obsłużona w komponencie zakładki
  }

  // Handler dla filtrów
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek strony */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Górny pasek z tytułem i statystykami */}
          <div className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Tytuł i opis */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Harmonogram zajęć
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Zarządzaj swoim czasem pracy i rezerwacjami kursantów
                </p>
              </div>

              {/* Przyciski akcji */}
              <div className="flex items-center gap-2">
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>

                {/* Desktop action buttons */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => {/* otwórz modal godzin pracy */}}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Godziny pracy</span>
                  </button>

                  <button
                    onClick={() => {/* otwórz modal wyjątków */}}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Dodaj wyjątek</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Szybkie statystyki */}
            <QuickStats stats={stats} className="mt-4" />
          </div>

          {/* Pasek nawigacji z zakładkami */}
          <nav className="flex space-x-1">
            <TabButton
              active={activeTab === 'kalendarz'}
              onClick={() => setActiveTab('kalendarz')}
              icon={<Calendar className="w-4 h-4" />}
              label="Kalendarz"
            />
            
            <TabButton
              active={activeTab === 'szablony'}
              onClick={() => setActiveTab('szablony')}
              icon={<Copy className="w-4 h-4" />}
              label="Szablony"
            />
            
            <TabButton
              active={activeTab === 'wnioski'}
              onClick={() => setActiveTab('wnioski')}
              icon={<AlertCircle className="w-4 h-4" />}
              label="Wnioski"
              badge={pendingRequestsCount > 0 ? pendingRequestsCount : undefined}
            />
            
            <TabButton
              active={activeTab === 'statystyki'}
              onClick={() => setActiveTab('statystyki')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Statystyki"
            />
          </nav>
        </div>
      </header>

      {/* Pasek narzędzi */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Nawigacja po datach (tylko dla kalendarza) */}
            {activeTab === 'kalendarz' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Poprzedni tydzień"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  Dziś
                </button>
                
                <button
                  onClick={handleNextWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Następny tydzień"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="ml-2 lg:ml-4">
                  <h2 className="text-sm lg:text-base font-semibold text-gray-900">
                    {weekLabel}
                  </h2>
                </div>
              </div>
            )}

            {/* Wyszukiwarka i filtry */}
            <div className="flex items-center gap-2">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Szukaj kursanta, lokalizacji..."
                className="flex-1 lg:w-64"
              />
              
              <button
                onClick={handleFilterToggle}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isFilterOpen 
                    ? "bg-blue-100 text-blue-600" 
                    : "hover:bg-gray-100"
                )}
                aria-label="Filtry"
              >
                <Filter className="w-5 h-5" />
              </button>

              {/* Przełącznik widoku (tylko dla kalendarza) */}
              {activeTab === 'kalendarz' && (
                <div className="hidden lg:flex items-center gap-1 border rounded-lg">
                  <ViewModeButton
                    active={viewMode === 'dzień'}
                    onClick={() => setViewMode('dzień')}
                    label="Dzień"
                  />
                  <ViewModeButton
                    active={viewMode === 'tydzień'}
                    onClick={() => setViewMode('tydzień')}
                    label="Tydzień"
                  />
                  <ViewModeButton
                    active={viewMode === 'miesiąc'}
                    onClick={() => setViewMode('miesiąc')}
                    label="Miesiąc"
                  />
                </div>
              )}
            </div>

            {/* Przyciski akcji */}
            <ActionButtons className="hidden lg:flex" />
          </div>

          {/* Panel filtrów (rozwijany) */}
          {isFilterOpen && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option value="">Status: Wszystkie</option>
                  <option value="dostępny">Dostępny</option>
                  <option value="zarezerwowany">Zarezerwowany</option>
                  <option value="zablokowany">Zablokowany</option>
                </select>
                
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option value="">Lokalizacja: Wszystkie</option>
                  <option value="warszawa">Warszawa</option>
                  <option value="krakow">Kraków</option>
                  <option value="wroclaw">Wrocław</option>
                </select>
                
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option value="">Kursant: Wszyscy</option>
                  <option value="anna-nowak">Anna Nowak</option>
                  <option value="piotr-kowalski">Piotr Kowalski</option>
                </select>
                
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Zastosuj filtry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Główna treść - zakładki */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <TabLoader />
        ) : (
          <Suspense fallback={<TabLoader />}>
            {activeTab === 'kalendarz' && (
              <CalendarTab
                viewMode={viewMode}
                currentDate={currentDate}
                searchTerm={searchTerm}
                onDateChange={setCurrentDate}
              />
            )}
            
            {activeTab === 'szablony' && (
              <TemplatesTab searchTerm={searchTerm} />
            )}
            
            {activeTab === 'wnioski' && (
              <RequestsTab searchTerm={searchTerm} />
            )}
            
            {activeTab === 'statystyki' && (
              <StatsTab currentDate={currentDate} />
            )}
          </Suspense>
        )}
      </main>

      {/* Mobile action menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="font-semibold text-gray-900 mb-4">Menu</h3>
              
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Godziny pracy</span>
                </button>
                
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Dodaj wyjątek</span>
                </button>
                
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Eksportuj</span>
                </button>
                
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Importuj</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Komponenty pomocnicze
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badge?: number
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
      active
        ? "text-blue-600 border-blue-600"
        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    {badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
)

interface ViewModeButtonProps {
  active: boolean
  onClick: () => void
  label: string
}

const ViewModeButton: React.FC<ViewModeButtonProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 text-sm transition-colors",
      active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
    )}
  >
    {label}
  </button>
)