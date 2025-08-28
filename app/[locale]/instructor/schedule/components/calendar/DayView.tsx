// app/[locale]/instructor/schedule/components/calendar/DayView.tsx
// Komponent widoku dziennego kalendarza z timeline i szczegółowym rozkładem

'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { 
  Clock, MapPin, User, Phone, Mail, AlertCircle, 
  MoreVertical, Edit2, Trash2, Copy, CheckCircle,
  XCircle, Calendar, Car, ChevronLeft, ChevronRight,
  DollarSign 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot, SlotStatus } from '../../types/schedule.types'
import { formatTime, isSameDay, addMinutes } from '../../utils/dateHelpers'

interface DayViewProps {
  currentDate: Date
  searchTerm?: string
  onSlotClick?: (slot: Slot) => void
  onDateChange?: (date: Date) => void
  className?: string
}

// Komponenty pomocnicze
const TimeSlotMarker: React.FC<{ time: string; isNow?: boolean }> = ({ time, isNow }) => (
  <div className={cn(
    "absolute left-0 w-full flex items-center",
    isNow && "z-20"
  )}>
    <span className={cn(
      "text-xs font-medium w-16 text-right pr-3",
      isNow ? "text-blue-600" : "text-gray-500"
    )}>
      {time}
    </span>
    <div className={cn(
      "flex-1 border-t",
      isNow ? "border-blue-600 border-t-2" : "border-gray-200"
    )} />
    {isNow && (
      <div className="absolute left-16 w-2 h-2 bg-blue-600 rounded-full -mt-1" />
    )}
  </div>
)

const SlotCard: React.FC<{
  slot: Slot
  onClick?: () => void
  style?: React.CSSProperties
}> = ({ slot, onClick, style }) => {
  const statusColors = {
    'dostępny': 'bg-green-100 border-green-300 text-green-900',
    'zarezerwowany': 'bg-blue-100 border-blue-300 text-blue-900',
    'zablokowany': 'bg-gray-100 border-gray-300 text-gray-700',
    'zakończony': 'bg-gray-50 border-gray-200 text-gray-600',
    'anulowany': 'bg-red-50 border-red-200 text-red-700',
    'nieobecność': 'bg-orange-50 border-orange-200 text-orange-700',
    'w_trakcie': 'bg-purple-50 border-purple-200 text-purple-700'
  }

  const statusIcons = {
    'dostępny': <CheckCircle className="w-3 h-3" />,
    'zarezerwowany': <Calendar className="w-3 h-3" />,
    'zablokowany': <XCircle className="w-3 h-3" />,
    'zakończony': <CheckCircle className="w-3 h-3" />,
    'anulowany': <XCircle className="w-3 h-3" />,
    'nieobecność': <AlertCircle className="w-3 h-3" />,
    'w_trakcie': <Clock className="w-3 h-3" />
  }

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "absolute left-20 right-4 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
        statusColors[slot.status as keyof typeof statusColors],
        "group"
      )}
    >
      {/* Nagłówek */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcons[slot.status as keyof typeof statusIcons]}
          <span className="text-sm font-semibold">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Treść */}
      {slot.student ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span className="text-sm font-medium">
              {slot.student.firstName} {slot.student.lastName}
            </span>
          </div>
          {slot.lessonType && (
            <div className="flex items-center gap-2">
              <Car className="w-3 h-3" />
              <span className="text-xs">
                {slot.lessonType === 'jazda' ? 'Jazda w mieście' : 
                 slot.lessonType === 'plac' ? 'Plac manewrowy' :
                 slot.lessonType === 'teoria' ? 'Zajęcia teoretyczne' :
                 'Egzamin'}
              </span>
            </div>
          )}
          {slot.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{slot.location.name}</span>
            </div>
          )}
          {slot.payment && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">
                {slot.payment.status === 'opłacony' ? 'Opłacone' :
                 slot.payment.status === 'nieopłacony' ? 'Nieopłacone' :
                 'Częściowo opłacone'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm">
          {slot.status === 'dostępny' && 'Wolny termin'}
          {slot.status === 'zablokowany' && (slot.notes || 'Termin zablokowany')}
        </div>
      )}

      {/* Notatka */}
      {slot.notes && slot.status !== 'zablokowany' && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs italic">{slot.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function DayView({
  currentDate,
  searchTerm = '',
  onSlotClick,
  onDateChange,
  className
}: DayViewProps) {
  const { slots, workingHours, updateSlot } = useScheduleContext()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollToCurrentRef = useRef<HTMLDivElement>(null)

  // Aktualizacja aktualnego czasu
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Przewiń do aktualnej godziny przy montowaniu
  useEffect(() => {
    if (scrollToCurrentRef.current && isSameDay(currentDate, new Date())) {
      scrollToCurrentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [currentDate])

  // Filtrowanie slotów dla bieżącego dnia
  const daySlots = useMemo(() => {
    return slots.filter(slot => {
      const slotDate = new Date(slot.date)
      if (!isSameDay(slotDate, currentDate)) return false
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          slot.student?.firstName.toLowerCase().includes(term) ||
          slot.student?.lastName.toLowerCase().includes(term) ||
          slot.location?.name.toLowerCase().includes(term) ||
          slot.notes?.toLowerCase().includes(term)
        )
      }
      
      return true
    })
  }, [slots, currentDate, searchTerm])

  // Godziny pracy dla bieżącego dnia
  const dayName = currentDate.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase()
  const dayWorkingHours = workingHours[dayName]

  // Generowanie godzin timeline (6:00 - 22:00)
  const timelineHours = useMemo(() => {
    const hours = []
    for (let h = 6; h <= 22; h++) {
      hours.push(`${h.toString().padStart(2, '0')}:00`)
    }
    return hours
  }, [])

  // Obliczanie pozycji slotu na timeline
  const getSlotPosition = (slot: Slot) => {
    const startMinutes = parseInt(slot.startTime.split(':')[0]) * 60 + 
                        parseInt(slot.startTime.split(':')[1])
    const endMinutes = parseInt(slot.endTime.split(':')[0]) * 60 + 
                      parseInt(slot.endTime.split(':')[1])
    
    const baseMinutes = 6 * 60 // 6:00 jako punkt startowy
    const pixelsPerMinute = 60 / 60 // 60px na godzinę
    
    return {
      top: (startMinutes - baseMinutes) * pixelsPerMinute,
      height: (endMinutes - startMinutes) * pixelsPerMinute
    }
  }

  // Pozycja aktualnego czasu
  const currentTimePosition = useMemo(() => {
    if (!isSameDay(currentDate, new Date())) return null
    
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const baseMinutes = 6 * 60
    const pixelsPerMinute = 60 / 60
    
    if (nowMinutes < baseMinutes || nowMinutes > 22 * 60) return null
    
    return (nowMinutes - baseMinutes) * pixelsPerMinute
  }, [currentTime, currentDate])

  // Nawigacja po dniach
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    onDateChange?.(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange?.(newDate)
  }

  const handleToday = () => {
    onDateChange?.(new Date())
  }

  // Formatowanie daty
  const dateLabel = currentDate.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Nagłówek */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousDay}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Poprzedni dzień"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
          >
            Dzisiaj
          </button>
          
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Następny dzień"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-semibold capitalize">
          {dateLabel}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto" ref={containerRef}>
        <div className="relative" style={{ minHeight: `${17 * 60}px` }}>
          {/* Godziny */}
          {timelineHours.map((hour, idx) => {
            const isNow = currentTimePosition !== null && 
                         Math.abs(currentTimePosition - (idx * 60)) < 30
            
            return (
              <div 
                key={hour}
                ref={isNow ? scrollToCurrentRef : undefined}
                style={{ top: `${idx * 60}px` }}
              >
                <TimeSlotMarker time={hour} isNow={isNow} />
              </div>
            )
          })}

          {/* Linia aktualnego czasu */}
          {currentTimePosition !== null && (
            <div
              className="absolute left-20 right-4 border-t-2 border-blue-600 z-10"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-blue-600 rounded-full" />
            </div>
          )}

          {/* Sloty */}
          {daySlots.map(slot => {
            const position = getSlotPosition(slot)
            return (
              <SlotCard
                key={slot.id}
                slot={slot}
                onClick={() => {
                  setSelectedSlot(slot)
                  onSlotClick?.(slot)
                }}
                style={{
                  top: `${position.top}px`,
                  height: `${position.height - 4}px`,
                  minHeight: '60px'
                }}
              />
            )
          })}

          {/* Obszary godzin pracy */}
          {dayWorkingHours?.enabled && dayWorkingHours.intervals.map((interval, idx) => {
            const startMinutes = parseInt(interval.start.split(':')[0]) * 60 + 
                               parseInt(interval.start.split(':')[1])
            const endMinutes = parseInt(interval.end.split(':')[0]) * 60 + 
                             parseInt(interval.end.split(':')[1])
            
            const baseMinutes = 6 * 60
            const pixelsPerMinute = 60 / 60
            
            return (
              <div
                key={idx}
                className="absolute left-20 right-4 bg-green-50 border-l-2 border-green-300 opacity-30"
                style={{
                  top: `${(startMinutes - baseMinutes) * pixelsPerMinute}px`,
                  height: `${(endMinutes - startMinutes) * pixelsPerMinute}px`
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Podsumowanie dnia */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded-full" />
              <span>Dostępne: {daySlots.filter(s => s.status === 'dostępny').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full" />
              <span>Zarezerwowane: {daySlots.filter(s => s.status === 'zarezerwowany').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span>Zablokowane: {daySlots.filter(s => s.status === 'zablokowany').length}</span>
            </div>
          </div>
          
          {daySlots.length === 0 && dayWorkingHours?.enabled && (
            <div className="text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Brak slotów - zostaną wygenerowane automatycznie przy zapisie godzin pracy</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}