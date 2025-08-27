// app/[locale]/instructor/lessons/page.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar, Clock, Users, Filter, Search, Download,
  CheckCircle, XCircle, AlertCircle, Play, Pause,
  TrendingUp, Star, MapPin, Phone, MessageSquare,
  MoreVertical, Eye, ChevronRight, Car, DollarSign
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, differenceInMinutes, isToday, isPast, isFuture } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface Lesson {
  id: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  student: {
    id: string
    name: string
    avatar: string
    phone: string
    category: string
    progress: number
  }
  type: 'city' | 'highway' | 'parking' | 'exam-prep' | 'night' | 'theory'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  location: string
  vehicle: {
    model: string
    number: string
  }
  payment: {
    status: 'paid' | 'pending' | 'overdue'
    amount: number
  }
  rating?: number
  distance?: number
  notes?: string
  checkIn?: {
    time: Date
    mileageStart: number
    fuelLevel: number
    documentsChecked: boolean
  }
  checkOut?: {
    time: Date
    mileageEnd: number
    fuelLevel: number
    feedback: string
  }
}

const lessonTypeConfig = {
  'city': { label: 'Місто', color: 'bg-blue-500', icon: '🏙️' },
  'highway': { label: 'Траса', color: 'bg-green-500', icon: '🛣️' },
  'parking': { label: 'Паркування', color: 'bg-purple-500', icon: '🅿️' },
  'exam-prep': { label: 'Іспит', color: 'bg-orange-500', icon: '📝' },
  'night': { label: 'Нічна їзда', color: 'bg-indigo-500', icon: '🌙' },
  'theory': { label: 'Теорія', color: 'bg-yellow-500', icon: '📚' }
}

const statusConfig = {
  'scheduled': { label: 'Заплановано', color: 'secondary' },
  'in-progress': { label: 'Триває', color: 'default', pulse: true },
  'completed': { label: 'Завершено', color: 'success' },
  'cancelled': { label: 'Скасовано', color: 'destructive' },
  'no-show': { label: 'Не з\'явився', color: 'warning' }
}

export default function LessonsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past' | 'all'>('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Mock data
  const lessons: Lesson[] = [
    {
      id: '1',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      student: {
        id: 's1',
        name: 'Марія Шевчук',
        avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
        phone: '+380501234567',
        category: 'B',
        progress: 85
      },
      type: 'exam-prep',
      status: 'completed',
      location: 'вул. Шевченка, 100',
      vehicle: { model: 'Toyota Corolla', number: 'AA1234AA' },
      payment: { status: 'paid', amount: 400 },
      rating: 5,
      distance: 22,
      checkIn: {
        time: new Date(),
        mileageStart: 125400,
        fuelLevel: 75,
        documentsChecked: true
      },
      checkOut: {
        time: new Date(),
        mileageEnd: 125422,
        fuelLevel: 70,
        feedback: 'Відмінно! Готова до іспиту'
      }
    },
    {
      id: '2',
      date: new Date(),
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      student: {
        id: 's2',
        name: 'Іван Петренко',
        avatar: 'https://ui-avatars.com/api/?name=IP&background=3B82F6&color=fff',
        phone: '+380501234568',
        category: 'B',
        progress: 45
      },
      type: 'city',
      status: 'in-progress',
      location: 'вул. Хрещатик, 1',
      vehicle: { model: 'Toyota Corolla', number: 'AA1234AA' },
      payment: { status: 'pending', amount: 350 },
      checkIn: {
        time: new Date(),
        mileageStart: 125422,
        fuelLevel: 70,
        documentsChecked: true
      }
    },
    {
      id: '3',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      student: {
        id: 's3',
        name: 'Олена Коваленко',
        avatar: 'https://ui-avatars.com/api/?name=OK&background=EC4899&color=fff',
        phone: '+380501234569',
        category: 'B',
        progress: 65
      },
      type: 'parking',
      status: 'scheduled',
      location: 'Майданчик',
      vehicle: { model: 'Toyota Corolla', number: 'AA1234AA' },
      payment: { status: 'overdue', amount: 350 }
    }
  ]

  // Statistics
  const stats = {
    today: lessons.filter(l => isToday(l.date)).length,
    completed: lessons.filter(l => l.status === 'completed').length,
    inProgress: lessons.filter(l => l.status === 'in-progress').length,
    scheduled: lessons.filter(l => l.status === 'scheduled').length,
    totalHours: lessons.reduce((acc, l) => acc + l.duration, 0) / 60,
    totalDistance: lessons.reduce((acc, l) => acc + (l.distance || 0), 0),
    averageRating: 4.8,
    revenue: lessons.reduce((acc, l) => acc + (l.payment.status === 'paid' ? l.payment.amount : 0), 0)
  }

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || lesson.type === filterType
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus
    const matchesPayment = filterPayment === 'all' || lesson.payment.status === filterPayment

    let matchesTab = true
    if (activeTab === 'today') matchesTab = isToday(lesson.date)
    if (activeTab === 'upcoming') matchesTab = isFuture(lesson.date)
    if (activeTab === 'past') matchesTab = isPast(lesson.date) && !isToday(lesson.date)

    return matchesSearch && matchesType && matchesStatus && matchesPayment && matchesTab
  })

  // Sort lessons
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    if (sortBy === 'date') return b.date.getTime() - a.date.getTime()
    if (sortBy === 'student') return a.student.name.localeCompare(b.student.name)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    if (sortBy === 'payment') return a.payment.status.localeCompare(b.payment.status)
    return 0
  })

  const handleStartLesson = (lessonId: string) => {
    router.push(`/instructor/lessons/check-in/${lessonId}`)
  }

  const handleViewDetails = (lessonId: string) => {
    router.push(`/instructor/lessons/${lessonId}`)
  }

  const getLessonStatusColor = (status: Lesson['status']) => {
    if (status === 'in-progress') return 'ring-2 ring-blue-500 bg-blue-50'
    if (status === 'completed') return 'bg-green-50'
    if (status === 'cancelled') return 'bg-red-50 opacity-60'
    if (status === 'no-show') return 'bg-yellow-50'
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мої заняття</h1>
          <p className="text-gray-600 mt-1">
            Керування та відстеження всіх занять
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Експорт
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Сьогодні</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Триває зараз</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Завершено</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Заробіток</p>
                <p className="text-2xl font-bold">₴{stats.revenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Пошук за студентом або локацією..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Тип заняття" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі типи</SelectItem>
                {Object.entries(lessonTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.icon} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі статуси</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Оплата" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Вся оплата</SelectItem>
                <SelectItem value="paid">Оплачено</SelectItem>
                <SelectItem value="pending">Очікується</SelectItem>
                <SelectItem value="overdue">Прострочено</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Сортування" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">За датою</SelectItem>
                <SelectItem value="student">За студентом</SelectItem>
                <SelectItem value="status">За статусом</SelectItem>
                <SelectItem value="payment">За оплатою</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="today">
            Сьогодні ({lessons.filter(l => isToday(l.date)).length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Майбутні ({lessons.filter(l => isFuture(l.date)).length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Минулі ({lessons.filter(l => isPast(l.date) && !isToday(l.date)).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Всі ({lessons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Alert for in-progress lesson */}
          {stats.inProgress > 0 && activeTab === 'today' && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Play className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                У вас зараз триває {stats.inProgress} {stats.inProgress === 1 ? 'заняття' : 'занять'}.
              </AlertDescription>
            </Alert>
          )}

          {/* Lessons List */}
          <div className="space-y-4">
            {sortedLessons.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Немає занять для відображення</p>
                </CardContent>
              </Card>
            ) : (
              sortedLessons.map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className={cn(
                    "transition-all hover:shadow-md",
                    getLessonStatusColor(lesson.status)
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Time & Status */}
                        <div className="text-center min-w-[80px]">
                          <p className="text-lg font-semibold">{lesson.startTime}</p>
                          <p className="text-sm text-gray-500">{lesson.endTime}</p>
                          {lesson.status === 'in-progress' && (
                            <Badge variant="default" className="mt-2 animate-pulse">
                              Триває
                            </Badge>
                          )}
                        </div>

                        {/* Student Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={lesson.student.avatar} />
                            <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{lesson.student.name}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {lesson.student.phone}
                              </span>
                              <Badge variant="outline">{lesson.student.category}</Badge>
                              <Progress value={lesson.student.progress} className="w-20 h-1.5" />
                            </div>
                          </div>
                        </div>

                        {/* Lesson Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={cn(
                              "text-white",
                              lessonTypeConfig[lesson.type].color
                            )}>
                              {lessonTypeConfig[lesson.type].icon} {lessonTypeConfig[lesson.type].label}
                            </Badge>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {lesson.location}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {lesson.vehicle.number}
                            </span>
                          </div>

                          {/* Check-in/out info */}
                          {lesson.checkIn && (
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Check-in: {format(lesson.checkIn.time, 'HH:mm')}</span>
                              <span>Пробіг: {lesson.checkIn.mileageStart} км</span>
                              <span>Паливо: {lesson.checkIn.fuelLevel}%</span>
                              {lesson.checkOut && (
                                <>
                                  <span>•</span>
                                  <span>Пройдено: {lesson.checkOut.mileageEnd - lesson.checkIn.mileageStart} км</span>
                                </>
                              )}
                            </div>
                          )}

                          {/* Rating */}
                          {lesson.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < lesson.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  )}
                                />
                              ))}
                              {lesson.checkOut?.feedback && (
                                <span className="text-sm text-gray-600 ml-2">
                                  "{lesson.checkOut.feedback}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Payment Status */}
                        <Badge variant={
                          lesson.payment.status === 'paid' ? 'default' :
                          lesson.payment.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          ₴{lesson.payment.amount}
                        </Badge>

                        {/* Status Badge */}
                        <Badge variant={statusConfig[lesson.status].color as any}>
                          {statusConfig[lesson.status].label}
                        </Badge>

                        {/* Action Buttons */}
                        {lesson.status === 'scheduled' && isToday(lesson.date) && (
                          <Button 
                            size="sm"
                            onClick={() => handleStartLesson(lesson.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Почати
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Дії</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(lesson.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Деталі
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Зателефонувати
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Повідомлення
                            </DropdownMenuItem>
                            {lesson.status === 'scheduled' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Скасувати
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}