// /app/[locale]/instructor/lessons/today/page.tsx
// Dzisiejsze lekcje instruktora

'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, MapPin, Phone, Navigation, Play, Pause, StopCircle,
  CheckCircle, XCircle, AlertCircle, Camera, FileText, Star,
  ChevronRight, User, Car, Fuel, Gauge, MessageSquare,
  Timer, Target, TrendingUp, Coffee, Battery
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function InstructorTodayLessonsPage() {
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [lessonTimer, setLessonTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Dzisiejsze lekcje
  const todayLessons = [
    {
      id: '1',
      time: '08:00 - 09:30',
      status: 'completed',
      student: {
        id: 's1',
        name: 'Anna Kowalczyk',
        phone: '+48 501 234 567',
        avatar: 'https://ui-avatars.com/api/?name=AK&background=EC4899&color=fff',
        lessonsCompleted: 12,
        progress: 65
      },
      type: 'Praktyka - miasto',
      location: {
        pickup: 'ul. Marszałkowska 1',
        area: 'Centrum miasta'
      },
      objectives: ['Parkowanie równoległe', 'Przejazd przez skrzyżowania'],
      duration: 90,
      distance: 18.5,
      rating: 5
    },
    {
      id: '2',
      time: '10:00 - 11:30',
      status: 'completed',
      student: {
        id: 's2',
        name: 'Jan Nowak',
        phone: '+48 501 234 568',
        avatar: 'https://ui-avatars.com/api/?name=JN&background=3B82F6&color=fff',
        lessonsCompleted: 5,
        progress: 30
      },
      type: 'Praktyka - plac manewrowy',
      location: {
        pickup: 'Ośrodek szkolenia kierowców',
        area: 'Plac manewrowy'
      },
      objectives: ['Ruszanie', 'Hamowanie', 'Skręty'],
      duration: 90,
      distance: 5.2,
      rating: 4
    },
    {
      id: '3',
      time: '12:00 - 13:30',
      status: 'in-progress',
      student: {
        id: 's3',
        name: 'Maria Wiśniewska',
        phone: '+48 501 234 569',
        avatar: 'https://ui-avatars.com/api/?name=MW&background=10B981&color=fff',
        lessonsCompleted: 22,
        progress: 85
      },
      type: 'Przygotowanie do egzaminu',
      location: {
        pickup: 'ul. Mickiewicza 100',
        area: 'Trasa egzaminacyjna'
      },
      objectives: ['Trasa egzaminacyjna', 'Hamowanie awaryjne'],
      duration: 90,
      distance: 0,
      rating: null
    },
    {
      id: '4',
      time: '14:30 - 16:00',
      status: 'upcoming',
      student: {
        id: 's4',
        name: 'Andrzej Kowalski',
        phone: '+48 501 234 570',
        avatar: 'https://ui-avatars.com/api/?name=AK&background=F59E0B&color=fff',
        lessonsCompleted: 10,
        progress: 55
      },
      type: 'Praktyka - drogi szybkiego ruchu',
      location: {
        pickup: 'ul. Zwycięstwa 50',
        area: 'Warszawa-Łódź'
      },
      objectives: ['Ruch po autostradzie', 'Wyprzedzanie', 'Zachowanie odstępu'],
      duration: 90,
      distance: 0,
      rating: null
    },
    {
      id: '5',
      time: '16:30 - 18:00',
      status: 'upcoming',
      student: {
        id: 's5',
        name: 'Natalia Kamińska',
        phone: '+48 501 234 571',
        avatar: 'https://ui-avatars.com/api/?name=NK&background=8B5CF6&color=fff',
        lessonsCompleted: 16,
        progress: 70
      },
      type: 'Praktyka - trudne warunki',
      location: {
        pickup: 'Plac Zwycięstwa',
        area: 'Centrum - Mokotów'
      },
      objectives: ['Jazda w korkach', 'Ruch okrężny'],
      duration: 90,
      distance: 0,
      rating: null
    }
  ]

  // Statystyki dnia
  const todayStats = {
    completed: 2,
    total: 5,
    distance: 23.7,
    earnings: 1500,
    rating: 4.5,
    fuel: 65
  }

  useEffect(() => {
    // Aktualizacja timera
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (isTimerRunning) {
        setLessonTimer(prev => prev + 1)
      }
    }, 1000)

    // Znajdź bieżącą lekcję
    const current = todayLessons.find(l => l.status === 'in-progress')
    if (current) {
      setCurrentLesson(current)
      setIsTimerRunning(true)
    }

    return () => clearInterval(timer)
  }, [isTimerRunning])

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartLesson = (lessonId: string) => {
    // Przejście na stronę check-in
    window.location.href = `/instructor/lessons/check-in/${lessonId}`
  }

  const handleEndLesson = () => {
    setIsTimerRunning(false)
    // Logika zakończenia lekcji
  }

  const calculateTimeUntil = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const lessonTime = new Date()
    lessonTime.setHours(hours, minutes, 0)
    
    const diff = lessonTime.getTime() - currentTime.getTime()
    if (diff <= 0) return 'Teraz'
    
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60))
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hoursUntil > 0) {
      return `${hoursUntil}g ${minutesUntil}min`
    }
    return `${minutesUntil}min`
  }

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dzisiejsze lekcje</h1>
        <p className="text-gray-600 mt-1">
          {format(currentTime, 'EEEE, d MMMM yyyy', { locale: pl })}
        </p>
      </div>

      {/* Szybkie statystyki */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Ukończone</p>
                <p className="text-xl font-bold">{todayStats.completed}/{todayStats.total}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Km</p>
                <p className="text-xl font-bold">{todayStats.distance}</p>
              </div>
              <Navigation className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Zarobek</p>
                <p className="text-xl font-bold">{todayStats.earnings} zł</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Ocena</p>
                <p className="text-xl font-bold">{todayStats.rating}</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Czas</p>
                <p className="text-xl font-bold">{format(currentTime, 'HH:mm')}</p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Paliwo</p>
                <p className="text-xl font-bold">{todayStats.fuel}%</p>
              </div>
              <Fuel className="w-5 h-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bieżąca lekcja */}
      {currentLesson && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Bieżąca lekcja</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default" className="animate-pulse">W TRAKCIE</Badge>
                  <span className="text-2xl font-mono font-bold text-blue-600">
                    {formatTimer(lessonTimer)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Pause className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={handleEndLesson}>
                  <StopCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentLesson.student.avatar} />
                  <AvatarFallback>{currentLesson.student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentLesson.student.name}</p>
                  <p className="text-sm text-gray-600">{currentLesson.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" className="justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Zdjęcia
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Notatki
              </Button>
              <Button variant="outline" className="justify-start">
                <Navigation className="w-4 h-4 mr-2" />
                Trasa
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/instructor/lessons/${currentLesson.id}`}>
                  <Target className="w-4 h-4 mr-2" />
                  Szczegóły
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Harmonogram lekcji */}
      <Card>
        <CardHeader>
          <CardTitle>Harmonogram na dziś</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${lesson.status === 'completed' ? 'bg-gray-50 border-gray-200' : ''}
                  ${lesson.status === 'in-progress' ? 'bg-blue-50 border-blue-300 shadow-md' : ''}
                  ${lesson.status === 'upcoming' ? 'bg-white border-gray-200 hover:shadow-md' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Czas i status */}
                    <div className="text-center min-w-[60px]">
                      <p className="font-semibold text-sm">{lesson.time.split(' - ')[0]}</p>
                      <p className="text-xs text-gray-500">{lesson.time.split(' - ')[1]}</p>
                      {lesson.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 mx-auto" />
                      )}
                      {lesson.status === 'in-progress' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full mt-1 mx-auto animate-pulse" />
                      )}
                      {lesson.status === 'upcoming' && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {calculateTimeUntil(lesson.time.split(' - ')[0])}
                        </Badge>
                      )}
                    </div>

                    {/* Informacje o uczniu */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lesson.student.avatar} />
                          <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{lesson.student.name}</p>
                        <Progress value={lesson.student.progress} className="w-20 h-1.5" />
                        <span className="text-xs text-gray-500">{lesson.student.progress}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lesson.type}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {lesson.location.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {lesson.objectives.length} celów
                        </span>
                        {lesson.distance > 0 && (
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            {lesson.distance} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Akcje */}
                  <div className="flex flex-col gap-2">
                    {lesson.status === 'completed' && lesson.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < lesson.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {lesson.status === 'upcoming' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStartLesson(lesson.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Rozpocznij
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/instructor/lessons/${lesson.id}`}>
                        Szczegóły
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}