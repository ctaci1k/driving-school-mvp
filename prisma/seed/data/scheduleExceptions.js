// prisma/seed/data/scheduleExceptions.ts

const { ScheduleExceptionType } = require('@prisma/client')

const scheduleExceptions = [
  // Instructor 1 - Jan Kowalski - Vacation
  {
    id: 'exception-1',
    instructorId: 'instructor-1',
    type: ScheduleExceptionType.VACATION,
    startDate: new Date('2024-12-23'),
    endDate: new Date('2024-12-31'),
    allDay: true,
    reason: 'Urlop świąteczny',
    description: 'Przerwa świąteczna - Boże Narodzenie i Nowy Rok',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-11-20'),
    affectsBookings: true,
    bookingsReassigned: 5,
    notificationSent: true,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-20'),
  },

  // Instructor 2 - Anna Nowak - Sick leave
  {
    id: 'exception-2',
    instructorId: 'instructor-2',
    type: ScheduleExceptionType.SICK_LEAVE,
    startDate: new Date('2024-10-10'),
    endDate: new Date('2024-10-12'),
    allDay: true,
    reason: 'Zwolnienie lekarskie',
    description: 'Grypa',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-10'),
    affectsBookings: true,
    bookingsReassigned: 3,
    notificationSent: true,
    medicalCertificateNumber: 'ZLA/2024/10/1234',
    certificateExpected: false,
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-10'),
  },

  // Instructor 3 - Piotr Wiśniewski - Training
  {
    id: 'exception-3',
    instructorId: 'instructor-3',
    type: ScheduleExceptionType.TRAINING,
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-11-16'),
    allDay: true,
    reason: 'Szkolenie zawodowe',
    description: 'Kurs doskonalenia techniki jazdy - poziom zaawansowany',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-30'),
    affectsBookings: true,
    bookingsReassigned: 4,
    notificationSent: true,
    location: 'Centrum Szkoleniowe, Warszawa',
    compensationRate: 150,
    additionalCompensation: 500,
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-30'),
  },

  // Instructor 4 - Katarzyna Lewandowska - Personal leave (half day)
  {
    id: 'exception-4',
    instructorId: 'instructor-4',
    type: ScheduleExceptionType.PERSONAL_LEAVE,
    startDate: new Date('2024-10-20'),
    endDate: new Date('2024-10-20'),
    allDay: false,
    startTime: '14:00',
    endTime: '18:00',
    reason: 'Sprawy osobiste',
    description: 'Wizyta u lekarza specjalisty',
    isApproved: true,
    approvedBy: 'branch-manager-1',
    approvedAt: new Date('2024-10-18'),
    affectsBookings: true,
    bookingsReassigned: 2,
    notificationSent: true,
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-18'),
  },

  // Company-wide holiday
  {
    id: 'exception-5',
    instructorId: 'instructor-1',
    type: ScheduleExceptionType.HOLIDAY,
    startDate: new Date('2024-11-11'),
    endDate: new Date('2024-11-11'),
    allDay: true,
    reason: 'Święto Niepodległości',
    description: 'Dzień ustawowo wolny od pracy',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-01-01'),
    affectsBookings: true,
    bookingsReassigned: 0,
    notificationSent: true,
    isCompanyWide: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Instructor 5 - Tomasz Kamiński - Substituting
  {
    id: 'exception-6',
    instructorId: 'instructor-5',
    type: ScheduleExceptionType.OTHER,
    startDate: new Date('2024-10-10'),
    endDate: new Date('2024-10-10'),
    allDay: false,
    startTime: '09:00',
    endTime: '13:00',
    reason: 'Zastępstwo',
    description: 'Zastępstwo za instruktora Anna Nowak - choroba',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-10'),
    affectsBookings: false,
    substitutingForId: 'instructor-2',
    additionalCompensation: 200,
    notificationSent: true,
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-10'),
  },

  // Future vacation - pending approval
  {
    id: 'exception-7',
    instructorId: 'instructor-6',
    type: ScheduleExceptionType.VACATION,
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-22'),
    allDay: true,
    reason: 'Urlop wypoczynkowy',
    description: 'Wyjazd zimowy',
    isApproved: false,
    affectsBookings: true,
    estimatedCost: 2500,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01'),
  },

  // Instructor 7 - Robert Mazur - Company event
  {
    id: 'exception-8',
    instructorId: 'instructor-7',
    type: ScheduleExceptionType.COMPANY_EVENT,
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-20'),
    allDay: false,
    startTime: '15:00',
    endTime: '23:00',
    reason: 'Wigilia firmowa',
    description: 'Spotkanie świąteczne pracowników',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-11-01'),
    affectsBookings: true,
    bookingsReassigned: 1,
    notificationSent: true,
    isCompanyWide: true,
    location: 'Restauracja Polska, Warszawa',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },

  // Past sick leave with medical certificate
  {
    id: 'exception-9',
    instructorId: 'instructor-8',
    type: ScheduleExceptionType.SICK_LEAVE,
    startDate: new Date('2024-09-05'),
    endDate: new Date('2024-09-09'),
    allDay: true,
    reason: 'Zwolnienie lekarskie',
    description: 'Kontuzja - zwichnięcie kostki',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-09-05'),
    affectsBookings: true,
    bookingsReassigned: 6,
    notificationSent: true,
    medicalCertificateNumber: 'ZLA/2024/09/0987',
    certificateExpected: false,
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-05'),
  },

  // Instructor 1 - Future training
  {
    id: 'exception-10',
    instructorId: 'instructor-1',
    type: ScheduleExceptionType.TRAINING,
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-02-14'),
    allDay: true,
    reason: 'Kurs egzaminatora',
    description: 'Szkolenie na egzaminatora WORD',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-15'),
    affectsBookings: true,
    notificationSent: false,
    location: 'WORD Warszawa',
    compensationRate: 200,
    additionalCompensation: 3000,
    estimatedCost: 5000,
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-15'),
  },

  // Multiple instructors - May holiday
  {
    id: 'exception-11',
    instructorId: 'instructor-1',
    type: ScheduleExceptionType.HOLIDAY,
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-03'),
    allDay: true,
    reason: 'Majówka',
    description: 'Święto Pracy i Konstytucji 3 Maja',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-01-01'),
    affectsBookings: true,
    notificationSent: false,
    isCompanyWide: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Instructor 2 - Personal leave for wedding
  {
    id: 'exception-12',
    instructorId: 'instructor-2',
    type: ScheduleExceptionType.PERSONAL_LEAVE,
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-21'),
    allDay: true,
    reason: 'Urlop okolicznościowy',
    description: 'Ślub',
    isApproved: false,
    affectsBookings: true,
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
  },
]

module.exports = async function seedScheduleExceptions(prisma, logger, options = {}) {
  try {
    const created = await prisma.scheduleException.createMany({
      data: scheduleExceptions,
      skipDuplicates: true
    })
    
    logger.success(`✓ Created ${created.count} schedule exceptions`)
    return created
  } catch (error) {
    logger.error('✗ Failed to seed schedule exceptions:', error.message)
    throw error
  }
}