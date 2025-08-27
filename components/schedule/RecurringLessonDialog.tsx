// components/schedule/RecurringLessonDialog.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar, Repeat, AlertCircle, Info, Check, X,
  CalendarDays, CalendarRange, Clock, Users
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { 
  format, addDays, addWeeks, addMonths, 
  differenceInDays, differenceInWeeks,
  eachDayOfInterval, isWeekend, getDay,
  startOfWeek, endOfWeek,
  isSameDay
} from 'date-fns'
import { uk } from 'date-fns/locale'

export interface RecurringLessonData {
  pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom'
  endType: 'date' | 'occurrences'
  endDate?: Date
  occurrences?: number
  weekDays?: number[] // 0 = Sunday, 1 = Monday, etc.
  interval?: number // For custom pattern
  skipHolidays?: boolean
  skipWeekends?: boolean
  exceptions?: Date[] // Specific dates to skip
  adjustmentPolicy?: 'skip' | 'next-available' | 'previous-available'
}

interface RecurringLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: RecurringLessonData) => void
  startDate: Date
  startTime: string
  duration: number
  studentName?: string
  lessonType?: string
  maxOccurrences?: number
  existingLessons?: Array<{ date: Date; time: string }>
}

const weekDaysOptions = [
  { value: 1, label: 'Пн', shortLabel: 'П' },
  { value: 2, label: 'Вт', shortLabel: 'В' },
  { value: 3, label: 'Ср', shortLabel: 'С' },
  { value: 4, label: 'Чт', shortLabel: 'Ч' },
  { value: 5, label: 'Пт', shortLabel: 'П' },
  { value: 6, label: 'Сб', shortLabel: 'С' },
  { value: 0, label: 'Нд', shortLabel: 'Н' }
]

export function RecurringLessonDialog({
  open,
  onOpenChange,
  onConfirm,
  startDate,
  startTime,
  duration,
  studentName,
  lessonType,
  maxOccurrences = 52,
  existingLessons = []
}: RecurringLessonDialogProps) {
  const [pattern, setPattern] = useState<RecurringLessonData['pattern']>('weekly')
  const [endType, setEndType] = useState<'date' | 'occurrences'>('occurrences')
  const [endDate, setEndDate] = useState(addMonths(startDate, 1))
  const [occurrences, setOccurrences] = useState(4)
  const [weekDays, setWeekDays] = useState<number[]>([getDay(startDate)])
  const [interval, setInterval] = useState(1)
  const [skipHolidays, setSkipHolidays] = useState(false)
  const [skipWeekends, setSkipWeekends] = useState(false)
  const [exceptions, setExceptions] = useState<Date[]>([])
  const [adjustmentPolicy, setAdjustmentPolicy] = useState<RecurringLessonData['adjustmentPolicy']>('skip')

  // Calculate lesson dates based on pattern
  const calculateLessonDates = (): Date[] => {
    const dates: Date[] = []
    let currentDate = new Date(startDate)
    let count = 0
    
    const maxDate = endType === 'date' ? endDate : addMonths(startDate, 12)
    const maxCount = endType === 'occurrences' ? occurrences : maxOccurrences

    while (currentDate <= maxDate && count < maxCount) {
      // Check if date should be included
      let includeDate = true

      // Skip weekends if needed
      if (skipWeekends && isWeekend(currentDate)) {
        includeDate = false
      }

      // Skip exceptions
      if (exceptions.some(ex => isSameDay(ex, currentDate))) {
        includeDate = false
      }

      // Check weekday for weekly/biweekly patterns
      if ((pattern === 'weekly' || pattern === 'biweekly') && !weekDays.includes(getDay(currentDate))) {
        includeDate = false
      }

      // Check for conflicts with existing lessons
      const hasConflict = existingLessons.some(lesson => 
        isSameDay(lesson.date, currentDate) && lesson.time === startTime
      )
      if (hasConflict) {
        includeDate = false
      }

      if (includeDate) {
        dates.push(new Date(currentDate))
        count++
      }

      // Calculate next date based on pattern
      switch (pattern) {
        case 'daily':
          currentDate = addDays(currentDate, 1)
          break
        case 'weekly':
          currentDate = addDays(currentDate, 1)
          // Skip to next valid weekday
          while (!weekDays.includes(getDay(currentDate)) && currentDate <= maxDate) {
            currentDate = addDays(currentDate, 1)
          }
          break
        case 'biweekly':
          // Move to next occurrence
          if (weekDays.indexOf(getDay(currentDate)) === weekDays.length - 1) {
            // Last day of selected weekdays, jump to next week
            currentDate = addWeeks(currentDate, 2)
            // Find first selected weekday
            while (!weekDays.includes(getDay(currentDate)) && currentDate <= maxDate) {
              currentDate = addDays(currentDate, 1)
            }
          } else {
            // Move to next selected weekday in the same period
            currentDate = addDays(currentDate, 1)
            while (!weekDays.includes(getDay(currentDate)) && currentDate <= maxDate) {
              currentDate = addDays(currentDate, 1)
            }
          }
          break
        case 'monthly':
          currentDate = addMonths(currentDate, 1)
          break
        case 'custom':
          currentDate = addDays(currentDate, interval)
          break
      }
    }

    return dates
  }

  const lessonDates = calculateLessonDates()
  const totalLessons = lessonDates.length
  const totalHours = (totalLessons * duration) / 60
  const lastLessonDate = lessonDates[lessonDates.length - 1]

  const handleConfirm = () => {
    const data: RecurringLessonData = {
      pattern,
      endType,
      endDate: endType === 'date' ? endDate : undefined,
      occurrences: endType === 'occurrences' ? occurrences : undefined,
      weekDays: (pattern === 'weekly' || pattern === 'biweekly') ? weekDays : undefined,
      interval: pattern === 'custom' ? interval : undefined,
      skipHolidays,
      skipWeekends,
      exceptions: exceptions.length > 0 ? exceptions : undefined,
      adjustmentPolicy
    }
    onConfirm(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-blue-600" />
            Налаштування повторюваних занять
          </DialogTitle>
          <DialogDescription>
            {studentName && lessonType && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{studentName}</Badge>
                <Badge variant="outline">{lessonType}</Badge>
                <Badge variant="outline">{startTime} ({duration} хв)</Badge>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pattern selection */}
          <div>
            <Label>Частота повторення</Label>
            <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as typeof pattern)}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                <label className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  pattern === 'daily' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}>
                  <RadioGroupItem value="daily" />
                  <span>Щоденно</span>
                </label>
                <label className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  pattern === 'weekly' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}>
                  <RadioGroupItem value="weekly" />
                  <span>Щотижня</span>
                </label>
                <label className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  pattern === 'biweekly' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}>
                  <RadioGroupItem value="biweekly" />
                  <span>Раз на 2 тижні</span>
                </label>
                <label className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  pattern === 'monthly' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}>
                  <RadioGroupItem value="monthly" />
                  <span>Щомісяця</span>
                </label>
                <label className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  pattern === 'custom' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}>
                  <RadioGroupItem value="custom" />
                  <span>Інше</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Week days selection for weekly/biweekly */}
          {(pattern === 'weekly' || pattern === 'biweekly') && (
            <div>
              <Label>Дні тижня</Label>
              <div className="flex gap-2 mt-2">
                {weekDaysOptions.map(day => (
                  <button
                    key={day.value}
                    onClick={() => {
                      if (weekDays.includes(day.value)) {
                        setWeekDays(weekDays.filter(d => d !== day.value))
                      } else {
                        setWeekDays([...weekDays, day.value].sort())
                      }
                    }}
                    className={cn(
                      "w-10 h-10 rounded-lg border-2 font-medium transition-all",
                      weekDays.includes(day.value)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {day.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom interval */}
          {pattern === 'custom' && (
            <div>
              <Label>Інтервал (дні)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                className="w-32 mt-2"
              />
            </div>
          )}

          <Separator />

          {/* End condition */}
          <div>
            <Label>Завершення</Label>
            <RadioGroup value={endType} onValueChange={(v) => setEndType(v as typeof endType)}>
              <div className="space-y-3 mt-2">
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="occurrences" />
                  <span>Після</span>
                  <Input
                    type="number"
                    min="1"
                    max={maxOccurrences}
                    value={occurrences}
                    onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                    disabled={endType !== 'occurrences'}
                    className="w-20 mx-1"
                  />
                  <span>занять</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="date" />
                  <span>До дати</span>
                  <Input
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    disabled={endType !== 'date'}
                    className="w-40 mx-1"
                  />
                </label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Additional options */}
          <div>
            <Label>Додаткові налаштування</Label>
            <div className="space-y-3 mt-2">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={skipWeekends}
                  onCheckedChange={(checked) => setSkipWeekends(checked as boolean)}
                />
                <span className="text-sm">Пропускати вихідні</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={skipHolidays}
                  onCheckedChange={(checked) => setSkipHolidays(checked as boolean)}
                />
                <span className="text-sm">Пропускати святкові дні</span>
              </label>
            </div>
          </div>

          {/* Conflict resolution */}
          <div>
            <Label>При конфлікті розкладу</Label>
            <Select value={adjustmentPolicy} onValueChange={(v) => setAdjustmentPolicy(v as typeof adjustmentPolicy)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">Пропустити заняття</SelectItem>
                <SelectItem value="next-available">Перенести на наступний вільний час</SelectItem>
                <SelectItem value="previous-available">Перенести на попередній вільний час</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Preview */}
          <div>
            <Label>Попередній перегляд</Label>
            <Alert className="mt-2">
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Всього занять:</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Загальна тривалість:</span>
                    <span className="font-medium">{totalHours.toFixed(1)} годин</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Перше заняття:</span>
                    <span className="font-medium">
                      {format(startDate, 'd MMMM yyyy', { locale: uk })}
                    </span>
                  </div>
                  {lastLessonDate && (
                    <div className="flex items-center justify-between">
                      <span>Останнє заняття:</span>
                      <span className="font-medium">
                        {format(lastLessonDate, 'd MMMM yyyy', { locale: uk })}
                      </span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {/* First few dates preview */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Перші заняття:</p>
              <div className="flex flex-wrap gap-2">
                {lessonDates.slice(0, 5).map((date, idx) => (
                  <Badge key={idx} variant="secondary">
                    {format(date, 'dd.MM', { locale: uk })} ({format(date, 'EEE', { locale: uk })})
                  </Badge>
                ))}
                {lessonDates.length > 5 && (
                  <Badge variant="outline">+{lessonDates.length - 5} ще</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Warnings */}
          {totalLessons === 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Не вдалося створити заняття з вказаними параметрами. 
                Перевірте налаштування.
              </AlertDescription>
            </Alert>
          )}

          {totalLessons > 20 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Буде створено багато занять ({totalLessons}). 
                Переконайтеся, що це правильно.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={totalLessons === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Створити {totalLessons} {totalLessons === 1 ? 'заняття' : 'занять'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}