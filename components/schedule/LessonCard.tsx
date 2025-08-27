// components/schedule/LessonCard.tsx
'use client'

import { 
  Clock, MapPin, Phone, MessageSquare, MoreVertical,
  User, Calendar, AlertCircle, CheckCircle, XCircle,
  DollarSign, Car, Navigation, Edit, Trash2, Copy
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export interface LessonData {
  id: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  student: {
    id: string
    name: string
    avatar?: string
    phone: string
    progress: number
    category?: string
    lessonsCompleted?: number
  }
  type: 'city' | 'highway' | 'parking' | 'exam-prep' | 'night' | 'theory'
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  location: string
  vehicle?: {
    model: string
    number: string
  }
  payment?: {
    status: 'paid' | 'pending' | 'overdue'
    amount: number
  }
  notes?: string
  recurring?: boolean
  rating?: number
}

interface LessonCardProps {
  lesson: LessonData
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onEdit?: (lesson: LessonData) => void
  onDelete?: (lesson: LessonData) => void
  onDuplicate?: (lesson: LessonData) => void
  onCall?: (lesson: LessonData) => void
  onMessage?: (lesson: LessonData) => void
  onNavigate?: (lesson: LessonData) => void
  onClick?: (lesson: LessonData) => void
  className?: string
}

const lessonTypeConfig = {
  'city': { 
    label: 'Місто', 
    color: 'bg-blue-500', 
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
    icon: '🏙️' 
  },
  'highway': { 
    label: 'Траса', 
    color: 'bg-green-500', 
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    icon: '🛣️' 
  },
  'parking': { 
    label: 'Паркування', 
    color: 'bg-purple-500', 
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    icon: '🅿️' 
  },
  'exam-prep': { 
    label: 'Підготовка до іспиту', 
    color: 'bg-orange-500', 
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50',
    icon: '📝' 
  },
  'night': { 
    label: 'Нічна їзда', 
    color: 'bg-indigo-500', 
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-50',
    icon: '🌙' 
  },
  'theory': { 
    label: 'Теорія', 
    color: 'bg-yellow-500', 
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50',
    icon: '📚' 
  }
}

const statusConfig = {
  'scheduled': { 
    label: 'Заплановано', 
    color: 'secondary',
    icon: Calendar 
  },
  'confirmed': { 
    label: 'Підтверджено', 
    color: 'default',
    icon: CheckCircle 
  },
  'in-progress': { 
    label: 'Триває', 
    color: 'default',
    icon: Clock,
    pulse: true 
  },
  'completed': { 
    label: 'Завершено', 
    color: 'success',
    icon: CheckCircle 
  },
  'cancelled': { 
    label: 'Скасовано', 
    color: 'destructive',
    icon: XCircle 
  }
}

export function LessonCard({
  lesson,
  variant = 'default',
  showActions = true,
  onEdit,
  onDelete,
  onDuplicate,
  onCall,
  onMessage,
  onNavigate,
  onClick,
  className
}: LessonCardProps) {
  const typeConfig = lessonTypeConfig[lesson.type]
  const statusConfig_ = statusConfig[lesson.status]
  const StatusIcon = statusConfig_.icon

  const handleCardClick = () => {
    if (onClick) {
      onClick(lesson)
    }
  }

  // Compact variant - for calendar views
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "p-2 rounded-lg cursor-pointer hover:opacity-90 transition-all",
          typeConfig.color,
          "text-white text-xs font-medium",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-1">
          <span>{typeConfig.icon}</span>
          <span>{lesson.startTime}</span>
          <span className="truncate">{lesson.student.name.split(' ')[0]}</span>
        </div>
      </div>
    )
  }

  // Detailed variant - for day/week views
  if (variant === 'detailed') {
    return (
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all border-l-4",
          typeConfig.borderColor,
          lesson.status === 'in-progress' && "ring-2 ring-blue-500 shadow-lg",
          lesson.status === 'cancelled' && "opacity-60",
          className
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {lesson.student.avatar && (
                  <AvatarImage src={lesson.student.avatar} />
                )}
<AvatarFallback>
  {lesson.student?.name ? 
    lesson.student.name.split(' ').map(n => n[0]).join('') : 
    'NA'
  }
</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{lesson.student.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.startTime} - {lesson.endTime}</span>
                  <span className="text-gray-400">•</span>
                  <span>{lesson.duration} хв</span>
                </div>
              </div>
            </div>

            {showActions && (
              <div className="flex items-center gap-1">
                {lesson.status === 'in-progress' && (
                  <Badge variant="default" className="animate-pulse">
                    <Clock className="w-3 h-3 mr-1" />
                    Триває
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Дії</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(lesson)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
                      </DropdownMenuItem>
                    )}
                    {onDuplicate && (
                      <DropdownMenuItem onClick={() => onDuplicate(lesson)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Дублювати
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(lesson)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Видалити
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {/* Type and Location */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>{typeConfig.icon}</span>
                <span className="font-medium">{typeConfig.label}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{lesson.location}</span>
              </div>
            </div>

            {/* Vehicle */}
            {lesson.vehicle && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Car className="w-3 h-3" />
                <span>{lesson.vehicle.model} • {lesson.vehicle.number}</span>
              </div>
            )}

            {/* Student progress */}
            {lesson.student.progress !== undefined && (
              <div className="flex items-center gap-2">
                <Progress value={lesson.student.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-gray-500">{lesson.student.progress}%</span>
              </div>
            )}

            {/* Notes */}
            {lesson.notes && (
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                {lesson.notes}
              </div>
            )}

            {/* Payment status */}
            {lesson.payment && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">₴{lesson.payment.amount}</span>
                </div>
                <Badge variant={
                  lesson.payment.status === 'paid' ? 'default' :
                  lesson.payment.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {lesson.payment.status === 'paid' ? 'Оплачено' :
                   lesson.payment.status === 'pending' ? 'Очікує' : 'Прострочено'}
                </Badge>
              </div>
            )}

            {/* Action buttons */}
            {showActions && (
              <div className="flex gap-2 pt-3">
                {onCall && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCall(lesson)
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Дзвонити
                  </Button>
                )}
                {onMessage && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMessage(lesson)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Повідомлення
                  </Button>
                )}
                {onNavigate && lesson.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate(lesson)
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Маршрут
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant - for lists
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer",
        lesson.status === 'in-progress' && "ring-2 ring-blue-500",
        lesson.status === 'cancelled' && "opacity-60",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-1 h-12 rounded", typeConfig.color)} />
        <Avatar className="h-10 w-10">
          {lesson.student.avatar && (
            <AvatarImage src={lesson.student.avatar} />
          )}
          <AvatarFallback>
            {lesson.student.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{lesson.student.name}</p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.startTime} - {lesson.endTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lesson.location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={cn(typeConfig.bgColor, "text-gray-900 border-0")}>
          {typeConfig.icon} {typeConfig.label}
        </Badge>
        {lesson.recurring && (
          <Badge variant="outline">Повтор</Badge>
        )}
        {lesson.payment && (
          <Badge variant={
            lesson.payment.status === 'paid' ? 'default' :
            lesson.payment.status === 'pending' ? 'secondary' : 'destructive'
          }>
            ₴{lesson.payment.amount}
          </Badge>
        )}
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(lesson)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редагувати
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(lesson)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Дублювати
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(lesson)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Видалити
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}