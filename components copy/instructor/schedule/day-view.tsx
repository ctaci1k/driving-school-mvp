// components/instructor/schedule/day-view.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, MapPin, Phone } from 'lucide-react'
import { format } from 'date-fns'

interface DayViewProps {
  date: Date
  lessons: any[]
  onLessonClick: (lesson: any) => void
}

export function DayView({ date, lessons, onLessonClick }: DayViewProps) {
  return (
    <div className="space-y-4">
      {lessons.map(lesson => (
        <Card key={lesson.id} className="p-4 cursor-pointer hover:shadow-md" onClick={() => onLessonClick(lesson)}>
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={lesson.student.avatar} />
                <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{lesson.student.name}</h3>
                <p className="text-sm text-gray-500">{lesson.type}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(lesson.date, 'HH:mm')} - {lesson.duration} хв
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {lesson.location}
                  </span>
                </div>
              </div>
            </div>
            <Badge>{lesson.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}