// app/[locale]/admin/bookings/calendar/page.tsx
// Widok kalendarza rezerwacji - wyświetla wszystkie rezerwacje w formie kalendarza

'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  MapPin,
  Filter,
  Download,
  Plus,
  Search,
  MoreVertical,
  Info,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Typy
type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
type BookingType = 'theory' | 'practice' | 'exam';
type ViewType = 'month' | 'week' | 'day' | 'list';

interface Booking {
  id: string;
  studentName: string;
  studentId: string;
  instructorName: string;
  instructorId: string;
  type: BookingType;
  status: BookingStatus;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  vehicle?: string;
  notes?: string;
  package: string;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    studentName: 'Jan Kowalski',
    studentId: 'st-1',
    instructorName: 'Adam Nowak',
    instructorId: 'ins-1',
    type: 'practice',
    status: 'confirmed',
    date: '2024-12-23',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Warszawa Centrum',
    vehicle: 'Toyota Corolla (WA 12345)',
    package: 'Pakiet Standard B'
  },
  {
    id: 'bk-2',
    studentName: 'Anna Wiśniewska',
    studentId: 'st-2',
    instructorName: 'Ewa Mazur',
    instructorId: 'ins-2',
    type: 'theory',
    status: 'confirmed',
    date: '2024-12-23',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Sala wykładowa A',
    package: 'Pakiet Premium B'
  },
  {
    id: 'bk-3',
    studentName: 'Piotr Zieliński',
    studentId: 'st-3',
    instructorName: 'Adam Nowak',
    instructorId: 'ins-1',
    type: 'practice',
    status: 'pending',
    date: '2024-12-23',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Warszawa Mokotów',
    vehicle: 'Volkswagen Golf (WA 67890)',
    package: 'Pakiet Standard B'
  },
  {
    id: 'bk-4',
    studentName: 'Maria Lewandowska',
    studentId: 'st-4',
    instructorName: 'Tomasz Wójcik',
    instructorId: 'ins-3',
    type: 'exam',
    status: 'confirmed',
    date: '2024-12-24',
    startTime: '08:00',
    endTime: '09:00',
    location: 'WORD Warszawa',
    package: 'Pakiet Standard B'
  },
  {
    id: 'bk-5',
    studentName: 'Krzysztof Nowicki',
    studentId: 'st-5',
    instructorName: 'Adam Nowak',
    instructorId: 'ins-1',
    type: 'practice',
    status: 'cancelled',
    date: '2024-12-24',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Warszawa Centrum',
    vehicle: 'Toyota Corolla (WA 12345)',
    notes: 'Odwołane przez kursanta - choroba',
    package: 'Pakiet Intensywny B'
  },
  // Więcej rezerwacji dla różnych dni
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `bk-${i + 6}`,
    studentName: `Student ${i + 6}`,
    studentId: `st-${i + 6}`,
    instructorName: ['Adam Nowak', 'Ewa Mazur', 'Tomasz Wójcik'][i % 3],
    instructorId: `ins-${(i % 3) + 1}`,
    type: (['practice', 'theory', 'exam'] as BookingType[])[i % 3],
    status: (['confirmed', 'pending', 'cancelled', 'completed'] as BookingStatus[])[i % 4],
    date: `2024-12-${20 + (i % 10)}`,
    startTime: `${9 + (i % 8)}:00`,
    endTime: `${10 + (i % 8)}:30`,
    location: ['Warszawa Centrum', 'Warszawa Mokotów', 'Sala wykładowa A'][i % 3],
    vehicle: i % 3 === 0 ? `Vehicle ${i}` : undefined,
    package: ['Pakiet Standard B', 'Pakiet Premium B', 'Pakiet Intensywny B'][i % 3]
  }))
];

const instructors = [
  { id: 'ins-1', name: 'Adam Nowak' },
  { id: 'ins-2', name: 'Ewa Mazur' },
  { id: 'ins-3', name: 'Tomasz Wójcik' }
];

const locations = [
  'Warszawa Centrum',
  'Warszawa Mokotów',
  'Warszawa Praga',
  'Sala wykładowa A',
  'Sala wykładowa B',
  'WORD Warszawa'
];

export default function BookingsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 23)); // December 2024
  const [viewType, setViewType] = useState<ViewType>('month');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState({
    instructor: 'all',
    type: 'all',
    status: 'all',
    location: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funkcje pomocnicze do kalendarza
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Dni z poprzedniego miesiąca
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Dni bieżącego miesiąca
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Dni z następnego miesiąca
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockBookings.filter(booking => {
      if (booking.date !== dateStr) return false;
      if (filters.instructor !== 'all' && booking.instructorId !== filters.instructor) return false;
      if (filters.type !== 'all' && booking.type !== filters.type) return false;
      if (filters.status !== 'all' && booking.status !== filters.status) return false;
      if (filters.location !== 'all' && booking.location !== filters.location) return false;
      return true;
    });
  };

  const monthDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date(2024, 11, 23));
  };

  const typeColors = {
    practice: 'bg-blue-100 text-blue-700 border-blue-200',
    theory: 'bg-purple-100 text-purple-700 border-purple-200',
    exam: 'bg-orange-100 text-orange-700 border-orange-200'
  };

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    confirmed: CheckCircle,
    pending: AlertCircle,
    cancelled: XCircle,
    completed: CheckCircle
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const exportCalendar = () => {
    console.log('Export calendar');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Kalendarz rezerwacji</h1>
              <p className="text-gray-600">Zarządzaj harmonogramem zajęć</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtry
              {Object.values(filters).filter(f => f !== 'all').length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(filters).filter(f => f !== 'all').length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCalendar}
            >
              <Download className="w-4 h-4 mr-2" />
              Eksportuj
            </Button>
            <Button
              size="sm"
              onClick={() => console.log('New booking')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nowa rezerwacja
            </Button>
          </div>
        </div>

        {/* Filtry */}
        {showFilters && (
          <Card className="bg-white border-gray-100 mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="instructor-filter">Instruktor</Label>
                  <Select
                    value={filters.instructor}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, instructor: value }))}
                  >
                    <SelectTrigger id="instructor-filter">
                      <SelectValue placeholder="Wszyscy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszyscy</SelectItem>
                      {instructors.map(instructor => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type-filter">Typ zajęć</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="Wszystkie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="practice">Praktyka</SelectItem>
                      <SelectItem value="theory">Teoria</SelectItem>
                      <SelectItem value="exam">Egzamin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Wszystkie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="confirmed">Potwierdzone</SelectItem>
                      <SelectItem value="pending">Oczekujące</SelectItem>
                      <SelectItem value="cancelled">Anulowane</SelectItem>
                      <SelectItem value="completed">Zakończone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location-filter">Lokalizacja</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger id="location-filter">
                      <SelectValue placeholder="Wszystkie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    instructor: 'all',
                    type: 'all',
                    status: 'all',
                    location: 'all'
                  })}
                >
                  Wyczyść filtry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kontrolki widoku */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Dzisiaj
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800 ml-4">
              {currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
            </h2>
          </div>

          <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
            <TabsList className="bg-white border border-gray-100">
              <TabsTrigger value="month">Miesiąc</TabsTrigger>
              <TabsTrigger value="week">Tydzień</TabsTrigger>
              <TabsTrigger value="day">Dzień</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Kalendarz */}
      <Card className="bg-white border-gray-100">
        <CardContent className="p-0">
          {viewType === 'month' && (
            <div className="grid grid-cols-7">
              {/* Nagłówki dni tygodnia */}
              {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map(day => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-100"
                >
                  {day}
                </div>
              ))}

              {/* Dni miesiąca */}
              {monthDays.map((dayInfo, index) => {
                const bookings = getBookingsForDate(dayInfo.date);
                const isToday = dayInfo.date.toDateString() === new Date(2024, 11, 23).toDateString();
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[120px] p-2 border-b border-r border-gray-100",
                      !dayInfo.isCurrentMonth && "bg-gray-50",
                      isToday && "bg-blue-50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm font-medium",
                        dayInfo.isCurrentMonth ? "text-gray-800" : "text-gray-400",
                        isToday && "text-blue-600"
                      )}>
                        {dayInfo.day}
                      </span>
                      {bookings.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {bookings.length}
                        </Badge>
                      )}
                    </div>
                    
                    <ScrollArea className="h-[80px]">
                      <div className="space-y-1">
                        {bookings.slice(0, 3).map(booking => (
                          <div
                            key={booking.id}
                            className={cn(
                              "text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity",
                              typeColors[booking.type]
                            )}
                            onClick={() => handleBookingClick(booking)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">
                                {booking.startTime} - {booking.studentName}
                              </span>
                            </div>
                            <div className="text-xs opacity-75 truncate">
                              {booking.type === 'practice' ? 'Praktyka' : 
                               booking.type === 'theory' ? 'Teoria' : 'Egzamin'}
                            </div>
                          </div>
                        ))}
                        {bookings.length > 3 && (
                          <button
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => {
                              setCurrentDate(dayInfo.date);
                              setViewType('day');
                            }}
                          >
                            +{bookings.length - 3} więcej
                          </button>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          )}

          {viewType === 'week' && (
            <div className="p-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  Widok tygodniowy w przygotowaniu. Proszę użyć widoku miesięcznego lub listy.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {viewType === 'day' && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentDate.toLocaleDateString('pl-PL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
              </div>
              <div className="space-y-3">
                {getBookingsForDate(currentDate).map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-800">{booking.startTime}</p>
                        <p className="text-xs text-gray-500">{booking.endTime}</p>
                      </div>
                      <div className="w-px h-10 bg-gray-200" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={typeColors[booking.type]}>
                            {booking.type === 'practice' ? 'Praktyka' : 
                             booking.type === 'theory' ? 'Teoria' : 'Egzamin'}
                          </Badge>
                          <Badge className={statusColors[booking.status]}>
                            {booking.status === 'confirmed' ? 'Potwierdzony' :
                             booking.status === 'pending' ? 'Oczekujący' :
                             booking.status === 'cancelled' ? 'Anulowany' : 'Zakończony'}
                          </Badge>
                        </div>
                        <p className="font-medium text-gray-800">{booking.studentName}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {booking.instructorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.location}
                          </span>
                          {booking.vehicle && (
                            <span className="flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {booking.vehicle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log('Edit', booking.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Cancel', booking.id)}>
                            <XCircle className="w-4 h-4 mr-2" />
                            Anuluj
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => console.log('Delete', booking.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {getBookingsForDate(currentDate).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Brak rezerwacji na ten dzień</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewType === 'list' && (
            <div className="p-6">
              <div className="space-y-3">
                {mockBookings
                  .filter(booking => {
                    if (filters.instructor !== 'all' && booking.instructorId !== filters.instructor) return false;
                    if (filters.type !== 'all' && booking.type !== filters.type) return false;
                    if (filters.status !== 'all' && booking.status !== filters.status) return false;
                    if (filters.location !== 'all' && booking.location !== filters.location) return false;
                    return true;
                  })
                  .map(booking => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleBookingClick(booking)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(booking.date).toLocaleDateString('pl-PL', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </p>
                          <p className="text-xs text-gray-500">{booking.startTime}</p>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={typeColors[booking.type]}>
                              {booking.type === 'practice' ? 'Praktyka' : 
                               booking.type === 'theory' ? 'Teoria' : 'Egzamin'}
                            </Badge>
                            <Badge className={statusColors[booking.status]}>
                              {booking.status === 'confirmed' ? 'Potwierdzony' :
                               booking.status === 'pending' ? 'Oczekujący' :
                               booking.status === 'cancelled' ? 'Anulowany' : 'Zakończony'}
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-800">{booking.studentName}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {booking.instructorName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.location}
                            </span>
                            {booking.vehicle && (
                              <span className="flex items-center gap-1">
                                <Car className="w-3 h-3" />
                                {booking.vehicle}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log('Edit', booking.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edytuj
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Cancel', booking.id)}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Anuluj
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => console.log('Delete', booking.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Usuń
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statystyki */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card className="bg-white border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dzisiejsze rezerwacje</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Oczekujące</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ten tydzień</p>
                <p className="text-2xl font-bold text-gray-800">68</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wykorzystanie</p>
                <p className="text-2xl font-bold text-gray-800">78%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog szczegółów rezerwacji */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Szczegóły rezerwacji</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={typeColors[selectedBooking.type]}>
                  {selectedBooking.type === 'practice' ? 'Praktyka' : 
                   selectedBooking.type === 'theory' ? 'Teoria' : 'Egzamin'}
                </Badge>
                <Badge className={statusColors[selectedBooking.status]}>
                  {selectedBooking.status === 'confirmed' ? 'Potwierdzony' :
                   selectedBooking.status === 'pending' ? 'Oczekujący' :
                   selectedBooking.status === 'cancelled' ? 'Anulowany' : 'Zakończony'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kursant</p>
                  <p className="font-medium text-gray-800">{selectedBooking.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instruktor</p>
                  <p className="font-medium text-gray-800">{selectedBooking.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedBooking.date).toLocaleDateString('pl-PL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Godzina</p>
                  <p className="font-medium text-gray-800">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lokalizacja</p>
                  <p className="font-medium text-gray-800">{selectedBooking.location}</p>
                </div>
                {selectedBooking.vehicle && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pojazd</p>
                    <p className="font-medium text-gray-800">{selectedBooking.vehicle}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pakiet</p>
                  <p className="font-medium text-gray-800">{selectedBooking.package}</p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notatki</p>
                  <p className="text-gray-800">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Zamknij
            </Button>
            <Button onClick={() => console.log('Edit booking', selectedBooking?.id)}>
              <Edit className="w-4 h-4 mr-2" />
              Edytuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}