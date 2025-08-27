// app/[locale]/instructor/schedule/page.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar as CalendarIcon, Clock, Users, MapPin, Car,
  ChevronLeft, ChevronRight, Plus, Filter, Search,
  MoreVertical, Edit, Trash2, Copy, X, Check,
  AlertCircle, Phone, MessageSquare, Navigation,
  Grid3x3, List, CalendarDays, Settings2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
         isSameMonth, isSameDay, isToday, addMonths, subMonths, 
         addWeeks, subWeeks, getDay, setHours, setMinutes, addDays,
         startOfDay, endOfDay, isWithinInterval, parse } from 'date-fns'
import { uk } from 'date-fns/locale'

// Import custom components
import { CalendarView } from '@/components/calendar/CalendarView'
import { LessonCard } from '@/components/schedule/LessonCard'
import { QuickBooking } from '@/components/schedule/QuickBooking'
import { TimeSlotPicker } from '@/components/schedule/TimeSlotPicker'
import { StudentSelector } from '@/components/schedule/StudentSelector'
import { LessonTypeSelector } from '@/components/schedule/LessonTypeSelector'
import { RecurringLessonDialog } from '@/components/schedule/RecurringLessonDialog'

interface Lesson {
  id: string
  date: Date
  startTime: string
  endTime: string
  student: {
    id: string
    name: string
    avatar: string
    phone: string
    progress: number
    category: string
  }
  type: 'city' | 'highway' | 'parking' | 'exam-prep' | 'night' | 'theory'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  location: string
  notes?: string
  recurring?: {
    id: string
    pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly'
    endDate: Date
    exceptions?: Date[]
  }
  payment?: {
    status: 'paid' | 'pending' | 'overdue'
    amount: number
  }
}

const lessonTypes = {
  'city': { label: 'Місто', color: 'bg-blue-500', icon: '🏙️' },
  'highway': { label: 'Траса', color: 'bg-green-500', icon: '🛣️' },
  'parking': { label: 'Паркування', color: 'bg-purple-500', icon: '🅿️' },
  'exam-prep': { label: 'Підготовка до іспиту', color: 'bg-orange-500', icon: '📝' },
  'night': { label: 'Нічна їзда', color: 'bg-indigo-500', icon: '🌙' },
  'theory': { label: 'Теорія', color: 'bg-yellow-500', icon: '📚' }
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
]

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showRecurringDialog, setShowRecurringDialog] = useState(false)
  const [showQuickBooking, setShowQuickBooking] = useState(false)
  const [showTimeSlotPicker, setShowTimeSlotPicker] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - lessons for the month
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      date: new Date(2024, 1, 5, 9, 0),
      startTime: '09:00',
      endTime: '10:30',
      student: {
        id: 's1',
        name: 'Марія Шевчук',
        avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
        phone: '+380501234567',
        progress: 85,
        category: 'B'
      },
      type: 'exam-prep',
      status: 'confirmed',
      location: 'вул. Шевченка, 100',
      notes: 'Фінальна підготовка до іспиту',
      payment: { status: 'paid', amount: 400 }
    },
    {
      id: '2',
      date: new Date(2024, 1, 5, 11, 0),
      startTime: '11:00',
      endTime: '12:30',
      student: {
        id: 's2',
        name: 'Іван Петренко',
        avatar: 'https://ui-avatars.com/api/?name=IP&background=3B82F6&color=fff',
        phone: '+380501234568',
        progress: 45,
        category: 'B'
      },
      type: 'city',
      status: 'scheduled',
      location: 'вул. Хрещатик, 1',
      recurring: {
        id: 'rec1',
        pattern: 'weekly',
        endDate: new Date(2024, 2, 5)
      },
      payment: { status: 'pending', amount: 350 }
    },
    {
      id: '3',
      date: new Date(2024, 1, 6, 14, 0),
      startTime: '14:00',
      endTime: '15:30',
      student: {
        id: 's3',
        name: 'Олена Коваленко',
        avatar: 'https://ui-avatars.com/api/?name=OK&background=EC4899&color=fff',
        phone: '+380501234569',
        progress: 65,
        category: 'B'
      },
      type: 'parking',
      status: 'confirmed',
      location: 'Майданчик',
      notes: 'Паралельне паркування',
      payment: { status: 'paid', amount: 350 }
    },
    {
      id: '4',
      date: new Date(2024, 1, 7, 16, 0),
      startTime: '16:00',
      endTime: '17:30',
      student: {
        id: 's4',
        name: 'Андрій Бондаренко',
        avatar: 'https://ui-avatars.com/api/?name=AB&background=F59E0B&color=fff',
        phone: '+380501234570',
        progress: 55,
        category: 'B'
      },
      type: 'highway',
      status: 'scheduled',
      location: 'Київ-Житомир',
      payment: { status: 'overdue', amount: 400 }
    }
  ])

  // Form state for new/edit lesson
  const [lessonForm, setLessonForm] = useState({
    studentId: '',
    date: new Date(),
    startTime: '09:00',
    duration: 90,
    type: 'city' as Lesson['type'],
    location: '',
    notes: '',
    recurring: false,
    recurringPattern: 'weekly' as 'daily' | 'weekly' | 'biweekly' | 'monthly',
    recurringEndDate: addMonths(new Date(), 1),
    sendReminder: true,
    reminderTime: '1-day' // 1-day, 2-hours, 30-min
  })

  // Filter state
  const [filters, setFilters] = useState({
    student: 'all',
    type: 'all',
    status: 'all'
  })

  // Mock students data
  const students = [
    { id: 's1', name: 'Марія Шевчук', progress: 85, avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff', phone: '+380501234567', category: 'B' },
    { id: 's2', name: 'Іван Петренко', progress: 45, avatar: 'https://ui-avatars.com/api/?name=IP&background=3B82F6&color=fff', phone: '+380501234568', category: 'B' },
    { id: 's3', name: 'Олена Коваленко', progress: 65, avatar: 'https://ui-avatars.com/api/?name=OK&background=EC4899&color=fff', phone: '+380501234569', category: 'B' },
    { id: 's4', name: 'Андрій Бондаренко', progress: 55, avatar: 'https://ui-avatars.com/api/?name=AB&background=F59E0B&color=fff', phone: '+380501234570', category: 'B' },
    { id: 's5', name: 'Наталія Гриценко', progress: 70, avatar: 'https://ui-avatars.com/api/?name=NG&background=8B5CF6&color=fff', phone: '+380501234571', category: 'B' },
    { id: 's6', name: 'Сергій Мельник', progress: 40, avatar: 'https://ui-avatars.com/api/?name=SM&background=EF4444&color=fff', phone: '+380501234572', category: 'B' }
  ]

  // Get calendar days
  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  // Get week days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  // Get lessons for a specific day
  const getLessonsForDay = (date: Date) => {
    return lessons.filter(lesson => 
      isSameDay(lesson.date, date) && lesson.status !== 'cancelled'
    )
  }

  // Navigate calendar
  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1))
    }
  }

  // Handle lesson creation
  const handleCreateLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      date: lessonForm.date,
      startTime: lessonForm.startTime,
      endTime: calculateEndTime(lessonForm.startTime, lessonForm.duration),
      student: students.find(s => s.id === lessonForm.studentId)!,
      type: lessonForm.type,
      status: 'scheduled',
      location: lessonForm.location,
      notes: lessonForm.notes,
      payment: { status: 'pending', amount: 350 }
    }

    if (lessonForm.recurring) {
      // Create recurring lessons
      const endDate = lessonForm.recurringEndDate
      let currentLessonDate = new Date(lessonForm.date)
      const recurringLessons: Lesson[] = []

      while (currentLessonDate <= endDate) {
        recurringLessons.push({
          ...newLesson,
          id: `lesson-${Date.now()}-${recurringLessons.length}`,
          date: new Date(currentLessonDate),
          recurring: {
            id: `rec-${Date.now()}`,
            pattern: lessonForm.recurringPattern,
            endDate: endDate
          }
        })

        // Calculate next date based on pattern
        if (lessonForm.recurringPattern === 'daily') {
          currentLessonDate = addDays(currentLessonDate, 1)
        } else if (lessonForm.recurringPattern === 'weekly') {
          currentLessonDate = addDays(currentLessonDate, 7)
        } else if (lessonForm.recurringPattern === 'biweekly') {
          currentLessonDate = addDays(currentLessonDate, 14)
        } else if (lessonForm.recurringPattern === 'monthly') {
          currentLessonDate = addMonths(currentLessonDate, 1)
        }
      }

      setLessons([...lessons, ...recurringLessons])
    } else {
      setLessons([...lessons, newLesson])
    }

    setShowAddDialog(false)
    resetForm()
  }

  // Calculate end time
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  // Reset form
  const resetForm = () => {
    setLessonForm({
      studentId: '',
      date: new Date(),
      startTime: '09:00',
      duration: 90,
      type: 'city',
      location: '',
      notes: '',
      recurring: false,
      recurringPattern: 'weekly',
      recurringEndDate: addMonths(new Date(), 1),
      sendReminder: true,
      reminderTime: '1-day'
    })
  }

  // Delete lesson
  const handleDeleteLesson = (lessonId: string, deleteAll: boolean = false) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson?.recurring && deleteAll) {
      // Delete all recurring lessons
      setLessons(lessons.filter(l => l.recurring?.id !== lesson.recurring?.id))
    } else {
      // Delete single lesson
      setLessons(lessons.filter(l => l.id !== lessonId))
    }
    setSelectedLesson(null)
  }

  // Render calendar grid
  const renderCalendarGrid = () => {
    const days = getCalendarDays()
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

    return (
      <div className="bg-white rounded-lg">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
              {/* Quick Booking */}
      <Button 
        variant="outline"
        className="fixed bottom-20 right-4 lg:bottom-4 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={() => setShowQuickBooking(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Quick Booking Modal */}
      <Dialog open={showQuickBooking} onOpenChange={setShowQuickBooking}>
        <DialogContent className="max-w-2xl">
          <QuickBooking
            students={students.map(s => ({
              id: s.id,
              name: s.name,
              progress: s.progress || 0
            }))}
            selectedDate={selectedDate || new Date()}
            onSubmit={(booking) => {
              const student = students.find(s => s.id === booking.studentId)
              if (student) {
                const newLesson: Lesson = {
                  id: `lesson-${Date.now()}`,
                  date: booking.date,
                  startTime: booking.startTime,
                  endTime: calculateEndTime(booking.startTime, booking.duration),
                  student: {
                    ...student,
                    avatar: `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=10B981&color=fff`,
                    phone: '+380501234567',
                    progress: student.progress || 0,
                    category: 'B'
                  },
                  type: booking.type,
                  status: 'scheduled',
                  location: booking.location,
                  notes: booking.notes,
                  payment: { status: 'pending', amount: 350 }
                }
                setLessons([...lessons, newLesson])
              }
              setShowQuickBooking(false)
            }}
            onCancel={() => setShowQuickBooking(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Recurring Lesson Dialog */}
      <RecurringLessonDialog
        open={lessonForm.recurring && showRecurringDialog}
        onOpenChange={setShowRecurringDialog}
        onConfirm={(recurringData) => {
          // Handle recurring lesson creation
          console.log('Recurring data:', recurringData)
          handleCreateLesson()
        }}
        startDate={lessonForm.date}
        startTime={lessonForm.startTime}
        duration={lessonForm.duration}
        studentName={students.find(s => s.id === lessonForm.studentId)?.name}
        lessonType={lessonTypes[lessonForm.type as keyof typeof lessonTypes]?.label}
      />
    </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, idx) => {
            const dayLessons = getLessonsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isSelectedDay = selectedDate && isSameDay(day, selectedDate)
            const isTodayDay = isToday(day)

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`
                  min-h-[100px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors
                  ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                  ${isSelectedDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${isTodayDay ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${isTodayDay ? 'text-blue-600' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayLessons.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayLessons.length}
                    </Badge>
                  )}
                </div>

                {/* Mini lesson indicators */}
                <div className="space-y-1">
                  {dayLessons.slice(0, 3).map(lesson => (
                    <div
                      key={lesson.id}
                      className={`text-xs p-1 rounded truncate ${lessonTypes[lesson.type].color} text-white`}
                    >
                      {lesson.startTime} {lesson.student.name.split(' ')[0]}
                    </div>
                  ))}
                  {dayLessons.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayLessons.length - 3} більше
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const days = getWeekDays()
    const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8:00 to 20:00

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-center text-sm font-medium text-gray-700 border-r">
            Час
          </div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`p-2 text-center border-r ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <div className="text-sm font-medium text-gray-700">
                {format(day, 'EEE', { locale: uk })}
              </div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <ScrollArea className="h-[600px]">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-sm text-gray-500 border-r">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {days.map((day, dayIdx) => {
                const dayLessons = getLessonsForDay(day).filter(lesson => {
                  const lessonHour = parseInt(lesson.startTime.split(':')[0])
                  return lessonHour === hour
                })

                return (
                  <div key={dayIdx} className="p-1 border-r min-h-[60px] relative">
                    {dayLessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={`absolute inset-x-1 p-2 rounded text-xs text-white ${lessonTypes[lesson.type].color} cursor-pointer hover:opacity-90`}
                        style={{
                          top: `${(parseInt(lesson.startTime.split(':')[1]) / 60) * 60}px`,
                          height: `${((parseInt(lesson.endTime.split(':')[0]) * 60 + parseInt(lesson.endTime.split(':')[1])) - 
                                     (parseInt(lesson.startTime.split(':')[0]) * 60 + parseInt(lesson.startTime.split(':')[1]))) * 1}px`,
                          minHeight: '40px'
                        }}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="font-medium truncate">{lesson.student.name}</div>
                        <div className="truncate">{lessonTypes[lesson.type].label}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </ScrollArea>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 8)
    const dayLessons = getLessonsForDay(currentDate)

    return (
      <div className="bg-white rounded-lg">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'EEEE, d MMMM yyyy', { locale: uk })}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {dayLessons.length} {dayLessons.length === 1 ? 'заняття' : 'занять'}
          </p>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="p-4">
            {hours.map(hour => {
              const hourLessons = dayLessons.filter(lesson => 
                parseInt(lesson.startTime.split(':')[0]) === hour
              )

              return (
                <div key={hour} className="flex gap-4 mb-4">
                  <div className="w-20 text-sm text-gray-500 pt-2">
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </div>
                  <div className="flex-1">
                    {hourLessons.length > 0 ? (
                      <div className="space-y-2">
                  {dayLessons.map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      lesson={{
                        ...lesson,
                        duration: 90,
                        student: {
                          ...lesson.student,
                          lessonsCompleted: 10
                        },
                        recurring: !!lesson.recurring
                      }}
                      variant="detailed"
                      onEdit={(l) => {
                        setSelectedLesson(lessons.find(les => les.id === l.id) || null)
                        setShowAddDialog(true)
                      }}
                      onDelete={(l) => handleDeleteLesson(l.id)}
                      onCall={(l) => console.log('Call:', l)}
                      onMessage={(l) => console.log('Message:', l)}
                      onNavigate={(l) => console.log('Navigate:', l)}
                      onClick={(l) => setSelectedLesson(lessons.find(les => les.id === l.id) || null)}
                    />
                  ))}
                      </div>
                    ) : (
                      <div className="h-16 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                           onClick={() => {
                             setLessonForm(prev => ({
                               ...prev,
                               date: currentDate,
                               startTime: `${hour.toString().padStart(2, '0')}:00`
                             }))
                             setShowAddDialog(true)
                           }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Додати заняття
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Render list view
  const renderListView = () => {
    const sortedLessons = [...lessons].sort((a, b) => a.date.getTime() - b.date.getTime())
    const groupedLessons = sortedLessons.reduce((acc, lesson) => {
      const dateKey = format(lesson.date, 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(lesson)
      return acc
    }, {} as Record<string, Lesson[]>)

    return (
      <div className="space-y-4">
        {Object.entries(groupedLessons).map(([dateKey, dateLessons]) => (
          <Card key={dateKey}>
            <CardHeader>
              <CardTitle className="text-base">
                {format(new Date(dateKey), 'EEEE, d MMMM', { locale: uk })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
            {dateLessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                lesson={{
                  ...lesson,
                  duration: 90,
                  student: {
                    ...lesson.student,
                    lessonsCompleted: 10
                  },
                  recurring: !!lesson.recurring
                }}
                variant="default"
                onEdit={(l) => {
                  setSelectedLesson(lessons.find(les => les.id === l.id) || null)
                  setShowAddDialog(true)
                }}
                onDelete={(l) => handleDeleteLesson(l.id)}
                onClick={(l) => setSelectedLesson(lessons.find(les => les.id === l.id) || null)}
              />
            ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Календар занять</h1>
          <p className="text-gray-600 mt-1">
            Керуйте розкладом та плануйте заняття
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Фільтри
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Додати заняття
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label>Студент</Label>
                <Select value={filters.student} onValueChange={(value) => setFilters(prev => ({ ...prev, student: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі студенти</SelectItem>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>Тип заняття</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі типи</SelectItem>
                    {Object.entries(lessonTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>Статус</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі статуси</SelectItem>
                    <SelectItem value="scheduled">Заплановано</SelectItem>
                    <SelectItem value="confirmed">Підтверджено</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                    <SelectItem value="cancelled">Скасовано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigateCalendar('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {view === 'month' && format(currentDate, 'LLLL yyyy', { locale: uk })}
                {view === 'week' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: uk })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: uk })}`}
                {view === 'day' && format(currentDate, 'EEEE, d MMMM yyyy', { locale: uk })}
                {view === 'list' && 'Список занять'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => navigateCalendar('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Сьогодні
              </Button>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
              <TabsList>
                <TabsTrigger value="month">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Місяць
                </TabsTrigger>
                <TabsTrigger value="week">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Тиждень
                </TabsTrigger>
                <TabsTrigger value="day">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  День
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="w-4 h-4 mr-2" />
                  Список
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
        {view === 'month' && (
          <CalendarView 
            currentDate={currentDate}
            events={lessons.map(lesson => ({
              id: lesson.id,
              date: lesson.date,
              startTime: lesson.startTime,
              endTime: lesson.endTime,
              title: lesson.student.name,
              type: lesson.type,
              color: lessonTypes[lesson.type].color.replace('bg-', '#').replace('500', ''),
              status: lesson.status
            }))}
            onDateSelect={setSelectedDate}
            onEventClick={(event) => {
              const lesson = lessons.find(l => l.id === event.id)
              if (lesson) setSelectedLesson(lesson)
            }}
            onMonthChange={setCurrentDate}
            onAddEvent={(date) => {
              setLessonForm(prev => ({ ...prev, date }))
              setShowAddDialog(true)
            }}
            showWeekNumbers={true}
          />
        )}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
          {view === 'list' && renderListView()}
        </CardContent>
      </Card>

      {/* Add/Edit Lesson Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Додати нове заняття</DialogTitle>
            <DialogDescription>
              Заповніть інформацію про заняття
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Student Selector using custom component */}
            <StudentSelector
              students={students.map(s => ({
                ...s,
                id: s.id,
                name: s.name,
                phone: '+380501234567',
                category: 'B',
                status: 'active',
                progress: s.progress || 0,
                lessonsCompleted: 10,
                lessonsTotal: 30
              }))}
              value={lessonForm.studentId}
              onChange={(studentId) => setLessonForm(prev => ({ ...prev, studentId }))}
              showDetails={true}
              showSearch={true}
            />

            {/* Lesson Type Selector using custom component */}
            <LessonTypeSelector
              value={lessonForm.type}
              onChange={(type) => {
                const lessonTypeData = Object.entries(lessonTypes).find(([key]) => key === type)?.[1]
                setLessonForm(prev => ({ 
                  ...prev, 
                  type: type as Lesson['type'],
                  duration: lessonTypeData ? 90 : 90
                }))
              }}
              studentProgress={50}
              variant="grid"
            />

            {/* Time Slot Picker using custom component */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Дата</Label>
                <Input
                  type="date"
                  value={format(lessonForm.date, 'yyyy-MM-dd')}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, date: new Date(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Час</Label>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => setShowTimeSlotPicker(true)}
                >
                  {lessonForm.startTime}
                  <Clock className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Time Slot Picker Dialog */}
            {showTimeSlotPicker && (
              <Dialog open={showTimeSlotPicker} onOpenChange={setShowTimeSlotPicker}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Оберіть час</DialogTitle>
                  </DialogHeader>
                  <TimeSlotPicker
                    date={lessonForm.date}
                    duration={lessonForm.duration}
                    selectedTime={lessonForm.startTime}
                    onSelect={(time) => {
                      setLessonForm(prev => ({ ...prev, startTime: time }))
                      setShowTimeSlotPicker(false)
                    }}
                    bookedSlots={lessons.filter(l => isSameDay(l.date, lessonForm.date)).map(l => ({
                      startTime: l.startTime,
                      endTime: l.endTime,
                      studentName: l.student.name,
                      type: lessonTypes[l.type].label
                    }))}
                  />
                </DialogContent>
              </Dialog>
            )}

            <div>
              <Label>Локація</Label>
              <Input
                value={lessonForm.location}
                onChange={(e) => setLessonForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Вкажіть місце зустрічі"
              />
            </div>

            <div>
              <Label>Нотатки</Label>
              <Textarea
                value={lessonForm.notes}
                onChange={(e) => setLessonForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Додаткова інформація..."
                rows={3}
              />
            </div>

            <Separator />

            {/* Recurring options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={lessonForm.recurring}
                  onCheckedChange={(checked) => setLessonForm(prev => ({ ...prev, recurring: checked as boolean }))}
                />
                <Label>Повторювати заняття</Label>
              </div>

              {lessonForm.recurring && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label>Частота повторення</Label>
                    <Select value={lessonForm.recurringPattern} onValueChange={(value) => setLessonForm(prev => ({ ...prev, recurringPattern: value as typeof lessonForm.recurringPattern }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Щоденно</SelectItem>
                        <SelectItem value="weekly">Щотижня</SelectItem>
                        <SelectItem value="biweekly">Кожні 2 тижні</SelectItem>
                        <SelectItem value="monthly">Щомісяця</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Повторювати до</Label>
                    <Input
                      type="date"
                      value={format(lessonForm.recurringEndDate, 'yyyy-MM-dd')}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, recurringEndDate: new Date(e.target.value) }))}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Reminder options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={lessonForm.sendReminder}
                  onCheckedChange={(checked) => setLessonForm(prev => ({ ...prev, sendReminder: checked as boolean }))}
                />
                <Label>Надіслати нагадування студенту</Label>
              </div>

              {lessonForm.sendReminder && (
                <div className="ml-6">
                  <Label>Коли нагадати</Label>
                  <RadioGroup value={lessonForm.reminderTime} onValueChange={(value) => setLessonForm(prev => ({ ...prev, reminderTime: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-day" id="1-day" />
                      <Label htmlFor="1-day">За 1 день</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-hours" id="2-hours" />
                      <Label htmlFor="2-hours">За 2 години</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30-min" id="30-min" />
                      <Label htmlFor="30-min">За 30 хвилин</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Скасувати
            </Button>
            <Button onClick={handleCreateLesson}>
              Створити заняття
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Selected lesson details popover */}
      {selectedLesson && (
        <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Деталі заняття</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedLesson.student.avatar} />
                  <AvatarFallback>{selectedLesson.student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedLesson.student.name}</p>
                  <p className="text-sm text-gray-500">{selectedLesson.student.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  {format(selectedLesson.date, 'EEEE, d MMMM yyyy', { locale: uk })}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {selectedLesson.startTime} - {selectedLesson.endTime}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {selectedLesson.location}
                </div>
                {selectedLesson.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{selectedLesson.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Badge>{lessonTypes[selectedLesson.type].label}</Badge>
                {selectedLesson.recurring && (
                  <Badge variant="outline">Повторюється</Badge>
                )}
                {selectedLesson.payment && (
                  <Badge variant={
                    selectedLesson.payment.status === 'paid' ? 'default' :
                    selectedLesson.payment.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    ₴{selectedLesson.payment.amount}
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Дзвонити
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Повідомлення
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (selectedLesson.recurring) {
                        // Show confirmation for recurring lessons
                        if (confirm('Видалити всі повторювані заняття?')) {
                          handleDeleteLesson(selectedLesson.id, true)
                        } else {
                          handleDeleteLesson(selectedLesson.id, false)
                        }
                      } else {
                        handleDeleteLesson(selectedLesson.id)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Видалити
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}