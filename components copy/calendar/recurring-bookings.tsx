// components/calendar/recurring-bookings.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, Repeat, AlertCircle } from 'lucide-react'
import { format, addDays, addWeeks } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface RecurrenceRule {
  pattern: 'weekly' | 'biweekly' | 'daily' | 'workdays' | 'custom'
  interval: number
  daysOfWeek?: number[]
  endType: 'never' | 'after' | 'date'
  endAfter?: number
  endDate?: Date
}

interface RecurringSeries {
  id: string
  studentName: string
  instructorName: string
  startDate: Date
  time: string
  recurrenceRule: RecurrenceRule
  scheduledDates: Date[]
}

export function RecurringBookings() {
  const t = useTranslations('calendar.recurringBookings')
  const tDays = useTranslations('calendar.shortWeekDays')
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>({
    pattern: 'weekly',
    interval: 1,
    daysOfWeek: [1, 3], // Poniedziałek i Środa
    endType: 'after',
    endAfter: 10
  })
  
  const [series, setSeries] = useState<RecurringSeries[]>([
    {
      id: '1',
      studentName: 'Anna Nowak',
      instructorName: 'Jan Kowalski',
      startDate: new Date('2024-02-01'),
      time: '16:00',
      recurrenceRule: {
        pattern: 'weekly',
        interval: 1,
        daysOfWeek: [1, 3],
        endType: 'after',
        endAfter: 8
      },
      scheduledDates: [
        new Date('2024-02-01'),
        new Date('2024-02-05'),
        new Date('2024-02-08'),
        new Date('2024-02-12'),
        new Date('2024-02-15'),
        new Date('2024-02-19'),
        new Date('2024-02-22'),
        new Date('2024-02-26')
      ]
    }
  ])
  
  const generatePreviewDates = (): Date[] => {
    const dates: Date[] = []
    let currentDate = new Date()
    const maxDates = recurrenceRule.endType === 'after' ? recurrenceRule.endAfter || 10 : 10
    
    for (let i = 0; i < maxDates; i++) {
      if (recurrenceRule.pattern === 'daily') {
        dates.push(new Date(currentDate))
        currentDate = addDays(currentDate, 1)
      } else if (recurrenceRule.pattern === 'weekly') {
        dates.push(new Date(currentDate))
        currentDate = addWeeks(currentDate, 1)
      } else if (recurrenceRule.pattern === 'biweekly') {
        dates.push(new Date(currentDate))
        currentDate = addWeeks(currentDate, 2)
      } else if (recurrenceRule.pattern === 'workdays') {
        // Pomijamy weekendy
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate = addDays(currentDate, 1)
        }
        dates.push(new Date(currentDate))
        currentDate = addDays(currentDate, 1)
      }
      
      if (recurrenceRule.endType === 'date' && recurrenceRule.endDate && currentDate > recurrenceRule.endDate) {
        break
      }
    }
    
    return dates
  }
  
  const previewDates = showCreateForm ? generatePreviewDates() : []
  
  return (
    <div className="space-y-4">
      {/* Formularz tworzenia serii */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('createSeries')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('recurrencePattern')}</Label>
              <select 
                className="w-full p-2 border rounded-md mt-1"
                value={recurrenceRule.pattern}
                onChange={(e) => setRecurrenceRule({...recurrenceRule, pattern: e.target.value as any})}
              >
                <option value="daily">{t('daily')}</option>
                <option value="weekly">{t('weekly')}</option>
                <option value="biweekly">{t('biweekly')}</option>
                <option value="workdays">{t('workdays')}</option>
                <option value="custom">{t('custom')}</option>
              </select>
            </div>
            
            {recurrenceRule.pattern === 'weekly' && (
              <div>
                <Label>{t('onDays')}</Label>
                <div className="flex gap-2 mt-2">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, index) => (
                    <button
                      key={day}
                      onClick={() => {
                        const days = recurrenceRule.daysOfWeek || []
                        if (days.includes(index)) {
                          setRecurrenceRule({
                            ...recurrenceRule,
                            daysOfWeek: days.filter(d => d !== index)
                          })
                        } else {
                          setRecurrenceRule({
                            ...recurrenceRule,
                            daysOfWeek: [...days, index]
                          })
                        }
                      }}
                      className={cn(
                        "px-3 py-1 rounded border",
                        recurrenceRule.daysOfWeek?.includes(index)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white border-gray-300"
                      )}
                    >
                      {tDays(day)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label>{t('endAfter')}</Label>
              <div className="flex gap-2 mt-2">
                <select 
                  className="p-2 border rounded-md"
                  value={recurrenceRule.endType}
                  onChange={(e) => setRecurrenceRule({...recurrenceRule, endType: e.target.value as any})}
                >
                  <option value="after">{t('endAfter')}</option>
                  <option value="date">{t('endDate')}</option>
                  <option value="never">{t('noEndDate')}</option>
                </select>
                
                {recurrenceRule.endType === 'after' && (
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={recurrenceRule.endAfter}
                      onChange={(e) => setRecurrenceRule({...recurrenceRule, endAfter: parseInt(e.target.value)})}
                      className="w-20"
                    />
                    <span>{t('lessons')}</span>
                  </div>
                )}
                
                {recurrenceRule.endType === 'date' && (
                  <Input 
                    type="date" 
                    onChange={(e) => setRecurrenceRule({...recurrenceRule, endDate: new Date(e.target.value)})}
                  />
                )}
              </div>
            </div>
            
            {/* Podgląd */}
            <div>
              <Label>{t('preview')}</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm font-medium mb-2">{t('scheduledDates')}:</p>
                <div className="grid grid-cols-3 gap-2">
                  {previewDates.map((date, index) => (
                    <div key={index} className="text-xs p-1 bg-white rounded border">
                      {format(date, 'd MMM yyyy', { locale: pl })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="w-full">
              {t('createBookings')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Lista serii */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              {t('title')}
            </span>
            <Button 
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {t('createSeries')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {series.map((s) => (
              <div key={s.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {s.studentName} - {s.instructorName}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(s.startDate, 'd MMM yyyy', { locale: pl })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {s.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        {t(s.recurrenceRule.pattern)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      {t('totalLessons', { count: s.scheduledDates.length })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {t('editSeries')}
                    </Button>
                    <Button size="sm" variant="ghost">
                      {t('cancelSeries')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}