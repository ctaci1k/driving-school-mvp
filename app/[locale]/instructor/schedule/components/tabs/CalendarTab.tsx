// app/[locale]/instructor/schedule/components/tabs/CalendarTab.tsx
// Zakładka kalendarza z importem komponentów widoków i obsługą zdarzeń

'use client'

import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { 
  Download, Filter, Grid3x3, List, 
  CalendarDays, Clock, AlertCircle, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot, SlotStatus } from '../../types/schedule.types'
import { isSameDay, formatDate } from '../../utils/dateHelpers'

// Lazy loading komponentów widoków
const WeekView = lazy(() => import('../calendar/WeekView'))
const DayView = lazy(() => import('../calendar/DayView'))
const MonthView = lazy(() => import('../calendar/MonthView'))

// Loading component
const ViewLoader = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-sm text-gray-500">Ładowanie kalendarza...</p>
    </div>
  </div>
)

interface CalendarTabProps {
  viewMode: 'dzień' | 'tydzień' | 'miesiąc' | 'lista'
  currentDate: Date
  searchTerm?: string
  onDateChange?: (date: Date) => void
  onOpenWorkingHours?: () => void
}

// Komponent filtrów
const FilterPanel: React.FC<{
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClose: () => void
}> = ({ filters, onFilterChange, onClose }) => {
  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border z-20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filtry</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Status
        </label>
        <div className="space-y-2">
          {Object.entries({
            'dostępny': 'Dostępne',
            'zarezerwowany': 'Zarezerwowane',
            'zablokowany': 'Zablokowane',
            'zakończony': 'Zakończone',
            'anulowany': 'Anulowane'
          }).map(([value, label]) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.status.includes(value as SlotStatus)}
                onChange={(e) => {
                  const newStatus = e.target.checked
                    ? [...filters.status, value as SlotStatus]
                    : filters.status.filter(s => s !== value)
                  onFilterChange({ ...filters, status: newStatus })
                }}
                className="mr-2"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Typ lekcji */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Typ zajęć
        </label>
        <select
          value={filters.lessonType}
          onChange={(e) => onFilterChange({ ...filters, lessonType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">Wszystkie</option>
          <option value="jazda">Jazda w mieście</option>
          <option value="plac">Plac manewrowy</option>
          <option value="teoria">Teoria</option>
          <option value="egzamin">Egzamin</option>
        </select>
      </div>

      {/* Przyciski */}
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange({
            status: [],
            lessonType: '',
            studentId: '',
            showOnlyAvailable: false
          })}
          className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          Wyczyść
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Zastosuj
        </button>
      </div>
    </div>
  )
}

// Stan filtrów
interface FilterState {
  status: SlotStatus[]
  lessonType: string
  studentId: string
  showOnlyAvailable: boolean
}

export default function CalendarTab({
  viewMode,
  currentDate,
  searchTerm = '',
  onDateChange,
  onOpenWorkingHours
}: CalendarTabProps) {
  const { 
    slots, 
    workingHours,
    updateSlot,
    deleteSlot,
    createSlot
  } = useScheduleContext()

  // Stan lokalny
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    lessonType: '',
    studentId: '',
    showOnlyAvailable: false
  })

  // Filtrowanie slotów
  const filteredSlots = useMemo(() => {
    let filtered = [...slots]

    // Filtr wyszukiwania
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(slot =>
        slot.student?.firstName.toLowerCase().includes(term) ||
        slot.student?.lastName.toLowerCase().includes(term) ||
        slot.location?.name.toLowerCase().includes(term) ||
        slot.notes?.toLowerCase().includes(term)
      )
    }

    // Filtr statusu
    if (filters.status.length > 0) {
      filtered = filtered.filter(slot => filters.status.includes(slot.status))
    }

    // Filtr typu lekcji
    if (filters.lessonType) {
      filtered = filtered.filter(slot => slot.lessonType === filters.lessonType)
    }

    // Filtr studenta
    if (filters.studentId) {
      filtered = filtered.filter(slot => slot.student?.id === filters.studentId)
    }

    // Pokaż tylko dostępne
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(slot => slot.status === 'dostępny')
    }

    return filtered
  }, [slots, searchTerm, filters])

  // Handlery
  const handleSlotClick = useCallback((slot: Slot) => {
    setSelectedSlot(slot)
    // Otwórz modal edycji
  }, [])

  const handleSlotEdit = useCallback(async (slotId: string, updates: Partial<Slot>) => {
    try {
      await updateSlot(slotId, updates)
    } catch (error) {
      console.error('Błąd aktualizacji slotu:', error)
    }
  }, [updateSlot])

  const handleSlotDelete = useCallback(async (slotId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten termin?')) {
      try {
        await deleteSlot(slotId)
      } catch (error) {
        console.error('Błąd usuwania slotu:', error)
      }
    }
  }, [deleteSlot])

  const handleExport = useCallback(() => {
    // Eksport do CSV/iCal
    const csv = filteredSlots.map(slot => ({
      Data: formatDate(new Date(slot.date)),
      Start: slot.startTime,
      Koniec: slot.endTime,
      Status: slot.status,
      Kursant: slot.student ? `${slot.student.firstName} ${slot.student.lastName}` : '-',
      Lokalizacja: slot.location?.name || '-'
    }))

    // Konwersja do CSV string
    const csvString = [
      Object.keys(csv[0] || {}).join(','),
      ...csv.map(row => Object.values(row).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `harmonogram_${formatDate(currentDate)}.csv`
    link.click()
  }, [filteredSlots, currentDate])

  // Statystyki
  const stats = useMemo(() => {
    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    let relevantSlots = filteredSlots

    if (viewMode === 'dzień') {
      relevantSlots = filteredSlots.filter(slot => {
        const slotDate = new Date(slot.date)
        return isSameDay(slotDate, currentDate)
      })
    } else if (viewMode === 'tydzień') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      relevantSlots = filteredSlots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate >= weekStart && slotDate <= weekEnd
      })
    } else if (viewMode === 'miesiąc') {
      relevantSlots = filteredSlots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate.getMonth() === currentDate.getMonth() &&
               slotDate.getFullYear() === currentDate.getFullYear()
      })
    }

    return {
      total: relevantSlots.length,
      dostępne: relevantSlots.filter(s => s.status === 'dostępny').length,
      zarezerwowane: relevantSlots.filter(s => s.status === 'zarezerwowany').length,
      zablokowane: relevantSlots.filter(s => s.status === 'zablokowany').length
    }
  }, [filteredSlots, viewMode, currentDate])

  return (
    <div className="space-y-4">
      {/* Nagłówek z akcjami */}
      <div className="bg-white rounded-lg border p-4">
        {/* Statystyki */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Łącznie: {stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Dostępne: {stats.dostępne}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Zarezerwowane: {stats.zarezerwowane}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Zablokowane: {stats.zablokowane}</span>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="flex items-center gap-2">
            {/* Przycisk ustawień godzin pracy */}
            <button
              onClick={onOpenWorkingHours}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Godziny pracy</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                  showFilters || filters.status.length > 0 || filters.lessonType
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "border hover:bg-gray-50"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Filtry</span>
                {(filters.status.length > 0 || filters.lessonType) && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {filters.status.length + (filters.lessonType ? 1 : 0)}
                  </span>
                )}
              </button>

              {showFilters && (
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              )}
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Eksportuj</span>
            </button>
          </div>
        </div>

        {/* Alert o braku slotów - ZAKTUALIZOWANY */}
        {stats.total === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Brak terminów w tym okresie</p>
              <p className="text-blue-600 mt-1">
                Sloty są generowane automatycznie na podstawie godzin pracy.
                Kliknij przycisk "Godziny pracy" aby skonfigurować dostępność.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Widok kalendarza */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Suspense fallback={<ViewLoader />}>
          {viewMode === 'dzień' && (
            <DayView
              currentDate={currentDate}
              searchTerm={searchTerm}
              onSlotClick={handleSlotClick}
              onDateChange={onDateChange}
            />
          )}

          {viewMode === 'tydzień' && (
            <WeekView
              currentDate={currentDate}
              searchTerm={searchTerm}
              onSlotClick={handleSlotClick}
              onDateChange={onDateChange}
            />
          )}

          {viewMode === 'miesiąc' && (
            <MonthView
              currentDate={currentDate}
              searchTerm={searchTerm}
              onSlotClick={handleSlotClick}
              onDateChange={onDateChange || (() => {})}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}