// components/reports/DateRangePicker.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface DateRangePickerProps {
  onDateChange: (start: Date, end: Date) => void
}

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<'month' | 'all'>('month')
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined

  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onDateChange(startOfMonth(newMonth), endOfMonth(newMonth))
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onDateChange(startOfMonth(newMonth), endOfMonth(newMonth))
  }

  const handleCurrentMonth = () => {
    const now = new Date()
    setCurrentMonth(now)
    setSelectedRange('month')
    onDateChange(startOfMonth(now), endOfMonth(now))
  }

  const handleAllTime = () => {
    setSelectedRange('all')
    onDateChange(new Date(2020, 0, 1), new Date())
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={selectedRange === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={handleCurrentMonth}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {t('reports.currentMonth')}
        </Button>
        <Button
          variant={selectedRange === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={handleAllTime}
        >
          {t('reports.allTime')}
        </Button>
      </div>

      {selectedRange === 'month' && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            disabled={currentMonth >= new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}