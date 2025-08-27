// components/instructor/schedule/lesson-modal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MessageSquare, Navigation, Calendar } from 'lucide-react'

interface LessonModalProps {
  lesson: any
  open: boolean
  onClose: () => void
}

export function LessonModal({ lesson, open, onClose }: LessonModalProps) {
  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Деталі заняття</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={lesson.student.avatar} />
              <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{lesson.student.name}</h3>
              <p className="text-sm text-gray-500">{lesson.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Дзвонити
            </Button>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Повідомлення
            </Button>
            <Button variant="outline">
              <Navigation className="w-4 h-4 mr-2" />
              Маршрут
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Перенести
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}