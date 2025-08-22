// components/ui/booking-card.tsx

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, MapPin, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: {
    id: string
    startTime: Date | string
    endTime: Date | string
    status: string
    instructor?: {
      firstName: string
      lastName: string
      email?: string
    }
    student?: {
      firstName: string
      lastName: string
      email?: string
    }
    notes?: string
  }
  userRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  onCancel?: (id: string) => void
  onComplete?: (id: string) => void
}

export function BookingCard({ 
  booking, 
  userRole,
  onCancel,
  onComplete 
}: BookingCardProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const isPast = startTime < new Date()
  const isToday = format(startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  return (
    <Card className={cn(
      "transition-all",
      isPast && "opacity-75",
      isToday && "border-blue-500 shadow-md"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {format(startTime, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </span>
              {isToday && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                  {t('booking.today')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
              </span>
              <span className="text-gray-500">({t('booking.twoHours')})</span>
            </div>

            {/* Person Info */}
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              {userRole === 'STUDENT' && booking.instructor && (
                <span>
                  {t('booking.instructor')}: {booking.instructor.firstName} {booking.instructor.lastName}
                </span>
              )}
              {userRole === 'INSTRUCTOR' && booking.student && (
                <span>
                  {t('booking.student')}: {booking.student.firstName} {booking.student.lastName}
                </span>
              )}
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="text-gray-600">{booking.notes}</span>
              </div>
            )}
          </div>

          {/* Actions and Status */}
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              booking.status === 'CONFIRMED' && "bg-green-100 text-green-800",
              booking.status === 'CANCELLED' && "bg-red-100 text-red-800",
              booking.status === 'COMPLETED' && "bg-blue-100 text-blue-800",
              booking.status === 'NO_SHOW' && "bg-orange-100 text-orange-800"
            )}>
              {t(`booking.status.${booking.status.toLowerCase()}`)}
            </span>

            {booking.status === 'CONFIRMED' && !isPast && onCancel && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(booking.id)}
              >
                {t('common.cancel')}
              </Button>
            )}

            {userRole === 'INSTRUCTOR' && booking.status === 'CONFIRMED' && isPast && onComplete && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onComplete(booking.id)}
              >
                {t('booking.markComplete')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}