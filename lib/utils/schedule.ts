// lib/utils/schedule.ts

import { 
  startOfDay, 
  endOfDay, 
  addMinutes, 
  isAfter, 
  isBefore, 
  isEqual,
  setHours,
  setMinutes,
  format,
  parse
} from 'date-fns'

export interface TimeSlot {
  id: string
  instructorId: string
  startTime: Date
  endTime: Date
  isAvailable: boolean
}

export interface InstructorSchedule {
  id: string
  instructorId: string
  dayOfWeek: number
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  isAvailable: boolean
}

export interface Booking {
  id: string
  instructorId: string
  startTime: Date
  endTime: Date
  status: string
}

/**
 * Генерує доступні слоти для інструктора на конкретну дату
 */
export function generateAvailableSlots(
  date: Date,
  schedule: InstructorSchedule,
  existingBookings: Booking[],
  slotDuration: number = 120 // хвилини (2 години)
): TimeSlot[] {
  const slots: TimeSlot[] = []
  
  // Перевіряємо чи розклад активний
  if (!schedule.isAvailable) {
    return slots
  }

  // Перевіряємо чи день тижня співпадає
  const dayOfWeek = date.getDay()
  if (dayOfWeek !== schedule.dayOfWeek) {
    return slots
  }

  // Парсимо час початку та кінця робочого дня
  const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
  const [endHour, endMinute] = schedule.endTime.split(':').map(Number)

  // Створюємо дати початку та кінця для конкретного дня
  let currentSlotStart = setMinutes(setHours(date, startHour), startMinute)
  const dayEnd = setMinutes(setHours(date, endHour), endMinute)

  // Поточний час (для фільтрації минулих слотів)
  const now = new Date()

  // Генеруємо слоти
  while (currentSlotStart < dayEnd) {
    const currentSlotEnd = addMinutes(currentSlotStart, slotDuration)

    // Перевіряємо чи слот не виходить за межі робочого дня
    if (currentSlotEnd > dayEnd) {
      break
    }

    // Перевіряємо чи слот не в минулому
    const isInPast = isBefore(currentSlotStart, now)

    // Перевіряємо чи немає конфлікту з існуючими бронюваннями
    const hasConflict = existingBookings.some(booking => {
      if (booking.status === 'CANCELLED') return false
      
      // Перевірка перетину часових інтервалів
      return !(
        isAfter(currentSlotStart, booking.endTime) ||
        isEqual(currentSlotStart, booking.endTime) ||
        isBefore(currentSlotEnd, booking.startTime) ||
        isEqual(currentSlotEnd, booking.startTime)
      )
    })

    // Додаємо слот
    slots.push({
      id: `${schedule.instructorId}-${currentSlotStart.getTime()}`,
      instructorId: schedule.instructorId,
      startTime: currentSlotStart,
      endTime: currentSlotEnd,
      isAvailable: !isInPast && !hasConflict
    })

    // Переходимо до наступного слоту
    currentSlotStart = currentSlotEnd
  }

  return slots
}

/**
 * Отримує всі доступні слоти для інструктора на діапазон дат
 */
export function getAvailableSlotsForRange(
  startDate: Date,
  endDate: Date,
  schedules: InstructorSchedule[],
  bookings: Booking[],
  slotDuration: number = 120
): TimeSlot[] {
  const allSlots: TimeSlot[] = []
  
  // Проходимо по кожному дню в діапазоні
  let currentDate = startOfDay(startDate)
  const rangeEnd = endOfDay(endDate)

  while (currentDate <= rangeEnd) {
    const dayOfWeek = currentDate.getDay()
    
    // Знаходимо розклад для цього дня тижня
    const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek)
    
    if (daySchedule) {
      // Фільтруємо бронювання для цього дня
      const dayBookings = bookings.filter(b => {
        const bookingDate = startOfDay(b.startTime)
        return bookingDate.getTime() === currentDate.getTime()
      })
      
      // Генеруємо слоти для цього дня
      const daySlots = generateAvailableSlots(
        currentDate,
        daySchedule,
        dayBookings,
        slotDuration
      )
      
      allSlots.push(...daySlots)
    }
    
    // Переходимо до наступного дня
    currentDate = addMinutes(currentDate, 24 * 60)
  }

  return allSlots
}

/**
 * Форматує слот для відображення
 */
export function formatSlotTime(slot: TimeSlot): string {
  const start = format(slot.startTime, 'HH:mm')
  const end = format(slot.endTime, 'HH:mm')
  return `${start} - ${end}`
}

/**
 * Групує слоти по датах
 */
export function groupSlotsByDate(slots: TimeSlot[]): Record<string, TimeSlot[]> {
  const grouped: Record<string, TimeSlot[]> = {}
  
  slots.forEach(slot => {
    const dateKey = format(slot.startTime, 'yyyy-MM-dd')
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(slot)
  })
  
  return grouped
}

/**
 * Перевіряє чи можна забронювати слот
 */
export function canBookSlot(slot: TimeSlot, minAdvanceHours: number = 24): boolean {
  if (!slot.isAvailable) return false
  
  const now = new Date()
  const minBookingTime = addMinutes(now, minAdvanceHours * 60)
  
  return isAfter(slot.startTime, minBookingTime)
}