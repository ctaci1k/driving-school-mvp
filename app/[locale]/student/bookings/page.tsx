// app/[locale]/student/bookings/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Car,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Eye,
  X,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Booking {
  id: string;
  date: string;
  time: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    registration: string;
  };
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'no_show';
  type: string;
  duration: number;
  price: number;
  paid: boolean;
}

export default function StudentBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  // Mock data
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        date: '2024-08-28',
        time: '10:00',
        instructor: {
          id: '1',
          name: 'Piotr Nowak',
          avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
        },
        vehicle: {
          id: '1',
          make: 'Toyota',
          model: 'Yaris',
          registration: 'WZ 12345'
        },
        location: 'Centrum - ul. Puławska 145',
        status: 'upcoming',
        type: 'Jazda standardowa',
        duration: 90,
        price: 180,
        paid: true
      },
      {
        id: '2',
        date: '2024-08-30',
        time: '14:00',
        instructor: {
          id: '2',
          name: 'Anna Kowalczyk',
          avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff'
        },
        vehicle: {
          id: '2',
          make: 'Volkswagen',
          model: 'Golf',
          registration: 'WZ 67890'
        },
        location: 'Mokotów - ul. Wilanowska 89',
        status: 'upcoming',
        type: 'Parkowanie',
        duration: 60,
        price: 120,
        paid: false
      },
      {
        id: '3',
        date: '2024-08-25',
        time: '16:00',
        instructor: {
          id: '1',
          name: 'Piotr Nowak',
          avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
        },
        vehicle: {
          id: '1',
          make: 'Toyota',
          model: 'Yaris',
          registration: 'WZ 12345'
        },
        location: 'Centrum - ul. Puławska 145',
        status: 'completed',
        type: 'Jazda nocna',
        duration: 90,
        price: 360,
        paid: true
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      booking.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      upcoming: { label: 'Nadchodzące', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Zakończone', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Anulowane', className: 'bg-gray-100 text-gray-700' },
      no_show: { label: 'Nieobecny', className: 'bg-red-100 text-red-700' }
    };
    return variants[status];
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    hoursCompleted: bookings
      .filter(b => b.status === 'completed')
      .reduce((acc, b) => acc + b.duration / 60, 0)
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Moje lekcje</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoimi lekcjami jazdy
          </p>
        </div>
        <Button 
          onClick={() => router.push('/student/bookings/book')}
          className="w-full sm:w-auto"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Zarezerwuj lekcję
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie lekcje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nadchodzące
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zakończone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Godziny jazdy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursCompleted.toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Szukaj po instruktorze lub typie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="upcoming">Nadchodzące</SelectItem>
                <SelectItem value="completed">Zakończone</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
                <SelectItem value="no_show">Nieobecny</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Okres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="today">Dzisiaj</SelectItem>
                <SelectItem value="week">Ten tydzień</SelectItem>
                <SelectItem value="month">Ten miesiąc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nie znaleziono lekcji</p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
              >
                Wyczyść filtry
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map(booking => {
            const statusInfo = getStatusBadge(booking.status);
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{booking.type}</h3>
                            <Badge className={statusInfo.className}>
                              {statusInfo.label}
                            </Badge>
                            {!booking.paid && booking.status === 'upcoming' && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Nieopłacone
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString('pl-PL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.time} ({booking.duration} min)
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/student/bookings/${booking.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Zobacz szczegóły
                            </DropdownMenuItem>
                            {booking.status === 'upcoming' && (
                              <>
                                <DropdownMenuItem onClick={() => router.push(`/student/schedule/reschedule/${booking.id}`)}>
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Przełóż
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <X className="w-4 h-4 mr-2" />
                                  Anuluj
                                </DropdownMenuItem>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Pobierz fakturę
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.instructor.avatar}
                            alt={booking.instructor.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">Instruktor</p>
                            <p className="text-sm text-muted-foreground">{booking.instructor.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Car className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Pojazd</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.vehicle.make} {booking.vehicle.model}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Lokalizacja</p>
                            <p className="text-sm text-muted-foreground">{booking.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-row lg:flex-col items-center gap-2">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cena</p>
                        <p className="text-xl font-bold">{booking.price} PLN</p>
                      </div>
                      {booking.status === 'upcoming' && !booking.paid && (
                        <Button size="sm" variant="outline" className="w-full">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Opłać
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Next lesson alert */}
      {stats.upcoming > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Masz {stats.upcoming} nadchodzących lekcji. Pamiętaj o punktualności!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}