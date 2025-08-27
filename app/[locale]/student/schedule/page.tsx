// app/[locale]/student/schedule/page.tsx

'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Car,
  MapPin,
  Info,
  BookOpen,
  Check,
  X,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import React from 'react';

// Mock data
const mockLessons = [
  {
    id: '1',
    date: '2024-08-28',
    time: '14:00-16:00',
    type: 'Jazda miejska',
    instructor: {
      name: 'Piotr Nowak',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
    },
    vehicle: 'Toyota Yaris (WZ 12345)',
    location: 'ul. Puławska 145',
    status: 'confirmed',
    credits: 2,
    color: 'blue'
  },
  {
    id: '2',
    date: '2024-08-30',
    time: '10:00-11:30',
    type: 'Parkowanie',
    instructor: {
      name: 'Anna Kowalczyk',
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff'
    },
    vehicle: 'VW Golf (WZ 67890)',
    location: 'Plac manewrowy',
    status: 'confirmed',
    credits: 1,
    color: 'green'
  },
  {
    id: '3',
    date: '2024-09-02',
    time: '18:00-20:00',
    type: 'Jazda nocna',
    instructor: {
      name: 'Piotr Nowak',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
    },
    vehicle: 'Toyota Yaris (WZ 12345)',
    location: 'ul. Wilanowska 89',
    status: 'pending',
    credits: 2,
    color: 'indigo'
  },
  {
    id: '4',
    date: '2024-09-05',
    time: '08:00-10:00',
    type: 'Jazda autostradą',
    instructor: {
      name: 'Tomasz Wiśniewski',
      avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff'
    },
    vehicle: 'Škoda Fabia (WZ 11111)',
    location: 'Stacja paliw Orlen',
    status: 'confirmed',
    credits: 2,
    color: 'purple'
  },
  {
    id: '5',
    date: '2024-09-10',
    time: '16:00-18:00',
    type: 'Egzamin próbny',
    instructor: {
      name: 'Piotr Nowak',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
    },
    vehicle: 'Toyota Yaris (WZ 12345)',
    location: 'WORD Warszawa',
    status: 'confirmed',
    credits: 2,
    color: 'red'
  }
];

const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

export default function StudentSchedulePage() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'list'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [showCancelled, setShowCancelled] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Helper functions
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDateHeader = () => {
    if (currentView === 'week') {
      const weekDates = getWeekDates(currentDate);
      const startMonth = monthNames[weekDates[0].getMonth()];
      const endMonth = monthNames[weekDates[6].getMonth()];
      const startDate = weekDates[0].getDate();
      const endDate = weekDates[6].getDate();
      
      if (startMonth === endMonth) {
        return `${startDate}-${endDate} ${startMonth} ${weekDates[0].getFullYear()}`;
      } else {
        return `${startDate} ${startMonth} - ${endDate} ${endMonth} ${weekDates[6].getFullYear()}`;
      }
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getLessonTypeIcon = (type: string) => {
    switch(type) {
      case 'Jazda nocna': return <Moon className="h-4 w-4" />;
      case 'Jazda autostradą': return <Zap className="h-4 w-4" />;
      case 'Parkowanie': return <Car className="h-4 w-4" />;
      case 'Egzamin próbny': return <BookOpen className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Potwierdzone</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Oczekuje</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Anulowane</Badge>;
      default:
        return null;
    }
  };

  const getLessonColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'border-l-blue-500 bg-blue-50',
      green: 'border-l-green-500 bg-green-50',
      purple: 'border-l-purple-500 bg-purple-50',
      indigo: 'border-l-indigo-500 bg-indigo-50',
      red: 'border-l-red-500 bg-red-50'
    };
    return colors[color] || colors.blue;
  };

  // Week view component
  const WeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Week header */}
          <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
            <div className="bg-white p-2"></div>
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={`weekday-${index}`} className={`bg-white p-3 text-center ${isToday ? 'bg-blue-50' : ''}`}>
                  <div className="text-xs text-gray-500">{weekDays[index]}</div>
                  <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {hours.map(hour => (
              <React.Fragment key={`hour-row-${hour}`}>
                <div className="bg-gray-50 p-2 text-xs text-gray-600 text-right">
                  {hour}:00
                </div>
                {weekDates.map((date, dayIndex) => {
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const dayLessons = mockLessons.filter(lesson => lesson.date === dateStr);
                  const hourStr = `${hour}:00`;
                  const lessonAtThisTime = dayLessons.find(lesson => lesson.time.startsWith(hourStr));

                  return (
                    <div key={`cell-${hour}-${dayIndex}`} className="bg-white min-h-[60px] p-1 relative">
                      {lessonAtThisTime && (
                        <div 
                          className={`absolute inset-x-1 p-2 rounded border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getLessonColor(lessonAtThisTime.color)}`}
                          onClick={() => setSelectedLesson(lessonAtThisTime.id)}
                        >
                          <div className="text-xs font-semibold">{lessonAtThisTime.type}</div>
                          <div className="text-xs text-gray-600">{lessonAtThisTime.instructor.name}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // List view component
  const ListView = () => {
    const filteredLessons = mockLessons.filter(lesson => {
      if (selectedInstructor !== 'all' && lesson.instructor.name !== selectedInstructor) return false;
      if (!showCancelled && lesson.status === 'cancelled') return false;
      return true;
    });

    return (
      <div className="space-y-3">
        {filteredLessons.map(lesson => (
          <Card key={lesson.id} className={`border-l-4 ${getLessonColor(lesson.color)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={lesson.instructor.avatar} />
                    <AvatarFallback>{lesson.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{lesson.type}</h3>
                      {getLessonTypeIcon(lesson.type)}
                      {getStatusBadge(lesson.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{lesson.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{lesson.instructor.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>{lesson.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{lesson.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{lesson.credits} kredyt</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Szczegóły
                      </DropdownMenuItem>
                      <Link href={`/student/schedule/reschedule/${lesson.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Przełóż
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Anuluj
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kalendarz lekcji</h1>
          <p className="text-gray-600">Zarządzaj swoim harmonogramem jazd</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/bookings/book">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Zarezerwuj lekcję
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Eksportuj
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Wszyscy instruktorzy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy instruktorzy</SelectItem>
                  <SelectItem value="Piotr Nowak">Piotr Nowak</SelectItem>
                  <SelectItem value="Anna Kowalczyk">Anna Kowalczyk</SelectItem>
                  <SelectItem value="Tomasz Wiśniewski">Tomasz Wiśniewski</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="show-cancelled"
                  checked={showCancelled}
                  onCheckedChange={(checked) => setShowCancelled(checked as boolean)}
                />
                <label htmlFor="show-cancelled" className="text-sm">
                  Pokaż anulowane
                </label>
              </div>

              <Link href="/student/schedule/availability">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Dostępne terminy
                </Button>
              </Link>
            </div>

            <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
              <TabsList>
                <TabsTrigger value="month">Miesiąc</TabsTrigger>
                <TabsTrigger value="week">Tydzień</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{formatDateHeader()}</h2>
            <Button variant="ghost" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Content */}
          {currentView === 'week' && <WeekView />}
          {currentView === 'list' && <ListView />}
          {currentView === 'month' && (
            <div className="text-center p-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Widok miesięczny w przygotowaniu</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-gray-700">Legenda:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Jazda miejska</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Parkowanie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Autostrada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span>Jazda nocna</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Egzamin</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ten tydzień</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-500">lekcje</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ten miesiąc</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-500">lekcji</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Godzin łącznie</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-gray-500">w tym miesiącu</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Następna lekcja</p>
                <p className="text-lg font-bold">28.08</p>
                <p className="text-xs text-gray-500">14:00</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}