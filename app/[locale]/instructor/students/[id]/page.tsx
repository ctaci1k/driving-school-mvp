// app/[locale]/instructor/students/[id]/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('instructor.students.profile')
  const studentId = params?.id as string
  const [isEditing, setIsEditing] = useState(false)

  const student = {
    id: studentId,
    name: 'Maria Wiśniewska',
    avatar: 'https://ui-avatars.com/api/?name=MW&background=10B981&color=fff',
    phone: '+48501234569',
    email: 'maria.w@email.com',
    address: 'ul. Nowy Świat, 22',
    dateOfBirth: '2000-05-15',
    category: 'B',
    
    // Інформація про навчання
    status: 'active',
    enrollmentDate: '2024-01-05',
    instructor: 'Piotr Kowalski',
    progress: 85,
    theoryStatus: 'completed',
    practiceHours: 36,
    
    // Заняття
    totalLessons: 28,
    completedLessons: 24,
    upcomingLessons: 2,
    missedLessons: 1,
    
    // Фінанси
    packageType: 'Standard',
    totalCost: 15000,
    paid: 12000,
    balance: 3000,
    nextPayment: '2024-02-10',
    
    // Результати
    averageScore: 4.8,
    strongPoints: ['Znajomość przepisów', 'Pewna jazda'],
    weakPoints: ['Parkowanie równoległe'],
    
    // Інформація про іспити
    theoryExamDate: '2024-01-25',
    theoryExamResult: 'passed',
    practiceExamDate: '2024-02-12',
    practiceExamAttempts: 0,
    
    // Екстрений контакт
    emergencyContact: 'Anna Wiśniewska',
    emergencyPhone: '+48501234570',
    
    // Нотатки
    notes: 'Szybko się uczy, potrzebuje więcej praktyki z parkowaniem'
  }

  const lessonHistory = [
    {
      id: 1,
      date: '2024-02-03',
      time: '14:30-16:00',
      type: 'examPrep',
      instructor: 'Piotr Kowalski',
      rating: 5,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-02-05',
      time: '10:00-11:30',
      type: 'city',
      instructor: 'Piotr Kowalski',
      rating: null,
      status: 'upcoming'
    }
  ]

  const payments = [
    {
      id: 1,
      date: '2024-01-05',
      amount: 5000,
      method: 'card',
      description: 'Pierwsza wpłata',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-20',
      amount: 7000,
      method: 'cash',
      description: 'Druga wpłata',
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                {t('cancel')}
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="w-4 h-4 mr-2" />
                {t('save')}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              {t('edit')}
            </Button>
          )}
        </div>
      </div>

      {/* Головна інформаційна картка */}
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
                    {student.status === 'active' ? t('status.active') : t('status.inactive')}
                  </Badge>
                  <Badge variant="outline">{t('status.category')} {student.category}</Badge>
                  {student.theoryStatus === 'completed' && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('status.theoryPassed')}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('metrics.progress')}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{student.progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('metrics.lessons')}</p>
                  <p className="font-semibold">{student.completedLessons}/{student.totalLessons}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('metrics.practiceHours')}</p>
                  <p className="font-semibold">{student.practiceHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('metrics.rating')}</p>
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

      {/* Вкладки */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">{t('tabs.info')}</TabsTrigger>
          <TabsTrigger value="lessons">{t('tabs.lessons')}</TabsTrigger>
          <TabsTrigger value="payments">{t('tabs.payments')}</TabsTrigger>
          <TabsTrigger value="exams">{t('tabs.exams')}</TabsTrigger>
          <TabsTrigger value="notes">{t('tabs.notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('info.contactTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('info.phone')}</Label>
                  <Input value={student.phone} disabled={!isEditing} />
                </div>
                <div>
                  <Label>{t('info.email')}</Label>
                  <Input value={student.email} disabled={!isEditing} />
                </div>
                <div>
                  <Label>{t('info.dateOfBirth')}</Label>
                  <Input value={student.dateOfBirth} disabled={!isEditing} />
                </div>
                <div>
                  <Label>{t('info.address')}</Label>
                  <Input value={student.address} disabled={!isEditing} />
                </div>
                <div>
                  <Label>{t('info.emergencyContact')}</Label>
                  <Input value={student.emergencyContact} disabled={!isEditing} />
                </div>
                <div>
                  <Label>{t('info.emergencyPhone')}</Label>
                  <Input value={student.emergencyPhone} disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('info.learningTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('info.enrollmentDate')}</Label>
                  <Input value={student.enrollmentDate} disabled />
                </div>
                <div>
                  <Label>{t('info.packageType')}</Label>
                  <Input value={student.packageType} disabled />
                </div>
                <div>
                  <Label>{t('info.strongPoints')}</Label>
                  <div className="flex gap-2 mt-2">
                    {student.strongPoints.map(point => (
                      <Badge key={point} variant="outline">{point}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{t('info.weakPoints')}</Label>
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
              <CardTitle>{t('lessons.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonHistory.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{t(`lessons.practiceTypes.${lesson.type}`)}</p>
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
                        {lesson.status === 'completed' ? t('lessons.completed') : t('lessons.scheduled')}
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
              <CardTitle>{t('payments.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('payments.totalCost')}</p>
                  <p className="text-2xl font-bold">{t('currency')}{student.totalCost}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('payments.paid')}</p>
                  <p className="text-2xl font-bold text-green-600">{t('currency')}{student.paid}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('payments.balance')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{t('currency')}{student.balance}</p>
                </div>
              </div>

              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        {payment.date} • {t(`payments.methods.${payment.method}`)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{t('currency')}{payment.amount}</p>
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('payments.status.completed')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {student.balance > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t('payments.nextPaymentAlert', { 
                      amount: student.balance, 
                      date: student.nextPayment 
                    })}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('exams.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t('exams.theoryExam')}</p>
                      <p className="text-sm text-gray-500">{t('exams.date')}: {student.theoryExamDate}</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('exams.status.passed')}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t('exams.practiceExam')}</p>
                      <p className="text-sm text-gray-500">{t('exams.plannedDate')}: {student.practiceExamDate}</p>
                      <p className="text-xs text-gray-400">{t('exams.attempts')}: {student.practiceExamAttempts}</p>
                    </div>
                    <Badge variant="outline">
                      {t('exams.status.scheduled')}
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
              <CardTitle>{t('notes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={student.notes}
                disabled={!isEditing}
                className="h-32"
                placeholder={t('notes.placeholder')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}