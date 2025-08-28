// app/[locale]/instructor/schedule/types/schedule.types.ts
// Główne typy dla modułu harmonogramu instruktora

export interface TimeInterval {
  start: string // Format HH:mm
  end: string   // Format HH:mm
}

export interface WorkingHours {
  enabled: boolean
  intervals: TimeInterval[]
  slotDuration: number // W minutach (np. 120 dla 2h)
  breakDuration: number // W minutach (np. 15)
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  lessonsCompleted?: number
  packageType?: 'podstawowy' | 'rozszerzony' | 'premium'
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  type: 'plac' | 'miasto' | 'trasa'
  coordinates?: {
    lat: number
    lng: number
  }
}

export type SlotStatus = 
  | 'dostępny'
  | 'zarezerwowany' 
  | 'zablokowany'
  | 'zakończony'
  | 'anulowany'
  | 'nieobecność'
  | 'w_trakcie'

export interface Slot {
  id: string
  date: string // Format YYYY-MM-DD
  startTime: string // Format HH:mm
  endTime: string // Format HH:mm
  status: SlotStatus
  student?: Student
  location?: Location
  notes?: string
  createdAt?: Date
  updatedAt?: Date
  cancelReason?: string
  lessonType?: 'jazda' | 'plac' | 'teoria' | 'egzamin'
  vehicleId?: string
  payment?: {
    status: 'opłacony' | 'nieopłacony' | 'częściowo'
    amount: number
    method?: 'gotówka' | 'przelew' | 'karta'
  }
}

export interface ScheduleTemplate {
  id: string
  name: string
  description?: string
  workingHours: Record<string, WorkingHours>
  isDefault: boolean
  createdAt: Date
  updatedAt?: Date
}

export type ExceptionType = 
  | 'urlop'
  | 'choroba'
  | 'święto'
  | 'szkolenie'
  | 'inne'

export interface Exception {
  id: string
  type: ExceptionType
  startDate: string // Format YYYY-MM-DD
  endDate: string // Format YYYY-MM-DD
  description?: string
  isRecurring?: boolean
  recurringPattern?: 'rocznie' | 'miesięcznie'
  createdAt: Date
  affectedSlots?: string[] // IDs slotów które są zablokowane
}

export type CancellationRequestStatus = 
  | 'oczekujący'
  | 'zatwierdzony'
  | 'odrzucony'

export interface CancellationRequest {
  id: string
  slotId: string
  slot?: Slot
  student: Student
  requestDate: Date
  reason: string
  status: CancellationRequestStatus
  processedAt?: Date
  processedBy?: string
  adminComment?: string
  refundAmount?: number
}

export interface ScheduleStats {
  totalSlots: number
  bookedSlots: number
  availableSlots: number
  blockedSlots: number
  completedLessons: number
  cancelledLessons: number
  noShowCount: number
  occupancyRate: number // Procent zajętości
  weeklyHours: number
  monthlyEarnings: number
  upcomingLessons: number
  pendingRequests: number
}

export interface DaySchedule {
  date: Date
  dayName: string
  slots: Slot[]
  workingHours: WorkingHours
  isException: boolean
  exceptionDetails?: Exception
}

export interface WeekSchedule {
  weekNumber: number
  startDate: Date
  endDate: Date
  days: DaySchedule[]
  stats: {
    totalSlots: number
    bookedSlots: number
    earnings: number
  }
}

export interface FilterOptions {
  dateRange?: {
    start: Date
    end: Date
  }
  status?: SlotStatus[]
  studentId?: string
  locationId?: string
  lessonType?: string[]
  showOnlyAvailable?: boolean
  showOnlyCancellable?: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  reminderTime: number // Minuty przed zajęciami
  cancellationAlerts: boolean
  newBookingAlerts: boolean
}

export interface InstructorPreferences {
  defaultSlotDuration: number
  defaultBreakDuration: number
  minAdvanceBooking: number // Minimalne wyprzedzenie rezerwacji w godzinach
  maxAdvanceBooking: number // Maksymalne wyprzedzenie rezerwacji w dniach
  allowStudentCancellation: boolean
  cancellationDeadline: number // Godziny przed zajęciami
  autoConfirmBookings: boolean
  preferredLocations: string[]
  notifications: NotificationSettings
}

export interface ScheduleExportData {
  slots: Slot[]
  workingHours: Record<string, WorkingHours>
  templates: ScheduleTemplate[]
  exceptions: Exception[]
  exportDate: string
  instructorId: string
  version: string
}