// components/calendar/CalendarView.tsx
'use client'

import { useState } from 'react'
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, Users, 
  MoreHorizontal, Plus 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
  addMonths, subMonths, getDay,
  Locale
} from 'date-fns'
import { pl } from 'date-fns/locale'

interface CalendarEvent {
  id: string
  date: Date
  startTime: string
  endTime: string
  title: string
  type: string
  color: string
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
}

interface CalendarViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onMonthChange?: (date: Date) => void
  onAddEvent?: (date: Date) => void
  showWeekNumbers?: boolean
  locale?: Locale
  className?: string
}

export function CalendarView({
  currentDate,
  events,
  onDateSelect,
  onEventClick,
  onMonthChange,
  onAddEvent,
  showWeekNumbers = false,
  locale = pl,
  className
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Get calendar days
  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date) && event.status !== 'cancelled'
    )
  }

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1)
    onMonthChange?.(newDate)
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const days = getCalendarDays()
  const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']

  // Group days by weeks for week numbers
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className={cn("bg-white rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'LLLL yyyy', { locale })}
          </h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onMonthChange?.(new Date())}
        >
          Dzisiaj
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week days header */}
        <div className={cn(
          "grid gap-px bg-gray-200",
          showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
        )}>
          {showWeekNumbers && (
            <div className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">
              #
            </div>
          )}
          {weekDays.map(day => (
            <div 
              key={day} 
              className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid gap-px bg-gray-200 mt-px">
          {weeks.map((week, weekIdx) => (
            <div 
              key={weekIdx}
              className={cn(
                "grid gap-px",
                showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
              )}
            >
              {showWeekNumbers && (
                <div className="bg-gray-50 p-2 text-center text-xs text-gray-500 font-medium">
                  {getWeekNumber(week[0])}
                </div>
              )}
              {week.map((day, dayIdx) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isHovered = hoveredDate && isSameDay(day, hoveredDate)
                const isTodayDate = isToday(day)
                const isWeekend = getDay(day) === 0 || getDay(day) === 6

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={cn(
                      "min-h-[100px] p-2 bg-white cursor-pointer transition-all relative group",
                      !isCurrentMonth && "text-gray-400 bg-gray-50",
                      isSelected && "ring-2 ring-blue-500 ring-inset bg-blue-50",
                      isHovered && !isSelected && "bg-gray-50",
                      isTodayDate && "bg-blue-50",
                      isWeekend && "bg-gray-50/50"
                    )}
                  >
                    {/* Date number */}
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "text-sm font-medium",
                        isTodayDate && "text-blue-600 font-bold",
                        !isCurrentMonth && "text-gray-400"
                      )}>
                        {format(day, 'd')}
                      </span>
                      
                      {/* Event count badge */}
                      {dayEvents.length > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-1.5 py-0 h-5"
                        >
                          {dayEvents.length}
                        </Badge>
                      )}
                      
                      {/* Add event button (shown on hover) */}
                      {onAddEvent && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 absolute top-1 right-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddEvent(day)
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Events */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity",
                            "text-white font-medium"
                          )}
                          style={{ backgroundColor: event.color }}
                        >
                          <span className="mr-1">{event.startTime}</span>
                          <span>{event.title}</span>
                        </div>
                      ))}
                      
                      {/* More events indicator */}
                      {dayEvents.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Could open a popover with all events
                            onDateSelect?.(day)
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-0.5"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                          <span>+{dayEvents.length - 3} więcej</span>
                        </button>
                      )}
                    </div>

                    {/* Today indicator */}
                    {isTodayDate && (
                      <div className="absolute top-1 left-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer with statistics */}
      <div className="border-t p-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{events.length} lekcji</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{events.filter(e => e.status === 'scheduled').length} zaplanowanych</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{new Set(events.map(e => e.title)).size} kursantów</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs">Praktyka</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-xs">Teoria</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-xs">Egzamin</span>
          </div>
        </div>
      </div>
    </div>
  )
}