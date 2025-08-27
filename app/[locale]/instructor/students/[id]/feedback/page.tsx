// /app/[locale]/instructor/students/[id]/feedback/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Star, Save, Send, ChevronLeft, MessageSquare, Target,
  TrendingUp, AlertCircle, CheckCircle, XCircle, Award,
  ThumbsUp, ThumbsDown, User, Calendar, Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function StudentFeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params?.id as string

  const [overallRating, setOverallRating] = useState(4)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')
  const [improvementAreas, setImprovementAreas] = useState<string[]>([])
  
  // Skills assessment state
  const [skills, setSkills] = useState({
    'Дотримання ПДР': 80,
    'Техніка водіння': 75,
    'Впевненість': 70,
    'Уважність': 85,
    'Реакція': 75,
    'Паркування': 60,
    'Маневрування': 70,
    'Міська їзда': 80,
    'Трасова їзда': 65,
    'Нічна їзда': 50
  })

  // Mock student data
  const student = {
    id: studentId,
    name: 'Марія Шевчук',
    avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
    lessonsCompleted: 24,
    totalLessons: 28,
    progress: 85,
    averageRating: 4.8
  }

  // Mock lessons for feedback
  const recentLessons = [
    { id: '1', date: '2024-02-03', type: 'Підготовка до іспиту' },
    { id: '2', date: '2024-02-01', type: 'Практика - місто' },
    { id: '3', date: '2024-01-29', type: 'Практика - траса' }
  ]

  // Predefined improvement areas
  const commonImprovements = [
    'Паралельне паркування',
    'Рух заднім ходом',
    'Проїзд перехресть',
    'Дотримання дистанції',
    'Швидкісний режим',
    'Використання дзеркал',
    'Екстрене гальмування',
    'Круговий рух',
    'Обгін',
    'Зміна смуги'
  ]

  // Previous feedback
  const previousFeedback = [
    {
      id: 1,
      date: '2024-02-01',
      lessonType: 'Практика - місто',
      rating: 4,
      feedback: 'Добре виконала паркування, потрібно попрацювати над впевненістю при зміні смуги',
      improvements: ['Зміна смуги', 'Впевненість']
    },
    {
      id: 2,
      date: '2024-01-29',
      lessonType: 'Практика - траса',
      rating: 5,
      feedback: 'Відмінна їзда по трасі, дотримання правил на високому рівні',
      improvements: []
    }
  ]

  const handleSkillChange = (skill: string, value: number[]) => {
    setSkills(prev => ({ ...prev, [skill]: value[0] }))
  }

  const toggleImprovement = (area: string) => {
    setImprovementAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  const handleSaveFeedback = () => {
    const feedbackData = {
      studentId,
      lessonId: selectedLesson,
      rating: overallRating,
      feedback: feedbackText,
      skills,
      improvementAreas,
      date: new Date()
    }
    console.log('Saving feedback:', feedbackData)
    router.push(`/instructor/students/${studentId}`)
  }

  const handleSendToStudent = () => {
    console.log('Sending feedback to student...')
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Оцінювання студента</h1>
            <p className="text-gray-600 mt-1">{student.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveFeedback}>
            <Save className="w-4 h-4 mr-2" />
            Зберегти
          </Button>
          <Button onClick={handleSendToStudent}>
            <Send className="w-4 h-4 mr-2" />
            Надіслати студенту
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{student.name}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Занять: {student.lessonsCompleted}/{student.totalLessons}</span>
                <span>Прогрес: {student.progress}%</span>
                <span>Середній рейтинг: {student.averageRating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Новий відгук</TabsTrigger>
          <TabsTrigger value="history">Історія оцінювань</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6 space-y-6">
          {/* Lesson Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Оберіть заняття</CardTitle>
              <CardDescription>Для якого заняття ви хочете залишити відгук</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть заняття" />
                </SelectTrigger>
                <SelectContent>
                  {recentLessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {format(new Date(lesson.date), 'd MMMM', { locale: uk })} - {lesson.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Overall Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Загальна оцінка</CardTitle>
              <CardDescription>Як студент виконав заняття</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setOverallRating(rating)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= overallRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-semibold">{overallRating}/5</span>
              </div>

              <RadioGroup defaultValue="good" className="mt-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">😊 Відмінно - готовий до наступного етапу</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">👍 Добре - є прогрес</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satisfactory" id="satisfactory" />
                  <Label htmlFor="satisfactory">📚 Задовільно - потрібна практика</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-work" id="needs-work" />
                  <Label htmlFor="needs-work">⚠️ Потрібно працювати</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Skills Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Оцінка навичок</CardTitle>
              <CardDescription>Оцініть кожну навичку від 0 до 100</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <Label>{skill}</Label>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(vals) => handleSkillChange(skill, vals)}
                      max={100}
                      step={5}
                      className={`
                        ${value >= 80 ? '[&_[role=slider]]:bg-green-500' : ''}
                        ${value >= 60 && value < 80 ? '[&_[role=slider]]:bg-yellow-500' : ''}
                        ${value < 60 ? '[&_[role=slider]]:bg-red-500' : ''}
                      `}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle>Області для покращення</CardTitle>
              <CardDescription>Оберіть навички, які потребують додаткової уваги</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {commonImprovements.map((area) => (
                  <Badge
                    key={area}
                    variant={improvementAreas.includes(area) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleImprovement(area)}
                  >
                    {improvementAreas.includes(area) && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Written Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Детальний відгук</CardTitle>
              <CardDescription>Опишіть прогрес студента та рекомендації</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Опишіть, що студент робив добре, що потрібно покращити, та ваші рекомендації для подальшого навчання..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="h-32"
              />
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Наступні кроки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Продовжити з поточним планом</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Додати додаткові заняття для проблемних областей</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Готовий до іспиту</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Потрібна консультація з керівництвом</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Історія оцінювань</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{feedback.lessonType}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(feedback.date), 'd MMMM yyyy', { locale: uk })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                    {feedback.improvements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {feedback.improvements.map((imp, index) => (
                          <Badge key={index} variant="outline">
                            {imp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Відгук буде збережено в профілі студента та може бути надісланий йому на email
        </AlertDescription>
      </Alert>
    </div>
  )
}