// app/[locale]/instructor/schedule/components/calendar/MonthView.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { 
  ChevronLeft, ChevronRight, Calendar,
  Clock, User, MapPin, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot } from '../../types/schedule.types'
import SlotCard from './SlotCard'
import { 
  formatDate, formatTime, isSameDay, getMonthDays,
  getPolishMonthName, isToday, isPast, isFuture,
  getPolishWeekDay
} from '../../utils/dateHelpers'

interface MonthViewProps {
  currentDate: Date
  searchTerm?: string
  onSlotClick?: (slot: Slot) => void
  onDateChange: (date: Date) => void
  className?: string
}

// Komponent pojedynczego dnia w kalendarzu
const DayCell: React.FC<{
  date: Date
  slots: Slot[]
  isToday: boolean
  isCurrentMonth: boolean
  isPast: boolean
  onSlotClick?: (slot: Slot) => void
  onDayClick?: (date: Date) => void
}> = ({ date, slots, isToday: today, isCurrentMonth, isPast: past, onSlotClick, onDayClick }) => {
  const t = useTranslations('instructor.schedule.calendar.monthView')
  const [isHovered, setIsHovered] = useState(false)
  
  // Grupowanie slotów po statusie
  const slotStats = useMemo(() => {
    const stats = {
      dostępny: 0,
      zarezerwowany: 0,
      zablokowany: 0,
      zakończony: 0,
      anulowany: 0,
      nieobecność: 0,
      w_trakcie: 0
    }
    
    slots.forEach(slot => {
      if (stats.hasOwnProperty(slot.status)) {
        stats[slot.status as keyof typeof stats]++
      }
    })
    
    return stats
  }, [slots])

  const hasSlots = slots.length > 0

  return (
    <div
      className={cn(
        "min-h-[100px] border-r border-b p-2 transition-all cursor-pointer relative",
        !isCurrentMonth && "bg-gray-50 text-gray-400",
        today && "bg-blue-50",
        past && !today && "bg-gray-100/50",
        isHovered && "bg-gray-50 shadow-inner"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onDayClick?.(date)}
    >
      {/* Nagłówek dnia */}
      <div className="flex items-start justify-between mb-1">
        <span className={cn(
          "text-sm font-medium",
          today && "text-blue-600 font-bold",
          !isCurrentMonth && "text-gray-400"
        )}>
          {date.getDate()}
        </span>
        
        {/* Pokazuje datę w hover bez przycisku */}
        {isHovered && (
          <span className="text-xs text-gray-500">
            {date.toLocaleDateString('uk-UA', { weekday: 'short' })}
          </span>
        )}
      </div>

      {/* Sloty */}
      {hasSlots && (
        <div className="space-y-1">
          {/* Pokaż pierwsze 3 sloty */}
          {slots.slice(0, 3).map(slot => (
            <div
              key={slot.id}
              onClick={(e) => {
                e.stopPropagation()
                onSlotClick?.(slot)
              }}
              className={cn(
                "text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80",
                slot.status === 'dostępny' && "bg-green-100 text-green-700",
                slot.status === 'zarezerwowany' && "bg-blue-100 text-blue-700",
                slot.status === 'zablokowany' && "bg-gray-200 text-gray-600",
                slot.status === 'zakończony' && "bg-gray-100 text-gray-500",
                slot.status === 'anulowany' && "bg-red-100 text-red-700",
                slot.status === 'nieobecność' && "bg-orange-100 text-orange-700",
                slot.status === 'w_trakcie' && "bg-purple-100 text-purple-700"
              )}
            >
              <span className="font-medium">{formatTime(slot.startTime)}</span>
              {slot.student && (
                <span className="ml-1">
                  {slot.student.firstName} {slot.student.lastName[0]}.
                </span>
              )}
            </div>
          ))}
          
          {/* Jeśli jest więcej slotów */}
          {slots.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              {t('dayCell.moreSlots', { count: slots.length - 3 })}
            </div>
          )}
        </div>
      )}

      {/* Brak slotów - informacja */}
      {!hasSlots && isCurrentMonth && !past && (
        <div className="text-xs text-gray-400 text-center mt-2">
          {t('dayCell.noSlots')}
        </div>
      )}

      {/* Statystyki slotów (pokazuje się przy hover) */}
      {isHovered && hasSlots && (
        <div className="absolute bottom-1 left-1 right-1 flex gap-1 justify-center">
          {slotStats.dostępny > 0 && (
            <div 
              className="w-2 h-2 bg-green-400 rounded-full" 
              title={t('dayCell.available', { count: slotStats.dostępny })} 
            />
          )}
          {slotStats.zarezerwowany > 0 && (
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full" 
              title={t('dayCell.reserved', { count: slotStats.zarezerwowany })} 
            />
          )}
          {slotStats.zablokowany > 0 && (
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full" 
              title={t('dayCell.blocked', { count: slotStats.zablokowany })} 
            />
          )}
        </div>
      )}
    </div>
  )
}

export default function MonthView({
  currentDate,
  searchTerm = '',
  onSlotClick,
  onDateChange,
  className
}: MonthViewProps) {
  const t = useTranslations('instructor.schedule.calendar.monthView')
  const { slots, workingHours } = useScheduleContext()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  // Dni miesiąca z paddingiem
  const monthGrid = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const endPadding = lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay()
    
    const days: Date[] = []
    
    // Dni z poprzedniego miesiąca
    for (let i = startPadding; i > 0; i--) {
      const date = new Date(firstDay)
      date.setDate(date.getDate() - i)
      days.push(date)
    }
    
    // Dni bieżącego miesiąca
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }
    
    // Dni z następnego miesiąca
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(lastDay)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }, [currentDate])

  // Filtrowanie slotów
  const monthSlots = useMemo(() => {
    return slots.filter(slot => {
      const slotDate = new Date(slot.date)
      const inView = monthGrid.some(day => isSameDay(day, slotDate))
      
      if (!inView) return false
      
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
  }, [slots, monthGrid, searchTerm])

  // Grupowanie slotów po dniach
  const slotsByDay = useMemo(() => {
    const grouped: Record<string, Slot[]> = {}
    
    monthSlots.forEach(slot => {
      const dateKey = slot.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(slot)
    })
    
    // Sortowanie slotów w każdym dniu
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const timeA = parseInt(a.startTime.replace(':', ''))
        const timeB = parseInt(b.startTime.replace(':', ''))
        return timeA - timeB
      })
    })
    
    return grouped
  }, [monthSlots])

  // Statystyki miesiąca
  const monthStats = useMemo(() => {
    const currentMonthSlots = monthSlots.filter(slot => {
      const slotDate = new Date(slot.date)
      return slotDate.getMonth() === currentDate.getMonth() &&
             slotDate.getFullYear() === currentDate.getFullYear()
    })

    return {
      total: currentMonthSlots.length,
      dostępne: currentMonthSlots.filter(s => s.status === 'dostępny').length,
      zarezerwowane: currentMonthSlots.filter(s => s.status === 'zarezerwowany').length,
      zakończone: currentMonthSlots.filter(s => s.status === 'zakończony').length
    }
  }, [monthSlots, currentDate])

  // Nawigacja
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onDateChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    // Przełącz na widok dzienny
    const newDate = new Date(date)
    onDateChange(newDate)
  }

  // Nazwy dni tygodnia
  const weekDays = [
    t('weekDays.mon'),
    t('weekDays.tue'),
    t('weekDays.wed'),
    t('weekDays.thu'),
    t('weekDays.fri'),
    t('weekDays.sat'),
    t('weekDays.sun')
  ]

  // Formatowanie nazwy miesiąca - użyj lokalnej funkcji jeśli dostępna
  const monthLabel = `${getPolishMonthName(currentDate)} ${currentDate.getFullYear()}`

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Nagłówek z nawigacją */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label={t('navigation.previousMonth')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
          >
            {t('navigation.currentMonth')}
          </button>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label={t('navigation.nextMonth')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-semibold capitalize">
          {monthLabel}
        </h2>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{t('stats.total', { count: monthStats.total })}</span>
          <span className="text-green-600">{t('stats.available', { count: monthStats.dostępne })}</span>
          <span className="text-blue-600">{t('stats.reserved', { count: monthStats.zarezerwowane })}</span>
        </div>
      </div>

      {/* Dni tygodnia */}
      <div className="grid grid-cols-7 border-b bg-gray-100">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "p-2 text-center text-sm font-medium border-r",
              index === 6 && "text-red-600"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Siatka miesięczna */}
      <div className="flex-1 grid grid-cols-7 overflow-auto">
        {monthGrid.map((date, index) => {
          const dateKey = formatDate(date)
          const daySlots = slotsByDay[dateKey.split('.').reverse().join('-')] || []
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const weekNumber = Math.floor(index / 7)
          
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredWeek(weekNumber)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              <DayCell
                date={date}
                slots={daySlots}
                isToday={isToday(date)}
                isCurrentMonth={isCurrentMonth}
                isPast={isPast(date)}
                onSlotClick={onSlotClick}
                onDayClick={handleDayClick}
              />
            </div>
          )
        })}
      </div>

      {/* Stopka z podsumowaniem */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {hoveredWeek !== null 
                ? t('footer.week', { number: hoveredWeek + 1 })
                : t('footer.weekPlaceholder')
              }
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
              <span className="text-xs">{t('footer.legend.today')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded" />
              <span className="text-xs">{t('footer.legend.weekend')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{t('footer.legend.workingHours')}</span>
            </div>
            {monthStats.total === 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">{t('footer.legend.noSlotsWarning')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}