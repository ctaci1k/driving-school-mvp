// components/ui/calendar.tsx

'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface CalendarProps {
  selectedDate?: Date
  onSelectDate?: (date: Date) => void
  disabledDates?: Date[]
  className?: string
}

export function Calendar({ 
  selectedDate, 
  onSelectDate, 
  disabledDates = [],
  className 
}: CalendarProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const isDisabled = (date: Date) => {
    return disabledDates.some(d => isSameDay(d, date)) || date < new Date()
  }

  // Дні тижня
  const weekDays = [
    t('calendar.monday'),
    t('calendar.tuesday'),
    t('calendar.wednesday'),
    t('calendar.thursday'),
    t('calendar.friday'),
    t('calendar.saturday'),
    t('calendar.sunday')
  ]

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isDisabled(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const today = isToday(day)
          const currentMonthDay = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelectDate?.(day)}
              disabled={disabled}
              className={cn(
                "h-10 w-full rounded-md text-sm transition-colors",
                currentMonthDay ? "text-gray-900" : "text-gray-400",
                !disabled && "hover:bg-gray-100",
                selected && "bg-blue-500 text-white hover:bg-blue-600",
                today && !selected && "bg-gray-100 font-semibold",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}