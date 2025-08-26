// lib/validations/schedule.ts
import { z } from 'zod'
import { isAfter, isBefore, addMinutes, isWithinInterval, parseISO } from 'date-fns'

export const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:MM'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:MM'),
  isAvailable: z.boolean().default(true),
})

export const dayScheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  slots: z.array(timeSlotSchema),
  isWorkingDay: z.boolean().default(true),
})

export const weekScheduleSchema = z.object({
  instructorId: z.string().min(1),
  weekStartDate: z.date(),
  schedule: z.array(dayScheduleSchema).length(7),
  exceptions: z.array(z.object({
    date: z.date(),
    reason: z.string(),
    allDay: z.boolean().default(true),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })).optional(),
})

export const scheduleTemplateSchema = z.object({
  name: z.string().min(1, 'Nazwa szablonu jest wymagana').max(100),
  description: z.string().max(500).optional(),
  weekPattern: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })),
  isDefault: z.boolean().default(false),
})

export const scheduleExceptionSchema = z.object({
  type: z.enum([
    'vacation',
    'sickLeave',
    'holiday',
    'personalLeave',
    'training',
    'vehicleMaintenance'
  ]),
  startDate: z.string(),
  endDate: z.string(),
  allDay: z.boolean().default(true),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
  reason: z.string().min(1, 'Powód jest wymagany').max(255),
  description: z.string().max(500).optional().nullable(),
  affectedInstructors: z.array(z.string()).optional(),
  affectedVehicles: z.array(z.string()).optional(),
})

export const availabilityQuerySchema = z.object({
  instructorId: z.string().min(1),
  date: z.string(),
  duration: z.number().min(30).max(240).default(120),
  excludeBookingId: z.string().optional(),
})

export const bulkScheduleUpdateSchema = z.object({
  instructorId: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  timeSlots: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean(),
  })),
  overwriteExisting: z.boolean().default(false),
})

export type TimeSlotData = z.infer<typeof timeSlotSchema>
export type DayScheduleData = z.infer<typeof dayScheduleSchema>
export type WeekScheduleData = z.infer<typeof weekScheduleSchema>
export type ScheduleTemplateData = z.infer<typeof scheduleTemplateSchema>
export type ScheduleExceptionData = z.infer<typeof scheduleExceptionSchema>
export type AvailabilityQueryData = z.infer<typeof availabilityQuerySchema>
export type BulkScheduleUpdateData = z.infer<typeof bulkScheduleUpdateSchema>

// Time utilities
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

export function formatTimeString(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTimeString(timeStr)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return formatTimeString(hours, mins)
}

// Validation functions
export function validateTimeSlot(
  startTime: string,
  endTime: string,
  minDuration = 30,
  maxDuration = 240
): {
  isValid: boolean
  error?: string
} {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  
  if (startMinutes >= endMinutes) {
    return { isValid: false, error: 'Czas końcowy musi być po czasie początkowym' }
  }
  
  const duration = endMinutes - startMinutes
  
  if (duration < minDuration) {
    return { isValid: false, error: `Minimalny czas to ${minDuration} minut` }
  }
  
  if (duration > maxDuration) {
    return { isValid: false, error: `Maksymalny czas to ${maxDuration} minut` }
  }
  
  // Check business hours (6:00 - 22:00)
  const startHour = Math.floor(startMinutes / 60)
  const endHour = Math.floor(endMinutes / 60)
  
  if (startHour < 6 || endHour > 22) {
    return { isValid: false, error: 'Godziny pracy: 6:00 - 22:00' }
  }
  
  return { isValid: true }
}

export function findOverlappingSlots(
  slots: Array<{ startTime: string; endTime: string }>
): Array<[number, number]> {
  const overlaps: Array<[number, number]> = []
  
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const start1 = timeToMinutes(slots[i].startTime)
      const end1 = timeToMinutes(slots[i].endTime)
      const start2 = timeToMinutes(slots[j].startTime)
      const end2 = timeToMinutes(slots[j].endTime)
      
      if (
        (start1 >= start2 && start1 < end2) ||
        (end1 > start2 && end1 <= end2) ||
        (start1 <= start2 && end1 >= end2)
      ) {
        overlaps.push([i, j])
      }
    }
  }
  
  return overlaps
}

export function mergeTimeSlots(
  slots: Array<{ startTime: string; endTime: string }>
): Array<{ startTime: string; endTime: string }> {
  if (slots.length === 0) return []
  
  // Sort by start time
  const sorted = [...slots].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
  
  const merged: Array<{ startTime: string; endTime: string }> = []
  let current = { ...sorted[0] }
  
  for (let i = 1; i < sorted.length; i++) {
    const currentEnd = timeToMinutes(current.endTime)
    const nextStart = timeToMinutes(sorted[i].startTime)
    
    if (currentEnd >= nextStart) {
      // Merge overlapping slots
      const nextEnd = timeToMinutes(sorted[i].endTime)
      if (nextEnd > currentEnd) {
        current.endTime = sorted[i].endTime
      }
    } else {
      // No overlap, add current and start new
      merged.push(current)
      current = { ...sorted[i] }
    }
  }
  
  merged.push(current)
  return merged
}

export function getAvailableSlots(
  dayStart: string,
  dayEnd: string,
  bookedSlots: Array<{ startTime: string; endTime: string }>,
  duration: number,
  interval = 30
): Array<{ startTime: string; endTime: string }> {
  const available: Array<{ startTime: string; endTime: string }> = []
  const dayStartMinutes = timeToMinutes(dayStart)
  const dayEndMinutes = timeToMinutes(dayEnd)
  
  // Merge booked slots to avoid duplicates
  const mergedBooked = mergeTimeSlots(bookedSlots)
  
  let currentMinutes = dayStartMinutes
  
  while (currentMinutes + duration <= dayEndMinutes) {
    const slotStart = minutesToTime(currentMinutes)
    const slotEnd = minutesToTime(currentMinutes + duration)
    
    // Check if this slot overlaps with any booked slot
    const isAvailable = !mergedBooked.some(booked => {
      const bookedStart = timeToMinutes(booked.startTime)
      const bookedEnd = timeToMinutes(booked.endTime)
      
      return (
        (currentMinutes >= bookedStart && currentMinutes < bookedEnd) ||
        (currentMinutes + duration > bookedStart && currentMinutes + duration <= bookedEnd) ||
        (currentMinutes <= bookedStart && currentMinutes + duration >= bookedEnd)
      )
    })
    
    if (isAvailable) {
      available.push({ startTime: slotStart, endTime: slotEnd })
    }
    
    currentMinutes += interval
  }
  
  return available
}

export function isWithinSchedule(
  time: Date,
  schedule: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
): boolean {
  const dayOfWeek = time.getDay()
  const timeStr = formatTimeString(time.getHours(), time.getMinutes())
  const timeMinutes = timeToMinutes(timeStr)
  
  const daySchedule = schedule.filter(s => s.dayOfWeek === dayOfWeek)
  
  return daySchedule.some(slot => {
    const startMinutes = timeToMinutes(slot.startTime)
    const endMinutes = timeToMinutes(slot.endTime)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
  })
}

export function hasScheduleConflict(
  newSchedule: { startTime: Date; endTime: Date },
  existingSchedules: Array<{ startTime: Date; endTime: Date }>
): boolean {
  return existingSchedules.some(existing => {
    return (
      isWithinInterval(newSchedule.startTime, {
        start: existing.startTime,
        end: existing.endTime
      }) ||
      isWithinInterval(newSchedule.endTime, {
        start: existing.startTime,
        end: existing.endTime
      }) ||
      (isBefore(newSchedule.startTime, existing.startTime) &&
        isAfter(newSchedule.endTime, existing.endTime))
    )
  })
}