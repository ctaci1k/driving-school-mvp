'use client'

import { format, startOfWeek, addDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
interface WeekSlot {
  day: number // 0-6
  hour: string
  isBooked: boolean
  studentName?: string
  vehicle?: string
  location?: string
  status?: string
}

interface WeekViewProps {
  startDate: Date
  slots?: WeekSlot[]
  onSlotClick?: (day: number, hour: string) => void
}

export function WeekView({ startDate, slots = [], onSlotClick }: WeekViewProps) {
  const t = useTranslations('calendar')
  
  // Початок тижня (понеділок)
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
  
  // Масив днів тижня
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  // Години з 8:00 до 20:00
  const hours = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)
  
  // Функція для перевірки чи слот зайнятий
  const isSlotBooked = (dayIndex: number, hour: string) => {
    const slot = slots.find(s => {
      // Додаємо перевірку з логуванням
      const matches = s.day === dayIndex && s.hour === hour
      if (matches) {
        console.log(`Знайдено відповідність: день ${dayIndex}, час ${hour}`)
      }
      return matches
    })
    return slot
  }
  
  // Логуємо для дебагу
  console.log('WeekView отримав слотів:', slots.length)
  console.log('Приклад слотів:', slots.slice(0, 3))
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Заголовок з днями тижня */}
          <div className="grid grid-cols-8 border-b bg-gray-50">
            <div className="p-2 sm:p-3 border-r">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {t('views.week')}
              </span>
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 sm:p-3 text-center border-r last:border-r-0">
                <div className="font-medium text-xs sm:text-sm">
                  {t(`shortWeekDays.${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index]}`)}
                </div>
                <div className="text-xs text-gray-600">
                  {format(day, 'd MMM', { locale: pl })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Сітка годин */}
          <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                {/* Час */}
                <div className="p-2 sm:p-3 bg-gray-50 border-r text-xs sm:text-sm font-medium text-gray-600">
                  {hour}
                </div>
                
{/* Слоти для кожного дня */}
{[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
  const slot = isSlotBooked(dayIndex, hour)
  const hasSlot = slots.some(s => s.day === dayIndex && s.hour === hour)
  const isClickable = hasSlot && !slot?.isBooked
  
  return (
    <div
      key={`${dayIndex}-${hour}`}
      onClick={() => {
        if (isClickable && onSlotClick) {
          onSlotClick(dayIndex, hour)
        }
      }}
      className={cn(
        "p-1 sm:p-2 border-r last:border-r-0 min-h-[50px] sm:min-h-[70px] transition-all",
        hasSlot && "bg-green-100",
        slot?.isBooked && "bg-blue-100",
        isClickable && "cursor-pointer hover:bg-green-300 hover:shadow-inner",
        !slot?.isBooked && !hasSlot && "hover:bg-gray-50"
      )}
    >
      {hasSlot ? (
        <div className="text-xs space-y-0.5">
          {slot?.isBooked ? (
            <>
              <p className="font-bold truncate text-[10px] sm:text-[11px] text-blue-800">
                {slot.studentName || 'Zajęte'}
              </p>
              {slot.vehicle && (
                <p className="text-[8px] sm:text-[9px] text-gray-700 truncate" title={slot.vehicle}>
                  🚗 {slot.vehicle}
                </p>
              )}
              {slot.location && (
                <p className="text-[8px] sm:text-[9px] text-gray-600 truncate" title={slot.location}>
                  📍 {slot.location}
                </p>
              )}
              {slot.status && (
                <p className={cn(
                  "text-[8px] sm:text-[9px] font-medium",
                  slot.status === 'CONFIRMED' && "text-green-700",
                  slot.status === 'CANCELLED' && "text-red-700 line-through"
                )}>
                  {slot.status === 'CONFIRMED' ? '✓ Potw.' : 
                   slot.status === 'CANCELLED' ? '✗ Anul.' : 
                   slot.status}
                </p>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-green-700 font-bold text-[10px] sm:text-xs">
                Wolne
              </p>
              {isClickable && (
                <p className="text-[8px] text-green-600">Kliknij</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-300 text-[10px] sm:text-xs">-</p>
      )}
    </div>
  )
})}
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </div>
  )
}