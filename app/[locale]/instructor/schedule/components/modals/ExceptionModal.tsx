// app/[locale]/instructor/schedule/components/modals/ExceptionModal.tsx
// Modal do dodawania wyjątków w harmonogramie - urlopy, święta, choroby

'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, Calendar, AlertTriangle, Plane, Heart, GraduationCap, 
  Gift, Save, Loader2, CalendarOff, Repeat, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Exception, ExceptionType, Slot } from '../../types/schedule.types'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { format, addDays, differenceInDays, eachDayOfInterval } from 'date-fns'
import { pl } from 'date-fns/locale'

interface ExceptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (exception: Exception) => void
  initialDate?: Date
  exception?: Exception | null
  mode?: 'create' | 'edit'
}

const EXCEPTION_TYPES: { 
  value: ExceptionType; 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
}[] = [
  { 
    value: 'urlop', 
    label: 'Urlop', 
    color: 'text-blue-600 bg-blue-50', 
    icon: <Plane className="w-5 h-5" />,
    description: 'Zaplanowany urlop wypoczynkowy'
  },
  { 
    value: 'choroba', 
    label: 'Zwolnienie lekarskie', 
    color: 'text-red-600 bg-red-50', 
    icon: <Heart className="w-5 h-5" />,
    description: 'Nieobecność z powodu choroby'
  },
  { 
    value: 'święto', 
    label: 'Święto', 
    color: 'text-green-600 bg-green-50', 
    icon: <Gift className="w-5 h-5" />,
    description: 'Dni świąteczne i wolne'
  },
  { 
    value: 'szkolenie', 
    label: 'Szkolenie', 
    color: 'text-purple-600 bg-purple-50', 
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Kursy i szkolenia zawodowe'
  },
  { 
    value: 'inne', 
    label: 'Inne', 
    color: 'text-gray-600 bg-gray-50', 
    icon: <CalendarOff className="w-5 h-5" />,
    description: 'Pozostałe powody nieobecności'
  }
]

const POLISH_HOLIDAYS = [
  { date: '01-01', name: 'Nowy Rok' },
  { date: '01-06', name: 'Święto Trzech Króli' },
  { date: '05-01', name: 'Święto Pracy' },
  { date: '05-03', name: 'Święto Konstytucji 3 Maja' },
  { date: '08-15', name: 'Wniebowzięcie NMP' },
  { date: '11-01', name: 'Wszystkich Świętych' },
  { date: '11-11', name: 'Święto Niepodległości' },
  { date: '12-25', name: 'Boże Narodzenie' },
  { date: '12-26', name: 'Drugi dzień Bożego Narodzenia' }
]

export default function ExceptionModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  exception,
  mode = 'create'
}: ExceptionModalProps) {
  const { slots, createException, exceptions } = useScheduleContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<{
    type: ExceptionType
    startDate: string
    endDate: string
    description: string
    isRecurring: boolean
    recurringPattern?: 'rocznie' | 'miesięcznie'
    blockSlots: boolean
  }>({
    type: 'urlop',
    startDate: '',
    endDate: '',
    description: '',
    isRecurring: false,
    recurringPattern: 'rocznie',
    blockSlots: true
  })
  
  const [affectedSlots, setAffectedSlots] = useState<Slot[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<string>('')

  // Initialize form
  useEffect(() => {
    if (exception && mode === 'edit') {
      setFormData({
        type: exception.type,
        startDate: exception.startDate,
        endDate: exception.endDate,
        description: exception.description || '',
        isRecurring: exception.isRecurring || false,
        recurringPattern: exception.recurringPattern,
        blockSlots: true
      })
    } else if (initialDate) {
      const dateStr = format(initialDate, 'yyyy-MM-dd')
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr
      }))
    }
  }, [exception, mode, initialDate])

  // Calculate affected slots
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      
      if (start <= end) {
        const affected = slots.filter(slot => {
          const slotDate = new Date(slot.date)
          return slotDate >= start && slotDate <= end && 
                 (slot.status === 'dostępny' || slot.status === 'zarezerwowany')
        })
        setAffectedSlots(affected)
      }
    }
  }, [formData.startDate, formData.endDate, slots])

  // Apply holiday template
  const applyHoliday = (holidayDate: string) => {
    const currentYear = new Date().getFullYear()
    const [month, day] = holidayDate.split('-')
    const date = `${currentYear}-${month}-${day}`
    const holiday = POLISH_HOLIDAYS.find(h => h.date === holidayDate)
    
    setFormData(prev => ({
      ...prev,
      type: 'święto',
      startDate: date,
      endDate: date,
      description: holiday?.name || '',
      isRecurring: true,
      recurringPattern: 'rocznie'
    }))
  }

  // Calculate statistics
  const calculateStats = () => {
    if (!formData.startDate || !formData.endDate) return null
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = differenceInDays(end, start) + 1
    const workDays = eachDayOfInterval({ start, end }).filter(date => {
      const day = date.getDay()
      return day !== 0 && day !== 6 // Exclude weekends
    }).length
    
    const bookedSlots = affectedSlots.filter(s => s.status === 'zarezerwowany').length
    const availableSlots = affectedSlots.filter(s => s.status === 'dostępny').length
    
    return {
      totalDays: days,
      workDays,
      bookedSlots,
      availableSlots,
      totalSlots: affectedSlots.length
    }
  }

  const stats = calculateStats()

  // Validate form
  const isFormValid = () => {
    return formData.startDate && 
           formData.endDate && 
           formData.type &&
           new Date(formData.startDate) <= new Date(formData.endDate)
  }

  // Handle save
  const handleSave = async () => {
    if (!isFormValid()) return
    
    setIsLoading(true)
    try {
      const exceptionData: Omit<Exception, 'id' | 'createdAt'> = {
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
        affectedSlots: formData.blockSlots ? affectedSlots.map(s => s.id) : []
      }
      
      await createException(exceptionData)
      
      if (onSave) {
        onSave({
          ...exceptionData,
          id: `exc-${Date.now()}`,
          createdAt: new Date()
        } as Exception)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving exception:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Dodaj wyjątek' : 'Edytuj wyjątek'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Zablokuj wybrane dni w harmonogramie
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Exception Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Typ wyjątku
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXCEPTION_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={cn(
                      "relative p-3 rounded-lg border-2 transition-all",
                      formData.type === type.value
                        ? `${type.color} border-current`
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {type.icon}
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    {formData.type === type.value && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {formData.type && (
                <p className="text-xs text-gray-500 mt-2">
                  {EXCEPTION_TYPES.find(t => t.value === formData.type)?.description}
                </p>
              )}
            </div>

            {/* Quick holidays */}
            {formData.type === 'święto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Szybki wybór świąt
                </label>
                <select
                  value={selectedHoliday}
                  onChange={(e) => {
                    setSelectedHoliday(e.target.value)
                    if (e.target.value) applyHoliday(e.target.value)
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz święto...</option>
                  {POLISH_HOLIDAYS.map(holiday => (
                    <option key={holiday.date} value={holiday.date}>
                      {holiday.name} ({holiday.date.replace('-', '.')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data początkowa
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data końcowa
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis (opcjonalnie)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Dodaj szczegóły wyjątku..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Recurring */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-sm">Wyjątek cykliczny</span>
                  <p className="text-xs text-gray-500">Powtarzaj ten wyjątek automatycznie</p>
                </div>
              </label>
              
              {formData.isRecurring && (
                <div className="ml-7 flex gap-3">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, recurringPattern: 'rocznie' }))}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                      formData.recurringPattern === 'rocznie'
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    Co roku
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, recurringPattern: 'miesięcznie' }))}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                      formData.recurringPattern === 'miesięcznie'
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    Co miesiąc
                  </button>
                </div>
              )}
            </div>

            {/* Block slots */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.blockSlots}
                  onChange={(e) => setFormData(prev => ({ ...prev, blockSlots: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-sm">Zablokuj sloty</span>
                  <p className="text-xs text-gray-500">Automatycznie zablokuj wszystkie sloty w tym okresie</p>
                </div>
              </label>
            </div>

            {/* Statistics */}
            {stats && (
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900">Wpływ na harmonogram</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-amber-700">
                      <div>Liczba dni: {stats.totalDays}</div>
                      <div>Dni robocze: {stats.workDays}</div>
                      <div>Zarezerwowane sloty: {stats.bookedSlots}</div>
                      <div>Dostępne sloty: {stats.availableSlots}</div>
                    </div>
                    {stats.bookedSlots > 0 && (
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        Uwaga: {stats.bookedSlots} zarezerwowanych slotów wymaga kontaktu z kursantami!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Affected slots preview */}
            {affectedSlots.length > 0 && (
              <div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Info className="w-4 h-4" />
                  {showPreview ? 'Ukryj' : 'Pokaż'} sloty do zablokowania ({affectedSlots.length})
                </button>
                
                {showPreview && (
                  <div className="mt-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                    <div className="space-y-2">
                      {affectedSlots.map(slot => (
                        <div key={slot.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{format(new Date(slot.date), 'dd.MM.yyyy')}</span>
                            <span className="text-gray-500">{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs",
                            slot.status === 'zarezerwowany' 
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          )}>
                            {slot.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || !isFormValid()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'create' ? 'Dodaj wyjątek' : 'Zapisz zmiany'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}