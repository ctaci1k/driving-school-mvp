// app/[locale]/student/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  TrendingUp, 
  Award, 
  CreditCard,
  Bell,
  ChevronRight,
  MapPin,
  Star,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  Cloud,
  Sun,
  CloudRain,
  Wind
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

// Mock data
const mockUserData = {
  name: 'Jan Kowalski',
  avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
  credits: 12,
  packageExpiry: '2024-09-15',
  totalLessons: 24,
  completedLessons: 15,
  nextLesson: {
    id: '1',
    date: '2024-08-28',
    time: '14:00',
    instructor: 'Piotr Nowak',
    instructorAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
    type: 'Jazda miejska',
    location: 'ul. Puławska 145',
    vehicle: 'Toyota Yaris (WZ 12345)'
  },
  upcomingLessons: [
    { id: '2', date: '2024-08-30', time: '10:00', type: 'Parkowanie' },
    { id: '3', date: '2024-09-02', time: '16:00', type: 'Jazda nocna' }
  ],
  recentGrades: [
    { skill: 'Parkowanie równoległe', grade: 4.5, trend: 'up' },
    { skill: 'Zmiana pasów', grade: 4.0, trend: 'up' },
    { skill: 'Rondo', grade: 3.5, trend: 'same' }
  ],
  achievements: [
    { id: '1', name: '10 lekcji', icon: Award, unlocked: true },
    { id: '2', name: 'Pierwsza jazda nocna', icon: Award, unlocked: true },
    { id: '3', name: 'Mistrz parkowania', icon: Award, unlocked: false }
  ],
  notifications: [
    { id: '1', type: 'reminder', message: 'Lekcja jutro o 14:00', time: '2 godz. temu' },
    { id: '2', type: 'info', message: 'Nowe materiały do nauki', time: '1 dzień temu' }
  ],
  examReadiness: 72,
  weakPoints: ['Parkowanie tyłem', 'Rondo wielopasmowe'],
  weather: {
    temp: 22,
    condition: 'sunny',
    wind: 12
  }
};

export default function StudentDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeUntilLesson = () => {
    const lessonDate = new Date(`${mockUserData.nextLesson.date} ${mockUserData.nextLesson.time}`);
    const diff = lessonDate.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const timeUntil = getTimeUntilLesson();
  const progressPercentage = (mockUserData.completedLessons / mockUserData.totalLessons) * 100;

  const getWeatherIcon = () => {
    switch(mockUserData.weather.condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Witaj ponownie, {mockUserData.name}!
          </h1>
          <p className="text-gray-600">Twój postęp w nauce jazdy</p>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      {/* Next Lesson Card with Countdown */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg">Następna lekcja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={mockUserData.nextLesson.instructorAvatar} />
                  <AvatarFallback>PN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{mockUserData.nextLesson.instructor}</p>
                  <p className="text-sm text-gray-600">{mockUserData.nextLesson.type}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{mockUserData.nextLesson.date}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{mockUserData.nextLesson.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{mockUserData.nextLesson.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="h-4 w-4" />
                  <span>{mockUserData.nextLesson.vehicle}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">Szczegóły</Button>
                <Button size="sm" variant="outline">Przełóż</Button>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pozostało</p>
                <div className="text-3xl font-bold text-blue-600">
                  {timeUntil.hours}:{String(timeUntil.minutes).padStart(2, '0')}
                </div>
                <p className="text-xs text-gray-500">godzin</p>
              </div>
              
              {/* Weather for lesson */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {getWeatherIcon()}
                <span className="text-sm font-medium">{mockUserData.weather.temp}°C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credits Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kredyty</p>
                <p className="text-2xl font-bold">{mockUserData.credits}</p>
                <p className="text-xs text-gray-500">Ważne do {mockUserData.packageExpiry}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <Link href="/student/payments/buy-package">
              <Button className="w-full mt-3" size="sm" variant="outline">
                Dokup kredyty
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Postęp nauki</p>
                <p className="text-2xl font-bold">{mockUserData.completedLessons}/{mockUserData.totalLessons}</p>
                <p className="text-xs text-gray-500">lekcji ukończonych</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Exam Readiness */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gotowość do egzaminu</p>
                <p className="text-2xl font-bold">{mockUserData.examReadiness}%</p>
                <p className="text-xs text-gray-500">Prawie gotowy!</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <Link href="/student/progress/exam-readiness">
              <Button className="w-full mt-3" size="sm" variant="outline">
                Sprawdź szczegóły
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Next Available Slot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Najbliższy wolny termin</p>
                <p className="text-lg font-bold">Jutro 16:00</p>
                <p className="text-xs text-gray-500">z Piotr Nowak</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500" />
            </div>
            <Link href="/student/bookings/book">
              <Button className="w-full mt-3" size="sm">
                Zarezerwuj
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Ostatnie oceny i feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserData.recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{grade.skill}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(grade.grade)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{grade.grade}</span>
                      </div>
                    </div>
                  </div>
                  {grade.trend === 'up' && (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
            <Link href="/student/progress">
              <Button className="w-full mt-4" variant="outline">
                Zobacz wszystkie oceny
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/student/bookings/book" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Zarezerwuj lekcję
              </Button>
            </Link>
            <Link href="/student/schedule" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Zobacz harmonogram
              </Button>
            </Link>
            <Link href="/student/theory/materials" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Materiały do nauki
              </Button>
            </Link>
            <Link href="/student/instructors" className="block">
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Kontakt z instruktorem
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Notifications and Weak Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Powiadomienia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserData.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {notification.type === 'reminder' ? (
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak Points to Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Obszary do poprawy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserData.weakPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">{point}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Ćwicz</Badge>
                </div>
              ))}
            </div>
            <Link href="/student/progress/skills">
              <Button className="w-full mt-4" variant="outline">
                Plan poprawy
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Osiągnięcia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {mockUserData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center p-4 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-yellow-50'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-yellow-200'
                    : 'bg-gray-300'
                }`}>
                  <Award className={`h-6 w-6 ${
                    achievement.unlocked
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`} />
                </div>
                <p className="text-xs mt-2 text-center">{achievement.name}</p>
              </div>
            ))}
            <Link href="/student/progress/achievements" className="flex flex-col items-center justify-center p-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-xs mt-2 text-gray-600">Zobacz wszystkie</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}