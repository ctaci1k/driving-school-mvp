// app/[locale]/instructor/dashboard/page.tsx
// Головна сторінка інструктора з оглядом дня, статистикою та швидкими діями

'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, DollarSign, Users, Car, TrendingUp, 
  ChevronRight, Phone, Navigation, Play, StopCircle,
  AlertCircle, CheckCircle, MapPin, Star, Award,
  BarChart3, Activity, Target, Zap, Trophy, Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { format, addMinutes, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function InstructorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null)

  // Mock data
  const todayLessons = [
    {
      id: '1',
      startTime: '08:00',
      endTime: '09:30',
      duration: 90,
      status: 'completed',
      student: {
        id: 's1',
        name: 'Олена Коваленко',
        avatar: 'https://ui-avatars.com/api/?name=OK&background=EC4899&color=fff',
        phone: '+380501234567',
        progress: 65
      },
      type: 'Практика - місто',
      location: 'вул. Хрещатик, 1',
      vehicle: 'Toyota Corolla AA1234AA',
      notes: 'Працювали над паркуванням',
      rating: 5
    },
    {
      id: '2',
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      status: 'completed',
      student: {
        id: 's2',
        name: 'Іван Петренко',
        avatar: 'https://ui-avatars.com/api/?name=IP&background=3B82F6&color=fff',
        phone: '+380501234568',
        progress: 40
      },
      type: 'Практика - початківець',
      location: 'вул. Шевченка, 10',
      vehicle: 'Toyota Corolla AA1234AA',
      notes: 'Перше заняття, базові навички',
      rating: 4
    },
    {
      id: '3',
      startTime: '12:00',
      endTime: '13:30',
      duration: 90,
      status: 'completed',
      student: {
        id: 's3',
        name: 'Марія Шевчук',
        avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
        phone: '+380501234569',
        progress: 85
      },
      type: 'Підготовка до іспиту',
      location: 'Автодром',
      vehicle: 'Toyota Corolla AA1234AA',
      notes: 'Готова до іспиту',
      rating: 5
    },
    {
      id: '4',
      startTime: '14:30',
      endTime: '16:00',
      duration: 90,
      status: 'in-progress',
      student: {
        id: 's4',
        name: 'Андрій Бондаренко',
        avatar: 'https://ui-avatars.com/api/?name=AB&background=F59E0B&color=fff',
        phone: '+380501234570',
        progress: 55
      },
      type: 'Практика - траса',
      location: 'вул. Перемоги, 50',
      vehicle: 'Toyota Corolla AA1234AA',
      timeUntil: 'Зараз',
      notes: null,
      rating: null
    },
    {
      id: '5',
      startTime: '16:30',
      endTime: '18:00',
      duration: 90,
      status: 'upcoming',
      student: {
        id: 's5',
        name: 'Наталія Гриценко',
        avatar: 'https://ui-avatars.com/api/?name=NG&background=8B5CF6&color=fff',
        phone: '+380501234571',
        progress: 70
      },
      type: 'Практика - нічна їзда',
      location: 'вул. Лесі Українки, 25',
      vehicle: 'Toyota Corolla AA1234AA',
      timeUntil: '2г 30хв',
      notes: null,
      rating: null
    },
    {
      id: '6',
      startTime: '18:30',
      endTime: '20:00',
      duration: 90,
      status: 'upcoming',
      student: {
        id: 's6',
        name: 'Сергій Мельник',
        avatar: 'https://ui-avatars.com/api/?name=SM&background=EF4444&color=fff',
        phone: '+380501234572',
        progress: 45
      },
      type: 'Практика - місто',
      location: 'пл. Незалежності',
      vehicle: 'Toyota Corolla AA1234AA',
      timeUntil: '4г 30хв',
      notes: null,
      rating: null
    }
  ]

  // Weekly stats
  const weeklyStats = {
    totalLessons: 28,
    completedLessons: 18,
    totalHours: 42,
    totalEarnings: 8400,
    averageRating: 4.8,
    newStudents: 3,
    examsPassed: 2
  }

  // Earnings chart data
  const earningsData = [
    { day: 'Пн', amount: 1200 },
    { day: 'Вт', amount: 1800 },
    { day: 'Ср', amount: 1500 },
    { day: 'Чт', amount: 2100 },
    { day: 'Пт', amount: 1850 },
    { day: 'Сб', amount: 2400 },
    { day: 'Нд', amount: 0 }
  ]

  // Students progress
  const topStudents = [
    { name: 'Марія Шевчук', progress: 85, lessons: 24, nextExam: '5 лют' },
    { name: 'Наталія Гриценко', progress: 70, lessons: 18, nextExam: '12 лют' },
    { name: 'Олена Коваленко', progress: 65, lessons: 15, nextExam: null },
    { name: 'Андрій Бондаренко', progress: 55, lessons: 12, nextExam: null },
    { name: 'Сергій Мельник', progress: 45, lessons: 8, nextExam: null }
  ]

  // Achievements
  const recentAchievements = [
    { id: 1, title: '100 занять', icon: Award, date: '2 дні тому', color: 'text-yellow-500' },
    { id: 2, title: '5 зірок тиждень', icon: Star, date: 'Вчора', color: 'text-blue-500' },
    { id: 3, title: 'Кращий інструктор', icon: Trophy, date: 'Тиждень тому', color: 'text-purple-500' }
  ]

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Find current lesson
      const now = new Date()
      const currentIndex = todayLessons.findIndex(lesson => {
        if (lesson.status === 'in-progress') return true
        
        const [startHour, startMinute] = lesson.startTime.split(':').map(Number)
        const [endHour, endMinute] = lesson.endTime.split(':').map(Number)
        
        const start = new Date()
        start.setHours(startHour, startMinute, 0)
        
        const end = new Date()
        end.setHours(endHour, endMinute, 0)
        
        return isWithinInterval(now, { start, end })
      })
      
      setCurrentLessonIndex(currentIndex >= 0 ? currentIndex : null)
    }, 60000)

    return () => clearInterval(timer)
  }, [todayLessons])

  // Calculate timeline position
  const calculateTimelinePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const workdayStart = 8 * 60 // 8:00
    const workdayEnd = 20 * 60 // 20:00
    const workdayDuration = workdayEnd - workdayStart
    
    if (totalMinutes < workdayStart) return 0
    if (totalMinutes > workdayEnd) return 100
    
    return ((totalMinutes - workdayStart) / workdayDuration) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Доброго дня, Петре! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {format(currentTime, 'EEEE, d MMMM yyyy', { locale: uk })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Сьогодні</p>
                <p className="text-2xl font-bold">₴1,850</p>
                <p className="text-xs text-green-600">+₴350 від вчора</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Занять</p>
                <p className="text-2xl font-bold">3/6</p>
                <Progress value={50} className="h-1 mt-1" />
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Рейтинг</p>
                <p className="text-2xl font-bold">4.9</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= 4.9 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Цей тиждень</p>
                <p className="text-2xl font-bold">28 год</p>
                <p className="text-xs text-gray-600">18 занять</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Timeline */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Розклад на сьогодні</CardTitle>
            <Button variant="outline" size="sm">
              Переглянути все
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Current time indicator */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 transition-all duration-300"
              style={{ top: `${calculateTimelinePosition()}%` }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <span className="absolute left-6 -top-3 text-xs text-red-500 font-medium bg-white px-1 rounded">
                {format(currentTime, 'HH:mm')}
              </span>
            </div>

            {/* Lessons */}
            <div className="space-y-3">
              {todayLessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className={`
                    relative pl-10 
                    ${index === currentLessonIndex ? 'scale-[1.02]' : ''}
                    transition-all duration-300
                  `}
                >
                  {/* Timeline line */}
                  {index !== todayLessons.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`
                    absolute left-2 top-3 w-5 h-5 rounded-full border-4 transition-all
                    ${lesson.status === 'completed' 
                      ? 'bg-green-500 border-green-200' 
                      : lesson.status === 'in-progress'
                      ? 'bg-blue-500 border-blue-200 animate-pulse scale-125'
                      : 'bg-gray-300 border-gray-100'
                    }
                  `} />

                  {/* Lesson card */}
                  <div className={`
                    bg-white rounded-xl p-4 border transition-all
                    ${lesson.status === 'in-progress' 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:shadow-md'
                    }
                  `}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-800">
                            {lesson.startTime} - {lesson.endTime}
                          </p>
                          {lesson.status === 'in-progress' && (
                            <Badge variant="default" className="animate-pulse">
                              Триває
                            </Badge>
                          )}
                          {lesson.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{lesson.type}</p>
                      </div>
                      {lesson.timeUntil && lesson.status === 'upcoming' && (
                        <Badge variant="outline" className="ml-2">
                          Через {lesson.timeUntil}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={lesson.student.avatar} />
                        <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lesson.student.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Progress value={lesson.student.progress} className="h-1.5 w-20" />
                          <span className="text-xs text-gray-500">{lesson.student.progress}%</span>
                        </div>
                      </div>
                      {lesson.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{lesson.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{lesson.location}</span>
                    </div>

                    {lesson.notes && (
                      <div className="bg-gray-50 rounded-lg p-2 mb-3">
                        <p className="text-sm text-gray-600">{lesson.notes}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {lesson.status === 'upcoming' && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-2" />
                            Зателефонувати
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Navigation className="w-4 h-4 mr-2" />
                            Маршрут
                          </Button>
                        </>
                      )}
                      {lesson.status === 'in-progress' && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Navigation className="w-4 h-4 mr-2" />
                            Відстежувати
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            <StopCircle className="w-4 h-4 mr-2" />
                            Завершити
                          </Button>
                        </>
                      )}
                      {lesson.status === 'completed' && (
                        <Button size="sm" variant="outline" className="w-full">
                          Переглянути деталі
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Заробіток за тиждень</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-500">Всього</p>
              <p className="text-lg font-bold">₴{weeklyStats.totalEarnings}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Середнє/день</p>
              <p className="text-lg font-bold">₴{Math.round(weeklyStats.totalEarnings / 7)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Бонуси</p>
              <p className="text-lg font-bold text-green-600">+₴500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Прогрес студентів</CardTitle>
            <Button variant="outline" size="sm">
              Всі студенти
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.lessons} занять</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Progress value={student.progress} className="w-20 h-2" />
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                    {student.nextExam && (
                      <p className="text-xs text-gray-500 mt-1">Іспит: {student.nextExam}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentAchievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-gray-100 rounded-lg ${achievement.color}`}>
                  <achievement.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}