// components/booking/recurring-booking-modal.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { format, addDays, addWeeks, isBefore, isWeekend } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/lib/toast'
import { useLocale } from 'next-intl'

interface RecurringBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseBooking: {
    instructorId: string
    locationId: string
    startTime: Date
    duration: number
    lessonType: string
  }
  onSuccess?: () => void
}

export function RecurringBookingModal({
  open,
  onOpenChange,
  baseBooking,
  onSuccess
}: RecurringBookingModalProps) {
  const t = useTranslations('booking.recurringBooking')
  const locale = useLocale()
  const dateLocale = locale === 'pl' ? pl : uk
  
  const [pattern, setPattern] = useState<'daily' | 'weekly' | 'biweekly'>('weekly')
  const [endType, setEndType] = useState<'after' | 'until'>('after')
  const [afterLessons, setAfterLessons] = useState(5)
  const [untilDate, setUntilDate] = useState(
    format(addDays(new Date(), 30), 'yyyy-MM-dd')
  )
  const [skipWeekends, setSkipWeekends] = useState(true)
  
  const createRecurringBookings = trpc.booking.createRecurring.useMutation({
    onSuccess: (data) => {
      toast.success(t('successMultiple', { count: data.created }))
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  const generateDates = () => {
    const dates: Date[] = []
    let currentDate = new Date(baseBooking.startTime)
    const maxDate = endType === 'until' 
      ? new Date(untilDate)
      : addDays(currentDate, 365) // Max 1 year
    const maxCount = endType === 'after' ? afterLessons : 52 // Max 52 lessons
    
    while (dates.length < maxCount && isBefore(currentDate, maxDate)) {
      if (!skipWeekends || !isWeekend(currentDate)) {
        dates.push(new Date(currentDate))
      }
      
      if (pattern === 'daily') {
        currentDate = addDays(currentDate, 1)
      } else if (pattern === 'weekly') {
        currentDate = addWeeks(currentDate, 1)
      } else if (pattern === 'biweekly') {
        currentDate = addWeeks(currentDate, 2)
      }
    }
    
    return dates
  }
  
  const previewDates = generateDates()
  
  const handleConfirm = () => {
    if (previewDates.length === 0) {
      toast.error(t('noDatesGenerated'))
      return
    }
    
    createRecurringBookings.mutate({
      baseBooking: {
        instructorId: baseBooking.instructorId,
        locationId: baseBooking.locationId,
        startTime: baseBooking.startTime.toISOString(),
        duration: baseBooking.duration,
        lessonType: baseBooking.lessonType,
      },
      pattern,
      endType,
      afterLessons: endType === 'after' ? afterLessons : undefined,
      untilDate: endType === 'until' ? untilDate : undefined,
      skipWeekends,
      dates: previewDates.map(d => d.toISOString())
    })
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>{t('pattern')}</Label>
            <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">{t('daily')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">{t('weekly')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly">{t('biweekly')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          {pattern === 'daily' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="skipWeekends"
                checked={skipWeekends}
                onCheckedChange={setSkipWeekends}
              />
              <Label htmlFor="skipWeekends">{t('skipWeekends')}</Label>
            </div>
          )}
          
          <div className="space-y-3">
            <Label>{t('endType')}</Label>
            <RadioGroup value={endType} onValueChange={(v) => setEndType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="after" id="after" />
                <Label htmlFor="after" className="flex items-center gap-2">
                  {t('afterLessons')}
                  <Input
                    type="number"
                    min="2"
                    max="52"
                    value={afterLessons}
                    onChange={(e) => setAfterLessons(parseInt(e.target.value) || 5)}
                    className="w-20 ml-2"
                    disabled={endType !== 'after'}
                  />
                  {t('lessons')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="until" id="until" />
                <Label htmlFor="until" className="flex items-center gap-2">
                  {t('untilDate')}
                  <Input
                    type="date"
                    value={untilDate}
                    onChange={(e) => setUntilDate(e.target.value)}
                    className="w-40 ml-2"
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 365), 'yyyy-MM-dd')}
                    disabled={endType !== 'until'}
                  />
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('preview')}</Label>
              <Badge variant="secondary">
                {previewDates.length} {t('lessons')}
              </Badge>
            </div>
            
            <ScrollArea className="h-48 w-full rounded-md border p-4">
              <div className="space-y-2">
                {previewDates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    {t('noDatesGenerated')}
                  </p>
                ) : (
                  previewDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {index + 1}.
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {format(date, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(date, 'HH:mm')} - {format(addDays(date, 0), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          {t('first')}
                        </Badge>
                      )}
                      {index === previewDates.length - 1 && (
                        <Badge variant="outline" className="text-xs">
                          {t('last')}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">{t('warning')}</p>
                <p className="text-sm">{t('warningText')}</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createRecurringBookings.isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={createRecurringBookings.isLoading || previewDates.length === 0}
          >
            {createRecurringBookings.isLoading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                {t('creating')}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('confirm', { count: previewDates.length })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}