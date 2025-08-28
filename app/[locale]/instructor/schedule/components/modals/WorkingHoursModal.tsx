// app/[locale]/instructor/schedule/components/modals/WorkingHoursModal.tsx
// Modal do konfiguracji godzin pracy instruktora

'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Copy, Clock, Calendar, Save, AlertCircle, Check } from 'lucide-react'
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

export default function WorkingHoursModal({
  isOpen,
  onClose,
  onSave
}: WorkingHoursModalProps) {
  const { workingHours: globalWorkingHours, updateWorkingHours } = useScheduleContext()
  const { toast } = useToast()
  const [workingHours, setWorkingHours] = useState<Record<string, WorkingHours>>({})
  const [activeDay, setActiveDay] = useState('poniedziałek')
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Inicjalizacja danych
  useEffect(() => {
    if (isOpen && globalWorkingHours) {
      setWorkingHours(JSON.parse(JSON.stringify(globalWorkingHours)))
    }
  }, [isOpen, globalWorkingHours])

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
    const [newStartH, newStartM] = newInterval.start.split(':').map(Number)
    const [newEndH, newEndM] = newInterval.end.split(':').map(Number)
    const newStart = newStartH * 60 + newStartM
    const newEnd = newEndH * 60 + newEndM

    return intervals.some((interval, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) return false
      
      const [startH, startM] = interval.start.split(':').map(Number)
      const [endH, endM] = interval.end.split(':').map(Number)
      const start = startH * 60 + startM
      const end = endH * 60 + endM
      
      return (newStart < end && newEnd > start)
    })
  }

  // Aktualizacja godzin pracy dla dnia
  const updateDayWorkingHours = (day: string, updates: Partial<WorkingHours>) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updates
      }
    }))
    setValidationErrors({})
  }

  // Dodaj interwał
  const addInterval = (day: string) => {
    const dayHours = workingHours[day]
    const lastInterval = dayHours.intervals[dayHours.intervals.length - 1]
    
    const newInterval: TimeInterval = lastInterval 
      ? {
          start: lastInterval.end,
          end: lastInterval.end.split(':')[0] === '20' ? '22:00' : 
                `${(parseInt(lastInterval.end.split(':')[0]) + 2).toString().padStart(2, '0')}:00`
        }
      : {
          start: '08:00',
          end: '12:00'
        }
    
    const error = validateTimeInterval(newInterval)
    if (error) {
      setValidationErrors({ [day]: error })
      return
    }
    
    if (checkIntervalOverlap(dayHours.intervals, newInterval)) {
      setValidationErrors({ [day]: 'Interwały nie mogą się nakładać' })
      return
    }
    
    updateDayWorkingHours(day, {
      intervals: [...dayHours.intervals, newInterval]
    })
  }

  // Usuń interwał
  const removeInterval = (day: string, index: number) => {
    const dayHours = workingHours[day]
    updateDayWorkingHours(day, {
      intervals: dayHours.intervals.filter((_, i) => i !== index)
    })
  }

  // Aktualizuj interwał
  const updateInterval = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const dayHours = workingHours[day]
    const newIntervals = [...dayHours.intervals]
    newIntervals[index] = {
      ...newIntervals[index],
      [field]: value
    }
    
    const error = validateTimeInterval(newIntervals[index])
    if (error) {
      setValidationErrors({ [`${day}-${index}`]: error })
      return
    }
    
    if (checkIntervalOverlap(newIntervals, newIntervals[index], index)) {
      setValidationErrors({ [`${day}-${index}`]: 'Interwały nie mogą się nakładać' })
      return
    }
    
    updateDayWorkingHours(day, { intervals: newIntervals })
  }

  // Kopiuj godziny do innych dni
  const copyToOtherDays = (sourceDay: string, targetDays: string[]) => {
    const sourceHours = workingHours[sourceDay]
    const updates: Record<string, WorkingHours> = {}
    
    targetDays.forEach(day => {
      updates[day] = { ...sourceHours }
    })
    
    setWorkingHours(prev => ({
      ...prev,
      ...updates
    }))
    
    toast({
      title: "Skopiowano godziny",
      description: `Godziny z ${sourceDay} zostały skopiowane do wybranych dni`,
    })
  }

  // Zastosuj szablon
  const applyTemplate = (template: 'standard' | 'intensywny' | 'weekend') => {
    const templates = {
      standard: {
        'poniedziałek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
        'wtorek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
        'środa': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
        'czwartek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
        'piątek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
        'sobota': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'niedziela': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 }
      },
      intensywny: {
        'poniedziałek': { enabled: true, intervals: [{ start: '07:00', end: '13:00' }, { start: '14:00', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
        'wtorek': { enabled: true, intervals: [{ start: '07:00', end: '13:00' }, { start: '14:00', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
        'środa': { enabled: true, intervals: [{ start: '07:00', end: '13:00' }, { start: '14:00', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
        'czwartek': { enabled: true, intervals: [{ start: '07:00', end: '13:00' }, { start: '14:00', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
        'piątek': { enabled: true, intervals: [{ start: '07:00', end: '13:00' }, { start: '14:00', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
        'sobota': { enabled: true, intervals: [{ start: '08:00', end: '14:00' }], slotDuration: 90, breakDuration: 15 },
        'niedziela': { enabled: false, intervals: [], slotDuration: 90, breakDuration: 15 }
      },
      weekend: {
        'poniedziałek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'wtorek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'środa': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'czwartek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'piątek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
        'sobota': { enabled: true, intervals: [{ start: '08:00', end: '13:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 30 },
        'niedziela': { enabled: true, intervals: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '18:00' }], slotDuration: 120, breakDuration: 30 }
      }
    }
    
    setWorkingHours(templates[template])
    toast({
      title: "Szablon zastosowany",
      description: `Zastosowano szablon: ${template}`,
    })
  }

  // Oblicz statystyki
  const calculateStats = () => {
    let totalHours = 0
    let workDays = 0
    
    Object.values(workingHours).forEach(day => {
      if (day.enabled && day.intervals.length > 0) {
        workDays++
        day.intervals.forEach(interval => {
          const [startH, startM] = interval.start.split(':').map(Number)
          const [endH, endM] = interval.end.split(':').map(Number)
          totalHours += (endH * 60 + endM - startH * 60 - startM) / 60
        })
      }
    })
    
    return {
      totalHours: totalHours.toFixed(1),
      workDays,
      avgHoursPerDay: workDays > 0 ? (totalHours / workDays).toFixed(1) : '0'
    }
  }

  // Zapisz zmiany
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Zapisz każdy dzień osobno
      for (const [day, hours] of Object.entries(workingHours)) {
        await updateWorkingHours(day, hours)
      }
      
      if (onSave) {
        onSave(workingHours)
      }
      
      toast({
        title: "Zapisano pomyślnie",
        description: "Godziny pracy zostały zaktualizowane",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać godzin pracy",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const stats = calculateStats()
  const currentDayHours = workingHours[activeDay]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Nagłówek */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Godziny pracy</h2>
              <p className="text-sm text-gray-500 mt-1">
                Skonfiguruj swoje godziny dostępności dla każdego dnia tygodnia
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Szablony */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Szybkie szablony:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => applyTemplate('standard')}
                  className="px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Standardowy (Pn-Pt)
                </button>
                <button
                  onClick={() => applyTemplate('intensywny')}
                  className="px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Intensywny
                </button>
                <button
                  onClick={() => applyTemplate('weekend')}
                  className="px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Weekendowy
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[500px]">
            {/* Panel boczny z dniami */}
            <div className="w-48 bg-gray-50 border-r">
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Dni tygodnia
                </h3>
                <div className="space-y-1">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.key}
                      onClick={() => setActiveDay(day.key)}
                      className={cn(
                        "w-full px-3 py-2 text-left rounded-lg transition-colors flex items-center justify-between",
                        activeDay === day.key
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <span className="text-sm font-medium">{day.label}</span>
                      {workingHours[day.key]?.enabled && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Statystyki */}
                <div className="mt-6 p-3 bg-white rounded-lg border">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Podsumowanie
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dni pracy:</span>
                      <span className="font-medium">{stats.workDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Godzin/tydzień:</span>
                      <span className="font-medium">{stats.totalHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Średnia/dzień:</span>
                      <span className="font-medium">{stats.avgHoursPerDay}h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel główny */}
            <div className="flex-1 p-6 overflow-y-auto">
              {currentDayHours && (
                <div className="space-y-6">
                  {/* Włącz/wyłącz dzień */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentDayHours.enabled}
                        onChange={(e) => updateDayWorkingHours(activeDay, { enabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium">
                        Pracuję w {DAYS_OF_WEEK.find(d => d.key === activeDay)?.label.toLowerCase()}
                      </span>
                    </label>
                    
                    {currentDayHours.enabled && (
                      <button
                        onClick={() => {
                          const otherDays = DAYS_OF_WEEK
                            .filter(d => d.key !== activeDay)
                            .map(d => d.key)
                          copyToOtherDays(activeDay, otherDays)
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Kopiuj do innych dni
                      </button>
                    )}
                  </div>

                  {/* Interwały czasowe */}
                  {currentDayHours.enabled && (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Godziny pracy
                        </h3>
                        <div className="space-y-3">
                          {currentDayHours.intervals.map((interval, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <input
                                type="time"
                                value={interval.start}
                                onChange={(e) => updateInterval(activeDay, index, 'start', e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-gray-500">do</span>
                              <input
                                type="time"
                                value={interval.end}
                                onChange={(e) => updateInterval(activeDay, index, 'end', e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => removeInterval(activeDay, index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {validationErrors[`${activeDay}-${index}`] && (
                                <span className="text-xs text-red-600">
                                  {validationErrors[`${activeDay}-${index}`]}
                                </span>
                              )}
                            </div>
                          ))}
                          
                          <button
                            onClick={() => addInterval(activeDay)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Dodaj przedział czasowy
                          </button>
                          
                          {validationErrors[activeDay] && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{validationErrors[activeDay]}</span>
                            </div>
                          )}
                        </div>
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
                      <div className="p-4 bg-blue-50 rounded-lg">
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
              )}
            </div>
          </div>

          {/* Stopka */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
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