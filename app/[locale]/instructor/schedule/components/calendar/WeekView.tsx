// app/[locale]/instructor/schedule/components/calendar/WeekView.tsx
// Komponent widoku tygodniowego kalendarza z siatką dni i godzin

'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { 
  ChevronLeft, ChevronRight, Clock, Calendar,
  AlertCircle, MapPin, User, Car
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot } from '../../types/schedule.types'
import SlotCard from './SlotCard'
import { 
  formatDate, formatTime, isSameDay, getCurrentWeek,
  getPolishWeekDay, formatPolishDate, isToday
} from '../../utils/dateHelpers'

interface WeekViewProps {
  currentDate: Date
  searchTerm?: string
  onSlotClick?: (slot: Slot) => void
  onDateChange?: (date: Date) => void
  className?: string
}

// Komponent nagłówka dnia
const DayHeader: React.FC<{
  date: Date
  isToday: boolean
  slotsCount: number
}> = ({ date, isToday: today, slotsCount }) => (
  <div className={cn(
    "text-center p-2 border-r",
    today && "bg-blue-50"
  )}>
    <div className="font-medium text-sm">
      {getPolishWeekDay(date)}
    </div>
    <div className={cn(
      "text-lg font-semibold mt-1",
      today && "text-blue-600"
    )}>
      {date.getDate()}
    </div>
    {slotsCount > 0 && (
      <div className="text-xs text-gray-500 mt-1">
        {slotsCount} {slotsCount === 1 ? 'termin' : slotsCount < 5 ? 'terminy' : 'terminów'}
      </div>
    )}
  </div>
)

// Komponent siatki godzinowej
const TimeGrid: React.FC = () => {
  const hours = []
  for (let h = 6; h <= 22; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`)
  }

  return (
    <div className="w-16 flex-shrink-0 border-r bg-gray-50">
      <div className="h-16 border-b"></div>
      {hours.map(hour => (
        <div
          key={hour}
          className="h-20 border-b flex items-start justify-end pr-2 pt-1"
        >
          <span className="text-xs text-gray-500">{hour}</span>
        </div>
      ))}
    </div>
  )
}

export default function WeekView({
  currentDate,
  searchTerm = '',
  onSlotClick,
  onDateChange,
  className
}: WeekViewProps) {
  const { slots, workingHours, updateSlot } = useScheduleContext()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Aktualizacja czasu
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Dni tygodnia
  const weekDays = useMemo(() => getCurrentWeek(currentDate), [currentDate])

  // Filtrowanie slotów
  const weekSlots = useMemo(() => {
    return slots.filter(slot => {
      const slotDate = new Date(slot.date)
      const inWeek = weekDays.some(day => isSameDay(day, slotDate))
      
      if (!inWeek) return false
      
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
  }, [slots, weekDays, searchTerm])

  // Grupowanie slotów po dniach
  const slotsByDay = useMemo(() => {
    const grouped: Record<string, Slot[]> = {}
    
    weekDays.forEach(day => {
      const dayKey = formatDate(day)
      grouped[dayKey] = weekSlots.filter(slot => 
        isSameDay(new Date(slot.date), day)
      ).sort((a, b) => {
        const timeA = parseInt(a.startTime.replace(':', ''))
        const timeB = parseInt(b.startTime.replace(':', ''))
        return timeA - timeB
      })
    })
    
    return grouped
  }, [weekSlots, weekDays])

  // Obliczanie pozycji slotu
  const getSlotPosition = (slot: Slot) => {
    const startHour = parseInt(slot.startTime.split(':')[0])
    const startMinute = parseInt(slot.startTime.split(':')[1])
    const endHour = parseInt(slot.endTime.split(':')[0])
    const endMinute = parseInt(slot.endTime.split(':')[1])
    
    const startOffset = (startHour - 6) * 80 + (startMinute / 60) * 80
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute))
    const height = (duration / 60) * 80
    
    return {
      top: startOffset + 64, // 64px dla nagłówka
      height: Math.max(height - 4, 30) // Minimalna wysokość
    }
  }

  // Nawigacja
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    onDateChange?.(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    onDateChange?.(newDate)
  }

  const handleToday = () => {
    onDateChange?.(new Date())
  }

  // Obsługa kliknięcia na slot
  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot)
    onSlotClick?.(slot)
  }

  // Obsługa statusu slotu
  const handleSlotStatusChange = async (slotId: string, status: any) => {
    await updateSlot(slotId, { status })
  }

  // Obliczanie pozycji linii czasu
  const currentTimePosition = useMemo(() => {
    const now = currentTime
    const hours = now.getHours()
    const minutes = now.getMinutes()
    
    if (hours < 6 || hours >= 22) return null
    
    return ((hours - 6) * 80 + (minutes / 60) * 80) + 64
  }, [currentTime])

  // Formatowanie zakresu dat
  const weekLabel = `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Nagłówek z nawigacją */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Poprzedni tydzień"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
          >
            Obecny tydzień
          </button>
          
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Następny tydzień"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-semibold">
          {weekLabel}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Siatka kalendarza */}
      <div className="flex-1 flex overflow-auto">
        <TimeGrid />
        
        {/* Dni tygodnia z slotami */}
        <div className="flex-1 flex">
          {weekDays.map((day, dayIndex) => {
            const dayKey = formatDate(day)
            const daySlots = slotsByDay[dayKey] || []
            const isCurrentDay = isToday(day)
            const dayName = day.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase()
            const dayWorkingHours = workingHours[dayName]
            
            return (
              <div
                key={dayIndex}
                className="flex-1 border-r relative"
                onMouseEnter={() => setHoveredDay(dayIndex)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Nagłówek dnia */}
                <DayHeader 
                  date={day} 
                  isToday={isCurrentDay}
                  slotsCount={daySlots.length}
                />
                
                {/* Siatka godzin */}
                <div className="relative" style={{ height: `${17 * 80}px` }}>
                  {/* Linie godzin */}
                  {Array.from({ length: 17 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-b border-gray-100"
                      style={{ top: `${i * 80}px`, height: '80px' }}
                    />
                  ))}
                  
                  {/* Obszary godzin pracy */}
                  {dayWorkingHours?.enabled && dayWorkingHours.intervals.map((interval, idx) => {
                    const [startH, startM] = interval.start.split(':').map(Number)
                    const [endH, endM] = interval.end.split(':').map(Number)
                    const startPos = (startH - 6) * 80 + (startM / 60) * 80
                    const endPos = (endH - 6) * 80 + (endM / 60) * 80
                    
                    return (
                      <div
                        key={idx}
                        className="absolute w-full bg-green-50 opacity-30"
                        style={{
                          top: `${startPos}px`,
                          height: `${endPos - startPos}px`
                        }}
                      />
                    )
                  })}
                  
                  {/* Aktualna godzina */}
                  {isCurrentDay && currentTimePosition !== null && (
                    <div
                      className="absolute w-full border-t-2 border-red-500 z-10"
                      style={{ top: `${currentTimePosition - 64}px` }}
                    >
                      <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                  )}
                  
                  {/* Sloty */}
                  {daySlots.map(slot => {
                    const position = getSlotPosition(slot)
                    return (
                      <div
                        key={slot.id}
                        className="absolute left-1 right-1"
                        style={{
                          top: `${position.top - 64}px`,
                          height: `${position.height}px`
                        }}
                      >
                        <SlotCard
                          slot={slot}
                          view="compact"
                          onClick={() => handleSlotClick(slot)}
                        />
                      </div>
                    )
                  })}

                  {/* Wskaźnik aktualnej godziny dla dzisiejszego dnia */}
                  {isCurrentDay && currentTimePosition !== null && (
                    <div
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{ top: `${currentTimePosition - 64}px` }}
                    >
                      <div className="relative">
                        <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded" />
            <span>Dostępny</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200 rounded" />
            <span>Zarezerwowany</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <span>Zablokowany</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded" />
            <span>Anulowany</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 rounded" />
            <span>Nieobecność</span>
          </div>
        </div>
      </div>
    </div>
  )
}