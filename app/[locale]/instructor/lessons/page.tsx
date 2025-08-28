// app/[locale]/instructor/lessons/page.tsx
// Сторінка зі списком усіх уроків інструктора

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { 
  Calendar, Clock, MapPin, Phone, User, Car, Filter,
  Search, ChevronRight, Star, CheckCircle, XCircle,
  AlertCircle, Download, Eye, MessageSquare, Navigation,
  DollarSign, TrendingUp, Users, FileText, Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Progress } from '@/components/ui/progress'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Lesson {
  id: string
  date: string
  time: string
  status: 'completed' | 'scheduled' | 'cancelled' | 'no-show'
  student: {
    id: string
    name: string
    phone: string
    avatar: string
    progress: number
  }
  type: string
  location: string
  vehicle: string
  duration: number
  price: number
  rating?: number
  distance?: number
  paid: boolean
}

export default function InstructorLessonsPage() {
  const t = useTranslations('instructor.lessons.list')
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('week')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  // Приклади даних уроків
  const lessons: Lesson[] = [
    {
      id: '1',
      date: '2024-02-05',
      time: '08:00',
      status: 'scheduled',
      student: {
        id: 's1',
        name: 'Анна Коваленко',
        phone: '+380 123 456 789',
        avatar: 'https://ui-avatars.com/api/?name=AK&background=EC4899&color=fff',
        progress: 65
      },
      type: t('lessonTypes.city'),
      location: 'вул. Хрещатик 100',
      vehicle: 'Toyota Corolla (АА 12345 КА)',
      duration: 90,
      price: 150,
      paid: true
    },
    {
      id: '2',
      date: '2024-02-04',
      time: '14:00',
      status: 'completed',
      student: {
        id: 's2',
        name: 'Петро Шевченко',
        phone: '+380 987 654 321',
        avatar: 'https://ui-avatars.com/api/?name=PS&background=3B82F6&color=fff',
        progress: 85
      },
      type: t('lessonTypes.internalExam'),
      location: 'Екзаменаційний майданчик',
      vehicle: 'Toyota Corolla (АА 12345 КА)',
      duration: 60,
      price: 120,
      rating: 5,
      distance: 25.5,
      paid: true
    },
    {
      id: '3',
      date: '2024-02-04',
      time: '10:00',
      status: 'completed',
      student: {
        id: 's3',
        name: 'Марія Бондаренко',
        phone: '+380 555 666 777',
        avatar: 'https://ui-avatars.com/api/?name=MB&background=10B981&color=fff',
        progress: 45
      },
      type: t('lessonTypes.practiceArea'),
      location: 'Навчальний майданчик',
      vehicle: 'Toyota Yaris (АА 67890 КА)',
      duration: 90,
      price: 150,
      rating: 4,
      distance: 8.2,
      paid: false
    },
    {
      id: '4',
      date: '2024-02-03',
      time: '16:00',
      status: 'cancelled',
      student: {
        id: 's4',
        name: 'Іван Мельник',
        phone: '+380 111 222 333',
        avatar: 'https://ui-avatars.com/api/?name=IM&background=F59E0B&color=fff',
        progress: 30
      },
      type: t('lessonTypes.city'),
      location: 'вул. Шевченка 50',
      vehicle: 'Toyota Corolla (АА 12345 КА)',
      duration: 90,
      price: 150,
      paid: false
    },
    {
      id: '5',
      date: '2024-02-03',
      time: '12:00',
      status: 'no-show',
      student: {
        id: 's5',
        name: 'Катерина Коваль',
        phone: '+380 444 555 666',
        avatar: 'https://ui-avatars.com/api/?name=KK&background=8B5CF6&color=fff',
        progress: 70
      },
      type: t('lessonTypes.examRoute'),
      location: 'Старт: ТСЦ',
      vehicle: 'Toyota Corolla (АА 12345 КА)',
      duration: 90,
      price: 150,
      paid: true
    }
  ]

  // Статистика
  const stats = {
    totalLessons: lessons.length,
    completedLessons: lessons.filter(l => l.status === 'completed').length,
    totalEarnings: lessons.filter(l => l.status === 'completed').reduce((sum, l) => sum + l.price, 0),
    averageRating: 4.5,
    totalDistance: lessons.filter(l => l.distance).reduce((sum, l) => sum + (l.distance || 0), 0),
    unpaidLessons: lessons.filter(l => !l.paid && l.status === 'completed').length
  }

  // Фільтрування уроків
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter
    const matchesType = typeFilter === 'all' || lesson.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: Lesson['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">{t('status.completed')}</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">{t('status.scheduled')}</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">{t('status.cancelled')}</Badge>
      case 'no-show':
        return <Badge className="bg-red-100 text-red-800">{t('status.noShow')}</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: Lesson['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />
      case 'no-show':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <Button onClick={() => router.push('/instructor/lessons/new')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('buttons.addLesson')}
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.all')}</p>
                <p className="text-2xl font-bold">{stats.totalLessons}</p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.completed')}</p>
                <p className="text-2xl font-bold">{stats.completedLessons}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.earnings')}</p>
                <p className="text-xl font-bold">{t('stats.currency', {amount: stats.totalEarnings})}</p>
              </div>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.rating')}</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.distance')}</p>
                <p className="text-xl font-bold">{t('stats.km', {distance: stats.totalDistance})}</p>
              </div>
              <Navigation className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t('stats.unpaid')}</p>
                <p className="text-2xl font-bold">{stats.unpaidLessons}</p>
              </div>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фільтри та пошук */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="scheduled">{t('status.scheduled')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                <SelectItem value="no-show">{t('status.noShow')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
                <SelectItem value={t('lessonTypes.city')}>{t('lessonTypes.city')}</SelectItem>
                <SelectItem value={t('lessonTypes.practiceArea')}>{t('lessonTypes.practiceArea')}</SelectItem>
                <SelectItem value={t('lessonTypes.examRoute')}>{t('lessonTypes.examRoute')}</SelectItem>
                <SelectItem value={t('lessonTypes.internalExam')}>{t('lessonTypes.internalExam')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Період" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t('filters.period.today')}</SelectItem>
                <SelectItem value="week">{t('filters.period.week')}</SelectItem>
                <SelectItem value="month">{t('filters.period.month')}</SelectItem>
                <SelectItem value="all">{t('filters.period.all')}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблиця уроків */}
      <Card>
        <CardHeader>
          <CardTitle>{t('table.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.headers.status')}</TableHead>
                  <TableHead>{t('table.headers.dateTime')}</TableHead>
                  <TableHead>{t('table.headers.student')}</TableHead>
                  <TableHead>{t('table.headers.lessonType')}</TableHead>
                  <TableHead>{t('table.headers.location')}</TableHead>
                  <TableHead>{t('table.headers.vehicle')}</TableHead>
                  <TableHead>{t('table.headers.duration')}</TableHead>
                  <TableHead>{t('table.headers.price')}</TableHead>
                  <TableHead>{t('table.headers.payment')}</TableHead>
                  <TableHead>{t('table.headers.rating')}</TableHead>
                  <TableHead>{t('table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(lesson.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {format(new Date(lesson.date), 'dd MMM yyyy', { locale: uk })}
                        </p>
                        <p className="text-sm text-gray-500">{lesson.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lesson.student.avatar} />
                          <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lesson.student.name}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={lesson.student.progress} className="w-16 h-1.5" />
                            <span className="text-xs text-gray-500">{lesson.student.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lesson.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{lesson.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{lesson.vehicle}</span>
                      </div>
                    </TableCell>
                    <TableCell>{t('table.minutes', {duration: lesson.duration})}</TableCell>
                    <TableCell className="font-medium">{t('stats.currency', {amount: lesson.price})}</TableCell>
                    <TableCell>
                      {lesson.paid ? (
                        <Badge className="bg-green-100 text-green-800">{t('table.paid')}</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">{t('table.toPay')}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {lesson.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{lesson.rating}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/instructor/lessons/${lesson.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}