// components/ui/calendar-view-switcher.tsx

'use client'

import { Button } from '@/components/ui/button'
import { CalendarDays, CalendarRange, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ViewType = 'day' | 'week' | 'month'

interface CalendarViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function CalendarViewSwitcher({ 
  currentView, 
  onViewChange 
}: CalendarViewSwitcherProps) {
  const t = useTranslations('calendar.views')
  
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      <Button
        size="sm"
        variant={currentView === 'day' ? 'default' : 'ghost'}
        onClick={() => onViewChange('day')}
        className="flex items-center gap-2"
      >
        <CalendarDays className="w-4 h-4" />
        {t('day')}
      </Button>
      
      <Button
        size="sm"
        variant={currentView === 'week' ? 'default' : 'ghost'}
        onClick={() => onViewChange('week')}
        className="flex items-center gap-2"
      >
        <CalendarRange className="w-4 h-4" />
        {t('week')}
      </Button>
      
      <Button
        size="sm"
        variant={currentView === 'month' ? 'default' : 'ghost'}
        onClick={() => onViewChange('month')}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        {t('month')}
      </Button>
    </div>
  )
}