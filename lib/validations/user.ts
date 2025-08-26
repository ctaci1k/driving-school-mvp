// lib/validations/user.ts
import { z } from 'zod'

export const userRegistrationSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Imię jest wymagane'),
  lastName: z.string().min(2, 'Nazwisko jest wymagane'),
  phone: z.string()
    .regex(/^(\+48)?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/, 'Nieprawidłowy numer telefonu'),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).default('STUDENT'),
  acceptTerms: z.boolean().refine(val => val === true, 'Musisz zaakceptować regulamin'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła muszą być identyczne',
  path: ['confirmPassword'],
})

export const userProfileSchema = z.object({
  firstName: z.string().min(2, 'Imię jest wymagane'),
  lastName: z.string().min(2, 'Nazwisko jest wymagane'),
  phone: z.string()
    .regex(/^(\+48)?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/, 'Nieprawidłowy numer telefonu'),
  email: z.string().email('Nieprawidłowy adres email'),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string()
    .regex(/^[0-9]{2}-[0-9]{3}$/, 'Format: 00-000')
    .optional(),
  pesel: z.string()
    .regex(/^[0-9]{11}$/, 'PESEL musi mieć 11 cyfr')
    .optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Obecne hasło jest wymagane'),
  newPassword: z.string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Hasła muszą być identyczne',
  path: ['confirmPassword'],
})

export const userPreferencesSchema = z.object({
  language: z.enum(['pl', 'uk', 'en']).default('pl'),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  reminderHours: z.number().min(1).max(48).default(24),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
})

export const instructorProfileSchema = userProfileSchema.extend({
  licenseNumber: z.string().min(1, 'Numer licencji jest wymagany'),
  licenseExpiry: z.date(),
  specializations: z.array(z.enum([
    'CITY_TRAFFIC',
    'HIGHWAY',
    'PARKING',
    'NIGHT_DRIVING',
    'EXAM_PREPARATION'
  ])).default([]),
  yearsOfExperience: z.number().min(0).max(50),
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().min(0).optional(),
})

export const studentProfileSchema = userProfileSchema.extend({
  studentId: z.string().optional(),
  theoryExamPassed: z.boolean().default(false),
  theoryExamDate: z.date().optional(),
  practicalExamAttempts: z.number().min(0).default(0),
  practicalExamPassed: z.boolean().default(false),
  practicalExamDate: z.date().optional(),
  preferredInstructorId: z.string().optional(),
})

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type UserProfileData = z.infer<typeof userProfileSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>
export type InstructorProfileData = z.infer<typeof instructorProfileSchema>
export type StudentProfileData = z.infer<typeof studentProfileSchema>

// Validation helpers
export function validatePesel(pesel: string): boolean {
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

export function validateAge(dateOfBirth: Date, minAge = 17): boolean {
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age >= minAge
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 9 || (cleaned.length === 11 && cleaned.startsWith('48'))
}