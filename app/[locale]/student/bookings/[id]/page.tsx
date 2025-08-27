// app/[locale]/student/bookings/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Car,
  CreditCard,
  Download,
  MessageSquare,
  Navigation,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Share2,
  Edit,
  X,
  ChevronLeft,
  Info,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface BookingDetails {
  id: string;
  date: string;
  time: string;
  endTime: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'no_show' | 'in_progress';
  type: string;
  duration: number;
  price: number;
  paid: boolean;
  paymentMethod: 'credits' | 'online' | 'cash';
  creditsUsed?: number;
  instructor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
    rating: number;
    experience: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    registration: string;
    year: number;
    transmission: string;
    fuel: string;
  };
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    skills: {
      parking: number;
      traffic: number;
      maneuvers: number;
    };
  };
  cancellationReason?: string;
  invoice?: {
    number: string;
    url: string;
  };
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Mock fetch booking details
    setTimeout(() => {
      setBooking({
        id: bookingId,
        date: '2024-08-28',
        time: '10:00',
        endTime: '11:30',
        status: 'upcoming',
        type: 'Jazda standardowa',
        duration: 90,
        price: 180,
        paid: true,
        paymentMethod: 'credits',
        creditsUsed: 1,
        instructor: {
          id: '1',
          name: 'Piotr Nowak',
          phone: '+48 123 456 789',
          email: 'piotr.nowak@szkola.pl',
          avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
          rating: 4.9,
          experience: '8 lat'
        },
        vehicle: {
          id: '1',
          make: 'Toyota',
          model: 'Yaris',
          registration: 'WZ 12345',
          year: 2023,
          transmission: 'Manual',
          fuel: 'Benzyna'
        },
        location: {
          name: 'Centrum - ul. Puławska 145',
          address: 'ul. Puławska 145, 02-715 Warszawa',
          coordinates: {
            lat: 52.2297,
            lng: 21.0122
          }
        },
        notes: 'Proszę o powtórzenie parkowania równoległego',
        invoice: {
          number: 'FV/2024/08/001234',
          url: '/invoices/FV-2024-08-001234.pdf'
        }
      });
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Lekcja anulowana",
      description: "Twoja lekcja została anulowana pomyślnie.",
    });
    
    setIsCancelling(false);
    setCancelDialogOpen(false);
    router.push('/student/bookings');
  };

  const getStatusBadge = (status: BookingDetails['status']) => {
    const variants = {
      upcoming: { label: 'Nadchodząca', className: 'bg-blue-100 text-blue-700', icon: Clock },
      in_progress: { label: 'W trakcie', className: 'bg-yellow-100 text-yellow-700', icon: Car },
      completed: { label: 'Zakończona', className: 'bg-green-100 text-green-700', icon: CheckCircle },
      cancelled: { label: 'Anulowana', className: 'bg-gray-100 text-gray-700', icon: XCircle },
      no_show: { label: 'Nieobecny', className: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };
    return variants[status];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Nie znaleziono rezerwacji</AlertTitle>
          <AlertDescription>
            Rezerwacja o podanym ID nie istnieje.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusInfo = getStatusBadge(booking.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/student/bookings')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Szczegóły lekcji</h1>
            <p className="text-muted-foreground mt-1">ID: #{booking.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          {booking.invoice && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Faktura
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informacje o lekcji</CardTitle>
                <Badge className={statusInfo.className}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {new Date(booking.date).toLocaleDateString('pl-PL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Godzina</p>
                    <p className="font-medium">{booking.time} - {booking.endTime}</p>
                    <p className="text-xs text-muted-foreground">{booking.duration} minut</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Typ lekcji</p>
                <p className="font-semibold text-lg">{booking.type}</p>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notatki</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Instructor Card */}
          <Card>
            <CardHeader>
              <CardTitle>Instruktor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.instructor.avatar}
                    alt={booking.instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{booking.instructor.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{booking.instructor.rating}</span>
                      <span className="text-sm text-muted-foreground">• {booking.instructor.experience} doświadczenia</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Wyślij wiadomość
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button variant="outline" className="justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  {booking.instructor.phone}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {booking.instructor.email}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pojazd</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {booking.vehicle.make} {booking.vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.vehicle.registration} • Rok {booking.vehicle.year}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {booking.vehicle.transmission} • {booking.vehicle.fuel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle>Miejsce spotkania</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">{booking.location.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.location.address}</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Otwórz w mapach
              </Button>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Płatność</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={booking.paid ? "success" : "destructive"}>
                  {booking.paid ? 'Opłacone' : 'Nieopłacone'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Metoda</span>
                <div className="flex items-center gap-2">
                  {booking.paymentMethod === 'credits' ? (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Kredyty ({booking.creditsUsed})</span>
                    </>
                  ) : booking.paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Online</span>
                    </>
                  ) : (
                    <span>Gotówka</span>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Kwota</span>
                <span className="text-xl font-bold">{booking.price} PLN</span>
              </div>

              {!booking.paid && booking.status === 'upcoming' && (
                <Button className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Opłać teraz
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          {booking.status === 'upcoming' && (
            <Card>
              <CardHeader>
                <CardTitle>Akcje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push(`/student/schedule/reschedule/${booking.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Przełóż lekcję
                </Button>
                <Button 
                  className="w-full text-destructive hover:text-destructive" 
                  variant="outline"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj lekcję
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Możesz anulować lub przełożyć lekcję do 24 godzin przed jej rozpoczęciem bez utraty kredytów.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anuluj lekcję</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz anulować tę lekcję? Jeśli anulujesz mniej niż 24 godziny przed rozpoczęciem, kredyty nie zostaną zwrócone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="reason" className="text-sm font-medium">
                Powód anulowania (opcjonalnie)
              </label>
              <Textarea
                id="reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Podaj powód anulowania..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Nie, zachowaj
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? 'Anulowanie...' : 'Tak, anuluj'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}