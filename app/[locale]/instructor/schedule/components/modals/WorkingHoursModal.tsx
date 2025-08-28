// app/[locale]/instructor/schedule/components/modals/WorkingHoursModal.tsx
// Modal do konfiguracji godzin pracy instruktora

'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Copy, Clock, Calendar, Save, AlertCircle, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkingHours, TimeInterval } from '../../types/schedule.types'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { useToast } from '@/hooks/use-toast'

interface WorkingHoursModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (workingHours: Record<string, WorkingHours>) => void
}

const DAYS_OF_WEEK = [
  { key: 'poniedziałek', label: 'Poniedziałek' },
  { key: 'wtorek', label: 'Wtorek' },
  { key: 'środa', label: 'Środa' },
  { key: 'czwartek', label: 'Czwartek' },
  { key: 'piątek', label: 'Piątek' },
  { key: 'sobota', label: 'Sobota' },
  { key: 'niedziela', label: 'Niedziela' }
]

const SLOT_DURATIONS = [
  { value: 60, label: '1 godzina' },
  { value: 90, label: '1.5 godziny' },
  { value: 120, label: '2 godziny' },
  { value: 150, label: '2.5 godziny' },
  { value: 180, label: '3 godziny' }
]

const BREAK_DURATIONS = [
  { value: 0, label: 'Bez przerwy' },
  { value: 15, label: '15 minut' },
  { value: 30, label: '30 minut' },
  { value: 45, label: '45 minut' },
  { value: 60, label: '1 godzina' }
]

// 🆕 Mapa polskich dni tygodnia na daty
const getDayDate = (dayKey: string, weeksAhead: number = 0): Date => {
  const dayMap: Record<string, number> = {
    'poniedziałek': 1,
    'wtorek': 2,
    'środa': 3,
    'czwartek': 4,
    'piątek': 5,
    'sobota': 6,
    'niedziela': 0
  }
  
  const today = new Date()
  const currentDay = today.getDay()
  const targetDay = dayMap[dayKey]
  let daysToAdd = targetDay - currentDay
  
  if (daysToAdd < 0) daysToAdd += 7
  daysToAdd += weeksAhead * 7
  
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysToAdd)
  return targetDate
}

export default function WorkingHoursModal({
  isOpen,
  onClose,
  onSave
}: WorkingHoursModalProps) {
  const { 
    workingHours: globalWorkingHours, 
    updateWorkingHours,
    checkDayHasReservations,
    slots 
  } = useScheduleContext()
  
  const { toast } = useToast()
  const [workingHours, setWorkingHours] = useState<Record<string, WorkingHours>>({})
  const [activeDay, setActiveDay] = useState('poniedziałek')
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [blockedDays, setBlockedDays] = useState<string[]>([])
  const [showWarning, setShowWarning] = useState(false)

  // Inicjalizacja danych
  useEffect(() => {
    if (isOpen && globalWorkingHours) {
      setWorkingHours(JSON.parse(JSON.stringify(globalWorkingHours)))
      checkBlockedDays()
    }
  }, [isOpen, globalWorkingHours])

  // 🆕 Sprawdzanie które dni mają rezerwacje
  const checkBlockedDays = () => {
    const blocked: string[] = []
    
    DAYS_OF_WEEK.forEach(day => {
      // Sprawdź najbliższe 4 tygodnie dla każdego dnia
      for (let week = 0; week < 4; week++) {
        const dayDate = getDayDate(day.key, week)
        if (checkDayHasReservations(dayDate)) {
          if (!blocked.includes(day.key)) {
            blocked.push(day.key)
          }
        }
      }
    })
    
    setBlockedDays(blocked)
  }

  // 🆕 Sprawdzanie czy są zmiany w zablokowanych dniach
  const hasChangesInBlockedDays = (): boolean => {
    return blockedDays.some(dayKey => {
      const original = globalWorkingHours[dayKey]
      const modified = workingHours[dayKey]
      
      if (!original || !modified) return false
      
      // Sprawdź czy są różnice
      return (
        original.enabled !== modified.enabled ||
        JSON.stringify(original.intervals) !== JSON.stringify(modified.intervals) ||
        original.slotDuration !== modified.slotDuration ||
        original.breakDuration !== modified.breakDuration
      )
    })
  }

  // Walidacja interwału czasowego
  const validateTimeInterval = (interval: TimeInterval): string | null => {
    const [startH, startM] = interval.start.split(':').map(Number)
    const [endH, endM] = interval.end.split(':').map(Number)
    
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    
    if (startMinutes >= endMinutes) {
      return 'Czas zakończenia musi być późniejszy niż czas rozpoczęcia'
    }
    
    if (startMinutes < 6 * 60 || endMinutes > 22 * 60) {
      return 'Godziny pracy muszą być między 6:00 a 22:00'
    }
    
    return null
  }

  // Sprawdź nakładanie się interwałów
  const checkIntervalOverlap = (intervals: TimeInterval[], newInterval: TimeInterval, excludeIndex?: number): boolean => {
    return intervals.some((interval, idx) => {
      if (excludeIndex !== undefined && idx === excludeIndex) return false
      
      const [existingStartH, existingStartM] = interval.start.split(':').map(Number)
      const [existingEndH, existingEndM] = interval.end.split(':').map(Number)
      const [newStartH, newStartM] = newInterval.start.split(':').map(Number)
      const [newEndH, newEndM] = newInterval.end.split(':').map(Number)
      
      const existingStart = existingStartH * 60 + existingStartM
      const existingEnd = existingEndH * 60 + existingEndM
      const newStart = newStartH * 60 + newStartM
      const newEnd = newEndH * 60 + newEndM
      
      return !(newEnd <= existingStart || newStart >= existingEnd)
    })
  }

  // Aktualizacja godzin pracy dla dnia
  const updateDayWorkingHours = (day: string, updates: Partial<WorkingHours>) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates }
    }))
    
    // Wyczyść błędy walidacji dla tego dnia
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[day]
      return newErrors
    })
  }

  // Dodaj interwał
  const addInterval = (day: string) => {
    const currentHours = workingHours[day]
    const lastInterval = currentHours.intervals[currentHours.intervals.length - 1]
    
    let newStart = '14:00'
    let newEnd = '18:00'
    
    if (lastInterval) {
      const [endH, endM] = lastInterval.end.split(':').map(Number)
      const newStartH = endH + Math.floor((endM + currentHours.breakDuration) / 60)
      const newStartM = (endM + currentHours.breakDuration) % 60
      newStart = `${newStartH.toString().padStart(2, '0')}:${newStartM.toString().padStart(2, '0')}`
      
      const newEndH = Math.min(newStartH + 2, 22)
      newEnd = `${newEndH.toString().padStart(2, '0')}:00`
    }
    
    const newInterval: TimeInterval = { start: newStart, end: newEnd }
    
    // Walidacja
    const error = validateTimeInterval(newInterval)
    if (error) {
      setValidationErrors(prev => ({ ...prev, [day]: error }))
      return
    }
    
    if (checkIntervalOverlap(currentHours.intervals, newInterval)) {
      setValidationErrors(prev => ({ ...prev, [day]: 'Interwały nie mogą się nakładać' }))
      return
    }
    
    updateDayWorkingHours(day, {
      intervals: [...currentHours.intervals, newInterval]
    })
  }

  // Usuń interwał
  const removeInterval = (day: string, index: number) => {
    const currentHours = workingHours[day]
    updateDayWorkingHours(day, {
      intervals: currentHours.intervals.filter((_, idx) => idx !== index)
    })
  }

  // Aktualizuj interwał
  const updateInterval = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const currentHours = workingHours[day]
    const newIntervals = [...currentHours.intervals]
    newIntervals[index] = { ...newIntervals[index], [field]: value }
    
    // Walidacja
    const error = validateTimeInterval(newIntervals[index])
    if (error) {
      setValidationErrors(prev => ({ ...prev, [`${day}-${index}`]: error }))
      return
    }
    
    if (checkIntervalOverlap(newIntervals, newIntervals[index], index)) {
      setValidationErrors(prev => ({ ...prev, [`${day}-${index}`]: 'Interwały nie mogą się nakładać' }))
      return
    }
    
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${day}-${index}`]
      return newErrors
    })
    
    updateDayWorkingHours(day, { intervals: newIntervals })
  }

  // Kopiuj godziny do innych dni
  const copyToOtherDays = (sourceDay: string) => {
    const sourceHours = workingHours[sourceDay]
    const newWorkingHours = { ...workingHours }
    
    DAYS_OF_WEEK.forEach(day => {
      if (day.key !== sourceDay && !blockedDays.includes(day.key)) {
        newWorkingHours[day.key] = JSON.parse(JSON.stringify(sourceHours))
      }
    })
    
    setWorkingHours(newWorkingHours)
    
    if (blockedDays.length > 0) {
      toast({
        title: "Skopiowano z ograniczeniami",
        description: `Pominięto ${blockedDays.length} dni z rezerwacjami`,
      })
    } else {
      toast({
        title: "Sukces",
        description: "Godziny zostały skopiowane do pozostałych dni",
      })
    }
  }

  // 🔄 ZAKTUALIZOWANA FUNKCJA ZAPISYWANIA
  const handleSave = async () => {
    // Walidacja
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Błąd",
        description: "Popraw błędy walidacji przed zapisaniem",
        variant: "destructive",
      })
      return
    }

    // Sprawdź czy są zmiany w zablokowanych dniach
    if (hasChangesInBlockedDays()) {
      setShowWarning(true)
      return
    }

    await performSave()
  }

  // 🆕 Funkcja wykonująca zapis
  const performSave = async () => {
    setIsSaving(true)
    
    try {
      const skippedDays: string[] = []
      
      // Zapisz każdy dzień osobno
      for (const day of DAYS_OF_WEEK) {
        const dayHours = workingHours[day.key]
        
        // Jeśli dzień ma rezerwacje i próbujemy go zmienić, pomiń
        if (blockedDays.includes(day.key)) {
          const original = globalWorkingHours[day.key]
          const hasChanges = JSON.stringify(original) !== JSON.stringify(dayHours)
          
          if (hasChanges) {
            skippedDays.push(day.label)
            // Przywróć oryginalne ustawienia dla tego dnia
            continue
          }
        }
        
        // Zaktualizuj godziny pracy dla dnia
        await updateWorkingHours(day.key, dayHours)
      }
      
      // Pokaż podsumowanie
      if (skippedDays.length > 0) {
        toast({
          title: "Zapisano z ograniczeniami",
          description: (
            <div>
              <p>Zaktualizowano godziny pracy.</p>
              <p className="mt-2 font-semibold">Pominięto dni z rezerwacjami:</p>
              <ul className="mt-1 text-sm">
                {skippedDays.map((day, idx) => (
                  <li key={idx}>• {day}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">Sloty zostaną wygenerowane automatycznie dla dni bez rezerwacji.</p>
            </div>
          ),
        })
      } else {
        toast({
          title: "Sukces",
          description: "Godziny pracy zostały zaktualizowane. Sloty zostaną wygenerowane automatycznie.",
        })
      }
      
      // Wywołaj callback jeśli istnieje
      if (onSave) {
        onSave(workingHours)
      }
      
      // Zamknij modal
      onClose()
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać godzin pracy",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setShowWarning(false)
    }
  }

  // 🆕 Modal ostrzeżenia o rezerwacjach
  const WarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Uwaga: Dni z rezerwacjami</h3>
            <p className="text-gray-600 mb-4">
              Następujące dni mają zarezerwowane lekcje i ich godziny pracy nie zostaną zmienione:
            </p>
            <ul className="space-y-1 mb-4">
              {blockedDays.map(dayKey => {
                const day = DAYS_OF_WEEK.find(d => d.key === dayKey)
                const daySlots = slots.filter(slot => {
                  const slotDate = new Date(slot.date)
                  const dayOfWeek = slotDate.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase()
                  return dayOfWeek === dayKey && slot.status === 'zarezerwowany'
                }).length
                
                return (
                  <li key={dayKey} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    <span className="font-medium">{day?.label}</span>
                    <span className="text-gray-500">({daySlots} rezerwacji)</span>
                  </li>
                )
              })}
            </ul>
            <p className="text-sm text-gray-500 mb-6">
              Zmiany zostaną zastosowane tylko dla dni bez rezerwacji. 
              Czy chcesz kontynuować?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={performSave}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Kontynuuj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  const currentDayHours = workingHours[activeDay] || {
    enabled: false,
    intervals: [],
    slotDuration: 120,
    breakDuration: 15
  }

  const isDayBlocked = blockedDays.includes(activeDay)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showWarning && <WarningModal />}
      
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Nagłówek */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Godziny pracy</h2>
            <p className="text-sm text-gray-500 mt-1">
              Skonfiguruj swoje godziny dostępności
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Treść */}
        <div className="flex flex-1 overflow-hidden">
          {/* Lista dni tygodnia */}
          <div className="w-48 border-r bg-gray-50 overflow-y-auto">
            {DAYS_OF_WEEK.map(day => (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center justify-between",
                  activeDay === day.key && "bg-white border-l-4 border-blue-600",
                  !workingHours[day.key]?.enabled && "text-gray-400"
                )}
              >
                <div>
                  <div className="font-medium">{day.label}</div>
                  {workingHours[day.key]?.enabled && (
                    <div className="text-xs text-gray-500 mt-1">
                      {workingHours[day.key]?.intervals.length || 0} interwałów
                    </div>
                  )}
                </div>
                {blockedDays.includes(day.key) && (
                  <span title="Dzień ma rezerwacje">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Konfiguracja dla wybranego dnia */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isDayBlocked && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">
                    Ten dzień ma zarezerwowane lekcje
                  </p>
                  <p className="text-amber-600 mt-1">
                    Godziny pracy dla tego dnia nie mogą być zmienione, dopóki istnieją rezerwacje.
                  </p>
                </div>
              </div>
            )}

            <div className={cn(isDayBlocked && "opacity-50 pointer-events-none")}>
              {/* Włącz/wyłącz dzień */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={currentDayHours.enabled}
                    onChange={(e) => updateDayWorkingHours(activeDay, { enabled: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600"
                    disabled={isDayBlocked}
                  />
                  <span className="font-medium">Pracuję w {DAYS_OF_WEEK.find(d => d.key === activeDay)?.label.toLowerCase()}</span>
                </label>
                
                {currentDayHours.enabled && !isDayBlocked && (
                  <button
                    onClick={() => copyToOtherDays(activeDay)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                    Kopiuj do innych dni
                  </button>
                )}
              </div>

              {/* Interwały czasowe */}
              {currentDayHours.enabled && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Interwały czasowe</h3>
                      <button
                        onClick={() => addInterval(activeDay)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={isDayBlocked}
                      >
                        <Plus className="w-4 h-4" />
                        Dodaj interwał
                      </button>
                    </div>

                    {currentDayHours.intervals.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Brak interwałów</p>
                        <p className="text-sm mt-1">Dodaj interwał aby określić godziny pracy</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentDayHours.intervals.map((interval, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="time"
                                value={interval.start}
                                onChange={(e) => updateInterval(activeDay, idx, 'start', e.target.value)}
                                className="px-3 py-2 border rounded-lg"
                                disabled={isDayBlocked}
                              />
                              <span className="text-gray-500">-</span>
                              <input
                                type="time"
                                value={interval.end}
                                onChange={(e) => updateInterval(activeDay, idx, 'end', e.target.value)}
                                className="px-3 py-2 border rounded-lg"
                                disabled={isDayBlocked}
                              />
                            </div>
                            <button
                              onClick={() => removeInterval(activeDay, idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              disabled={isDayBlocked}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {validationErrors[`${activeDay}-${idx}`] && (
                              <div className="text-xs text-red-600">
                                {validationErrors[`${activeDay}-${idx}`]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ustawienia slotów */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domyślna długość zajęć
                      </label>
                      <select
                        value={currentDayHours.slotDuration}
                        onChange={(e) => updateDayWorkingHours(activeDay, { 
                          slotDuration: parseInt(e.target.value) 
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isDayBlocked}
                      >
                        {SLOT_DURATIONS.map(duration => (
                          <option key={duration.value} value={duration.value}>
                            {duration.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Przerwa między zajęciami
                      </label>
                      <select
                        value={currentDayHours.breakDuration}
                        onChange={(e) => updateDayWorkingHours(activeDay, { 
                          breakDuration: parseInt(e.target.value) 
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isDayBlocked}
                      >
                        {BREAK_DURATIONS.map(duration => (
                          <option key={duration.value} value={duration.value}>
                            {duration.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Podgląd slotów */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Podgląd wygenerowanych slotów
                    </h4>
                    <div className="text-sm text-blue-700">
                      {currentDayHours.intervals.map((interval, idx) => {
                        const [startH, startM] = interval.start.split(':').map(Number)
                        const [endH, endM] = interval.end.split(':').map(Number)
                        const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM)
                        const slotsCount = Math.floor(totalMinutes / (currentDayHours.slotDuration + currentDayHours.breakDuration))
                        
                        return (
                          <div key={idx}>
                            {interval.start} - {interval.end}: {slotsCount} slotów po {currentDayHours.slotDuration} min
                            {currentDayHours.breakDuration > 0 && ` (z ${currentDayHours.breakDuration} min przerwą)`}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stopka */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {blockedDays.length > 0 && (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {blockedDays.length} dni z rezerwacjami
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Zapisz zmiany
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}