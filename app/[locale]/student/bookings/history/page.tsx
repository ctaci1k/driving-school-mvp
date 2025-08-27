// app/[locale]/student/bookings/history/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  TrendingUp,
  Award,
  Car,
  User,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

interface HistoricalBooking {
  id: string;
  date: string;
  time: string;
  type: string;
  instructor: string;
  vehicle: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'no_show';
  rating?: number;
  price: number;
  hasInvoice: boolean;
  hasFeedback: boolean;
}

interface Statistics {
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  averageRating: number;
  successRate: number;
  favoriteInstructor: string;
  mostCommonType: string;
  totalSpent: number;
}

export default function BookingsHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<HistoricalBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<HistoricalBooking[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedView, setSelectedView] = useState<'list' | 'table'>('list');
  
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock data
    const mockBookings: HistoricalBooking[] = [
      {
        id: '1',
        date: '2024-08-20',
        time: '10:00',
        type: 'Jazda standardowa',
        instructor: 'Piotr Nowak',
        vehicle: 'Toyota Yaris',
        duration: 90,
        status: 'completed',
        rating: 5,
        price: 180,
        hasInvoice: true,
        hasFeedback: true
      },
      {
        id: '2',
        date: '2024-08-15',
        time: '14:00',
        type: 'Parkowanie',
        instructor: 'Anna Kowalczyk',
        vehicle: 'VW Golf',
        duration: 60,
        status: 'completed',
        rating: 4,
        price: 120,
        hasInvoice: true,
        hasFeedback: true
      },
      {
        id: '3',
        date: '2024-08-10',
        time: '16:00',
        type: 'Jazda nocna',
        instructor: 'Piotr Nowak',
        vehicle: 'Toyota Yaris',
        duration: 90,
        status: 'cancelled',
        price: 360,
        hasInvoice: false,
        hasFeedback: false
      },
      {
        id: '4',
        date: '2024-08-05',
        time: '12:00',
        type: 'Jazda autostradą',
        instructor: 'Tomasz Wiśniewski',
        vehicle: 'Škoda Fabia',
        duration: 120,
        status: 'completed',
        rating: 5,
        price: 360,
        hasInvoice: true,
        hasFeedback: true
      },
      {
        id: '5',
        date: '2024-07-30',
        time: '09:00',
        type: 'Manewry',
        instructor: 'Anna Kowalczyk',
        vehicle: 'VW Golf',
        duration: 90,
        status: 'completed',
        rating: 4,
        price: 180,
        hasInvoice: true,
        hasFeedback: false
      }
    ];

    const mockStatistics: Statistics = {
      totalLessons: 25,
      completedLessons: 22,
      totalHours: 45,
      averageRating: 4.6,
      successRate: 88,
      favoriteInstructor: 'Piotr Nowak',
      mostCommonType: 'Jazda standardowa',
      totalSpent: 4500
    };

    setTimeout(() => {
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= dateRange.from! && bookingDate <= dateRange.to!;
      });
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateRange, bookings]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: HistoricalBooking['status']) => {
    const variants = {
      completed: { label: 'Zakończona', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Anulowana', className: 'bg-gray-100 text-gray-700' },
      no_show: { label: 'Nieobecny', className: 'bg-red-100 text-red-700' }
    };
    return variants[status];
  };

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log('Exporting to CSV...');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Historia lekcji</h1>
          <p className="text-muted-foreground mt-1">
            Przeglądaj swoją historię jazd i postępy
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Eksportuj CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ukończone lekcje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{statistics.completedLessons}</span>
                <span className="text-sm text-muted-foreground">/ {statistics.totalLessons}</span>
              </div>
              <Progress value={(statistics.completedLessons / statistics.totalLessons) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Godziny jazdy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{statistics.totalHours}h</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Średnia ocena
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold">{statistics.averageRating}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wydane łącznie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{statistics.totalSpent} PLN</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Szukaj po typie, instruktorze lub pojeździe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="completed">Zakończone</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
                <SelectItem value="no_show">Nieobecne</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={selectedView === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedView('list')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedView === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedView('table')}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {selectedView === 'list' ? (
            <div className="divide-y">
              {paginatedBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nie znaleziono lekcji w historii</p>
                </div>
              ) : (
                paginatedBookings.map(booking => {
                  const statusInfo = getStatusBadge(booking.status);
                  return (
                    <div key={booking.id} className="p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{booking.type}</h3>
                            <Badge className={statusInfo.className}>
                              {statusInfo.label}
                            </Badge>
                            {booking.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < (booking.rating || 0)
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString('pl-PL')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.time} ({booking.duration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {booking.instructor}
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              {booking.vehicle}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{booking.price} PLN</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/student/bookings/${booking.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.hasInvoice && (
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Instruktor</TableHead>
                  <TableHead>Pojazd</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ocena</TableHead>
                  <TableHead>Cena</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.map(booking => {
                  const statusInfo = getStatusBadge(booking.status);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {new Date(booking.date).toLocaleDateString('pl-PL')}
                      </TableCell>
                      <TableCell>{booking.type}</TableCell>
                      <TableCell>{booking.instructor}</TableCell>
                      <TableCell>{booking.vehicle}</TableCell>
                      <TableCell>
                        <Badge className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{booking.rating}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{booking.price} PLN</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/student/bookings/${booking.id}`)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {booking.hasInvoice && (
                            <Button variant="ghost" size="icon">
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Poprzednia
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Następna
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}