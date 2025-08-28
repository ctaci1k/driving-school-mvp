'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { cn } from '@/lib/utils';

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
  const t = useTranslations('student.bookingNew');
  
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

  const monthNames = t.raw('dateTime.months') as string[];
  const weekDays = t.raw('dateTime.weekDays') as string[];

  const lessonTypes: LessonType[] = [
    {
      id: 'STANDARD',
      name: t('lessonTypes.standard.name'),
      description: t('lessonTypes.standard.description'),
      icon: Car,
      duration: 90,
      credits: 1,
      price: 180,
      recommended: false,
      color: 'blue'
    },
    {
      id: 'HIGHWAY',
      name: t('lessonTypes.highway.name'),
      description: t('lessonTypes.highway.description'),
      icon: Zap,
      duration: 120,
      credits: 2,
      price: 360,
      recommended: false,
      color: 'purple'
    },
    {
      id: 'PARKING',
      name: t('lessonTypes.parking.name'),
      description: t('lessonTypes.parking.description'),
      icon: Circle,
      duration: 60,
      credits: 1,
      price: 120,
      recommended: false,
      color: 'green'
    },
    {
      id: 'NIGHT',
      name: t('lessonTypes.night.name'),
      description: t('lessonTypes.night.description'),
      icon: Moon,
      duration: 90,
      credits: 2,
      price: 360,
      recommended: true,
      color: 'indigo'
    },
    {
      id: 'EXAM_PREP',
      name: t('lessonTypes.examPrep.name'),
      description: t('lessonTypes.examPrep.description'),
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
      name: 'Петро Новак',
      rating: 4.9,
      reviews: 124,
      experience: t('instructor.years', { count: 8 }),
      specializations: [t('instructor.exams'), t('instructor.nightDriving'), t('instructor.highways')],
      completedLessons: 1250,
      successRate: 94,
      avatar: 'https://ui-avatars.com/api/?name=Petro+Novak&background=10B981&color=fff',
      nextAvailable: t('instructor.tomorrow') + ' 14:00',
      favorite: true
    },
    {
      id: '2',
      name: 'Анна Коваленко',
      rating: 4.8,
      reviews: 98,
      experience: t('instructor.years', { count: 5 }),
      specializations: [t('instructor.parking'), t('instructor.maneuvers'), t('instructor.city')],
      completedLessons: 890,
      successRate: 92,
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kovalenko&background=8B5CF6&color=fff',
      nextAvailable: t('instructor.today') + ' 18:00',
      favorite: false
    }
  ];

  const vehicles: Vehicle[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Yaris',
      year: 2023,
      transmission: 'manual',
      fuel: 'petrol',
      registration: 'AA 1234 BB',
      image: 'https://via.placeholder.com/300x200?text=Toyota+Yaris',
      features: [t('vehicle.features.abs'), t('vehicle.features.esp'), t('vehicle.features.airCondition'), t('vehicle.features.parkingSensors')]
    },
    {
      id: '2',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      transmission: 'manual',
      fuel: 'diesel',
      registration: 'AA 5678 CC',
      image: 'https://via.placeholder.com/300x200?text=VW+Golf',
      features: [t('vehicle.features.abs'), t('vehicle.features.esp'), t('vehicle.features.airCondition'), t('vehicle.features.rearCamera')]
    }
  ];

  const locations: Location[] = [
    { id: '1', name: 'Центр - вул. Хрещатик 145', distance: '2.3' },
    { id: '2', name: 'Печерськ - вул. Лесі Українки 89', distance: '4.1' },
    { id: '3', name: 'Позняки - вул. Урлівська 36', distance: '0.8' }
  ];

  const steps = [
    { id: 1, name: t('steps.lessonType'), icon: Car },
    { id: 2, name: t('steps.instructor'), icon: User },
    { id: 3, name: t('steps.dateTime'), icon: Calendar },
    { id: 4, name: t('steps.vehicleLocation'), icon: MapPin },
    { id: 5, name: t('steps.confirmation'), icon: Check }
  ];

  // Helper functions for calendar with dynamic slots
  const generateAvailableSlotsForInstructor = (date: string, instructorId: string) => {
    const dayDate = new Date(date);
    const dayOfWeek = dayDate.getDay();
    
    // No lessons on Sunday
    if (dayOfWeek === 0) return [];
    
    // All possible time slots
    const allSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    
    // Simulate different availability patterns
    const availableSlots = allSlots.filter(slot => {
      // Random unavailability (20% chance)
      if (Math.random() < 0.2) return false;
      
      // Instructor specific patterns
      if (instructorId === '1') {
        // Instructor 1: prefers mornings, doesn't work after 16:00 on Fridays
        if (dayOfWeek === 5 && parseInt(slot) >= 16) return false;
        if (slot === '18:00' && Math.random() < 0.5) return false;
      }
      
      if (instructorId === '2') {
        // Instructor 2: doesn't work early mornings
        if (slot === '08:00') return false;
        // More available in afternoons
        if (parseInt(slot) >= 14 && Math.random() < 0.9) return true;
      }
      
      // Day-specific patterns
      if (dayOfWeek === 1) { // Monday - fewer slots
        return Math.random() < 0.6;
      }
      if (dayOfWeek === 5) { // Friday - busier
        return Math.random() < 0.4;
      }
      
      return true;
    });
    
    return availableSlots;
  };

  const generateCalendarDaysWithSlots = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7;
    
    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 2; i >= 0; i--) {
      days.push({ 
        day: 0, 
        isCurrentMonth: false, 
        date: null, 
        dateString: '',
        availableSlots: []
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      // Generate available slots for this day if instructor is selected
      const availableSlots = selectedInstructor 
        ? generateAvailableSlotsForInstructor(dateString, selectedInstructor)
        : [];
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        dateString: dateString,
        availableSlots: availableSlots
      });
    }
    
    // Fill remaining cells
    while (days.length < 42) {
      days.push({ 
        day: 0, 
        isCurrentMonth: false, 
        date: null, 
        dateString: '',
        availableSlots: []
      });
    }
    
    return days;
  };

  const getAvailableSlotsForDate = (date: string) => {
    if (!selectedInstructor) return [];
    return generateAvailableSlotsForInstructor(date, selectedInstructor);
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
            <h2 className="text-2xl font-bold mb-2">{t('success.title')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('success.description')}
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm">
                <strong>{t('success.date')}:</strong> {selectedDate}<br />
                <strong>{t('success.time')}:</strong> {selectedTime}<br />
                <strong>{t('success.instructor')}:</strong> {instructors.find(i => i.id === selectedInstructor)?.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{t('success.redirecting')}</p>
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
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
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
                <h2 className="text-xl font-semibold">{t('lessonTypes.title')}</h2>
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
                            {t('lessonTypes.recommended')}
                          </Badge>
                        )}
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('lessonTypes.duration', { minutes: type.duration })}</span>
                          <div className="text-right">
                            <span className="font-semibold text-primary">{type.credits} {t('lessonTypes.credit', { count: type.credits })}</span>
                            <span className="text-xs text-muted-foreground block">{t('lessonTypes.or')} {t('lessonTypes.currency', { amount: type.price })}</span>
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
                <h2 className="text-xl font-semibold">{t('instructor.title')}</h2>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder={t('instructor.searchPlaceholder')}
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
                              <span className="text-sm text-muted-foreground">({t('instructor.reviews', { count: instructor.reviews })})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">{t('instructor.experience')}</p>
                          <p className="text-sm font-semibold">{instructor.experience}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">{t('instructor.successRate')}</p>
                          <p className="text-sm font-semibold text-green-600">{instructor.successRate}%</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">{t('instructor.specializations')}:</p>
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
                        <span className="text-muted-foreground">{t('instructor.nextAvailable')}: {instructor.nextAvailable}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{t('dateTime.title')}</h2>
                
                {/* Month Navigation */}
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
                      
                      <h3 className="text-lg font-semibold">
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
                  <CardContent className="p-0">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                      {/* Week day headers */}
                      {weekDays.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-b bg-muted/50">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar days */}
                      {generateCalendarDaysWithSlots().map((dayInfo, index) => {
                        const isToday = dayInfo.dateString === new Date().toISOString().split('T')[0];
                        const isSelected = selectedDate === dayInfo.dateString;
                        const isPast = dayInfo.date && dayInfo.date < new Date();
                        const isSunday = dayInfo.date?.getDay() === 0;
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "min-h-[120px] p-2 border-b border-r relative",
                              !dayInfo.isCurrentMonth && "bg-muted/30",
                              isToday && "bg-primary/5",
                              isSelected && "bg-primary/10 ring-2 ring-primary ring-inset"
                            )}
                          >
                            {dayInfo.isCurrentMonth && dayInfo.day && (
                              <>
                                <div className={cn(
                                  "text-sm font-medium mb-2",
                                  isToday && "text-primary",
                                  isPast && "text-muted-foreground",
                                  isSunday && "text-muted-foreground"
                                )}>
                                  {dayInfo.day}
                                </div>
                                
                                {/* Available slots for this day */}
                                <div className="space-y-1">
                                  {!isPast && !isSunday && selectedInstructor && (
                                    <>
                                      {dayInfo.availableSlots.length > 0 ? (
                                        <>
                                          {dayInfo.availableSlots.slice(0, 2).map(slot => (
                                            <button
                                              key={slot}
                                              onClick={() => {
                                                setSelectedDate(dayInfo.dateString);
                                                setSelectedTime(slot);
                                              }}
                                              className={cn(
                                                "w-full text-xs px-1 py-1 rounded transition-all",
                                                selectedDate === dayInfo.dateString && selectedTime === slot
                                                  ? "bg-primary text-primary-foreground"
                                                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                              )}
                                            >
                                              {slot}
                                            </button>
                                          ))}
                                          {dayInfo.availableSlots.length > 2 && (
                                            <button
                                              onClick={() => setSelectedDate(dayInfo.dateString)}
                                              className="w-full text-xs px-1 py-0.5 text-primary hover:underline"
                                            >
                                              {t('dateTime.moreSlots', { count: dayInfo.availableSlots.length - 2 })}
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <div className="text-xs text-muted-foreground text-center py-2">
                                          {t('dateTime.noSlots')}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  
                                  {!selectedInstructor && !isPast && !isSunday && (
                                    <div className="text-xs text-muted-foreground text-center py-2">
                                      {t('dateTime.selectInstructor')}
                                    </div>
                                  )}
                                  
                                  {(isPast || isSunday) && (
                                    <div className="text-xs text-muted-foreground text-center py-2">
                                      {isSunday ? t('dateTime.sunday') : t('dateTime.unavailable')}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="p-4 bg-muted/30 border-t">
                      <div className="flex items-center justify-center gap-6 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                          <span>{t('dateTime.legendAvailable')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary text-primary-foreground rounded flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{t('dateTime.legendSelected')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-muted border border-muted-foreground/20 rounded"></div>
                          <span>{t('dateTime.legendUnavailable')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Selected slot details */}
                {selectedDate && selectedTime && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      <strong>{t('dateTime.selected')}:</strong> {new Date(selectedDate).toLocaleDateString('uk-UA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}, {selectedTime}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Time slots detail view when date is selected */}
                {selectedDate && !selectedTime && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {t('dateTime.availableHours')} - {new Date(selectedDate).toLocaleDateString('uk-UA', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        {getAvailableSlotsForDate(selectedDate).map(slot => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            onClick={() => setSelectedTime(slot)}
                            className="h-auto py-3"
                          >
                            <div className="flex flex-col items-center">
                              <Clock className="w-4 h-4 mb-1" />
                              <span>{slot}</span>
                              <span className="text-xs opacity-75">{t('dateTime.hours', { count: 2 })}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      {getAvailableSlotsForDate(selectedDate).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          {t('dateTime.noSlotsForDay')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {!selectedInstructor && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('dateTime.selectInstructorFirst')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 4: Vehicle & Location */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">{t('vehicle.title')}</h3>
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
                          <span>{t(`vehicle.transmission.${vehicle.transmission}`)}</span>
                          <span>•</span>
                          <span>{t(`vehicle.fuel.${vehicle.fuel}`)}</span>
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
                  <h3 className="font-semibold">{t('location.title')}</h3>
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
                            <span className="text-sm text-muted-foreground">{t('location.distance', { distance: location.distance })}</span>
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
                <h2 className="text-xl font-semibold">{t('summary.title')}</h2>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">{t('summary.lessonType')}</span>
                      <span className="font-semibold">
                        {lessonTypes.find(t => t.id === selectedType)?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">{t('summary.instructor')}</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={instructors.find(i => i.id === selectedInstructor)?.avatar}
                          alt="Instructor"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">
                          {instructors.find(i => i.id === selectedInstructor)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">{t('summary.dateTime')}</span>
                      <span className="font-semibold">{selectedDate}, {selectedTime}</span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">{t('summary.vehicle')}</span>
                      <span className="font-semibold">
                        {vehicles.find(v => v.id === selectedVehicle)?.make} {vehicles.find(v => v.id === selectedVehicle)?.model}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('summary.location')}</span>
                      <span className="font-semibold">
                        {locations.find(l => l.id === selectedLocation)?.name}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('payment.title')}</CardTitle>
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
                          <p className="font-medium">{t('payment.useCredits')}</p>
                          <p className="text-sm text-muted-foreground">{t('payment.creditsAvailable', { count: userCredits })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {t('payment.creditsRequired', { count: lessonTypes.find(t => t.id === selectedType)?.credits || 0 })}
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
                          <p className="font-medium">{t('payment.payOnline')}</p>
                          <p className="text-sm text-muted-foreground">{t('payment.paymentService')}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">
                        {t('lessonTypes.currency', { amount: lessonTypes.find(t => t.id === selectedType)?.price || 0 })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    {t('alerts.cancellationPolicy')}
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
              {t('buttons.back')}
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                {t('buttons.next')}
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
                    {t('buttons.confirming')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('buttons.confirm')}
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