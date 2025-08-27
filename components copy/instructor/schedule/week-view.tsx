// components/instructor/schedule/week-view.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface WeekViewProps {
  currentWeek: Date
  lessons: any[]
  onLessonClick: (lesson: any) => void
}

export function WeekView({ currentWeek, lessons, onLessonClick }: WeekViewProps) {
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8)

  return (
    <div className="grid grid-cols-8 gap-px bg-gray-200">
      <div className="bg-white p-2"></div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="bg-white p-2 text-center text-sm font-medium">
          {format(new Date(), 'EEE d', { locale: uk })}
        </div>
      ))}
      
      {timeSlots.map(hour => (
        <>
          <div key={hour} className="bg-white p-2 text-sm text-gray-500">
            {hour}:00
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`${hour}-${i}`} className="bg-white p-1 min-h-[60px] hover:bg-gray-50" />
          ))}
        </>
      ))}
    </div>
  )
}