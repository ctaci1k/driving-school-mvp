// app/[locale]/student/bookings/book/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Car, MapPin, Star, ChevronRight, ChevronLeft,
  Check, X, AlertCircle, Filter, Search, User, Award,
  Zap, Moon, Sun, Mountain, RotateCw, Navigation, Circle,
  GraduationCap, AlertTriangle, CheckCircle, CreditCard, Coins,
  Info, CalendarDays, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface LessonType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  duration: number;
  credits: number;
  price: number;
  recommended: boolean;
  color: string;
}

interface Instructor {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  completedLessons: number;
  successRate: number;
  avatar: string;
  nextAvailable: string;
  favorite: boolean;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel: string;
  registration: string;
  image: string;
  features: string[];
}

interface Location {
  id: string;
  name: string;
  distance: string;
}

export default function BookNewLessonPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [useCredits, setUseCredits] = useState(true);
  const [searchInstructor, setSearchInstructor] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const userCredits = 12;
  const lessonPrice = 180;

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                     'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  const instructorBusyDates = ['2024-08-18', '2024-08-22', '2024-08-25', '2024-08-29'];

  const lessonTypes: LessonType[] = [
    {
      id: 'STANDARD',
      name: 'Jazda standardowa',
      description: 'Podstawowa lekcja jazdy w mieście',
      icon: Car,
      duration: 90,
      credits: 1,
      price: 180,
      recommended: false,
      color: 'blue'
    },
    {
      id: 'HIGHWAY',
      name: 'Jazda autostradą',
      description: 'Nauka jazdy z wysokimi prędkościami',
      icon: Zap,
      duration: 120,
      credits: 2,
      price: 360,
      recommended: false,
      color: 'purple'
    },
    {
      id: 'PARKING',
      name: 'Parkowanie',
      description: 'Parkowanie równoległe i prostopadłe',
      icon: Circle,
      duration: 60,
      credits: 1,
      price: 120,
      recommended: false,
      color: 'green'
    },
    {
      id: 'NIGHT',
      name: 'Jazda nocna',
      description: 'Jazda w warunkach ograniczonej widoczności',
      icon: Moon,
      duration: 90,
      credits: 2,
      price: 360,
      recommended: true,
      color: 'indigo'
    },
    {
      id: 'EXAM_PREP',
      name: 'Przygotowanie do egzaminu',
      description: 'Symulacja egzaminu państwowego',
      icon: GraduationCap,
      duration: 120,
      credits: 2,
      price: 400,
      recommended: true,
      color: 'red'
    }
  ];

  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Piotr Nowak',
      rating: 4.9,
      reviews: 124,
      experience: '8 lat',
      specializations: ['Egzaminy', 'Jazda nocna', 'Autostrady'],
      completedLessons: 1250,
      successRate: 94,
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      nextAvailable: 'Jutro 14:00',
      favorite: true
    },
    {
      id: '2',
      name: 'Anna Kowalczyk',
      rating: 4.8,
      reviews: 98,
      experience: '5 lat',
      specializations: ['Parkowanie', 'Manewry', 'Miasto'],
      completedLessons: 890,
      successRate: 92,
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff',
      nextAvailable: 'Dziś 18:00',
      favorite: false
    }
  ];

  const vehicles: Vehicle[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Yaris',
      year: 2023,
      transmission: 'Manual',
      fuel: 'Benzyna',
      registration: 'WZ 12345',
      image: 'https://via.placeholder.com/300x200?text=Toyota+Yaris',
      features: ['ABS', 'ESP', 'Klimatyzacja', 'Parking sensors']
    },
    {
      id: '2',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      transmission: 'Manual',
      fuel: 'Diesel',
      registration: 'WZ 67890',
      image: 'https://via.placeholder.com/300x200?text=VW+Golf',
      features: ['ABS', 'ESP', 'Klimatyzacja', 'Kamera cofania']
    }
  ];

  const locations: Location[] = [
    { id: '1', name: 'Centrum - ul. Puławska 145', distance: '2.3 km' },
    { id: '2', name: 'Mokotów - ul. Wilanowska 89', distance: '4.1 km' },
    { id: '3', name: 'Ursynów - al. KEN 36', distance: '0.8 km' }
  ];

  const steps = [
    { id: 1, name: 'Typ lekcji', icon: Car },
    { id: 2, name: 'Instruktor', icon: User },
    { id: 3, name: 'Data i czas', icon: Calendar },
    { id: 4, name: 'Pojazd i miejsce', icon: MapPin },
    { id: 5, name: 'Potwierdzenie', icon: Check }
  ];

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7;
    
    const days = [];
    
    for (let i = startingDayOfWeek - 2; i >= 0; i--) {
      days.push({ day: 0, isCurrentMonth: false, date: null, dateString: '' });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    return days;
  };

  const isDateAvailable = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date < tomorrow) return false;
    
    if (instructorBusyDates.includes(dateString)) return false;
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return false;
    
    return true;
  };

  const getTimeSlots = () => {
    if (!selectedInstructor || !selectedDate) {
      return [
        { time: '08:00', available: false },
        { time: '10:00', available: false },
        { time: '12:00', available: false },
        { time: '14:00', available: false },
        { time: '16:00', available: false },
        { time: '18:00', available: false }
      ];
    }
    
    return [
      { time: '08:00', available: true },
      { time: '10:00', available: true },
      { time: '12:00', available: false },
      { time: '14:00', available: true },
      { time: '16:00', available: selectedInstructor === '1' },
      { time: '18:00', available: selectedInstructor === '2' }
    ];
  };

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConfirming(false);
    setBookingSuccess(true);
    
    setTimeout(() => {
      router.push('/student/bookings');
    }, 3000);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchInstructor.toLowerCase()) &&
    instructor.rating >= filterRating
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedType;
      case 2: return !!selectedInstructor;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: return !!selectedVehicle && !!selectedLocation;
      default: return true;
    }
  };

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Rezerwacja potwierdzona!</h2>
            <p className="text-muted-foreground mb-4">
              Twoja lekcja została zarezerwowana pomyślnie. 
              Otrzymasz potwierdzenie na email.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm">
                <strong>Data:</strong> {selectedDate}<br />
                <strong>Godzina:</strong> {selectedTime}<br />
                <strong>Instruktor:</strong> {instructors.find(i => i.id === selectedInstructor)?.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Przekierowanie do listy lekcji...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Zarezerwuj lekcję jazdy</h1>
          <p className="text-muted-foreground mt-1">Wybierz odpowiedni termin i instruktora</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-primary text-primary-foreground' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-primary' :
                        isCompleted ? 'text-green-600' :
                        'text-muted-foreground'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-20 lg:w-32 h-1 mx-2 transition-all ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Lesson Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Wybierz typ lekcji</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessonTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedType === type.id
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-border hover:border-muted-foreground hover:shadow-md'
                        }`}
                      >
                        {type.recommended && (
                          <Badge className="absolute -top-2 -right-2" variant="destructive">
                            Polecane
                          </Badge>
                        )}
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{type.duration} min</span>
                          <div className="text-right">
                            <span className="font-semibold text-primary">{type.credits} kredyt</span>
                            <span className="text-xs text-muted-foreground block">lub {type.price} PLN</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Select Instructor */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Wybierz instruktora</h2>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Szukaj instruktora..."
                        value={searchInstructor}
                        onChange={(e) => setSearchInstructor(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInstructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      onClick={() => setSelectedInstructor(instructor.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedInstructor === instructor.id
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-muted-foreground hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img src={instructor.avatar} alt={instructor.name} className="w-14 h-14 rounded-full" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{instructor.name}</h3>
                              {instructor.favorite && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-semibold">{instructor.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">({instructor.reviews} opinii)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Doświadczenie</p>
                          <p className="text-sm font-semibold">{instructor.experience}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Skuteczność</p>
                          <p className="text-sm font-semibold text-green-600">{instructor.successRate}%</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Specjalizacje:</p>
                        <div className="flex flex-wrap gap-1">
                          {instructor.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Najbliższy termin: {instructor.nextAvailable}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Wybierz datę i godzinę</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Wybierz dzień</h3>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newMonth = new Date(currentMonth);
                              newMonth.setMonth(newMonth.getMonth() - 1);
                              setCurrentMonth(newMonth);
                            }}
                            disabled={currentMonth.getMonth() === new Date().getMonth() && 
                                     currentMonth.getFullYear() === new Date().getFullYear()}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          
                          <h3 className="font-semibold">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </h3>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newMonth = new Date(currentMonth);
                              newMonth.setMonth(newMonth.getMonth() + 1);
                              setCurrentMonth(newMonth);
                            }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {generateCalendarDays(currentMonth).map((day, index) => {
                            const isToday = day.dateString === new Date().toISOString().split('T')[0];
                            const isSelected = selectedDate === day.dateString;
                            const isAvailable = day.date && day.isCurrentMonth && isDateAvailable(day.dateString);
                            const isBusy = day.dateString && instructorBusyDates.includes(day.dateString);
                            
                            return (
                              <button
                                key={index}
                                onClick={() => isAvailable && setSelectedDate(day.dateString)}
                                disabled={!isAvailable || !day.isCurrentMonth}
                                className={`
                                  p-2 rounded-lg text-sm font-medium transition-all relative
                                  ${!day.isCurrentMonth ? 'invisible' : ''}
                                  ${isSelected ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                                  ${isToday && !isSelected ? 'bg-primary/10 text-primary' : ''}
                                  ${isAvailable && !isSelected && !isToday ? 'hover:bg-muted' : ''}
                                  ${!isAvailable && day.isCurrentMonth ? 'text-muted-foreground cursor-not-allowed' : ''}
                                  ${isBusy ? 'bg-destructive/10 text-destructive/50 cursor-not-allowed' : ''}
                                `}
                              >
                                {day.day || ''}
                                {isBusy && day.isCurrentMonth && (
                                  <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Minimalne wyprzedzenie rezerwacji to 24 godziny.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Wybierz godzinę</h3>
                    
                    {!selectedDate ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">Najpierw wybierz datę</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          {getTimeSlots().map((slot) => (
                            <Button
                              key={slot.time}
                              variant={selectedTime === slot.time ? "default" : "outline"}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className="h-auto py-3"
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{slot.time}</span>
                              </div>
                              {!slot.available && (
                                <span className="text-xs ml-2">(Zajęte)</span>
                              )}
                            </Button>
                          ))}
                        </div>
                        
                        {selectedTime && (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                              Wybrano: <strong>{selectedDate}, {selectedTime}</strong>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Vehicle & Location */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Dostępne pojazdy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedVehicle === vehicle.id
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-border hover:border-muted-foreground hover:shadow-md'
                        }`}
                      >
                        <h4 className="font-semibold">
                          {vehicle.make} {vehicle.model}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{vehicle.registration}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{vehicle.year}</span>
                          <span>•</span>
                          <span>{vehicle.transmission}</span>
                          <span>•</span>
                          <span>{vehicle.fuel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Miejsce rozpoczęcia</h3>
                  <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                    {locations.map((location) => (
                      <div key={location.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted">
                        <RadioGroupItem value={location.id} id={location.id} />
                        <Label htmlFor={location.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{location.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{location.distance}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Podsumowanie rezerwacji</h2>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">Typ lekcji</span>
                      <span className="font-semibold">
                        {lessonTypes.find(t => t.id === selectedType)?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">Instruktor</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={instructors.find(i => i.id === selectedInstructor)?.avatar}
                          alt="Instruktor"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">
                          {instructors.find(i => i.id === selectedInstructor)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">Data i godzina</span>
                      <span className="font-semibold">{selectedDate}, {selectedTime}</span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">Pojazd</span>
                      <span className="font-semibold">
                        {vehicles.find(v => v.id === selectedVehicle)?.make} {vehicles.find(v => v.id === selectedVehicle)?.model}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Miejsce</span>
                      <span className="font-semibold">
                        {locations.find(l => l.id === selectedLocation)?.name}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metoda płatności</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div
                      onClick={() => setUseCredits(true)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                        useCredits ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Użyj kredytów</p>
                          <p className="text-sm text-muted-foreground">Dostępne: {userCredits} kredytów</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {lessonTypes.find(t => t.id === selectedType)?.credits || 0} kredyty
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setUseCredits(false)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                        !useCredits ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Zapłać online</p>
                          <p className="text-sm text-muted-foreground">Przelewy24</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">
                        {lessonTypes.find(t => t.id === selectedType)?.price || 0} PLN
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    Możesz anulować lub przełożyć lekcję do 24h przed jej rozpoczęciem bez utraty kredytów.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>

          {/* Navigation */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Wstecz
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Dalej
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirmBooking}
                disabled={isConfirming}
                className="min-w-[150px]"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Potwierdzanie...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Potwierdź rezerwację
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}