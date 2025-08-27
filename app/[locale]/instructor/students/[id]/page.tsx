// app/[locale]/instructor/students/[id]/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  User, Mail, Phone, MapPin, Calendar, Car, Clock,
  Star, TrendingUp, Award, Target, FileText, MessageSquare,
  ChevronLeft, Edit, Save, X, AlertCircle, CheckCircle,
  BookOpen, GraduationCap, CreditCard, History
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params?.id as string
  const [isEditing, setIsEditing] = useState(false)

  const student = {
    id: studentId,
    name: 'Марія Шевчук',
    avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
    phone: '+380501234569',
    email: 'maria.s@email.com',
    address: 'вул. Хрещатик, 22',
    dateOfBirth: '2000-05-15',
    category: 'B',
    
    // Learning info
    status: 'active',
    enrollmentDate: '2024-01-05',
    instructor: 'Петро Водій',
    progress: 85,
    theoryStatus: 'completed',
    practiceHours: 36,
    
    // Lessons
    totalLessons: 28,
    completedLessons: 24,
    upcomingLessons: 2,
    missedLessons: 1,
    
    // Financial
    packageType: 'Стандарт',
    totalCost: 15000,
    paid: 12000,
    balance: 3000,
    nextPayment: '2024-02-10',
    
    // Performance
    averageScore: 4.8,
    strongPoints: ['Знання ПДР', 'Впевнена їзда'],
    weakPoints: ['Паралельне паркування'],
    
    // Exam info
    theoryExamDate: '2024-01-25',
    theoryExamResult: 'passed',
    practiceExamDate: '2024-02-12',
    practiceExamAttempts: 0,
    
    // Emergency contact
    emergencyContact: 'Олена Шевчук',
    emergencyPhone: '+380501234570',
    
    // Notes
    notes: 'Швидко навчається, потребує більше практики з паркуванням'
  }

  const lessonHistory = [
    {
      id: 1,
      date: '2024-02-03',
      time: '14:30-16:00',
      type: 'Підготовка до іспиту',
      instructor: 'Петро Водій',
      rating: 5,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-02-05',
      time: '10:00-11:30',
      type: 'Практика - місто',
      instructor: 'Петро Водій',
      rating: null,
      status: 'upcoming'
    }
  ]

  const payments = [
    {
      id: 1,
      date: '2024-01-05',
      amount: 5000,
      method: 'Картка',
      description: 'Перший внесок',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-20',
      amount: 7000,
      method: 'Готівка',
      description: 'Другий внесок',
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Профіль студента</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Скасувати
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="w-4 h-4 mr-2" />
                Зберегти
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Редагувати
            </Button>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.avatar} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status === 'active' ? 'Активний' : 'Неактивний'}
                  </Badge>
                  <Badge variant="outline">Категорія {student.category}</Badge>
                  {student.theoryStatus === 'completed' && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Теорія здана
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Прогрес</p>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{student.progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Занять</p>
                  <p className="font-semibold">{student.completedLessons}/{student.totalLessons}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Годин практики</p>
                  <p className="font-semibold">{student.practiceHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Рейтинг</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{student.averageScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Інформація</TabsTrigger>
          <TabsTrigger value="lessons">Заняття</TabsTrigger>
          <TabsTrigger value="payments">Платежі</TabsTrigger>
          <TabsTrigger value="exams">Іспити</TabsTrigger>
          <TabsTrigger value="notes">Нотатки</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Контактна інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Телефон</Label>
                  <Input value={student.phone} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={student.email} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Дата народження</Label>
                  <Input value={student.dateOfBirth} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Адреса</Label>
                  <Input value={student.address} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Контакт для екстрених випадків</Label>
                  <Input value={student.emergencyContact} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Телефон екстреного контакту</Label>
                  <Input value={student.emergencyPhone} disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Навчальна інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Дата зарахування</Label>
                  <Input value={student.enrollmentDate} disabled />
                </div>
                <div>
                  <Label>Пакет навчання</Label>
                  <Input value={student.packageType} disabled />
                </div>
                <div>
                  <Label>Сильні сторони</Label>
                  <div className="flex gap-2 mt-2">
                    {student.strongPoints.map(point => (
                      <Badge key={point} variant="outline">{point}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Потребує уваги</Label>
                  <div className="flex gap-2 mt-2">
                    {student.weakPoints.map(point => (
                      <Badge key={point} variant="outline" className="text-yellow-600">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Історія занять</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonHistory.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{lesson.type}</p>
                      <p className="text-sm text-gray-500">
                        {lesson.date} • {lesson.time} • {lesson.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.status === 'completed' && lesson.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{lesson.rating}</span>
                        </div>
                      )}
                      <Badge variant={lesson.status === 'completed' ? 'default' : 'outline'}>
                        {lesson.status === 'completed' ? 'Завершено' : 'Заплановано'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Фінансова інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Загальна вартість</p>
                  <p className="text-2xl font-bold">₴{student.totalCost}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Сплачено</p>
                  <p className="text-2xl font-bold text-green-600">₴{student.paid}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-500">Залишок</p>
                  <p className="text-2xl font-bold text-yellow-600">₴{student.balance}</p>
                </div>
              </div>

              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-500">{payment.date} • {payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₴{payment.amount}</p>
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Сплачено
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {student.balance > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Наступний платіж ₴{student.balance} до {student.nextPayment}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Екзамени</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Теоретичний іспит</p>
                      <p className="text-sm text-gray-500">Дата: {student.theoryExamDate}</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Здано
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Практичний іспит</p>
                      <p className="text-sm text-gray-500">Запланована дата: {student.practiceExamDate}</p>
                      <p className="text-xs text-gray-400">Спроб: {student.practiceExamAttempts}</p>
                    </div>
                    <Badge variant="outline">
                      Заплановано
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Нотатки інструктора</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={student.notes}
                disabled={!isEditing}
                className="h-32"
                placeholder="Додайте нотатки про студента..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}