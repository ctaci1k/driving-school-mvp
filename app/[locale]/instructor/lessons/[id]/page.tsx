// /app/[locale]/instructor/lessons/[id]/page.tsx
// Деталі конкретного заняття

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Calendar, Clock, MapPin, User, Phone, Mail, Car,
  Star, FileText, Camera, Navigation, Target, CheckCircle,
  AlertCircle, Download, Share, Edit, ChevronLeft,
  MessageSquare, DollarSign, Gauge, Timer, Fuel  
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.id as string
  
  const [notes, setNotes] = useState('')

  // Mock lesson data
  const lesson = {
    id: lessonId,
    date: '2024-02-03',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'completed',
    
    student: {
      id: 's1',
      name: 'Марія Шевчук',
      avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
      phone: '+380501234569',
      email: 'maria.s@email.com',
      lessonsCompleted: 24,
      totalLessons: 28,
      progress: 85,
      joinDate: '2024-01-05'
    },
    
    type: 'Підготовка до іспиту',
    category: 'B',
    
    location: {
      start: 'вул. Шевченка, 100',
      end: 'Автодром',
      area: 'Маршрут ДАІ',
      coordinates: { lat: 50.4501, lng: 30.5234 }
    },
    
    vehicle: {
      id: 'v1',
      model: 'Toyota Corolla',
      number: 'AA 1234 AA',
      year: 2020
    },
    
    objectives: [
      { id: 1, title: 'Маршрут іспиту ДАІ', completed: true },
      { id: 2, title: 'Екстрене гальмування', completed: true },
      { id: 3, title: 'Паралельне паркування', completed: true },
      { id: 4, title: 'Розворот в обмеженому просторі', completed: false }
    ],
    
    performance: {
      overallRating: 5,
      skills: {
        confidence: 4,
        technique: 5,
        rules: 5,
        safety: 5
      },
      mistakes: 2,
      improvements: ['Впевненість при паркуванні', 'Швидкість прийняття рішень']
    },
    
    metrics: {
      distance: 22.5,
      maxSpeed: 65,
      avgSpeed: 35,
      fuelUsed: 1.8,
      suddenBrakes: 1,
      sharpTurns: 0
    },
    
    payment: {
      amount: 600,
      status: 'paid',
      method: 'cash',
      date: '2024-02-03'
    },
    
    feedback: {
      instructor: 'Відмінне заняття! Марія показала великий прогрес. Готова до іспиту на 90%.',
      student: 'Дякую за терпіння! Нарешті зрозуміла паралельне паркування.',
      studentRating: 5
    },
    
    photos: [
      { id: 1, url: '/photo1.jpg', caption: 'Паркування' },
      { id: 2, url: '/photo2.jpg', caption: 'Маршрут' }
    ],
    
    nextLesson: {
      date: '2024-02-05',
      time: '14:00',
      type: 'Фінальна підготовка'
    }
  }

  const handleEditLesson = () => {
    // Логіка редагування
  }

  const handleShareLesson = () => {
    // Логіка поділитися
  }

  const handleDownloadReport = () => {
    // Логіка завантаження звіту
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Деталі заняття</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(lesson.date), 'd MMMM yyyy', { locale: uk })} • {lesson.startTime} - {lesson.endTime}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareLesson}>
            <Share className="w-4 h-4 mr-2" />
            Поділитись
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Звіт
          </Button>
          <Button onClick={handleEditLesson}>
            <Edit className="w-4 h-4 mr-2" />
            Редагувати
          </Button>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Студент */}
        <Card>
          <CardHeader>
            <CardTitle>Студент</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lesson.student.avatar} />
                <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{lesson.student.name}</p>
                <p className="text-sm text-gray-500">ID: {lesson.student.id}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{lesson.student.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{lesson.student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>З нами з {format(new Date(lesson.student.joinDate), 'd MMM yyyy', { locale: uk })}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Прогрес курсу</span>
                <span className="text-sm font-medium">{lesson.student.progress}%</span>
              </div>
              <Progress value={lesson.student.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {lesson.student.lessonsCompleted} з {lesson.student.totalLessons} занять
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-1" />
                Дзвонити
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Написати
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Деталі заняття */}
        <Card>
          <CardHeader>
            <CardTitle>Інформація про заняття</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Тип заняття</p>
                <Badge variant="outline" className="mt-1">{lesson.type}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Категорія</p>
                <p className="font-medium">Категорія {lesson.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Тривалість</p>
                <p className="font-medium">{lesson.duration} хвилин</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Локація</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{lesson.location.area}</p>
                    <p className="text-sm text-gray-600">{lesson.location.start}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Автомобіль</p>
                <div className="flex items-center gap-2 mt-1">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{lesson.vehicle.model}</span>
                  <Badge variant="secondary">{lesson.vehicle.number}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Статус</p>
                <Badge variant="default" className="mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Завершено
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Оплата */}
        <Card>
          <CardHeader>
            <CardTitle>Оплата</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">₴{lesson.payment.amount}</p>
              <Badge variant="default" className="mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Оплачено
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Метод оплати:</span>
                <span className="font-medium">
                  {lesson.payment.method === 'cash' ? 'Готівка' : 'Картка'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Дата:</span>
                <span className="font-medium">
                  {format(new Date(lesson.payment.date), 'd MMM yyyy', { locale: uk })}
                </span>
              </div>
            </div>

            <Alert className="mt-4">
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Оплата підтверджена системою
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Табси з детальною інформацією */}
      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="objectives">Цілі</TabsTrigger>
          <TabsTrigger value="performance">Результати</TabsTrigger>
          <TabsTrigger value="metrics">Метрики</TabsTrigger>
          <TabsTrigger value="feedback">Відгуки</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Цілі заняття</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lesson.objectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {objective.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className={objective.completed ? 'line-through text-gray-500' : ''}>
                        {objective.title}
                      </span>
                    </div>
                    <Badge variant={objective.completed ? 'default' : 'secondary'}>
                      {objective.completed ? 'Виконано' : 'Частково'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label>Додаткові нотатки</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Додайте нотатки про заняття..."
                  className="mt-2"
                />
                <Button className="mt-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Зберегти нотатки
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Оцінка виконання</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">Загальна оцінка</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < lesson.performance.overallRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold mt-2">{lesson.performance.overallRating}/5</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(lesson.performance.skills).map(([skill, rating]) => (
                  <div key={skill}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm capitalize">
                        {skill === 'confidence' && 'Впевненість'}
                        {skill === 'technique' && 'Техніка'}
                        {skill === 'rules' && 'Знання ПДР'}
                        {skill === 'safety' && 'Безпека'}
                      </span>
                      <span className="text-sm font-medium">{rating}/5</span>
                    </div>
                    <Progress value={rating * 20} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Кількість помилок</p>
                  <Badge variant={lesson.performance.mistakes <= 2 ? 'default' : 'destructive'}>
                    {lesson.performance.mistakes} помилки
                  </Badge>
                </div>

                <div>
                  <p className="font-medium mb-2">Потребує покращення</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.performance.improvements.map((item, index) => (
                      <Badge key={index} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Метрики їзди</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.distance} км</p>
                  <p className="text-sm text-gray-500">Відстань</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Timer className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.avgSpeed} км/год</p>
                  <p className="text-sm text-gray-500">Середня швидкість</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Navigation className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.maxSpeed} км/год</p>
                  <p className="text-sm text-gray-500">Макс. швидкість</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel  className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.fuelUsed} л</p>
                  <p className="text-sm text-gray-500">Витрата палива</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.suddenBrakes}</p>
                  <p className="text-sm text-gray-500">Різкі гальмування</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.sharpTurns}</p>
                  <p className="text-sm text-gray-500">Різкі повороти</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Відгук інструктора</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{lesson.feedback.instructor}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Відгук студента</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-gray-700">{lesson.feedback.student}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < lesson.feedback.studentRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Наступне заняття */}
      {lesson.nextLesson && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Наступне заняття:</strong> {format(new Date(lesson.nextLesson.date), 'd MMMM', { locale: uk })} о {lesson.nextLesson.time} - {lesson.nextLesson.type}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}