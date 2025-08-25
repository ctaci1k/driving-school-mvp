// lib/validations/booking.ts
import { z } from 'zod'
import { addMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

export const bookingFormSchema = z.object({
  instructorId: z.string().min(1, 'Instruktor jest wymagany'),
  locationId: z.string().min(1, 'Lokalizacja jest wymagana'),
  vehicleId: z.string().optional(),
  startTime: z.date().refine((date) => {
    return isAfter(date, new Date())
  }, 'Data musi być w przyszłości'),
  duration: z.number().min(30).max(240).default(120),
  lessonType: z.enum([
    'STANDARD',
    'CITY_TRAFFIC', 
    'HIGHWAY',
    'PARKING',
    'EXAM_PREPARATION',
    'NIGHT_DRIVING'
  ]),
  paymentMethod: z.enum(['credits', 'payment']),
  notes: z.string().max(500).optional(),
})

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
  reason: z.string().min(1, 'Powód jest wymagany').max(500),
})

export const rescheduleBookingSchema = z.object({
  bookingId: z.string().min(1),
  newStartTime: z.date().refine((date) => {
    return isAfter(date, new Date())
  }, 'Nowa data musi być w przyszłości'),
  reason: z.string().max(500).optional(),
})

export const recurringBookingSchema = z.object({
  baseBooking: bookingFormSchema.omit({ paymentMethod: true, notes: true }),
  pattern: z.enum(['daily', 'weekly', 'biweekly']),
  endType: z.enum(['after', 'until']),
  afterLessons: z.number().min(2).max(52).optional(),
  untilDate: z.string().optional(),
  skipWeekends: z.boolean().default(true),
})

export const bookingFilterSchema = z.object({
  status: z.enum([
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
    'IN_PROGRESS'
  ]).optional(),
  instructorId: z.string().optional(),
  studentId: z.string().optional(),
  locationId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  lessonType: z.enum([
    'STANDARD',
    'CITY_TRAFFIC',
    'HIGHWAY',
    'PARKING',
    'EXAM_PREPARATION',
    'NIGHT_DRIVING'
  ]).optional(),
  isPaid: z.boolean().optional(),
})

export const availabilitySchema = z.object({
  instructorId: z.string().min(1),
  date: z.date(),
  duration: z.number().min(30).max(240).default(120),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>
export type CancelBookingData = z.infer<typeof cancelBookingSchema>
export type RescheduleBookingData = z.infer<typeof rescheduleBookingSchema>
export type RecurringBookingData = z.infer<typeof recurringBookingSchema>
export type BookingFilterData = z.infer<typeof bookingFilterSchema>
export type AvailabilityData = z.infer<typeof availabilitySchema>

// Business rules validation
export function validateBookingTime(startTime: Date, duration: number): boolean {
  const start = startTime.getHours()
  const end = addMinutes(startTime, duration).getHours()
  
  // Allow bookings between 6:00 and 22:00
  return start >= 6 && (end <= 22 || end < start)
}

export function validateCancellation(bookingStartTime: Date): boolean {
  const now = new Date()
  const hoursUntilBooking = (bookingStartTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  // Allow cancellation if more than 24 hours before booking
  return hoursUntilBooking > 24
}

export function validateReschedule(
  oldStartTime: Date,
  newStartTime: Date
): boolean {
  const now = new Date()
  const hoursUntilBooking = (oldStartTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  // Allow reschedule if more than 24 hours before booking
  // and new time is in the future
  return hoursUntilBooking > 24 && isAfter(newStartTime, now)
}

export function getAvailableTimeSlots(
  date: Date,
  duration: number,
  bookedSlots: { startTime: Date; endTime: Date }[]
): string[] {
  const slots: string[] = []
  const dayStart = new Date(date)
  dayStart.setHours(6, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(22, 0, 0, 0)
  
  let currentSlot = new Date(dayStart)
  
  while (isBefore(currentSlot, dayEnd)) {
    const slotEnd = addMinutes(currentSlot, duration)
    
    // Check if slot overlaps with any booked slot
    const isAvailable = !bookedSlots.some(booked => {
      const bookedStart = new Date(booked.startTime)
      const bookedEnd = new Date(booked.endTime)
      
      return (
        (currentSlot >= bookedStart && currentSlot < bookedEnd) ||
        (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
        (currentSlot <= bookedStart && slotEnd >= bookedEnd)
      )
    })
    
    if (isAvailable && isAfter(currentSlot, new Date())) {
      slots.push(currentSlot.toISOString())
    }
    
    currentSlot = addMinutes(currentSlot, 30) // 30-minute intervals
  }
  
  return slots
}