// components/forms/booking-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { format } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CreditCard,
  AlertCircle,
  Check,
  Loader2,
  Car,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  instructorId: string
  locationId: string
  startTime: Date
  duration?: number
  vehicleId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function BookingForm({
  instructorId,
  locationId,
  startTime,
  duration = 120,
  vehicleId,
  onSuccess,
  onCancel
}: BookingFormProps) {
  const router = useRouter()
  const t = useTranslations('booking.form')
  const locale = useLocale()
  const dateLocale = locale === 'pl' ? pl : uk
  
  const [lessonType, setLessonType] = useState('STANDARD')
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'payment'>('credits')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ✅ Виправлено
  const { data: instructor } = trpc.user.getById.useQuery(instructorId)
  const { data: location } = trpc.location.getById.useQuery(locationId)
  const { data: vehicle } = trpc.vehicle.getById.useQuery(vehicleId || '', {
    enabled: !!vehicleId
  })
  const { data: userPackages } = trpc.package.getUserPackages.useQuery({
    status: 'ACTIVE'
  })
  
  const createBooking = trpc.booking.create.useMutation({
    onSuccess: () => {
      toast.success(t('bookingCreated'))
      onSuccess?.()
      router.push(`/${locale}/student/calendar`)
    },
    onError: (error) => {
      toast.error(error.message)
      setIsSubmitting(false)
    }
  })
  
  const totalCredits = userPackages?.reduce((sum, pkg) => sum + pkg.creditsRemaining, 0) || 0
  const canUseCredits = totalCredits >= 1
  
  const lessonTypes = [
    { value: 'STANDARD', label: t('types.standard'), icon: BookOpen },
    { value: 'CITY_TRAFFIC', label: t('types.cityTraffic'), icon: Car },
    { value: 'HIGHWAY', label: t('types.highway'), icon: Car },
    { value: 'PARKING', label: t('types.parking'), icon: Car },
    { value: 'EXAM_PREPARATION', label: t('types.examPreparation'), icon: Check },
    { value: 'NIGHT_DRIVING', label: t('types.nightDriving'), icon: Clock }
  ]
  
  const handleSubmit = () => {
    setIsSubmitting(true)
    
    createBooking.mutate({
      instructorId,
      locationId,
      vehicleId,
      startTime: startTime.toISOString(),
      duration,
      lessonType,
      paymentMethod,
      notes: notes.trim() || undefined
    })
  }
  
  const endTime = new Date(startTime.getTime() + duration * 60000)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('date')}
              </Label>
              <p className="text-sm font-medium">
                {format(startTime, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('time')}
              </Label>
              <p className="text-sm font-medium">
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                <span className="text-muted-foreground ml-1">({duration} min)</span>
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('instructor')}
              </Label>
              <p className="text-sm font-medium">
                {instructor?.firstName} {instructor?.lastName}
              </p>
              {instructor?.rating && (
                <Badge variant="secondary" className="text-xs">
                  ⭐ {instructor.rating.toFixed(1)}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('location')}
              </Label>
              <p className="text-sm font-medium">{location?.name}</p>
              <p className="text-xs text-muted-foreground">{location?.address}</p>
            </div>
          </div>
          
          {vehicle && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {t('vehicle')}
                </Label>
                <p className="text-sm font-medium">
                  {vehicle.make} {vehicle.model} - {vehicle.registrationNumber}
                </p>
                <Badge variant="outline" className="text-xs">
                  {vehicle.transmission}
                </Badge>
              </div>
            </>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <Label>{t('lessonType')}</Label>
          <RadioGroup value={lessonType} onValueChange={setLessonType}>
            <div className="grid gap-3">
              {lessonTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label 
                      htmlFor={type.value} 
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {type.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <Label>{t('paymentMethod')}</Label>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <div className="space-y-3">
              <div className={cn(
                "flex items-start space-x-2 p-3 rounded-lg border",
                paymentMethod === 'credits' && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="credits" id="credits" disabled={!canUseCredits} />
                <Label htmlFor="credits" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>{t('useCredits')}</span>
                    <Badge variant={canUseCredits ? "default" : "secondary"}>
                      {totalCredits} {t('available')}
                    </Badge>
                  </div>
                  {!canUseCredits && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('insufficientCredits')}
                    </p>
                  )}
                </Label>
              </div>
              
              <div className={cn(
                "flex items-start space-x-2 p-3 rounded-lg border",
                paymentMethod === 'payment' && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="payment" id="payment" />
                <Label htmlFor="payment" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{t('payNow')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('paymentDescription')}
                  </p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>{t('notes')} ({t('optional')})</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
            rows={3}
          />
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('cancellationPolicy')}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting || (!canUseCredits && paymentMethod === 'credits')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('booking')}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('confirmBooking')}
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('cancel')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}