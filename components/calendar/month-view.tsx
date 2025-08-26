// components/calendar/month-view.tsx

'use client'

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface DayBookings {
  date: Date
  bookingsCount: number
  isCurrentMonth: boolean
}

interface MonthViewProps {
  currentDate: Date
  bookings?: { date: Date; count: number }[]
  onDayClick?: (date: Date) => void
}

export function MonthView({ currentDate, bookings = [], onDayClick }: MonthViewProps) {
  const t = useTranslations('calendar')
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  
  // Функція для отримання кількості бронювань на день
  const getBookingsCount = (date: Date) => {
    const booking = bookings.find(b => isSameDay(b.date, date))
    return booking?.count || 0
  }
  
return (
  <div className="bg-white rounded-lg shadow w-full">
    {/* Заголовок місяця */}
    <div className="p-3 sm:p-4 border-b">
      <h3 className="text-base sm:text-lg font-semibold text-center">
        {format(currentDate, 'MMMM yyyy', { locale: pl })}
      </h3>
    </div>
    
    {/* Обгортка для мобільних */}
    <div className="overflow-x-auto">
      <div className="min-w-[320px]">
        {/* Дні тижня */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-[10px] sm:text-sm font-medium text-gray-600 border-r last:border-r-0">
              {t(`shortWeekDays.${day}`)}
            </div>
          ))}
        </div>
        
        {/* Календарна сітка */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const bookingsCount = getBookingsCount(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isCurrentDay = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  "min-h-[50px] sm:min-h-[80px] p-1 sm:p-2 border-r border-b last:border-r-0 cursor-pointer transition-colors",
                  !isCurrentMonth && "bg-gray-50",
                  isCurrentDay && "bg-blue-50",
                  "hover:bg-gray-100"
                )}
              >
                <div className="flex flex-col h-full">
                  <div className={cn(
                    "text-xs sm:text-sm font-medium",
                    !isCurrentMonth && "text-gray-400",
                    isCurrentDay && "text-blue-600"
                  )}>
                    {format(day, 'd')}
                    {isCurrentDay && (
                      <span className="hidden sm:inline ml-1 text-[10px] sm:text-xs text-blue-600">
                        {t('today')}
                      </span>
                    )}
                  </div>
                  
                  {bookingsCount > 0 && (
                    <div className="mt-auto">
                      <div className="bg-blue-100 text-blue-700 text-[9px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center">
                        {bookingsCount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    
    {/* Індикатор скролу для мобільних (якщо потрібно) */}
    <div className="sm:hidden text-center py-1 text-[10px] text-gray-400">
      {days.length > 35 && "← →"}
    </div>
  </div>
)
}