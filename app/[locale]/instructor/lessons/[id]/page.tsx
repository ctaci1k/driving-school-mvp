// /app/[locale]/instructor/lessons/[id]/page.tsx
// Деталі конкретного уроку

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('instructor.lessons.detail')
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
      name: 'Марія Коваленко',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=10B981&color=fff',
      phone: '+380501234569',
      email: 'maria.k@email.com',
      lessonsCompleted: 24,
      totalLessons: 28,
      progress: 85,
      joinDate: '2024-01-05'
    },
    
    type: t('lessonTypes.examPreparation'),
    category: 'B',
    
    location: {
      start: 'вул. Хрещатик 100',
      end: t('locations.practiceArea'),
      area: t('locations.examRoute'),
      coordinates: { lat: 50.4501, lng: 30.5234 }
    },
    
    vehicle: {
      id: 'v1',
      model: 'Toyota Corolla',
      number: 'АА 1234 КА',
      year: 2020
    },
    
    objectives: [
      { id: 1, title: t('objectives.examRoute'), completed: true },
      { id: 2, title: t('objectives.emergencyBraking'), completed: true },
      { id: 3, title: t('objectives.parallelParking'), completed: true },
      { id: 4, title: t('objectives.turningLimited'), completed: false }
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
      improvements: [t('performance.parkingConfidence'), t('performance.decisionSpeed')]
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
      amount: 150,
      status: 'paid',
      method: 'cash',
      date: '2024-02-03'
    },
    
    feedback: {
      instructor: t('feedback.instructorComment'),
      student: t('feedback.studentComment'),
      studentRating: 5
    },
    
    photos: [
      { id: 1, url: '/photo1.jpg', caption: 'Паркування' },
      { id: 2, url: '/photo2.jpg', caption: 'Маршрут' }
    ],
    
    nextLesson: {
      date: '2024-02-05',
      time: '14:00',
      type: t('lessonTypes.finalPreparation')
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
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('dateTime', {
                date: format(new Date(lesson.date), 'd MMMM yyyy', { locale: uk }),
                startTime: lesson.startTime,
                endTime: lesson.endTime
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareLesson}>
            <Share className="w-4 h-4 mr-2" />
            {t('buttons.share')}
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            {t('buttons.report')}
          </Button>
          <Button onClick={handleEditLesson}>
            <Edit className="w-4 h-4 mr-2" />
            {t('buttons.edit')}
          </Button>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Курсант */}
        <Card>
          <CardHeader>
            <CardTitle>{t('student.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lesson.student.avatar} />
                <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{lesson.student.name}</p>
                <p className="text-sm text-gray-500">{t('student.id', {id: lesson.student.id})}</p>
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
                <span>{t('student.joinedDate', {date: format(new Date(lesson.student.joinDate), 'd MMM yyyy', { locale: uk })})}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">{t('student.courseProgress')}</span>
                <span className="text-sm font-medium">{lesson.student.progress}%</span>
              </div>
              <Progress value={lesson.student.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {t('student.lessonsCompleted', {
                  completed: lesson.student.lessonsCompleted,
                  total: lesson.student.totalLessons
                })}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-1" />
                {t('buttons.call')}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                {t('buttons.message')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Деталі уроку */}
        <Card>
          <CardHeader>
            <CardTitle>{t('lessonInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.type')}</p>
                <Badge variant="outline" className="mt-1">{lesson.type}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.category')}</p>
                <p className="font-medium">{t('lessonInfo.categoryB')}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.duration')}</p>
                <p className="font-medium">{t('lessonInfo.minutes', {minutes: lesson.duration})}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.location')}</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{lesson.location.area}</p>
                    <p className="text-sm text-gray-600">{lesson.location.start}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.vehicle')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{lesson.vehicle.model}</span>
                  <Badge variant="secondary">{lesson.vehicle.number}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t('lessonInfo.status')}</p>
                <Badge variant="default" className="mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('lessonInfo.completed')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Оплата */}
        <Card>
          <CardHeader>
            <CardTitle>{t('payment.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{t('payment.amount', {amount: lesson.payment.amount})}</p>
              <Badge variant="default" className="mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('payment.paid')}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('payment.paymentMethod')}</span>
                <span className="font-medium">
                  {lesson.payment.method === 'cash' ? t('payment.cash') : t('payment.card')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('payment.date')}</span>
                <span className="font-medium">
                  {format(new Date(lesson.payment.date), 'd MMM yyyy', { locale: uk })}
                </span>
              </div>
            </div>

            <Alert className="mt-4">
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                {t('payment.confirmed')}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Картки з детальною інформацією */}
      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="objectives">{t('tabs.objectives')}</TabsTrigger>
          <TabsTrigger value="performance">{t('tabs.performance')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('tabs.metrics')}</TabsTrigger>
          <TabsTrigger value="feedback">{t('tabs.feedback')}</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('objectives.title')}</CardTitle>
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
                      {objective.completed ? t('objectives.completed') : t('objectives.partial')}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label>{t('objectives.additionalNotes')}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('objectives.notesPlaceholder')}
                  className="mt-2"
                />
                <Button className="mt-2">
                  <FileText className="w-4 h-4 mr-2" />
                  {t('buttons.saveNotes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">{t('performance.overallRating')}</p>
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
                        {skill === 'confidence' && t('performance.confidence')}
                        {skill === 'technique' && t('performance.technique')}
                        {skill === 'rules' && t('performance.rules')}
                        {skill === 'safety' && t('performance.safety')}
                      </span>
                      <span className="text-sm font-medium">{rating}/5</span>
                    </div>
                    <Progress value={rating * 20} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">{t('performance.mistakes')}</p>
                  <Badge variant={lesson.performance.mistakes <= 2 ? 'default' : 'destructive'}>
                    {t('performance.mistakesCount', {count: lesson.performance.mistakes})}
                  </Badge>
                </div>

                <div>
                  <p className="font-medium mb-2">{t('performance.needsImprovement')}</p>
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
              <CardTitle>{t('metrics.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{t('metrics.km', {value: lesson.metrics.distance})}</p>
                  <p className="text-sm text-gray-500">{t('metrics.distance')}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Timer className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{t('metrics.kmh', {value: lesson.metrics.avgSpeed})}</p>
                  <p className="text-sm text-gray-500">{t('metrics.avgSpeed')}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Navigation className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{t('metrics.kmh', {value: lesson.metrics.maxSpeed})}</p>
                  <p className="text-sm text-gray-500">{t('metrics.maxSpeed')}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel  className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{t('metrics.liters', {value: lesson.metrics.fuelUsed})}</p>
                  <p className="text-sm text-gray-500">{t('metrics.fuelUsed')}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.suddenBrakes}</p>
                  <p className="text-sm text-gray-500">{t('metrics.suddenBrakes')}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.sharpTurns}</p>
                  <p className="text-sm text-gray-500">{t('metrics.sharpTurns')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('feedback.instructorTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{lesson.feedback.instructor}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('feedback.studentTitle')}</CardTitle>
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

      {/* Наступний урок */}
      {lesson.nextLesson && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('nextLesson.title')}</strong> {t('nextLesson.info', {
              date: format(new Date(lesson.nextLesson.date), 'd MMMM', { locale: uk }),
              time: lesson.nextLesson.time,
              type: lesson.nextLesson.type
            })}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}