// app/[locale]/instructor/schedule/data/mockData.ts

import type {
  Slot,
  WorkingHours,
  ScheduleTemplate,
  Exception,
  CancellationRequest,
  Student,
  Location
} from '../types/schedule.types'
import { ExceptionTypeEnum } from '../types/enums'

// ---------------------------
// Helpers
// ---------------------------

const enumFirst = <T extends object>(e: T): T[keyof T] =>
  (Object.values(e)[0] as T[keyof T])

const DEFAULT_EXCEPTION_TYPE = enumFirst(ExceptionTypeEnum)

const makeLocation = (o: object): Location => (o as unknown as Location)
const makeStudent = (p: {
  id: string; firstName: string; lastName: string; email: string; phone: string
}): Student => ({
  id: p.id,
  firstName: p.firstName,
  lastName: p.lastName,
  email: p.email,
  phone: p.phone,
})

// ---------------------------
// Locations
// ---------------------------

const LOC_WAW = makeLocation({
  id: 'loc-waw-plac',
  label: 'Plac manewrowy Warszawa',
  city: 'Warszawa',
  address: 'ul. Puławska 21',
})

const LOC_KRK = makeLocation({
  id: 'loc-krk-plac',
  label: 'Plac manewrowy Kraków',
  city: 'Kraków',
  address: 'ul. Wadowicka 8',
})

const LOC_WRO = makeLocation({
  id: 'loc-wro-plac',
  label: 'Plac manewrowy Wrocław',
  city: 'Wrocław',
  address: 'ul. Grabiszyńska 12',
})

export const locations: Location[] = [LOC_WAW, LOC_KRK, LOC_WRO]

// ---------------------------
// Students
// ---------------------------

export const students: Student[] = [
  makeStudent({ id: 's-anna',  firstName: 'Anna',      lastName: 'Nowak',      email: 'anna.nowak@example.com',     phone: '123 456 789' }),
  makeStudent({ id: 's-piotr', firstName: 'Piotr',     lastName: 'Kowalski',   email: 'piotr.kowalski@example.com',  phone: '987 654 321' }),
  makeStudent({ id: 's-kasia', firstName: 'Katarzyna', lastName: 'Wiśniewska', email: 'k.wisniewska@example.com',    phone: '606 111 222' }),
]

const ST_Anna  = students.find(s => s.id === 's-anna')!
const ST_Piotr = students.find(s => s.id === 's-piotr')!

// ---------------------------
// Dates
// ---------------------------

const today = new Date()
const todayISO = today.toISOString().slice(0, 10)

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowISO = tomorrow.toISOString().slice(0, 10)

const iso = (d: Date) => d.toISOString()

// ---------------------------
// Slots
// ---------------------------

export const mockSlots: Slot[] = [
  {
    id: 'slot-1',
    date: todayISO,
    startTime: '08:00',
    endTime: '10:00',
    status: 'zarezerwowany',
    location: LOC_WAW,
    student: ST_Anna,
    notes: 'Jazda w ruchu miejskim',
  },
  {
    id: 'slot-2',
    date: todayISO,
    startTime: '10:15',
    endTime: '12:15',
    status: 'dostępny',
    location: LOC_WAW,
  },
  {
    id: 'slot-3',
    date: todayISO,
    startTime: '14:00',
    endTime: '16:00',
    status: 'zablokowany',
    location: LOC_KRK,
    notes: 'Serwis auta',
  },
  {
    id: 'slot-4',
    date: tomorrowISO,
    startTime: '08:00',
    endTime: '10:00',
    status: 'zarezerwowany',
    location: LOC_WRO,
    student: ST_Piotr,
  },
  {
    id: 'slot-5',
    date: tomorrowISO,
    startTime: '10:30',
    endTime: '12:30',
    status: 'dostępny',
    location: LOC_WRO,
  },
]

// ---------------------------
// Templates
// ---------------------------

const baseWorkingHours: Record<string, WorkingHours> = {
  poniedziałek:   { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
  wtorek:         { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
  środa:          { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
  czwartek:       { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
  piątek:         { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }], slotDuration: 120, breakDuration: 15 },
  sobota:         { enabled: true,  intervals: [{ start: '08:00', end: '12:00' }],                                  slotDuration: 120, breakDuration: 15 },
  niedziela:      { enabled: false, intervals: [],                                                                   slotDuration: 120, breakDuration: 15 },
}

export const mockTemplates: ScheduleTemplate[] = [
  {
    id: 'template-standard',
    name: 'Tydzień standard',
    workingHours: baseWorkingHours,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'template-poranny',
    name: 'Tylko poranki',
    workingHours: {
      ...baseWorkingHours,
      poniedziałek: { ...baseWorkingHours.poniedziałek, intervals: [{ start: '08:00', end: '12:00' }] },
      wtorek:       { ...baseWorkingHours.wtorek,       intervals: [{ start: '08:00', end: '12:00' }] },
      środa:        { ...baseWorkingHours.środa,        intervals: [{ start: '08:00', end: '12:00' }] },
      czwartek:     { ...baseWorkingHours.czwartek,     intervals: [{ start: '08:00', end: '12:00' }] },
      piątek:       { ...baseWorkingHours.piątek,       intervals: [{ start: '08:00', end: '12:00' }] },
      sobota:       { ...baseWorkingHours.sobota },
      niedziela:    { ...baseWorkingHours.niedziela },
    },
    isDefault: false,
    createdAt: new Date(),
  },
]

// ---------------------------
// Exceptions
// ---------------------------
//
// Твій тип `Exception` вимагає `startDate` і `endDate`.
// Додаємо їх як ISO-рядки (наприклад, цілий день).

const mkDayRange = (isoDate: string) => {
  const start = new Date(isoDate + 'T00:00:00.000Z')
  const end = new Date(isoDate + 'T23:59:59.999Z')
  return { startDate: iso(start), endDate: iso(end) }
}
// ---------------------------
// Exceptions
// ---------------------------
export const mockExceptions: Exception[] = [
  {
    id: 'ex-1',
    type: DEFAULT_EXCEPTION_TYPE,
    description: 'Badanie techniczne pojazdu',
    ...mkDayRange(todayISO),
    createdAt: new Date(),
  },
  {
    id: 'ex-2',
    type: DEFAULT_EXCEPTION_TYPE,
    description: 'Szkolenie wewnętrzne',
    ...mkDayRange(tomorrowISO),
    createdAt: new Date(),
  },
]

// ---------------------------
// Cancellation Requests
// ---------------------------
// У CancellationRequest є поле `student` (тип Student), тому робимо мінімальний обʼєкт.
export const mockCancellationRequests: CancellationRequest[] = [
  {
    id: 'cr-1',
    slotId: 'slot-1',
    student: {
      id: 's-anna',
      firstName: 'Anna',
      lastName: 'Nowak',
      email: 'anna.nowak@example.com',
      phone: '+48 123 456 789',
    },
    reason: 'Choroba',
    status: 'oczekujący',
    requestDate: new Date(),   // ✅ typ Date
  },
  {
    id: 'cr-2',
    slotId: 'slot-4',
    student: {
      id: 's-piotr',
      firstName: 'Piotr',
      lastName: 'Kowalski',
      email: 'piotr.kowalski@example.com',
      phone: '+48 987 654 321',
    },
    reason: 'Wyjazd służbowy',
    status: 'zatwierdzony',
    requestDate: new Date(),   // ✅ typ Date
  },
]


