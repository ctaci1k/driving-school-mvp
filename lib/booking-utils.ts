import { addMinutes, setHours, setMinutes, format } from 'date-fns'

export interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}

export interface BookedSlot {
  startTime: Date
  endTime: Date
}

// Generate time slots for a given date (MVP - fixed 2 hour duration)
export function generateTimeSlots(
  date: Date,
  startTime: string, // "09:00"
  endTime: string,   // "17:00"
  duration: number = 120, // 2 hours for MVP
  bookedSlots: BookedSlot[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = []
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  let currentSlot = setMinutes(setHours(date, startHour), startMinute)
  const dayEnd = setMinutes(setHours(date, endHour), endMinute)
  
  while (currentSlot < dayEnd) {
    const slotEnd = addMinutes(currentSlot, duration)
    
    // Check if slot is available (not overlapping with booked slots)
    const isBooked = bookedSlots.some(booked => {
      return (
        (currentSlot >= booked.startTime && currentSlot < booked.endTime) ||
        (slotEnd > booked.startTime && slotEnd <= booked.endTime) ||
        (currentSlot <= booked.startTime && slotEnd >= booked.endTime)
      )
    })
    
    // Only add slots that don't exceed the day end
    if (slotEnd <= dayEnd) {
      slots.push({
        startTime: new Date(currentSlot),
        endTime: new Date(slotEnd),
        available: !isBooked && currentSlot > new Date() // Can't book past slots
      })
    }
    
    currentSlot = slotEnd
  }
  
  return slots
}

// Check if a time slot is available
export function isSlotAvailable(
  slot: TimeSlot,
  bookedSlots: BookedSlot[]
): boolean {
  return !bookedSlots.some(booked => {
    return (
      (slot.startTime >= booked.startTime && slot.startTime < booked.endTime) ||
      (slot.endTime > booked.startTime && slot.endTime <= booked.endTime) ||
      (slot.startTime <= booked.startTime && slot.endTime >= booked.endTime)
    )
  })
}

// Format slot for display
export function formatTimeSlot(slot: TimeSlot): string {
  return `${format(slot.startTime, 'HH:mm')} - ${format(slot.endTime, 'HH:mm')}`
}