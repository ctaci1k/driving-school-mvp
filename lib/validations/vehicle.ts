// lib/validations/vehicle.ts
import { z } from 'zod'
import { addMonths, isBefore, isAfter } from 'date-fns'

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Marka jest wymagana').max(50),
  model: z.string().min(1, 'Model jest wymagany').max(50),
  year: z.number()
    .min(1990, 'Rok produkcji nie może być wcześniejszy niż 1990')
    .max(new Date().getFullYear() + 1, 'Nieprawidłowy rok produkcji'),
  registrationNumber: z.string()
    .min(1, 'Numer rejestracyjny jest wymagany')
    .regex(/^[A-Z]{2,3}\s?[A-Z0-9]{4,5}$/, 'Nieprawidłowy format numeru rejestracyjnego'),
  vin: z.string()
    .length(17, 'VIN musi mieć 17 znaków')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Nieprawidłowy format VIN'),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG']),
  category: z.enum(['B', 'B1', 'BE', 'C', 'CE', 'D', 'DE']).default('B'),
  color: z.string().optional(),
  mileage: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE', 'RETIRED']).default('ACTIVE'),
  notes: z.string().max(1000).optional(),
})

export const vehicleMaintenanceSchema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum([
    'OIL_CHANGE',
    'TIRE_CHANGE',
    'BRAKE_SERVICE',
    'INSPECTION',
    'REPAIR',
    'CLEANING',
    'OTHER'
  ]),
  description: z.string().min(1, 'Opis jest wymagany').max(500),
  date: z.date(),
  mileage: z.number().min(0),
  cost: z.number().min(0).optional(),
  nextServiceDate: z.date().optional(),
  nextServiceMileage: z.number().min(0).optional(),
  performedBy: z.string().optional(),
  invoiceNumber: z.string().optional(),
})

export const vehicleInsuranceSchema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(['OC', 'AC', 'ASSISTANCE', 'NNW']),
  provider: z.string().min(1, 'Nazwa ubezpieczyciela jest wymagana'),
  policyNumber: z.string().min(1, 'Numer polisy jest wymagany'),
  startDate: z.date(),
  endDate: z.date(),
  premium: z.number().min(0),
  coverage: z.string().max(1000).optional(),
})

export const vehicleInspectionSchema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(['TECHNICAL', 'PERIODIC', 'EMISSION']),
  date: z.date(),
  validUntil: z.date(),
  result: z.enum(['PASSED', 'FAILED', 'CONDITIONAL']),
  notes: z.string().max(500).optional(),
  stationName: z.string().optional(),
  certificateNumber: z.string().optional(),
})

export const vehicleAssignmentSchema = z.object({
  vehicleId: z.string().min(1),
  instructorId: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  isPrimary: z.boolean().default(false),
  notes: z.string().max(500).optional(),
})

export const vehicleFilterSchema = z.object({
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE', 'RETIRED']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']).optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG']).optional(),
  category: z.enum(['B', 'B1', 'BE', 'C', 'CE', 'D', 'DE']).optional(),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  mileageFrom: z.number().optional(),
  mileageTo: z.number().optional(),
  assignedInstructorId: z.string().optional(),
})

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1),
  date: z.date(),
  mileage: z.number().min(0),
  liters: z.number().min(0.01),
  pricePerLiter: z.number().min(0.01),
  totalCost: z.number().min(0.01),
  fuelType: z.enum(['PETROL', 'DIESEL', 'LPG', 'ELECTRIC']),
  station: z.string().optional(),
  notes: z.string().max(500).optional(),
})

export type VehicleData = z.infer<typeof vehicleSchema>
export type VehicleMaintenanceData = z.infer<typeof vehicleMaintenanceSchema>
export type VehicleInsuranceData = z.infer<typeof vehicleInsuranceSchema>
export type VehicleInspectionData = z.infer<typeof vehicleInspectionSchema>
export type VehicleAssignmentData = z.infer<typeof vehicleAssignmentSchema>
export type VehicleFilterData = z.infer<typeof vehicleFilterSchema>
export type FuelLogData = z.infer<typeof fuelLogSchema>

// VIN validation
export function validateVIN(vin: string): boolean {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return false
  }
  
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
  const values: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  }
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += values[vin[i]] * weights[i]
  }
  
  const checkDigit = sum % 11
  const checkChar = checkDigit === 10 ? 'X' : checkDigit.toString()
  
  return vin[8] === checkChar
}

// Registration number validation (Polish format)
export function validateRegistrationNumber(regNumber: string): boolean {
  // Remove spaces
  const cleaned = regNumber.replace(/\s/g, '')
  
  // Polish registration number patterns
  const patterns = [
    /^[A-Z]{2}[0-9]{4,5}$/,     // XX 12345
    /^[A-Z]{3}[0-9]{4,5}$/,     // XXX 1234
    /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/, // XX 123XX
    /^[A-Z]{2}[A-Z0-9]{5}$/,     // XX X1234
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

// Maintenance scheduling
export function getNextMaintenanceDate(
  lastServiceDate: Date,
  intervalMonths: number
): Date {
  return addMonths(lastServiceDate, intervalMonths)
}

export function isMaintenanceDue(
  lastServiceDate: Date,
  intervalMonths: number,
  warningDays = 30
): {
  isDue: boolean
  isWarning: boolean
  daysUntilDue: number
} {
  const nextServiceDate = getNextMaintenanceDate(lastServiceDate, intervalMonths)
  const now = new Date()
  const daysUntilDue = Math.floor(
    (nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return {
    isDue: daysUntilDue <= 0,
    isWarning: daysUntilDue > 0 && daysUntilDue <= warningDays,
    daysUntilDue: Math.max(0, daysUntilDue),
  }
}

// Insurance validation
export function isInsuranceValid(
  endDate: Date,
  warningDays = 30
): {
  isValid: boolean
  isExpiring: boolean
  daysRemaining: number
} {
  const now = new Date()
  const daysRemaining = Math.floor(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return {
    isValid: daysRemaining > 0,
    isExpiring: daysRemaining > 0 && daysRemaining <= warningDays,
    daysRemaining: Math.max(0, daysRemaining),
  }
}

// Inspection validation
export function isInspectionValid(
  validUntil: Date,
  warningDays = 30
): {
  isValid: boolean
  isExpiring: boolean
  daysRemaining: number
} {
  return isInsuranceValid(validUntil, warningDays)
}

// Fuel efficiency calculation
export function calculateFuelEfficiency(
  fuelLogs: Array<{
    mileage: number
    liters: number
    date: Date
  }>
): {
  averageConsumption: number // liters per 100km
  totalDistance: number
  totalFuel: number
} {
  if (fuelLogs.length < 2) {
    return {
      averageConsumption: 0,
      totalDistance: 0,
      totalFuel: 0,
    }
  }
  
  // Sort by mileage
  const sorted = [...fuelLogs].sort((a, b) => a.mileage - b.mileage)
  
  const totalDistance = sorted[sorted.length - 1].mileage - sorted[0].mileage
  const totalFuel = sorted.reduce((sum, log) => sum + log.liters, 0)
  
  const averageConsumption = totalDistance > 0
    ? (totalFuel / totalDistance) * 100
    : 0
  
  return {
    averageConsumption: Number(averageConsumption.toFixed(2)),
    totalDistance,
    totalFuel: Number(totalFuel.toFixed(2)),
  }
}

// Vehicle availability check
export function isVehicleAvailable(
  vehicle: {
    status: string
    assignments?: Array<{
      startDate: Date
      endDate?: Date
    }>
  },
  date: Date
): boolean {
  if (vehicle.status !== 'ACTIVE') {
    return false
  }
  
  if (!vehicle.assignments || vehicle.assignments.length === 0) {
    return true
  }
  
  return !vehicle.assignments.some(assignment => {
    const startDate = new Date(assignment.startDate)
    const endDate = assignment.endDate ? new Date(assignment.endDate) : null
    
    if (endDate) {
      return date >= startDate && date <= endDate
    } else {
      return date >= startDate
    }
  })
}

// Calculate vehicle usage statistics
export function calculateVehicleStats(
  bookings: Array<{
    startTime: Date
    endTime: Date
    distance?: number
  }>
): {
  totalHours: number
  totalBookings: number
  totalDistance: number
  averageBookingDuration: number
  utilizationRate: number // percentage
} {
  const totalBookings = bookings.length
  
  if (totalBookings === 0) {
    return {
      totalHours: 0,
      totalBookings: 0,
      totalDistance: 0,
      averageBookingDuration: 0,
      utilizationRate: 0,
    }
  }
  
  let totalMinutes = 0
  let totalDistance = 0
  
  bookings.forEach(booking => {
    const duration = (new Date(booking.endTime).getTime() - 
                     new Date(booking.startTime).getTime()) / (1000 * 60)
    totalMinutes += duration
    totalDistance += booking.distance || 0
  })
  
  const totalHours = totalMinutes / 60
  const averageBookingDuration = totalMinutes / totalBookings
  
  // Calculate utilization (assuming 8 hours per day, 22 working days per month)
  const availableHours = 8 * 22
  const utilizationRate = (totalHours / availableHours) * 100
  
  return {
    totalHours: Number(totalHours.toFixed(2)),
    totalBookings,
    totalDistance,
    averageBookingDuration: Number(averageBookingDuration.toFixed(0)),
    utilizationRate: Number(Math.min(100, utilizationRate).toFixed(2)),
  }
}