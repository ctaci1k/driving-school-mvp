// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistance, formatRelative, isToday, isTomorrow, isYesterday } from 'date-fns'
import { pl, uk, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocale(locale: string) {
  switch (locale) {
    case 'pl':
      return pl
    case 'uk':
      return uk
    default:
      return enUS
  }
}

export function formatDate(date: Date | string, formatStr: string, locale: string) {
  return format(new Date(date), formatStr, { locale: getLocale(locale) })
}

export function formatRelativeDate(date: Date | string, locale: string) {
  const d = new Date(date)
  
  if (isToday(d)) {
    return locale === 'pl' ? 'Dziś' : locale === 'uk' ? 'Сьогодні' : 'Today'
  }
  
  if (isTomorrow(d)) {
    return locale === 'pl' ? 'Jutro' : locale === 'uk' ? 'Завтра' : 'Tomorrow'
  }
  
  if (isYesterday(d)) {
    return locale === 'pl' ? 'Wczoraj' : locale === 'uk' ? 'Вчора' : 'Yesterday'
  }
  
  return formatRelative(d, new Date(), { locale: getLocale(locale) })
}

export function formatTimeDistance(date: Date | string, locale: string) {
  return formatDistance(new Date(date), new Date(), { 
    locale: getLocale(locale),
    addSuffix: true 
  })
}

export function formatCurrency(amount: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatPhoneNumber(phone: string) {
  // Format Polish phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('48')) {
    return `+48 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  return phone
}

export function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.[0] || ''
  const l = lastName?.[0] || ''
  return (f + l).toUpperCase()
}

export function generateTimeSlots(
  startHour = 6,
  endHour = 22,
  interval = 30
): string[] {
  const slots: string[] = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(time)
    }
  }
  
  return slots
}

export function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 9 || (cleaned.length === 11 && cleaned.startsWith('48'))
}

export function isValidPesel(pesel: string): boolean {
  if (!/^\d{11}$/.test(pesel)) return false
  
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
  const digits = pesel.split('').map(Number)
  
  let sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * weights[i]
  }
  
  const checksum = (10 - (sum % 10)) % 10
  return checksum === digits[10]
}

export function generatePassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function downloadFile(data: any, filename: string, type = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)], { type })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800'
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export function getLessonTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    STANDARD: 'bg-blue-100 text-blue-800',
    CITY_TRAFFIC: 'bg-green-100 text-green-800',
    HIGHWAY: 'bg-orange-100 text-orange-800',
    PARKING: 'bg-purple-100 text-purple-800',
    EXAM_PREPARATION: 'bg-red-100 text-red-800',
    NIGHT_DRIVING: 'bg-indigo-100 text-indigo-800'
  }
  
  return typeColors[type] || 'bg-gray-100 text-gray-800'
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key])
    if (!result[group]) result[group] = []
    result[group].push(item)
    return result
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function range(start: number, end: number, step = 1): number[] {
  const result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}