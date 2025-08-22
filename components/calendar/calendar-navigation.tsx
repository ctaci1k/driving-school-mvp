// components/calendar/calendar-navigation.tsx

'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useTranslations } from 'next-intl'

interface CalendarNavigationProps {
  currentDate: Date
  view: 'day' | 'week' | 'month'
  onDateChange: (date: Date) => void
  onGoToToday: () => void
}

export function CalendarNavigation({ 
  currentDate, 
  view, 
  onDateChange,
  onGoToToday 
}: CalendarNavigationProps) {
  const t = useTranslations('calendar')
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange(newDate)
  }
  
  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }
  
  const getDateDisplay = () => {
    if (view === 'day') {
      return format(currentDate, 'd MMMM yyyy', { locale: pl })
    } else if (view === 'week') {
      const weekEnd = new Date(currentDate)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return `${format(currentDate, 'd MMM', { locale: pl })} - ${format(weekEnd, 'd MMM yyyy', { locale: pl })}`
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: pl })
    }
  }
  
  const getPreviousTooltip = () => {
    if (view === 'day') return t('previousDay')
    if (view === 'week') return t('previousWeek')
    return t('previousMonth')
  }
  
  const getNextTooltip = () => {
    if (view === 'day') return t('nextDay')
    if (view === 'week') return t('nextWeek')
    return t('nextMonth')
  }
  
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          title={getPreviousTooltip()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          title={getNextTooltip()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToToday}
          className="ml-2"
          title={t('goToToday')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {t('today')}
        </Button>
      </div>
      
      <div className="text-lg font-semibold">
        {getDateDisplay()}
      </div>
    </div>
  )
}