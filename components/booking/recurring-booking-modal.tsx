// components/booking/recurring-booking-modal.tsx

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Calendar, AlertCircle } from 'lucide-react'
import { format, addWeeks, addDays } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface RecurringBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: Date
  startTime: string
  onConfirm: (settings: RecurringSettings) => void
}

export interface RecurringSettings {
  pattern: 'weekly' | 'biweekly' | 'daily'
  endType: 'count' | 'date'
  count?: number
  endDate?: Date
  skipWeekends: boolean
}

export function RecurringBookingModal({
  open,
  onOpenChange,
  startDate,
  startTime,
  onConfirm
}: RecurringBookingModalProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  const [pattern, setPattern] = useState<'weekly' | 'biweekly' | 'daily'>('weekly')
  const [endType, setEndType] = useState<'count' | 'date'>('count')
  const [count, setCount] = useState(4)
  const [endDate, setEndDate] = useState(addWeeks(startDate, 8))
  const [skipWeekends, setSkipWeekends] = useState(true)
  
  // Generowanie preview dat
  const generatePreviewDates = () => {
    const dates: Date[] = [startDate]
    let currentDate = new Date(startDate)
    const maxDates = endType === 'count' ? count : 20
    const finalDate = endType === 'date' ? endDate : addWeeks(startDate, 52)
    
    for (let i = 1; i < maxDates; i++) {
      if (pattern === 'daily') {
        currentDate = addDays(currentDate, 1)
      } else if (pattern === 'weekly') {
        currentDate = addWeeks(currentDate, 1)
      } else if (pattern === 'biweekly') {
        currentDate = addWeeks(currentDate, 2)
      }
      
      // Pomiń weekendy jeśli zaznaczono
      if (skipWeekends && pattern === 'daily') {
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate = addDays(currentDate, 1)
        }
      }
      
      if (currentDate <= finalDate) {
        dates.push(new Date(currentDate))
      } else {
        break
      }
    }
    
    return dates
  }
  
  const previewDates = generatePreviewDates()
  
  const handleConfirm = () => {
    onConfirm({
      pattern,
      endType,
      count: endType === 'count' ? count : undefined,
      endDate: endType === 'date' ? endDate : undefined,
      skipWeekends
    })
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('booking.recurringBooking.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pattern wyboru */}
          <div>
            <Label>{t('booking.recurringBooking.pattern')}</Label>
            <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">{t('booking.recurringBooking.daily')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">{t('booking.recurringBooking.weekly')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly">{t('booking.recurringBooking.biweekly')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Skip weekends (tylko dla daily) */}
          {pattern === 'daily' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skipWeekends"
                checked={skipWeekends}
                onChange={(e) => setSkipWeekends(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="skipWeekends">{t('booking.recurringBooking.skipWeekends')}</Label>
            </div>
          )}
          
          {/* End type */}
          <div>
            <Label>{t('booking.recurringBooking.endType')}</Label>
            <RadioGroup value={endType} onValueChange={(v) => setEndType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="count" id="count" />
                <Label htmlFor="count" className="flex items-center gap-2">
                  {t('booking.recurringBooking.afterLessons')}
                  <Input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    min={2}
                    max={20}
                    className="w-20"
                    disabled={endType !== 'count'}
                  />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date" className="flex items-center gap-2">
                  {t('booking.recurringBooking.untilDate')}
                  <Input
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    min={format(addDays(startDate, 1), 'yyyy-MM-dd')}
                    className="w-40"
                    disabled={endType !== 'date'}
                  />
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Preview */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              {t('booking.recurringBooking.preview')}
              <span className="text-sm text-gray-500">
                ({previewDates.length} {t('booking.recurringBooking.lessons')})
              </span>
            </Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {previewDates.map((date, idx) => (
                  <div 
                    key={idx}
                    className={`text-sm p-2 rounded ${idx === 0 ? 'bg-blue-100' : 'bg-white'} border`}
                  >
                    <div className="font-medium">
                      {format(date, 'EEE, d MMM', { locale: dateLocale })}
                    </div>
                    <div className="text-xs text-gray-600">{startTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Ostrzeżenie */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-900">{t('booking.recurringBooking.warning')}</p>
              <p className="text-yellow-700">{t('booking.recurringBooking.warningText')}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('booking.recurringBooking.confirm', { count: previewDates.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}