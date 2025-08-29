// Шлях: /app/[locale]/student/schedule/reschedule/[id]/page.tsx

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Star,
  Sun,
  Cloud,
  CloudRain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock current lesson data
const currentLesson = {
  id: '1',
  date: '2024-08-28',
  time: '14:00-16:00',
  type: 'cityDriving',
  instructor: {
    name: 'Piotr Nowak',
    avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
    rating: 4.9
  },
  vehicle: 'Toyota Yaris (WZ 12345)',
  location: 'ul. Puławska 145',
  credits: 2,
  status: 'confirmed'
};

// Mock available slots for rescheduling
const availableSlots = [
  {
    id: 'slot1',
    date: '2024-08-30',
    dayName: 'friday',
    time: '10:00-12:00',
    instructor: 'Piotr Nowak',
    available: true,
    recommended: true,
    weather: 'sunny'
  },
  {
    id: 'slot2',
    date: '2024-08-30',
    dayName: 'friday',
    time: '16:00-18:00',
    instructor: 'Piotr Nowak',
    available: true,
    recommended: false,
    weather: 'cloudy'
  },
  {
    id: 'slot3',
    date: '2024-09-02',
    dayName: 'monday',
    time: '08:00-10:00',
    instructor: 'Piotr Nowak',
    available: true,
    recommended: false,
    weather: 'sunny'
  },
  {
    id: 'slot4',
    date: '2024-09-02',
    dayName: 'monday',
    time: '14:00-16:00',
    instructor: 'Piotr Nowak',
    available: true,
    recommended: true,
    weather: 'cloudy'
  },
  {
    id: 'slot5',
    date: '2024-09-03',
    dayName: 'tuesday',
    time: '12:00-14:00',
    instructor: 'Piotr Nowak',
    available: false,
    recommended: false,
    weather: 'rainy'
  },
  {
    id: 'slot6',
    date: '2024-09-04',
    dayName: 'wednesday',
    time: '18:00-20:00',
    instructor: 'Piotr Nowak',
    available: true,
    recommended: false,
    weather: 'sunny'
  }
];

export default function ReschedulePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('student.reschedule');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      default: return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getWeatherLabel = (weather: string) => {
    return t(`weather.${weather}`);
  };

  const getDayName = (dayKey: string) => {
    return t(`days.${dayKey}`);
  };

  const getLessonType = (typeKey: string) => {
    return t(`lessonTypes.${typeKey}`);
  };

  const calculateTimeDifference = () => {
    const lessonDate = new Date(currentLesson.date + ' ' + currentLesson.time.split('-')[0]);
    const now = new Date();
    const diffInHours = Math.floor((lessonDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    return diffInHours;
  };

  const hoursUntilLesson = calculateTimeDifference();
  const canRescheduleFreely = hoursUntilLesson >= 24;

  const handleReschedule = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowConfirmDialog(false);
    router.push('/student/schedule?rescheduled=true');
  };

  const reasons = [
    { id: 'sick', label: t('reasons.sick'), icon: '🤒' },
    { id: 'work', label: t('reasons.work'), icon: '💼' },
    { id: 'personal', label: t('reasons.personal'), icon: '👤' },
    { id: 'weather', label: t('reasons.weather'), icon: '🌧️' },
    { id: 'other', label: t('reasons.other'), icon: '📝' }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
      </div>

      {/* Warning/Info Alert */}
      {!canRescheduleFreely ? (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">{t('warning.title')}</AlertTitle>
          <AlertDescription className="text-red-700">
            {t('warning.description', { hours: hoursUntilLesson })}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">{t('freeReschedule.title')}</AlertTitle>
          <AlertDescription className="text-green-700">
            {t('freeReschedule.description', { hours: hoursUntilLesson })}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Lesson Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('currentLesson.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={currentLesson.instructor.avatar} />
                    <AvatarFallback>{currentLesson.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{currentLesson.instructor.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{currentLesson.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{currentLesson.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{currentLesson.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{currentLesson.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{currentLesson.location}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">{t('currentLesson.lessonType')}</p>
                  <p className="font-semibold">{getLessonType(currentLesson.type)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">{t('policy.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <p>{t('policy.free24h')}</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <p>{t('policy.fee12to24h')}</p>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-4 w-4 text-red-500 mt-0.5" />
                <p>{t('policy.fullFeeUnder12h')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Slots */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('newSlot.title')}</CardTitle>
              <CardDescription>{t('newSlot.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedSlot === slot.id
                        ? 'border-blue-500 bg-blue-50'
                        : slot.available
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                  >
                    {slot.recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                        {t('recommended')}
                      </Badge>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-1 h-12 rounded-full ${
                          selectedSlot === slot.id ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div>
                          <p className="font-semibold">
                            {getDayName(slot.dayName)}, {slot.date}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {slot.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          {getWeatherIcon(slot.weather)}
                          <span className="text-gray-600">{getWeatherLabel(slot.weather)}</span>
                        </div>
                        {slot.available ? (
                          <RadioGroup value={selectedSlot}>
                            <RadioGroupItem value={slot.id} />
                          </RadioGroup>
                        ) : (
                          <Badge variant="outline" className="text-red-600">
                            {t('taken')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reason for rescheduling */}
              <div className="mt-6 space-y-3">
                <Label>{t('reasonLabel')}</Label>
                <RadioGroup value={rescheduleReason} onValueChange={setRescheduleReason}>
                  <div className="grid grid-cols-2 gap-3">
                    {reasons.map(reason => (
                      <div key={reason.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={reason.id} id={reason.id} />
                        <Label htmlFor={reason.id} className="cursor-pointer">
                          <span className="mr-2">{reason.icon}</span>
                          {reason.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t('buttons.cancel')}
                </Button>
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={!selectedSlot}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('buttons.reschedule')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('confirmDialog.title')}</DialogTitle>
                      <DialogDescription>{t('confirmDialog.description')}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">{t('confirmDialog.oldSlot')}:</p>
                        <p className="font-semibold">{currentLesson.date}, {currentLesson.time}</p>
                      </div>
                      
                      <ArrowRight className="h-4 w-4 mx-auto text-gray-400" />
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">{t('confirmDialog.newSlot')}:</p>
                        <p className="font-semibold">
                          {getDayName(availableSlots.find(s => s.id === selectedSlot)?.dayName || '')}, {' '}
                          {availableSlots.find(s => s.id === selectedSlot)?.date}, {' '}
                          {availableSlots.find(s => s.id === selectedSlot)?.time}
                        </p>
                      </div>

                      {!canRescheduleFreely && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <CreditCard className="h-4 w-4 text-yellow-600" />
                          <AlertDescription>
                            {t('confirmDialog.feeWarning')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmDialog(false)}
                        disabled={isProcessing}
                      >
                        {t('buttons.cancel')}
                      </Button>
                      <Button
                        onClick={handleReschedule}
                        disabled={isProcessing}
                      >
                        {isProcessing ? t('buttons.processing') : t('buttons.confirmReschedule')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Info about finding other instructors */}
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('otherInstructorsInfo')}
                  <Button variant="link" className="px-1" onClick={() => router.push('/student/schedule/availability')}>
                    {t('viewAllSlots')}
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}