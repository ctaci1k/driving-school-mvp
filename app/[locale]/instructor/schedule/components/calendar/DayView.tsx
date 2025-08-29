// app/[locale]/instructor/schedule/components/calendar/DayView.tsx

'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Clock, MapPin, User, Plus, AlertCircle,
  ChevronLeft, ChevronRight, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot } from '../../types/schedule.types'
import SlotCard from './SlotCard'
import { 
  formatTime, 
  isSameDay, 
  formatPolishDate,
  getPolishWeekDay
} from '../../utils/dateHelpers'

interface DayViewProps {
  currentDate: Date
  searchTerm?: string
  onSlotClick?: (slot: Slot) => void
  onDateChange?: (date: Date) => void
  className?: string
}

// Маркер часу на timeline
const TimeSlotMarker: React.FC<{ 
  time: string
  isNow?: boolean 
}> = ({ time, isNow }) => (
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

export default function DayView({
  currentDate,
  searchTerm = '',
  onSlotClick,
  onDateChange,
  className
}: DayViewProps) {
  const t = useTranslations('instructor.schedule.calendar.dayView')
  const { slots, workingHours, generateSlots } = useScheduleContext()
  const [currentTime, setCurrentTime] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollToCurrentRef = useRef<HTMLDivElement>(null)

  // Оновлення поточного часу щохвилини
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Прокрутка до поточної години при монтуванні
  useEffect(() => {
    if (scrollToCurrentRef.current && isSameDay(currentDate, new Date())) {
      scrollToCurrentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [currentDate])

  // Фільтрування слотів для поточного дня з виявленням конфліктів
  const daySlots = useMemo(() => {
    const filtered = slots.filter((slot: Slot) => {
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
    }).sort((a: Slot, b: Slot) => {
      const [aHour, aMin] = a.startTime.split(':').map(Number)
      const [bHour, bMin] = b.startTime.split(':').map(Number)
      return (aHour * 60 + aMin) - (bHour * 60 + bMin)
    })
    
    return filtered
  }, [slots, currentDate, searchTerm])
  
  // Виявлення конфліктів між слотами
  const slotConflicts = useMemo(() => {
    const conflicts = new Map<string, number>()
    const endTimes: number[] = []
    
    daySlots.forEach((slot: Slot) => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number)
      const [endHour, endMin] = slot.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      // Знайти першу вільну колонку
      let column = 0
      for (let i = 0; i < endTimes.length; i++) {
        if (startMinutes >= endTimes[i]) {
          column = i
          break
        }
      }
      if (column === 0 && endTimes.length > 0 && startMinutes < endTimes[0]) {
        column = endTimes.length
      }
      
      conflicts.set(slot.id, column)
      if (!endTimes[column] || endTimes[column] < endMinutes) {
        endTimes[column] = endMinutes
      }
    })
    
    return {
      columns: conflicts,
      maxColumns: Math.max(1, ...Array.from(conflicts.values()).map(col => col + 1))
    }
  }, [daySlots])

  // Години роботи для поточного дня
  const dayName = getPolishWeekDay(currentDate).toLowerCase()
  const dayWorkingHours = workingHours[dayName]

  // Генерація годин timeline (6:00 - 22:00)
  const timelineHours = useMemo(() => {
    const hours = []
    for (let h = 6; h <= 22; h++) {
      hours.push(`${h.toString().padStart(2, '0')}:00`)
    }
    return hours
  }, [])

  // Обчислення позиції слота на timeline
  const getSlotPosition = (slot: Slot) => {
    const [startHour, startMin] = slot.startTime.split(':').map(Number)
    const [endHour, endMin] = slot.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const baseMinutes = 6 * 60 // 6:00 як початкова точка
    const pixelsPerHour = 80 // 80px на годину
    const pixelsPerMinute = pixelsPerHour / 60
    
    return {
      top: (startMinutes - baseMinutes) * pixelsPerMinute,
      height: (endMinutes - startMinutes) * pixelsPerMinute
    }
  }

  // Позиція поточного часу
  const currentTimePosition = useMemo(() => {
    if (!isSameDay(currentDate, new Date())) return null
    
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const baseMinutes = 6 * 60
    const pixelsPerHour = 80
    const pixelsPerMinute = pixelsPerHour / 60
    
    if (nowMinutes < baseMinutes || nowMinutes > 22 * 60) return null
    
    return (nowMinutes - baseMinutes) * pixelsPerMinute
  }, [currentTime, currentDate])

  // Навігація по днях
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

  // Генерування слотів для дня
  const handleGenerateSlots = () => {
    if (dayWorkingHours?.enabled) {
      // generateSlots приймає (startDate, endDate)
      const startDate = new Date(currentDate)
      const endDate = new Date(currentDate)
      generateSlots(startDate, endDate)
    }
  }

  const isToday = isSameDay(currentDate, new Date())
  const dateLabel = formatPolishDate(currentDate)

  // Статистика дня
  const dayStats = useMemo(() => ({
    available: daySlots.filter((s: Slot) => s.status === 'dostępny').length,
    reserved: daySlots.filter((s: Slot) => s.status === 'zarezerwowany').length,
    blocked: daySlots.filter((s: Slot) => s.status === 'zablokowany').length
  }), [daySlots])

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Заголовок з навігацією */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousDay}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            aria-label={t('previousDay')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
              isToday ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
            )}
          >
            {t('today')}
          </button>
          
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            aria-label={t('nextDay')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-semibold">
          {dateLabel}
        </h2>

        <div className="flex items-center gap-4">
          {isToday && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
          )}
          
          <button
            onClick={handleGenerateSlots}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            {t('generateSlots')}
          </button>
        </div>
      </div>

      {/* Інформація про вихідний день */}
      {dayWorkingHours && !dayWorkingHours.enabled && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{t('dayOff')}</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto relative bg-gray-50"
      >
        <div className="relative" style={{ height: `${17 * 80}px` }}>
          {/* Години та лінії */}
          {timelineHours.map((hour, index) => {
            const isCurrentHour = isToday && 
              hour === `${currentTime.getHours().toString().padStart(2, '0')}:00`
            
            return (
              <div
                key={hour}
                ref={isCurrentHour ? scrollToCurrentRef : undefined}
                style={{ top: `${index * 80}px` }}
                className="absolute w-full"
              >
                <TimeSlotMarker time={hour} isNow={false} />
              </div>
            )
          })}

          {/* Лінія поточного часу */}
          {currentTimePosition !== null && (
            <div
              style={{ top: `${currentTimePosition}px` }}
              className="absolute w-full z-20 pointer-events-none"
            >
              <TimeSlotMarker 
                time={formatTime(currentTime)} 
                isNow={true} 
              />
            </div>
          )}

          {/* Області годин роботи (фон) */}
          {dayWorkingHours?.enabled && dayWorkingHours.intervals.map((interval, idx) => {
            const [startHour, startMin] = interval.start.split(':').map(Number)
            const [endHour, endMin] = interval.end.split(':').map(Number)
            
            const startMinutes = startHour * 60 + startMin
            const endMinutes = endHour * 60 + endMin
            
            const baseMinutes = 6 * 60
            const pixelsPerMinute = 80 / 60
            
            return (
              <div
                key={idx}
                className="absolute left-20 right-4 bg-white border-l-4 border-green-200"
                style={{
                  top: `${(startMinutes - baseMinutes) * pixelsPerMinute}px`,
                  height: `${(endMinutes - startMinutes) * pixelsPerMinute}px`
                }}
              />
            )
          })}

          {/* Слоти з обробкою конфліктів */}
          {daySlots.map(slot => {
            const position = getSlotPosition(slot)
            const column = slotConflicts.columns.get(slot.id) || 0
            const maxColumns = slotConflicts.maxColumns
            const widthPercentage = 90 / maxColumns // 90% ширини, 10% на padding
            const leftOffset = 80 + (column * widthPercentage) // 80px для колонки часу
            
            return (
              <div
                key={slot.id}
                style={{
                  position: 'absolute',
                  top: `${position.top}px`,
                  height: `${Math.max(position.height - 4, 60)}px`,
                  left: `${leftOffset}px`,
                  width: `calc(${widthPercentage}% - 8px)`,
                  marginRight: '4px'
                }}
              >
                <SlotCard
                  slot={slot}
                  view="expanded"
                  showDate={false}
                  showActions={true}
                  onClick={() => onSlotClick?.(slot)}
                  onEdit={() => onSlotClick?.(slot)}
                  className="w-full h-full"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Підсумок дня */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>{t('stats.available')}: <strong>{dayStats.available}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>{t('stats.reserved')}: <strong>{dayStats.reserved}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span>{t('stats.blocked')}: <strong>{dayStats.blocked}</strong></span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {t('stats.total')}: <strong>{daySlots.length}</strong> {t('stats.slots')}
          </div>
        </div>
      </div>
    </div>
  )
}