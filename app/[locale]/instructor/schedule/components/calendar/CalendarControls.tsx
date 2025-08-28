// app/[locale]/instructor/schedule/components/calendar/CalendarControls.tsx
// Kontrolki nawigacji i filtrowania kalendarza

'use client'

import React, { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Filter,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Grid3x3,
  List,
  CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewMode } from '../../types/enums'
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from 'date-fns'
import { pl } from 'date-fns/locale'

interface CalendarControlsProps {
  currentDate: Date
  viewMode: ViewMode
  onDateChange: (date: Date) => void
  onViewModeChange: (mode: ViewMode) => void
  onFilterToggle?: () => void
  onRefresh?: () => void
  onExport?: () => void
  onImport?: () => void
  isFilterOpen?: boolean
  className?: string
}

export default function CalendarControls({
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onFilterToggle,
  onRefresh,
  onExport,
  onImport,
  isFilterOpen = false,
  className
}: CalendarControlsProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  // Nawigacja w czasie
  const handlePrevious = () => {
    let newDate = new Date(currentDate)
    
    switch (viewMode) {
      case 'dzień':
        newDate = addDays(currentDate, -1)
        break
      case 'tydzień':
        newDate = addWeeks(currentDate, -1)
        break
      case 'miesiąc':
        newDate = addMonths(currentDate, -1)
        break
    }
    
    onDateChange(newDate)
  }

  const handleNext = () => {
    let newDate = new Date(currentDate)
    
    switch (viewMode) {
      case 'dzień':
        newDate = addDays(currentDate, 1)
        break
      case 'tydzień':
        newDate = addWeeks(currentDate, 1)
        break
      case 'miesiąc':
        newDate = addMonths(currentDate, 1)
        break
    }
    
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  // Format wyświetlanej daty
  const getDateLabel = () => {
    switch (viewMode) {
      case 'dzień':
        return format(currentDate, 'EEEE, d MMMM yyyy', { locale: pl })
      case 'tydzień':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
        return `${format(weekStart, 'd MMM', { locale: pl })} - ${format(weekEnd, 'd MMM yyyy', { locale: pl })}`
      case 'miesiąc':
        return format(currentDate, 'MMMM yyyy', { locale: pl })
      default:
        return format(currentDate, 'd MMMM yyyy', { locale: pl })
    }
  }

  // Quick date picker
  const handleQuickDateSelect = (date: Date) => {
    onDateChange(date)
    setShowDatePicker(false)
  }

  const handleMonthYearChange = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1)
    onDateChange(newDate)
    setShowDatePicker(false)
  }

  return (
    <div className={cn("bg-white border-b", className)}>
      <div className="px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Lewa sekcja - nawigacja w czasie */}
          <div className="flex items-center gap-2">
            {/* Przyciski nawigacji */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handlePrevious}
                className="p-1.5 hover:bg-white rounded transition-colors"
                aria-label="Poprzedni okres"
                title="Poprzedni okres"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm font-medium hover:bg-white rounded transition-colors"
                title="Przejdź do dzisiaj"
              >
                Dziś
              </button>
              
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white rounded transition-colors"
                aria-label="Następny okres"
                title="Następny okres"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Wyświetlanie aktualnej daty */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold capitalize">
                  {getDateLabel()}
                </span>
              </button>

              {/* Date picker dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg border z-50 min-w-[280px]">
                  <div className="space-y-3">
                    {/* Szybki wybór */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Szybki wybór</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleQuickDateSelect(new Date())}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          Dziś
                        </button>
                        <button
                          onClick={() => handleQuickDateSelect(addDays(new Date(), 1))}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          Jutro
                        </button>
                        <button
                          onClick={() => handleQuickDateSelect(addWeeks(new Date(), 1))}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          Za tydzień
                        </button>
                        <button
                          onClick={() => handleQuickDateSelect(addMonths(new Date(), 1))}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          Za miesiąc
                        </button>
                      </div>
                    </div>

                    {/* Wybór miesiąca i roku */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Wybierz miesiąc i rok</p>
                      <div className="flex gap-2">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(Number(e.target.value))}
                          className="flex-1 px-2 py-1.5 text-sm border rounded"
                        >
                          {[
                            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 
                            'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
                            'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
                          ].map((month, index) => (
                            <option key={month} value={index}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="px-2 py-1.5 text-sm border rounded"
                        >
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleMonthYearChange}
                        className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Przejdź
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Środkowa sekcja - przełącznik widoku */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Widok:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('dzień')}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === 'dzień' 
                    ? "bg-white shadow-sm" 
                    : "hover:bg-gray-200"
                )}
                title="Widok dzienny"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('tydzień')}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === 'tydzień' 
                    ? "bg-white shadow-sm" 
                    : "hover:bg-gray-200"
                )}
                title="Widok tygodniowy"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('miesiąc')}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === 'miesiąc' 
                    ? "bg-white shadow-sm" 
                    : "hover:bg-gray-200"
                )}
                title="Widok miesięczny"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prawa sekcja - akcje */}
          <div className="flex items-center gap-2">
            {/* Filtrowanie */}
            {onFilterToggle && (
              <button
                onClick={onFilterToggle}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  isFilterOpen 
                    ? "bg-blue-100 text-blue-600" 
                    : "hover:bg-gray-100"
                )}
                title="Pokaż filtry"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Filtry</span>
                {isFilterOpen && (
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    ON
                  </span>
                )}
              </button>
            )}

            {/* Odświeżanie */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Odśwież kalendarz"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 hidden lg:block" />

            {/* Import/Export */}
            <div className="flex items-center gap-1 hidden lg:flex">
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Eksportuj kalendarz"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm hidden xl:inline">Eksportuj</span>
                </button>
              )}
              
              {onImport && (
                <button
                  onClick={onImport}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Importuj kalendarz"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm hidden xl:inline">Importuj</span>
                </button>
              )}
            </div>

            {/* Ustawienia */}
            <button
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ustawienia kalendarza"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="flex items-center gap-2 mt-3 lg:hidden">
          {onExport && (
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Eksportuj</span>
            </button>
          )}
          
          {onImport && (
            <button
              onClick={onImport}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Importuj</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}