// /app/[locale]/instructor/students/[id]/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Phone, Mail, Calendar, Clock, MapPin, Car,
  Star, TrendingUp, Award, FileText, MessageSquare,
  ChevronRight, ChevronLeft, MoreVertical, Edit, Download, Share,
  AlertCircle, CheckCircle, XCircle, Target, BookOpen,
  DollarSign, History, Camera, Video
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params?.id as string

  // Mock student data
  const student = {
    id: studentId,
    // Personal info
    name: 'Марія Шевчук',
    avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
    phone: '+380501234569',
    alternatePhone: '+380671234569',
    email: 'maria.shevchuk@email.com',
    dateOfBirth: '2002-03-15',
    address: 'вул. Хрещатик, 100, Київ',
    
    // Course info
    category: 'B',
    enrollmentDate: '2024-01-05',
    status: 'active',
    courseType: 'Повний курс',
    paymentStatus: 'paid',
    
    // Progress
    overallProgress: 85,
    theoryProgress: 95,
    practiceProgress: 78,
    totalLessons: 28,
    completedLessons: 24,
    remainingLessons: 4,
    totalHours: 36,
    
    // Performance
    averageRating: 4.8,
    lastLessonDate: '2024-02-03',
    nextLessonDate: '2024-02-05',
    examDate: '2024-02-12',
    
    // Financial
    totalPaid: 12500,
    totalCost: 14000,
    balance: -1500,
    nextPaymentDate: '2024-02-10',
    
    // Emergency contact
    emergencyContact: {
      name: 'Олена Шевчук',
      relation: 'Мати',
      phone: '+380501234560'
    },
    
    // Skills assessment
    skills: {
      'Знання ПДР': 95,
      'Паркування': 70,
      'Маневрування': 85,
      'Міська їзда': 88,
      'Трасова їзда': 75,
      'Нічна їзда': 60
    }
  }

  // Lesson history
  const lessonHistory = [
    {
      id: 1,
      date: '2024-02-03',
      time: '14:00-15:30',
      type: 'Підготовка до іспиту',
      status: 'completed',
      rating: 5,
      distance: 22.5,
      notes: 'Відмінно! Готова до іспиту'
    },
    {
      id: 2,
      date: '2024-02-01',
      time: '10:00-11:30',
      type: 'Практика - місто',
      status: 'completed',
      rating: 4,
      distance: 18.3,
      notes: 'Покращення в паркуванні'
    },
    {
      id: 3,
      date: '2024-01-29',
      time: '14:00-16:00',
      type: 'Практика - траса',
      status: 'completed',
      rating: 5,
      distance: 45.7,
      notes: 'Впевнена їзда по трасі'
    }
  ]

  // Upcoming lessons
  const upcomingLessons = [
    {
      id: 1,
      date: '2024-02-05',
      time: '14:00-15:30',
      type: 'Підготовка до іспиту',
      location: 'Маршрут ДАІ'
    },
    {
      id: 2,
      date: '2024-02-07',
      time: '10:00-11:30',
      type: 'Екзаменаційна практика',
      location: 'Автодром'
    }
  ]

  // Payments history
  const payments = [
    {
      id: 1,
      date: '2024-01-05',
      amount: 5000,
      description: 'Перший внесок',
      method: 'Банківський переказ',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-15',
      amount: 4000,
      description: 'Другий внесок',
      method: 'Готівка',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-25',
      amount: 3500,
      description: 'Третій внесок',
      method: 'Картка',
      status: 'completed'
    }
  ]

  const getStatusBadge = () => {
    if (student.status === 'active') {
      return <Badge variant="default">Активний</Badge>
    } else if (student.status === 'paused') {
      return <Badge variant="secondary">На паузі</Badge>
    } else {
      return <Badge variant="outline">Завершив</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.avatar} />
            <AvatarFallback>{student.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              {getStatusBadge()}
              <span className="text-gray-500">Категорія {student.category}</span>
              <span className="text-gray-500">З {format(new Date(student.enrollmentDate), 'd MMM yyyy', { locale: uk })}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Зателефонувати
          </Button>
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Повідомлення
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Дії</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Редагувати
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Згенерувати звіт
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Експорт даних
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Поділитись
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Прогрес</p>
                <p className="text-2xl font-bold">{student.overallProgress}%</p>
              </div>
              <Progress value={student.overallProgress} className="w-12 h-12" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Занять</p>
                <p className="text-2xl font-bold">{student.completedLessons}/{student.totalLessons}</p>
              </div>
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Рейтинг</p>
                <p className="text-2xl font-bold">{student.averageRating}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Годин</p>
                <p className="text-2xl font-bold">{student.totalHours}</p>
              </div>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Баланс</p>
                <p className={`text-2xl font-bold ${student.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₴{Math.abs(student.balance)}
                </p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Dates Alert */}
      {student.examDate && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Іспит заплановано на {format(new Date(student.examDate), 'd MMMM yyyy', { locale: uk })}</strong>
            <br />
            Залишилось {student.remainingLessons} занять до завершення курсу
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Інформація</TabsTrigger>
          <TabsTrigger value="progress">
            <Link href={`/instructor/students/${studentId}/progress`}>
              Прогрес
            </Link>
          </TabsTrigger>
          <TabsTrigger value="lessons">Заняття</TabsTrigger>
          <TabsTrigger value="payments">Платежі</TabsTrigger>
          <TabsTrigger value="feedback">
            <Link href={`/instructor/students/${studentId}/feedback`}>
              Оцінювання
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Особиста інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Додатковий телефон</p>
                  <p className="font-medium">{student.alternatePhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата народження</p>
                  <p className="font-medium">{format(new Date(student.dateOfBirth), 'd MMMM yyyy', { locale: uk })}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Адреса</p>
                  <p className="font-medium">{student.address}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="font-semibold mb-3">Екстрений контакт</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ім'я</p>
                    <p className="font-medium">{student.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Відношення</p>
                    <p className="font-medium">{student.emergencyContact.relation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium">{student.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>Інформація про курс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Тип курсу</p>
                  <p className="font-medium">{student.courseType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Категорія</p>
                  <p className="font-medium">Категорія {student.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата початку</p>
                  <p className="font-medium">{format(new Date(student.enrollmentDate), 'd MMMM yyyy', { locale: uk })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата іспиту</p>
                  <p className="font-medium">
                    {student.examDate ? format(new Date(student.examDate), 'd MMMM yyyy', { locale: uk }) : 'Не призначено'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="mt-6 space-y-6">
          {/* Upcoming Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Заплановані заняття</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{lesson.type}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(lesson.date), 'd MMMM', { locale: uk })} • {lesson.time}
                      </p>
                      <p className="text-sm text-gray-500">{lesson.location}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Деталі
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lesson History */}
          <Card>
            <CardHeader>
              <CardTitle>Історія занять</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonHistory.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{lesson.type}</p>
                        {lesson.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(lesson.date), 'd MMMM', { locale: uk })} • {lesson.time}
                      </p>
                      {lesson.notes && (
                        <p className="text-sm text-gray-500 mt-1">{lesson.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {lesson.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{lesson.rating}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">{lesson.distance} км</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Історія платежів</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(payment.date), 'd MMMM yyyy', { locale: uk })}
                      </p>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₴{payment.amount}</p>
                      <Badge variant="default">Сплачено</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Всього сплачено:</span>
                  <span className="font-semibold">₴{student.totalPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Загальна вартість:</span>
                  <span className="font-semibold">₴{student.totalCost}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Залишок:</span>
                  <span className={student.balance < 0 ? 'text-red-600' : 'text-green-600'}>
                    ₴{Math.abs(student.balance)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}