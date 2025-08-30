// lib/validations/report.ts
import { z } from 'zod'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export const reportPeriodSchema = z.object({
  from: z.date(),
  to: z.date(),
  preset: z.enum([
    'TODAY',
    'YESTERDAY',
    'THIS_WEEK',
    'LAST_WEEK',
    'THIS_MONTH',
    'LAST_MONTH',
    'THIS_QUARTER',
    'LAST_QUARTER',
    'THIS_YEAR',
    'LAST_YEAR',
    'LAST_7_DAYS',
    'LAST_30_DAYS',
    'LAST_90_DAYS',
    'CUSTOM'
  ]).optional(),
})

export const studentReportSchema = z.object({
  studentId: z.string().min(1),
  period: reportPeriodSchema,
  includeSkills: z.boolean().default(true),
  includeAttendance: z.boolean().default(true),
  includePayments: z.boolean().default(false),
  includeInstructorNotes: z.boolean().default(true),
})

export const instructorReportSchema = z.object({
  instructorId: z.string().min(1),
  period: reportPeriodSchema,
  includeStudents: z.boolean().default(true),
  includeRevenue: z.boolean().default(true),
  includeSchedule: z.boolean().default(true),
  includeVehicles: z.boolean().default(false),
})

export const financialReportSchema = z.object({
  period: reportPeriodSchema,
  groupBy: z.enum(['DAY', 'WEEK', 'MONTH', 'QUARTER']).default('MONTH'),
  includeBookings: z.boolean().default(true),
  includePackages: z.boolean().default(true),
  includeRefunds: z.boolean().default(true),
  includeProjections: z.boolean().default(false),
  currency: z.enum(['PLN', 'EUR', 'USD']).default('PLN'),
})

export const vehicleReportSchema = z.object({
  vehicleId: z.string().optional(),
  period: reportPeriodSchema,
  includeMaintenanceCosts: z.boolean().default(true),
  includeFuelCosts: z.boolean().default(true),
  includeInsuranceCosts: z.boolean().default(true),
  includeUtilization: z.boolean().default(true),
  includeBookings: z.boolean().default(false),
})

export const attendanceReportSchema = z.object({
  period: reportPeriodSchema,
  groupBy: z.enum(['student', 'instructor', 'DAY', 'WEEK']).default('student'),
  includeNoShows: z.boolean().default(true),
  includeCancellations: z.boolean().default(true),
  includeRescheduled: z.boolean().default(true),
})

export const examReportSchema = z.object({
  period: reportPeriodSchema,
  examType: z.enum(['THEORY', 'PRACTICAL', 'BOTH']).default('BOTH'),
  includePassRate: z.boolean().default(true),
  includeAttempts: z.boolean().default(true),
  includeByInstructor: z.boolean().default(false),
  includeByLocation: z.boolean().default(false),
})

export const dashboardMetricsSchema = z.object({
  period: reportPeriodSchema.optional(),
  metrics: z.array(z.enum([
    'TOTAL_STUDENTS',
    'ACTIVE_STUDENTS',
    'TOTAL_INSTRUCTORS',
    'TOTAL_BOOKINGS',
    'COMPLETED_LESSONS',
    'TOTAL_REVENUE',
    'PENDING_PAYMENTS',
    'EXAM_PASS_RATE',
    'AVERAGE_RATING',
    'VEHICLE_UTILIZATION',
    'UPCOMING_BOOKINGS',
    'ACTIVE_PACKAGES'
  ])),
})

export const exportReportSchema = z.object({
  type: z.enum(['PDF', 'EXCEL', 'CSV', 'JSON']),
  reportType: z.enum([
    'student',
    'instructor',
    'FINANCIAL',
    'VEHICLE',
    'ATTENDANCE',
    'EXAM',
    'CUSTOM'
  ]),
  data: z.any(),
  options: z.object({
    includeCharts: z.boolean().default(true),
    includeSummary: z.boolean().default(true),
    includeDetails: z.boolean().default(true),
    pageOrientation: z.enum(['PORTRAIT', 'LANDSCAPE']).default('PORTRAIT'),
    language: z.enum(['pl', 'uk', 'en']).default('pl'),
  }).optional(),
})

export type ReportPeriodData = z.infer<typeof reportPeriodSchema>
export type StudentReportData = z.infer<typeof studentReportSchema>
export type InstructorReportData = z.infer<typeof instructorReportSchema>
export type FinancialReportData = z.infer<typeof financialReportSchema>
export type VehicleReportData = z.infer<typeof vehicleReportSchema>
export type AttendanceReportData = z.infer<typeof attendanceReportSchema>
export type ExamReportData = z.infer<typeof examReportSchema>
export type DashboardMetricsData = z.infer<typeof dashboardMetricsSchema>
export type ExportReportData = z.infer<typeof exportReportSchema>

// Report calculation helpers
export function calculateAttendanceRate(
  completed: number,
  cancelled: number,
  noShows: number
): number {
  const total = completed + cancelled + noShows
  if (total === 0) return 100
  return Number(((completed / total) * 100).toFixed(2))
}

export function calculatePassRate(
  passed: number,
  failed: number
): number {
  const total = passed + failed
  if (total === 0) return 0
  return Number(((passed / total) * 100).toFixed(2))
}

export function calculateRevenue(
  payments: Array<{
    amount: number
    status: string
    refundedAmount?: number
  }>
): {
  gross: number
  net: number
  refunded: number
  pending: number
} {
  let gross = 0
  let refunded = 0
  let pending = 0
  
  payments.forEach(payment => {
    if (payment.status === 'COMPLETED') {
      gross += payment.amount
      refunded += payment.refundedAmount || 0
    } else if (payment.status === 'PENDING') {
      pending += payment.amount
    }
  })
  
  return {
    gross,
    net: gross - refunded,
    refunded,
    pending,
  }
}

export function calculateGrowthRate(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(2))
}

export function calculateAverageRating(
  ratings: Array<{ rating: number; weight?: number }>
): number {
  if (ratings.length === 0) return 0
  
  let totalRating = 0
  let totalWeight = 0
  
  ratings.forEach(r => {
    const weight = r.weight || 1
    totalRating += r.rating * weight
    totalWeight += weight
  })
  
  return Number((totalRating / totalWeight).toFixed(2))
}

export function calculateUtilizationRate(
  usedHours: number,
  availableHours: number
): number {
  if (availableHours === 0) return 0
  return Number(Math.min(100, (usedHours / availableHours) * 100).toFixed(2))
}

export function groupDataByPeriod<T extends { date: Date }>(
  data: T[],
  groupBy: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER'
): Map<string, T[]> {
  const grouped = new Map<string, T[]>()
  
  data.forEach(item => {
    let key: string
    const date = new Date(item.date)
    
    switch (groupBy) {
      case 'DAY':
        key = date.toISOString().split('T')[0]
        break
      case 'WEEK':
        const weekNumber = getWeekNumber(date)
        key = `${date.getFullYear()}-W${weekNumber}`
        break
      case 'MONTH':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'QUARTER':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        key = `${date.getFullYear()}-Q${quarter}`
        break
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })
  
  return grouped
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function calculateTrend(
  data: Array<{ date: Date; value: number }>,
  periods = 7
): {
  trend: 'UP' | 'DOWN' | 'STABLE'
  percentage: number
  forecast: number
} {
  if (data.length < 2) {
    return { trend: 'STABLE', percentage: 0, forecast: 0 }
  }
  
  // Sort by date
  const sorted = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  // Take last N periods
  const recent = sorted.slice(-periods)
  
  // Calculate trend using linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  
  recent.forEach((item, index) => {
    sumX += index
    sumY += item.value
    sumXY += index * item.value
    sumX2 += index * index
  })
  
  const n = recent.length
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // Calculate forecast for next period
  const forecast = slope * n + intercept
  
  // Calculate percentage change
  const firstValue = recent[0].value
  const lastValue = recent[recent.length - 1].value
  const percentage = firstValue !== 0
    ? ((lastValue - firstValue) / firstValue) * 100
    : 0
  
  // Determine trend
  let trend: 'UP' | 'DOWN' | 'STABLE'
  if (Math.abs(percentage) < 5) {
    trend = 'STABLE'
  } else if (percentage > 0) {
    trend = 'UP'
  } else {
    trend = 'DOWN'
  }
  
  return {
    trend,
    percentage: Number(percentage.toFixed(2)),
    forecast: Number(forecast.toFixed(2)),
  }
}

export function generateReportSummary(
  data: any,
  reportType: string
): {
  title: string
  highlights: Array<{ label: string; value: string | number }>
  insights: string[]
} {
  // This would be customized based on report type
  const highlights: Array<{ label: string; value: string | number }> = []
  const insights: string[] = []
  
  switch (reportType) {
    case 'student':
      highlights.push(
        { label: 'Ukończone lekcje', value: data.completedLessons || 0 },
        { label: 'Frekwencja', value: `${data.attendanceRate || 0}%` },
        { label: 'Postęp', value: `${data.progress || 0}%` }
      )
      if (data.attendanceRate < 80) {
        insights.push('Niska frekwencja może wydłużyć czas nauki')
      }
      break
      
    case 'FINANCIAL':
      highlights.push(
        { label: 'Przychód', value: `${data.revenue || 0} PLN` },
        { label: 'Wzrost', value: `${data.growth || 0}%` },
        { label: 'Zaległości', value: `${data.pending || 0} PLN` }
      )
      if (data.growth > 10) {
        insights.push('Znaczący wzrost przychodów w tym okresie')
      }
      break
  }
  
  return {
    title: `Raport ${reportType}`,
    highlights,
    insights,
  }
}