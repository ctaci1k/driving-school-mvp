// /app/[locale]/instructor/lessons/[id]/page.tsx
// Szczegóły konkretnej lekcji

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
import { pl } from 'date-fns/locale'

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
      name: 'Maria Kowalska',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=10B981&color=fff',
      phone: '+48501234569',
      email: 'maria.k@email.com',
      lessonsCompleted: 24,
      totalLessons: 28,
      progress: 85,
      joinDate: '2024-01-05'
    },
    
    type: 'Przygotowanie do egzaminu',
    category: 'B',
    
    location: {
      start: 'ul. Marszałkowska 100',
      end: 'Plac manewrowy',
      area: 'Trasa egzaminacyjna',
      coordinates: { lat: 52.2297, lng: 21.0122 }
    },
    
    vehicle: {
      id: 'v1',
      model: 'Toyota Corolla',
      number: 'WZ 1234 A',
      year: 2020
    },
    
    objectives: [
      { id: 1, title: 'Trasa egzaminacyjna', completed: true },
      { id: 2, title: 'Hamowanie awaryjne', completed: true },
      { id: 3, title: 'Parkowanie równoległe', completed: true },
      { id: 4, title: 'Zawracanie w ograniczonej przestrzeni', completed: false }
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
      improvements: ['Pewność przy parkowaniu', 'Szybkość podejmowania decyzji']
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
      instructor: 'Doskonała lekcja! Maria pokazała wielki postęp. Gotowa do egzaminu w 90%.',
      student: 'Dziękuję za cierpliwość! W końcu zrozumiałam parkowanie równoległe.',
      studentRating: 5
    },
    
    photos: [
      { id: 1, url: '/photo1.jpg', caption: 'Parkowanie' },
      { id: 2, url: '/photo2.jpg', caption: 'Trasa' }
    ],
    
    nextLesson: {
      date: '2024-02-05',
      time: '14:00',
      type: 'Finalne przygotowanie'
    }
  }

  const handleEditLesson = () => {
    // Logika edytowania
  }

  const handleShareLesson = () => {
    // Logika udostępniania
  }

  const handleDownloadReport = () => {
    // Logika pobierania raportu
  }

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
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
            <h1 className="text-2xl font-bold text-gray-900">Szczegóły lekcji</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(lesson.date), 'd MMMM yyyy', { locale: pl })} • {lesson.startTime} - {lesson.endTime}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareLesson}>
            <Share className="w-4 h-4 mr-2" />
            Udostępnij
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Raport
          </Button>
          <Button onClick={handleEditLesson}>
            <Edit className="w-4 h-4 mr-2" />
            Edytuj
          </Button>
        </div>
      </div>

      {/* Podstawowe informacje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kursant */}
        <Card>
          <CardHeader>
            <CardTitle>Kursant</CardTitle>
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
                <span>Z nami od {format(new Date(lesson.student.joinDate), 'd MMM yyyy', { locale: pl })}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Postęp kursu</span>
                <span className="text-sm font-medium">{lesson.student.progress}%</span>
              </div>
              <Progress value={lesson.student.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {lesson.student.lessonsCompleted} z {lesson.student.totalLessons} lekcji
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-1" />
                Zadzwoń
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Napisz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Szczegóły lekcji */}
        <Card>
          <CardHeader>
            <CardTitle>Informacje o lekcji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Typ lekcji</p>
                <Badge variant="outline" className="mt-1">{lesson.type}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Kategoria</p>
                <p className="font-medium">Kategoria {lesson.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Czas trwania</p>
                <p className="font-medium">{lesson.duration} minut</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Lokalizacja</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{lesson.location.area}</p>
                    <p className="text-sm text-gray-600">{lesson.location.start}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pojazd</p>
                <div className="flex items-center gap-2 mt-1">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{lesson.vehicle.model}</span>
                  <Badge variant="secondary">{lesson.vehicle.number}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant="default" className="mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Zakończona
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Płatność */}
        <Card>
          <CardHeader>
            <CardTitle>Płatność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{lesson.payment.amount} zł</p>
              <Badge variant="default" className="mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Opłacone
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sposób płatności:</span>
                <span className="font-medium">
                  {lesson.payment.method === 'cash' ? 'Gotówka' : 'Karta'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span className="font-medium">
                  {format(new Date(lesson.payment.date), 'd MMM yyyy', { locale: pl })}
                </span>
              </div>
            </div>

            <Alert className="mt-4">
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Płatność potwierdzona przez system
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Karty z szczegółowymi informacjami */}
      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="objectives">Cele</TabsTrigger>
          <TabsTrigger value="performance">Wyniki</TabsTrigger>
          <TabsTrigger value="metrics">Metryki</TabsTrigger>
          <TabsTrigger value="feedback">Opinie</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cele lekcji</CardTitle>
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
                      {objective.completed ? 'Wykonane' : 'Częściowo'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label>Dodatkowe notatki</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dodaj notatki o lekcji..."
                  className="mt-2"
                />
                <Button className="mt-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Zapisz notatki
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ocena wykonania</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">Ocena ogólna</p>
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
                        {skill === 'confidence' && 'Pewność siebie'}
                        {skill === 'technique' && 'Technika'}
                        {skill === 'rules' && 'Znajomość przepisów'}
                        {skill === 'safety' && 'Bezpieczeństwo'}
                      </span>
                      <span className="text-sm font-medium">{rating}/5</span>
                    </div>
                    <Progress value={rating * 20} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Liczba błędów</p>
                  <Badge variant={lesson.performance.mistakes <= 2 ? 'default' : 'destructive'}>
                    {lesson.performance.mistakes} błędów
                  </Badge>
                </div>

                <div>
                  <p className="font-medium mb-2">Wymaga poprawy</p>
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
              <CardTitle>Metryki jazdy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.distance} km</p>
                  <p className="text-sm text-gray-500">Dystans</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Timer className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.avgSpeed} km/h</p>
                  <p className="text-sm text-gray-500">Średnia prędkość</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Navigation className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.maxSpeed} km/h</p>
                  <p className="text-sm text-gray-500">Maks. prędkość</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel  className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.fuelUsed} l</p>
                  <p className="text-sm text-gray-500">Zużycie paliwa</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.suddenBrakes}</p>
                  <p className="text-sm text-gray-500">Gwałtowne hamowania</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{lesson.metrics.sharpTurns}</p>
                  <p className="text-sm text-gray-500">Ostre zakręty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Opinia instruktora</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{lesson.feedback.instructor}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opinia kursanta</CardTitle>
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

      {/* Następna lekcja */}
      {lesson.nextLesson && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Następna lekcja:</strong> {format(new Date(lesson.nextLesson.date), 'd MMMM', { locale: pl })} o {lesson.nextLesson.time} - {lesson.nextLesson.type}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}