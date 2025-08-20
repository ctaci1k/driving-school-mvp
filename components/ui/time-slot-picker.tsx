'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedSlot?: TimeSlot
  onSelectSlot: (slot: TimeSlot) => void
  loading?: boolean
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false
}: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available time slots for this date
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((slot, index) => {
        const isSelected = selectedSlot?.startTime === slot.startTime
        const isAvailable = slot.available

        return (
          <Button
            key={index}
            variant={isSelected ? "default" : "outline"}
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelectSlot(slot)}
            className={cn(
              "h-auto flex flex-col items-center py-3",
              !isAvailable && "opacity-50 cursor-not-allowed",
              isSelected && "ring-2 ring-blue-500"
            )}
          >
            <span className="font-medium">
              {format(slot.startTime, 'HH:mm')}
            </span>
            <span className="text-xs opacity-75">to</span>
            <span className="font-medium">
              {format(slot.endTime, 'HH:mm')}
            </span>
            {!isAvailable && (
              <span className="text-xs text-red-500 mt-1">Booked</span>
            )}
          </Button>
        )
      })}
    </div>
  )
}