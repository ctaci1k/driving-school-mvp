// /app/[locale]/instructor/schedule/exceptions/page.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar, Plus, X, AlertCircle, Plane, Heart,
  Briefcase, GraduationCap, Home, Clock, Edit, Trash2,
  ChevronLeft, ChevronRight, CalendarX
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function InstructorExceptionsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  
  const [newException, setNewException] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    recurring: false,
    recurringType: 'weekly'
  })

  // Mock exceptions data
  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      type: 'vacation',
      title: 'Відпустка',
      startDate: '2024-02-15',
      endDate: '2024-02-22',
      reason: 'Щорічна відпустка',
      icon: Plane,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      type: 'sick',
      title: 'Лікарняний',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      reason: 'Медичний огляд',
      icon: Heart,
      color: 'bg-red-100 text-red-700'
    },
    {
      id: 3,
      type: 'personal',
      title: 'Особисті справи',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      reason: 'Сімейні обставини',
      icon: Home,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 4,
      type: 'training',
      title: 'Навчання',
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      reason: 'Курси підвищення кваліфікації',
      icon: GraduationCap,
      color: 'bg-green-100 text-green-700'
    }
  ])

  const exceptionTypes = [
    { value: 'vacation', label: 'Відпустка', icon: Plane },
    { value: 'sick', label: 'Лікарняний', icon: Heart },
    { value: 'personal', label: 'Особисті справи', icon: Home },
    { value: 'training', label: 'Навчання', icon: GraduationCap },
    { value: 'business', label: 'Відрядження', icon: Briefcase },
    { value: 'other', label: 'Інше', icon: CalendarX }
  ]

  // Calendar generation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handleAddException = () => {
    const type = exceptionTypes.find(t => t.value === newException.type)
    const newExc = {
      id: exceptions.length + 1,
      type: newException.type,
      title: type?.label || '',
      startDate: newException.startDate,
      endDate: newException.endDate,
      reason: newException.reason,
      icon: type?.icon || CalendarX,
      color: getExceptionColor(newException.type)
    }
    
    setExceptions([...exceptions, newExc])
    setShowAddDialog(false)
    setNewException({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      recurring: false,
      recurringType: 'weekly'
    })
  }

  const getExceptionColor = (type: string) => {
    const colors: Record<string, string> = {
      vacation: 'bg-blue-100 text-blue-700',
      sick: 'bg-red-100 text-red-700',
      personal: 'bg-purple-100 text-purple-700',
      training: 'bg-green-100 text-green-700',
      business: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const deleteException = (id: number) => {
    setExceptions(exceptions.filter(exc => exc.id !== id))
  }

  const hasException = (date: Date) => {
    return exceptions.some(exc => {
      const start = new Date(exc.startDate)
      const end = new Date(exc.endDate)
      return date >= start && date <= end
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Винятки в розкладі</h1>
          <p className="text-gray-600 mt-1">Керуйте відпустками, вихідними та іншими винятками</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Додати виняток
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новий виняток в розкладі</DialogTitle>
              <DialogDescription>
                Вкажіть період, коли ви будете недоступні для занять
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Тип</Label>
                <Select
                  value={newException.type}
                  onValueChange={(value) => setNewException(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {exceptionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Дата початку</Label>
                  <Input
                    type="date"
                    value={newException.startDate}
                    onChange={(e) => setNewException(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Дата завершення</Label>
                  <Input
                    type="date"
                    value={newException.endDate}
                    onChange={(e) => setNewException(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Причина (опціонально)</Label>
                <Textarea
                  value={newException.reason}
                  onChange={(e) => setNewException(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Додаткова інформація..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Скасувати
              </Button>
              <Button onClick={handleAddException}>
                Додати
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Календар</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium">
                {format(currentMonth, 'LLLL yyyy', { locale: uk })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {monthDays.map(day => {
              const hasExc = hasException(day)
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={day.toString()}
                  className={`
                    aspect-square p-2 rounded-lg text-center cursor-pointer transition-all
                    ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                    ${hasExc ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exceptions */}
      <Card>
        <CardHeader>
          <CardTitle>Заплановані винятки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exceptions.map(exception => (
              <div
                key={exception.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${exception.color}`}>
                    <exception.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{exception.title}</p>
                    <p className="text-sm text-gray-500">
                      {exception.startDate === exception.endDate
                        ? format(new Date(exception.startDate), 'd MMMM yyyy', { locale: uk })
                        : `${format(new Date(exception.startDate), 'd MMM', { locale: uk })} - ${format(new Date(exception.endDate), 'd MMM yyyy', { locale: uk })}`
                      }
                    </p>
                    {exception.reason && (
                      <p className="text-sm text-gray-600 mt-1">{exception.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteException(exception.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {exceptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CalendarX className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Немає запланованих винятків</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Цього місяця</p>
                <p className="text-2xl font-bold">
                  {exceptions.filter(e => {
                    const date = new Date(e.startDate)
                    return isSameMonth(date, currentMonth)
                  }).length} днів
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Наступний виняток</p>
                <p className="text-lg font-bold">
                  {exceptions.find(e => new Date(e.startDate) > new Date())?.title || 'Немає'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всього за рік</p>
                <p className="text-2xl font-bold">18 днів</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}