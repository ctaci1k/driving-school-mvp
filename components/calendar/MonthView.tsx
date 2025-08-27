// components/calendar/MonthView.tsx

'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Car,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  date: string;
  time: string;
  type: string;
  instructor: {
    name: string;
    avatar: string;
  };
  vehicle: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  credits: number;
  color: string;
}

interface MonthViewProps {
  currentDate: Date;
  lessons: Lesson[];
  onLessonClick?: (lesson: Lesson) => void;
  onLessonEdit?: (lesson: Lesson) => void;
  onLessonCancel?: (lesson: Lesson) => void;
}

const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
const monthNames = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

export default function MonthView({ 
  currentDate, 
  lessons, 
  onLessonClick,
  onLessonEdit,
  onLessonCancel 
}: MonthViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 1; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        date: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isSelected: dateStr === selectedDate
      });
    }
    
    // Fill remaining cells
    while (days.length % 7 !== 0) {
      days.push({ day: null, date: null, isCurrentMonth: false });
    }
    
    return days;
  };

  const getLessonsForDate = (date: string) => {
    return lessons.filter(lesson => lesson.date === date);
  };

  const getLessonColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="text-xs bg-green-100 text-green-700">Potw.</Badge>;
      case 'pending':
        return <Badge className="text-xs bg-yellow-100 text-yellow-700">Ocz.</Badge>;
      case 'cancelled':
        return <Badge className="text-xs bg-red-100 text-red-700">Anul.</Badge>;
      default:
        return null;
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="w-full">
      {/* Month Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Week days header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayInfo, index) => {
            const dayLessons = dayInfo.date ? getLessonsForDate(dayInfo.date) : [];
            const hasLessons = dayLessons.length > 0;
            
            return (
              <div
                key={index}
                className={cn(
                  'min-h-[100px] p-2 border-r border-b relative',
                  !dayInfo.isCurrentMonth && 'bg-gray-50',
                  dayInfo.isToday && 'bg-blue-50',
                  dayInfo.isSelected && 'bg-blue-100',
                  hasLessons && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => dayInfo.date && setSelectedDate(dayInfo.date)}
              >
                {dayInfo.day && (
                  <>
                    {/* Day number */}
                    <div className={cn(
                      'text-sm font-medium mb-1',
                      dayInfo.isToday ? 'text-blue-600' : 'text-gray-900'
                    )}>
                      {dayInfo.day}
                    </div>

                    {/* Lessons */}
                    <div className="space-y-1">
                      {dayLessons.slice(0, 3).map((lesson) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            'relative group cursor-pointer rounded p-1 text-xs transition-all',
                            'hover:shadow-md hover:z-10',
                            getLessonColor(lesson.color),
                            'text-white'
                          )}
                          onMouseEnter={() => setHoveredLesson(lesson.id)}
                          onMouseLeave={() => setHoveredLesson(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLessonClick?.(lesson);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate font-medium">
                              {lesson.time.split('-')[0]}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger 
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-3 w-3 text-white" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onLessonClick?.(lesson)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Szczegóły
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onLessonEdit?.(lesson)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Przełóż
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => onLessonCancel?.(lesson)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Anuluj
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="truncate opacity-90">
                            {lesson.type}
                          </div>

                          {/* Tooltip on hover */}
                          {hoveredLesson === lesson.id && (
                            <div className="absolute z-20 top-full left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-xl border">
                              <div className="space-y-2 text-gray-700">
                                <div className="font-semibold text-gray-900">
                                  {lesson.type}
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Clock className="h-3 w-3" />
                                  <span>{lesson.time}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <User className="h-3 w-3" />
                                  <span>{lesson.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Car className="h-3 w-3" />
                                  <span>{lesson.vehicle}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  <span>{lesson.location}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  {getStatusBadge(lesson.status)}
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.credits} kredyt
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {dayLessons.length > 3 && (
                        <div className="text-xs text-gray-600 text-center">
                          +{dayLessons.length - 3} więcej
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Jazda miejska</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Parkowanie</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Autostrada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span>Nocna</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Egzamin</span>
        </div>
      </div>
    </div>
  );
}