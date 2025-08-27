// components/schedule/TimeSlotPicker.tsx
'use client'

import { useState, useMemo } from 'react'
import { Clock, Calendar, AlertCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { 
  format, setHours, setMinutes, addMinutes, 
  isBefore, isAfter, isWithinInterval, parse 
} from 'date-fns'
import { uk } from 'date-fns/locale'

interface TimeSlot {
  time: string
  available: boolean
  booked?: {
    studentName: string
    type: string
  }
  break?: boolean
  past?: boolean
}

interface TimeSlotPickerProps {
  date: Date
  duration: number
  onSelect: (time: string) => void
  selectedTime?: string
  bookedSlots?: Array<{
    startTime: string
    endTime: string
    studentName: string
    type: string
  }>
  workingHours?: {
    start: string
    end: string
  }
  breakTimes?: Array<{
    start: string
    end: string
  }>
  minInterval?: number // Minimum minutes between slots (default 30)
  showPastSlots?: boolean
  className?: string
}

export function TimeSlotPicker({
  date,
  duration,
  onSelect,
  selectedTime,
  bookedSlots = [],
  workingHours = { start: '08:00', end: '20:00' },
  breakTimes = [{ start: '12:00', end: '13:00' }],
  minInterval = 30,
  showPastSlots = false,
  className
}: TimeSlotPickerProps) {
  const [view, setView] = useState<'morning' | 'afternoon' | 'evening' | 'all'>('all')
  
  // Generate all possible time slots
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = []
    const [startHour, startMinute] = workingHours.start.split(':').map(Number)
    const [endHour, endMinute] = workingHours.end.split(':').map(Number)
    
    let currentTime = setMinutes(setHours(new Date(date), startHour), startMinute)
    const endTime = setMinutes(setHours(new Date(date), endHour), endMinute)
    
    const now = new Date()
    const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    
    while (isBefore(currentTime, endTime)) {
      const timeString = format(currentTime, 'HH:mm')
      const slotEndTime = addMinutes(currentTime, duration)
      
      // Check if slot is in the past
      const isPast = isToday && isBefore(currentTime, now)
      
      // Check if slot is during break time
      const isDuringBreak = breakTimes.some(breakTime => {
        const breakStart = parse(breakTime.start, 'HH:mm', date)
        const breakEnd = parse(breakTime.end, 'HH:mm', date)
        return isWithinInterval(currentTime, { start: breakStart, end: breakEnd }) ||
               isWithinInterval(slotEndTime, { start: breakStart, end: breakEnd })
      })
      
      // Check if slot is booked
      const bookedSlot = bookedSlots.find(booked => {
        const bookedStart = parse(booked.startTime, 'HH:mm', date)
        const bookedEnd = parse(booked.endTime, 'HH:mm', date)
        
        // Check for any overlap
        return !(isAfter(currentTime, bookedEnd) || isBefore(slotEndTime, bookedStart))
      })
      
      slots.push({
        time: timeString,
        available: !isDuringBreak && !bookedSlot && !isPast,
        booked: bookedSlot ? {
          studentName: bookedSlot.studentName,
          type: bookedSlot.type
        } : undefined,
        break: isDuringBreak,
        past: isPast
      })
      
      currentTime = addMinutes(currentTime, minInterval)
    }
    
    return slots
  }, [date, duration, bookedSlots, workingHours, breakTimes, minInterval, showPastSlots])
  
  // Filter slots by time of day
  const filteredSlots = useMemo(() => {
    if (view === 'all') return timeSlots
    
    return timeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      if (view === 'morning') return hour >= 6 && hour < 12
      if (view === 'afternoon') return hour >= 12 && hour < 18
      if (view === 'evening') return hour >= 18
      return true
    })
  }, [timeSlots, view])
  
  // Get available slots count
  const availableCount = timeSlots.filter(s => s.available).length
  const bookedCount = timeSlots.filter(s => s.booked).length
  
  // Calculate end time for selected slot
  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const start = setMinutes(setHours(new Date(), hours), minutes)
    const end = addMinutes(start, duration)
    return format(end, 'HH:mm')
  }
  
  // Group slots by hour for better visualization
  const groupedSlots = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {}
    
    filteredSlots.forEach(slot => {
      const hour = slot.time.split(':')[0] + ':00'
      if (!groups[hour]) {
        groups[hour] = []
      }
      groups[hour].push(slot)
    })
    
    return groups
  }, [filteredSlots])
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">
            {format(date, 'EEEE, d MMMM', { locale: uk })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-600">
            {availableCount} вільно
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-orange-600">
            {bookedCount} зайнято
          </span>
        </div>
      </div>
      
      {/* Time of day filter */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={view === 'all' ? 'default' : 'outline'}
          onClick={() => setView('all')}
        >
          Весь день
        </Button>
        <Button
          size="sm"
          variant={view === 'morning' ? 'default' : 'outline'}
          onClick={() => setView('morning')}
        >
          Ранок
        </Button>
        <Button
          size="sm"
          variant={view === 'afternoon' ? 'default' : 'outline'}
          onClick={() => setView('afternoon')}
        >
          День
        </Button>
        <Button
          size="sm"
          variant={view === 'evening' ? 'default' : 'outline'}
          onClick={() => setView('evening')}
        >
          Вечір
        </Button>
      </div>
      
      {/* Duration info */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Тривалість заняття: <strong>{duration} хвилин</strong>
          {selectedTime && (
            <span className="ml-2">
              ({selectedTime} - {calculateEndTime(selectedTime)})
            </span>
          )}
        </AlertDescription>
      </Alert>
      
      {/* Time slots grid */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {Object.entries(groupedSlots).map(([hour, slots]) => (
            <div key={hour}>
              <Label className="text-sm text-gray-500 mb-2 block">
                {hour}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time
                  const showSlot = showPastSlots || !slot.past
                  
                  if (!showSlot) return null
                  
                  return (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && onSelect(slot.time)}
                      disabled={!slot.available}
                      className={cn(
                        "relative p-3 rounded-lg border-2 transition-all text-sm font-medium",
                        slot.available && !isSelected && 
                          "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer",
                        slot.available && isSelected && 
                          "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
                        slot.booked && 
                          "border-orange-200 bg-orange-50 cursor-not-allowed opacity-75",
                        slot.break && 
                          "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50",
                        slot.past && 
                          "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50 line-through"
                      )}
                    >
                      <span className={cn(
                        slot.available && !isSelected && "text-gray-700",
                        slot.available && isSelected && "text-blue-700",
                        slot.booked && "text-orange-700",
                        slot.break && "text-gray-500",
                        slot.past && "text-gray-400"
                      )}>
                        {slot.time}
                      </span>
                      
                      {/* Status indicators */}
                      {isSelected && (
                        <Check className="absolute top-1 right-1 w-3 h-3 text-blue-600" />
                      )}
                      {slot.booked && (
                        <div className="mt-1">
                          <div className="text-xs text-orange-600 truncate">
                            {slot.booked.studentName}
                          </div>
                        </div>
                      )}
                      {slot.break && (
                        <div className="text-xs text-gray-500 mt-1">
                          Перерва
                        </div>
                      )}
                      {slot.past && (
                        <div className="text-xs text-gray-400 mt-1">
                          Минув
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-200 bg-white" />
          <span className="text-gray-600">Вільно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50" />
          <span className="text-gray-600">Обрано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-orange-200 bg-orange-50" />
          <span className="text-gray-600">Зайнято</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-200 bg-gray-100" />
          <span className="text-gray-600">Перерва</span>
        </div>
      </div>
      
      {/* No available slots message */}
      {availableCount === 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            На жаль, на цю дату немає вільних слотів. 
            Спробуйте обрати інший день або зв'яжіться з адміністратором.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}