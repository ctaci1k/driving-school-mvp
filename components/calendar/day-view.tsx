'use client'

import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface TimeSlot {
  time: string
  isBooked?: boolean
  bookingInfo?: {
    studentName: string
    lessonType: string
    additionalInfo?: string[]
  }
}

interface DayViewProps {
  date: Date
  slots?: TimeSlot[]
}

export function DayView({ date, slots }: DayViewProps) {
  const t = useTranslations('calendar')
  
  // Генеруємо слоти з 8:00 до 20:00
  const hours = Array.from({ length: 13 }, (_, i) => i + 8)
  
  const defaultSlots: TimeSlot[] = hours.map(hour => ({
    time: `${hour.toString().padStart(2, '0')}:00`,
    isBooked: false
  }))
  
  const displaySlots = slots || defaultSlots

  return (
    <div className="bg-white rounded-lg shadow w-full">
      {/* Заголовок з датою */}
      <div className="p-3 sm:p-4 border-b">
        <h3 className="text-base sm:text-lg font-semibold">
          {format(date, 'EEEE, d MMMM yyyy', { locale: pl })}
        </h3>
      </div>
      
      {/* Слоти часу */}
      <div className="p-3 sm:p-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        <div className="space-y-2">
          {displaySlots.map((slot) => (
            <div
              key={slot.time}
              className={cn(
                "flex flex-col sm:flex-row sm:items-start p-3 sm:p-4 rounded-lg border transition-colors",
                slot.isBooked 
                  ? "bg-blue-50 border-blue-200 hover:bg-blue-100" 
                  : "hover:bg-gray-50 border-gray-200"
              )}
            >
              <div className="font-medium text-gray-600 mb-2 sm:mb-0 sm:w-24 text-lg">
                {slot.time}
              </div>
              
              <div className="flex-1 sm:px-4">
                {slot.isBooked && slot.bookingInfo ? (
                  <div className="space-y-2">
                    {/* Główna informacja */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {slot.bookingInfo.studentName}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {slot.bookingInfo.lessonType}
                      </p>
                    </div>
                    
                    {/* Dodatkowe informacje */}
                    {slot.bookingInfo.additionalInfo && slot.bookingInfo.additionalInfo.length > 0 && (
                      <div className="pt-2 border-t border-blue-100 space-y-1">
                        {slot.bookingInfo.additionalInfo.map((info, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {info}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">{t('views.freeSlot')}</p>
                    {!slot.isBooked && (
                      <button className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                        {t('views.book')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}