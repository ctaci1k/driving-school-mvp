// app/[locale]/instructor/schedule/utils/dateHelpers.ts
// Funkcje pomocnicze do pracy z datami w module harmonogramu


// Formatowanie daty do formatu DD.MM.YYYY
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

// Formatowanie czasu do formatu HH:MM
export function formatTime(time: string | Date): string {
  if (typeof time === 'string') {
    // Jeśli już jest w formacie HH:MM
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time
    }
    // Jeśli jest w formacie ISO
    const date = new Date(time)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
}

// Formatowanie daty i czasu
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

// Sprawdzanie czy daty są tego samego dnia
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Sprawdzanie czy data jest dzisiaj
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

// Sprawdzanie czy data jest w przeszłości
export function isPast(date: Date): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < now
}

// Sprawdzanie czy data jest w przyszłości
export function isFuture(date: Date): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate > now
}

// Pobieranie początku tygodnia (poniedziałek)
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// Pobieranie końca tygodnia (niedziela)
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return end
}

// Pobieranie wszystkich dni tygodnia
export function getCurrentWeek(date: Date): Date[] {
  const start = getWeekStart(date)
  const week = []
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    week.push(day)
  }
  
  return week
}

// Pobieranie początku miesiąca
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Pobieranie końca miesiąca
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// Pobieranie wszystkich dni miesiąca
export function getMonthDays(date: Date): Date[] {
  const start = getMonthStart(date)
  const end = getMonthEnd(date)
  const days = []
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  
  return days
}

// Dodawanie minut do daty
export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

// Dodawanie godzin do daty
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

// Dodawanie dni do daty
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Dodawanie tygodni do daty
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7)
}

// Dodawanie miesięcy do daty
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

// Różnica w minutach między datami
export function diffInMinutes(date1: Date, date2: Date): number {
  return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60)
}

// Różnica w godzinach między datami
export function diffInHours(date1: Date, date2: Date): number {
  return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60)
}

// Różnica w dniach między datami
export function diffInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs(date1.getTime() - date2.getTime()) / oneDay)
}

// Parsowanie czasu z formatu HH:MM do minut od północy
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Konwersja minut od północy do formatu HH:MM
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Sprawdzanie czy czas mieści się w przedziale
export function isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMin = timeToMinutes(time)
  const startMin = timeToMinutes(start)
  const endMin = timeToMinutes(end)
  return timeMin >= startMin && timeMin <= endMin
}

// Pobieranie nazwy dnia tygodnia po polsku
export function getPolishWeekDay(date: Date): string {
  const days = [
    'niedziela',
    'poniedziałek',
    'wtorek',
    'środa',
    'czwartek',
    'piątek',
    'sobota'
  ]
  return days[date.getDay()]
}

// Pobieranie nazwy miesiąca po polsku
export function getPolishMonthName(date: Date): string {
  const months = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień'
  ]
  return months[date.getMonth()]
}

// Formatowanie daty po polsku (np. "poniedziałek, 15 maja 2024")
export function formatPolishDate(date: Date): string {
  const weekDay = getPolishWeekDay(date)
  const day = date.getDate()
  const month = getPolishMonthName(date)
  const year = date.getFullYear()
  return `${weekDay}, ${day} ${month} ${year}`
}

// Formatowanie względnej daty po polsku
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diff = diffInDays(date, now)
  
  if (isSameDay(date, now)) return 'Dziś'
  if (diff === 1 && date > now) return 'Jutro'
  if (diff === 1 && date < now) return 'Wczoraj'
  if (diff === 2 && date > now) return 'Pojutrze'
  if (diff === 2 && date < now) return 'Przedwczoraj'
  if (diff < 7 && date > now) return `Za ${diff} dni`
  if (diff < 7 && date < now) return `${diff} dni temu`
  
  return formatDate(date)
}

// Pobieranie numeru tygodnia w roku
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Sprawdzanie czy rok jest przestępny
export function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

// Pobieranie liczby dni w miesiącu
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

// Parsowanie daty z różnych formatów
export function parseDate(input: string | Date): Date {
  if (input instanceof Date) return input
  
  // Format DD.MM.YYYY
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(input)) {
    const [day, month, year] = input.split('.').map(Number)
    return new Date(year, month - 1, day)
  }
  
  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [year, month, day] = input.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  // Domyślnie próbuj parsować jako ISO
  return new Date(input)
}

// Sortowanie dat
export function sortDates(dates: Date[], ascending = true): Date[] {
  return [...dates].sort((a, b) => {
    const diff = a.getTime() - b.getTime()
    return ascending ? diff : -diff
  })
}

// Znajdowanie najbliższej daty
export function findClosestDate(dates: Date[], target: Date = new Date()): Date | null {
  if (dates.length === 0) return null
  
  return dates.reduce((closest, date) => {
    const closestDiff = Math.abs(closest.getTime() - target.getTime())
    const dateDiff = Math.abs(date.getTime() - target.getTime())
    return dateDiff < closestDiff ? date : closest
  })
}