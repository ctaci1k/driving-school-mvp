// Шлях: /app/[locale]/student/schedule/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  Zap,
  Plus,
  CalendarDays,
  Timer,
  Circle,
  RotateCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Unified lesson type configuration
const lessonTypeConfig = {
  STANDARD: { icon: Car, color: 'blue' },
  HIGHWAY: { icon: Zap, color: 'purple' },
  PARKING: { icon: Circle, color: 'green' },
  NIGHT: { icon: Moon, color: 'indigo' },
  EXAM_PREP: { icon: BookOpen, color: 'red' },
  MANEUVERS: { icon: RotateCw, color: 'teal' },
  CITY: { icon: Sun, color: 'blue' }
};

// Unified mock data generator - МАКОВІ ДАНІ ЗАЛИШАЮТЬСЯ ПОЛЬСЬКОЮ
const generateMockLessons = () => {
  const lessons = [];
  const startDate = new Date(2024, 7, 1); // August 2024
  const endDate = new Date(2024, 9, 31); // October 2024
  
  const instructors = [
    { id: '1', name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff' },
    { id: '2', name: 'Anna Kowalczyk', avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff' },
    { id: '3', name: 'Tomasz Wiśniewski', avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff' },
  ];
  
  const vehicles = [
    'Toyota Yaris (WZ 12345)',
    'VW Golf (WZ 67890)',
    'Škoda Fabia (WZ 11111)'
  ];
  
  const locations = [
    'ul. Puławska 145',
    'Plac manewrowy',
    'ul. Wilanowska 89',
    'Stacja paliw Orlen',
    'WORD Warszawa',
    'al. KEN 36'
  ];

  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const lessonTypes = Object.keys(lessonTypeConfig);
  
  // Generate lessons for each day
  let lessonId = 1;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Skip some days randomly to make it realistic
    if (Math.random() > 0.3) continue;
    
    // Generate 1-3 lessons per day
    const lessonsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < lessonsPerDay; i++) {
      const instructor = instructors[Math.floor(Math.random() * instructors.length)];
      const lessonType = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
      const startTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const startHour = parseInt(startTime.split(':')[0]);
      const endTime = `${startHour + 2}:00`;
      
      // Determine status based on date
      let status = 'confirmed';
      const today = new Date(2024, 7, 27); // Current date in the app
      if (d < today) {
        status = Math.random() > 0.1 ? 'completed' : 'cancelled';
      } else if (d.getTime() === today.getTime()) {
        status = 'in_progress';
      } else {
        status = Math.random() > 0.2 ? 'confirmed' : 'pending';
      }
      
      lessons.push({
        id: String(lessonId++),
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        time: `${startTime}-${endTime}`,
        startTime,
        endTime,
        type: lessonType,
        instructor: instructor,
        vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        status: status,
        credits: Math.floor(Math.random() * 2) + 1,
        notes: Math.random() > 0.7 ? 'Dodatkowe uwagi dotyczące lekcji' : null
      });
    }
  }
  
  return lessons.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
};

export default function StudentSchedulePage() {
  const router = useRouter();
  const t = useTranslations('student.schedule');
  const [mockLessons] = useState(generateMockLessons());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 27)); // August 27, 2024
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [showCancelled, setShowCancelled] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const weekDays = [
    t('weekDays.mon'), t('weekDays.tue'), t('weekDays.wed'), 
    t('weekDays.thu'), t('weekDays.fri'), t('weekDays.sat'), t('weekDays.sun')
  ];
  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'), t('months.april'),
    t('months.may'), t('months.june'), t('months.july'), t('months.august'),
    t('months.september'), t('months.october'), t('months.november'), t('months.december')
  ];

  // Get unique instructors for filter
  const uniqueInstructors = useMemo(() => {
    const instructorsSet = new Set(mockLessons.map(l => l.instructor.name));
    return Array.from(instructorsSet);
  }, [mockLessons]);

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 2; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
        dateString: ''
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    // Fill remaining cells to make 42 (6 weeks)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
        dateString: ''
      });
    }
    
    return days;
  };

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

  const getLessonsForDate = (dateString: string) => {
    return mockLessons.filter(lesson => {
      if (lesson.date !== dateString) return false;
      if (selectedInstructor !== 'all' && lesson.instructor.name !== selectedInstructor) return false;
      if (!showCancelled && lesson.status === 'cancelled') return false;
      return true;
    });
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
    const config = lessonTypeConfig[type as keyof typeof lessonTypeConfig];
    const Icon = config?.icon || Car;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const statusLabel = t(`statuses.${status}`);
    const badges = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    const badgeClass = badges[status as keyof typeof badges] || badges.confirmed;
    return <Badge className={badgeClass}>{statusLabel}</Badge>;
  };

  const getLessonColor = (type: string) => {
    const config = lessonTypeConfig[type as keyof typeof lessonTypeConfig];
    const colorMap: { [key: string]: string } = {
      blue: 'border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100',
      green: 'border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100',
      purple: 'border-l-4 border-l-purple-500 bg-purple-50 hover:bg-purple-100',
      indigo: 'border-l-4 border-l-indigo-500 bg-indigo-50 hover:bg-indigo-100',
      red: 'border-l-4 border-l-red-500 bg-red-50 hover:bg-red-100',
      teal: 'border-l-4 border-l-teal-500 bg-teal-50 hover:bg-teal-100'
    };
    return colorMap[config?.color || 'blue'] || colorMap.blue;
  };

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setDetailsDialogOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    router.push(`/student/schedule/reschedule/${lesson.id}`);
  };

  const handleCancelLesson = (lesson: any) => {
    // TODO: Implement cancellation logic
    console.log('Cancel lesson:', lesson.id);
  };

  const filteredLessons = mockLessons.filter(lesson => {
    if (selectedInstructor !== 'all' && lesson.instructor.name !== selectedInstructor) return false;
    if (!showCancelled && lesson.status === 'cancelled') return false;
    return true;
  });

  // Month view component
  const MonthView = () => {
    const monthDays = getDaysInMonth(currentDate);
    
    return (
      <div className="grid grid-cols-7">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-100">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {monthDays.map((dayInfo, index) => {
          const dayLessons = dayInfo.isCurrentMonth ? getLessonsForDate(dayInfo.dateString) : [];
          const isToday = dayInfo.dateString === '2024-08-27';
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] p-2 border-b border-r border-gray-100 relative",
                !dayInfo.isCurrentMonth && "bg-gray-50",
                isToday && "bg-blue-50"
              )}
            >
              {dayInfo.isCurrentMonth && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-sm font-medium",
                      isToday ? "text-blue-600" : "text-gray-800"
                    )}>
                      {dayInfo.day}
                    </span>
                    {dayLessons.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayLessons.length}
                      </Badge>
                    )}
                  </div>
                  
                  <ScrollArea className="h-[70px]">
                    <div className="space-y-1">
                      {dayLessons.slice(0, 3).map(lesson => (
                        <div
                          key={lesson.id}
                          className={`text-xs p-1 rounded cursor-pointer transition-all ${getLessonColor(lesson.type)}`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {lesson.startTime}
                            </span>
                            {getLessonTypeIcon(lesson.type)}
                          </div>
                          <div className="text-xs opacity-75 truncate">
                            {t(`lessonTypes.${lesson.type.toLowerCase()}`)}
                          </div>
                        </div>
                      ))}
                      {dayLessons.length > 3 && (
                        <button
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium w-full text-left"
                          onClick={() => {
                            setCurrentDate(dayInfo.date);
                            setCurrentView('list');
                          }}
                        >
                          +{dayLessons.length - 3} {t('more')}
                        </button>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
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
              const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              const isToday = dateString === '2024-08-27';
              return (
                <div key={index} className={`bg-white p-3 text-center ${isToday ? 'bg-blue-50' : ''}`}>
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
              <React.Fragment key={`hour-block-${hour}`}>
                <div className="bg-gray-50 p-2 text-xs text-gray-600 text-right">
                  {hour}:00
                </div>
                {weekDates.map((date, dayIndex) => {
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const dayLessons = getLessonsForDate(dateStr);
                  const hourStr = `${String(hour).padStart(2, '0')}:00`;
                  const lessonAtThisTime = dayLessons.find(lesson => lesson.startTime === hourStr);

                  return (
                    <div key={`${dayIndex}-${hour}`} className="bg-white min-h-[60px] p-1 relative">
                      {lessonAtThisTime && (
                        <div 
                          className={`absolute inset-x-1 p-2 rounded cursor-pointer transition-shadow ${getLessonColor(lessonAtThisTime.type)}`}
                          style={{ height: '118px' }} // 2-hour span
                          onClick={() => handleLessonClick(lessonAtThisTime)}
                        >
                          <div className="text-xs font-semibold">
                            {t(`lessonTypes.${lessonAtThisTime.type.toLowerCase()}`)}
                          </div>
                          <div className="text-xs text-gray-600">{lessonAtThisTime.instructor.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{lessonAtThisTime.location}</div>
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
    return (
      <div className="space-y-3">
        {filteredLessons.map(lesson => (
          <Card key={lesson.id} className={`${getLessonColor(lesson.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={lesson.instructor.avatar} />
                    <AvatarFallback>{lesson.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{t(`lessonTypes.${lesson.type.toLowerCase()}`)}</h3>
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
                  <Badge variant="outline">{lesson.credits} {t('credit')}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleLessonClick(lesson)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t('actions.details')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditLesson(lesson)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('actions.reschedule')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleCancelLesson(lesson)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('actions.cancel')}
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

  // Calculate stats
  const upcomingLessons = filteredLessons.filter(l => l.date >= '2024-08-27' && l.status !== 'cancelled');
  const thisWeekLessons = filteredLessons.filter(l => {
    const lessonDate = new Date(l.date);
    const weekDates = getWeekDates(currentDate);
    return lessonDate >= weekDates[0] && lessonDate <= weekDates[6];
  });
  const thisMonthLessons = filteredLessons.filter(l => {
    const lessonDate = new Date(l.date);
    return lessonDate.getMonth() === currentDate.getMonth() && 
           lessonDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/bookings/book">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('buttons.bookLesson')}
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('buttons.export')}
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
                  <SelectValue placeholder={t('filters.allInstructors')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allInstructors')}</SelectItem>
                  {uniqueInstructors.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="show-cancelled"
                  checked={showCancelled}
                  onCheckedChange={(checked) => setShowCancelled(checked as boolean)}
                />
                <label htmlFor="show-cancelled" className="text-sm">
                  {t('filters.showCancelled')}
                </label>
              </div>

              <Link href="/student/schedule/availability">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters.availableSlots')}
                </Button>
              </Link>
            </div>

            <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
              <TabsList>
                <TabsTrigger value="month">{t('views.month')}</TabsTrigger>
                <TabsTrigger value="week">{t('views.week')}</TabsTrigger>
                <TabsTrigger value="list">{t('views.list')}</TabsTrigger>
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
          {currentView === 'month' && <MonthView />}
          {currentView === 'week' && <WeekView />}
          {currentView === 'list' && <ListView />}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <span className="font-medium text-gray-700">{t('legend.title')}:</span>
            {Object.entries(lessonTypeConfig).slice(0, 5).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 bg-${config.color}-500 rounded`}></div>
                <span>{t(`lessonTypes.${key.toLowerCase()}`)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.thisWeek')}</p>
                <p className="text-2xl font-bold">{thisWeekLessons.length}</p>
                <p className="text-xs text-gray-500">{t('stats.lessons')}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.thisMonth')}</p>
                <p className="text-2xl font-bold">{thisMonthLessons.length}</p>
                <p className="text-xs text-gray-500">{t('stats.lessonsCount')}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalHours')}</p>
                <p className="text-2xl font-bold">{thisMonthLessons.length * 2}</p>
                <p className="text-xs text-gray-500">{t('stats.inThisMonth')}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.nextLesson')}</p>
                <p className="text-lg font-bold">
                  {upcomingLessons[0]?.date.split('-').slice(1).reverse().join('.')}
                </p>
                <p className="text-xs text-gray-500">{upcomingLessons[0]?.startTime}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialog.title')}</DialogTitle>
          </DialogHeader>
          {selectedLesson && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getLessonColor(selectedLesson.type).split(' ')[0]}>
                  {t(`lessonTypes.${selectedLesson.type.toLowerCase()}`)}
                </Badge>
                {getStatusBadge(selectedLesson.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.instructor')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.instructor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.date')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.time')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.location')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.vehicle')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.credits')}</p>
                  <p className="font-medium text-gray-800">{selectedLesson.credits}</p>
                </div>
              </div>

              {selectedLesson.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dialog.notes')}</p>
                  <p className="text-gray-800">{selectedLesson.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              {t('dialog.close')}
            </Button>
            {selectedLesson && selectedLesson.status === 'confirmed' && (
              <>
                <Button variant="outline" onClick={() => handleEditLesson(selectedLesson)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('dialog.reschedule')}
                </Button>
                <Button variant="destructive" onClick={() => handleCancelLesson(selectedLesson)}>
                  <X className="w-4 h-4 mr-2" />
                  {t('dialog.cancel')}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}