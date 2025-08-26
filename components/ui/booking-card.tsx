// components/ui/booking-card.tsx
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { format, isPast, isToday, isTomorrow, differenceInHours } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Car,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Navigation,
  CreditCard,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: {
    id: string
    status: string
    startTime: string | Date
    endTime: string | Date
    duration: number
    lessonType: string
    notes?: string | null
    isPaid: boolean
    usedCredits?: number
    instructor?: {
      id: string
      firstName: string
      lastName: string
      phone?: string | null
      email?: string | null
    } | null
    student?: {
      id: string
      firstName: string
      lastName: string
      phone?: string | null
      email?: string | null
    } | null
    vehicle?: {
      id: string
      make: string
      model: string
      registrationNumber: string
    } | null
    location?: {
      id: string
      name: string
      address?: string | null
      city?: string | null
    } | null
    payment?: {
      id: string
      status: string
      amount: number
    } | null
  }
  viewType?: 'student' | 'instructor' | 'admin'
  onCancel?: (id: string) => void
  onReschedule?: (id: string) => void
  onCheckIn?: (id: string) => void
  onCheckOut?: (id: string) => void
  className?: string
}

export function BookingCard({
  booking,
  viewType = 'student',
  onCancel,
  onReschedule,
  onCheckIn,
  onCheckOut,
  className
}: BookingCardProps) {
  const t = useTranslations('booking.card')
  const locale = useLocale()
  const dateLocale = locale === 'pl' ? pl : uk
  
  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const bookingIsPast = isPast(endTime)
  const bookingIsToday = isToday(startTime)
  const bookingIsTomorrow = isTomorrow(startTime)
  const hoursUntilBooking = differenceInHours(startTime, new Date())
  const canCancel = booking.status === 'CONFIRMED' && hoursUntilBooking > 24
  
  const getStatusIcon = () => {
    switch(booking.status) {
      case 'CONFIRMED': return Clock
      case 'COMPLETED': return CheckCircle
      case 'CANCELLED': return XCircle
      case 'NO_SHOW': return AlertCircle
      case 'IN_PROGRESS': return Clock
      default: return Calendar
    }
  }
  
  const getStatusColor = () => {
    switch(booking.status) {
      case 'CONFIRMED': return 'default'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'destructive'
      case 'NO_SHOW': return 'warning'
      case 'IN_PROGRESS': return 'secondary'
      default: return 'outline'
    }
  }
  
  const StatusIcon = getStatusIcon()
  
  const handleGetDirections = () => {
    if (booking.location?.address) {
      const query = encodeURIComponent(`${booking.location.address}, ${booking.location.city || ''}`)
      window.open(`https://maps.google.com/?q=${query}`, '_blank')
    }
  }
  
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }
  
  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }
  
  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      bookingIsToday && "ring-2 ring-primary",
      bookingIsPast && "opacity-75",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              bookingIsToday && "bg-primary text-primary-foreground",
              !bookingIsToday && "bg-secondary"
            )}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">
                {format(startTime, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                <span className="ml-1">({booking.duration} min)</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor() as any}>
              {t(`status.${booking.status}`)}
            </Badge>
            {bookingIsToday && (
              <Badge variant="outline" className="border-primary text-primary">
                {t('today')}
              </Badge>
            )}
            {bookingIsTomorrow && (
              <Badge variant="outline">
                {t('tomorrow')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {viewType === 'student' && booking.instructor && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('instructor')}</p>
                <p className="text-muted-foreground">
                  {booking.instructor.firstName} {booking.instructor.lastName}
                </p>
              </div>
            </div>
          )}
          
          {viewType === 'instructor' && booking.student && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('student')}</p>
                <p className="text-muted-foreground">
                  {booking.student.firstName} {booking.student.lastName}
                </p>
              </div>
            </div>
          )}
          
          {booking.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('location')}</p>
                <p className="text-muted-foreground">
                  {booking.location.name}
                </p>
              </div>
            </div>
          )}
          
          {booking.vehicle && (
            <div className="flex items-start gap-2">
              <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('vehicle')}</p>
                <p className="text-muted-foreground">
                  {booking.vehicle.make} {booking.vehicle.model}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{t(`lessonType.${booking.lessonType}`)}</Badge>
          {booking.isPaid ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              {t('paid')}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {t('unpaid')}
            </Badge>
          )}
          {booking.usedCredits && booking.usedCredits > 0 && (
            <Badge variant="outline" className="gap-1">
              <CreditCard className="h-3 w-3" />
              {booking.usedCredits} {t('credits')}
            </Badge>
          )}
        </div>
        
        {booking.notes && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {booking.notes}
            </AlertDescription>
          </Alert>
        )}
        
        {booking.status === 'CONFIRMED' && !bookingIsPast && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {viewType === 'instructor' && (
                <>
                  {!bookingIsToday && onCheckIn && (
                    <Button size="sm" variant="outline" disabled>
                      {t('checkIn')}
                    </Button>
                  )}
                  {bookingIsToday && onCheckIn && (
                    <Button size="sm" onClick={() => onCheckIn(booking.id)}>
                      {t('checkIn')}
                    </Button>
                  )}
                </>
              )}
              
              {viewType === 'student' && canCancel && onCancel && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onCancel(booking.id)}
                >
                  {t('cancel')}
                </Button>
              )}
              
              {onReschedule && hoursUntilBooking > 24 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onReschedule(booking.id)}
                >
                  {t('reschedule')}
                </Button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {booking.location?.address && (
                  <DropdownMenuItem onClick={handleGetDirections}>
                    <Navigation className="mr-2 h-4 w-4" />
                    {t('getDirections')}
                  </DropdownMenuItem>
                )}
                
                {viewType === 'student' && booking.instructor?.phone && (
                  <DropdownMenuItem onClick={() => handleCall(booking.instructor!.phone!)}>
                    <Phone className="mr-2 h-4 w-4" />
                    {t('callInstructor')}
                  </DropdownMenuItem>
                )}
                
                {viewType === 'instructor' && booking.student?.phone && (
                  <DropdownMenuItem onClick={() => handleCall(booking.student!.phone!)}>
                    <Phone className="mr-2 h-4 w-4" />
                    {t('callStudent')}
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                {viewType === 'student' && booking.instructor?.email && (
                  <DropdownMenuItem onClick={() => handleEmail(booking.instructor!.email!)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t('emailInstructor')}
                  </DropdownMenuItem>
                )}
                
                {viewType === 'instructor' && booking.student?.email && (
                  <DropdownMenuItem onClick={() => handleEmail(booking.student!.email!)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t('emailStudent')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {booking.status === 'IN_PROGRESS' && viewType === 'instructor' && onCheckOut && (
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={() => onCheckOut(booking.id)}
            >
              {t('checkOut')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}