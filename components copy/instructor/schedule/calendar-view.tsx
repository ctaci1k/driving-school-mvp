// components/instructor/schedule/calendar-view.tsx
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format, isSameDay, isSameMonth, isToday } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Lesson {
  id: string
  date: Date
  studentName: string
  type: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface CalendarViewProps {
  currentDate: Date
  lessons: Lesson[]
  onDateSelect: (date: Date) => void
  onNavigate: (direction: number) => void
}

export function CalendarView({ currentDate, lessons, onDateSelect, onNavigate }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'LLLL yyyy', { locale: uk })}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => onNavigate(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => onDateSelect(new Date())}>
          Сьогодні
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}