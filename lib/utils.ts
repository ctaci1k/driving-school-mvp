// lib\utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addMinutes, startOfWeek, addDays, setHours, setMinutes } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate time slots for a given date
export function generateTimeSlots(
  date: Date,
  startTime: string,
  endTime: string,
  duration: number = 120, // 2 hours default
  bookedSlots: { startTime: Date; endTime: Date }[] = []
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = []
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  let currentSlot = setMinutes(setHours(date, startHour), startMinute)
  const dayEnd = setMinutes(setHours(date, endHour), endMinute)
  
  while (currentSlot < dayEnd) {
    const slotEnd = addMinutes(currentSlot, duration)
    
    // Check if slot is available (not overlapping with booked slots)
    const isAvailable = !bookedSlots.some(booked => {
      return (
        (currentSlot >= booked.startTime && currentSlot < booked.endTime) ||
        (slotEnd > booked.startTime && slotEnd <= booked.endTime) ||
        (currentSlot <= booked.startTime && slotEnd >= booked.endTime)
      )
    })
    
    // Only add slots that don't exceed the day end
    if (slotEnd <= dayEnd) {
      slots.push({
        time: format(currentSlot, 'HH:mm'),
        available: isAvailable && currentSlot > new Date() // Can't book past slots
      })
    }
    
    currentSlot = slotEnd
  }
  
  return slots
}

// Get week dates starting from Monday
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

// Format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price)
}