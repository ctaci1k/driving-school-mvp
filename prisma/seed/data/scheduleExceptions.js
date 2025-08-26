// prisma/seed/data/scheduleExceptions.js

const scheduleExceptions = [
  // Instructor 1 - Jan Kowalski - Vacation
  {
    id: 'exception-1',
    instructorId: 'instructor-1',
    type: 'VACATION',
    startDate: new Date('2024-12-23'),
    endDate: new Date('2024-12-31'),
    allDay: true,
    reason: 'Urlop świąteczny',
    description: 'Przerwa świąteczna - Boże Narodzenie i Nowy Rok',
    status: 'APPROVED',  // Замість isApproved
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-11-20'),
    affectsBookings: true,
    bookingsCount: 5,  // Замість bookingsReassigned
    bookingsReassigned: 5,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 5,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Instructor 2 - Anna Nowak - Sick leave
  {
    id: 'exception-2',
    instructorId: 'instructor-2',
    type: 'SICK_LEAVE',
    startDate: new Date('2024-10-10'),
    endDate: new Date('2024-10-12'),
    allDay: true,
    reason: 'Zwolnienie lekarskie',
    description: 'Grypa',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-10'),
    affectsBookings: true,
    bookingsCount: 3,
    bookingsReassigned: 3,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 3,
    certificateNumber: 'ZLA/2024/10/1234',
    certificateExpected: false,
    isCompanyWide: false,
    priority: 'HIGH'
  },

  // Instructor 3 - Piotr Wiśniewski - Training
  {
    id: 'exception-3',
    instructorId: 'instructor-3',
    type: 'TRAINING',
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-11-16'),
    allDay: true,
    reason: 'Szkolenie zawodowe',
    description: 'Kurs doskonalenia techniki jazdy - poziom zaawansowany',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-30'),
    affectsBookings: true,
    bookingsCount: 4,
    bookingsReassigned: 4,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 4,
    compensationRate: 150,
    additionalCompensation: 500,
    isPaid: false,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Instructor 4 - Katarzyna Lewandowska - Personal leave (half day)
  {
    id: 'exception-4',
    instructorId: 'instructor-4',
    type: 'PERSONAL_LEAVE',
    startDate: new Date('2024-10-20'),
    endDate: new Date('2024-10-20'),
    allDay: false,
    startTime: '14:00',
    endTime: '18:00',
    reason: 'Sprawy osobiste',
    description: 'Wizyta u lekarza specjalisty',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'branch-manager-1',
    approvedAt: new Date('2024-10-18'),
    affectsBookings: true,
    bookingsCount: 2,
    bookingsReassigned: 2,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 2,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Company-wide holiday
  {
    id: 'exception-5',
    instructorId: 'instructor-1',
    type: 'HOLIDAY',
    startDate: new Date('2024-11-11'),
    endDate: new Date('2024-11-11'),
    allDay: true,
    reason: 'Święto Niepodległości',
    description: 'Dzień ustawowo wolny od pracy',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-01-01'),
    affectsBookings: true,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 0,
    isCompanyWide: true,
    priority: 'HIGH'
  },

  // Instructor 5 - Tomasz Kamiński - Substituting
  {
    id: 'exception-6',
    instructorId: 'instructor-5',
    type: 'OTHER',
    startDate: new Date('2024-10-10'),
    endDate: new Date('2024-10-10'),
    allDay: false,
    startTime: '09:00',
    endTime: '13:00',
    reason: 'Zastępstwo',
    description: 'Zastępstwo za instruktora Anna Nowak - choroba',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-10'),
    affectsBookings: false,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    substituteInstructorId: 'instructor-2',
    substituteConfirmed: true,
    additionalCompensation: 200,
    isPaid: true,
    notificationSent: true,
    studentsNotified: 0,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Future vacation - pending approval
  {
    id: 'exception-7',
    instructorId: 'instructor-6',
    type: 'VACATION',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-22'),
    allDay: true,
    reason: 'Urlop wypoczynkowy',
    description: 'Wyjazd zimowy',
    status: 'PENDING',
    isApproved: null,
    affectsBookings: true,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    notificationSent: false,
    studentsNotified: 0,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Instructor 7 - Robert Mazur - Company event
  {
    id: 'exception-8',
    instructorId: 'instructor-7',
    type: 'COMPANY_EVENT',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-20'),
    allDay: false,
    startTime: '15:00',
    endTime: '23:00',
    reason: 'Wigilia firmowa',
    description: 'Spotkanie świąteczne pracowników',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-11-01'),
    affectsBookings: true,
    bookingsCount: 1,
    bookingsReassigned: 1,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 1,
    isCompanyWide: true,
    priority: 'NORMAL'
  },

  // Past sick leave with medical certificate
  {
    id: 'exception-9',
    instructorId: 'instructor-8',
    type: 'SICK_LEAVE',
    startDate: new Date('2024-09-05'),
    endDate: new Date('2024-09-09'),
    allDay: true,
    reason: 'Zwolnienie lekarskie',
    description: 'Kontuzja - zwichnięcie kostki',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-09-05'),
    affectsBookings: true,
    bookingsCount: 6,
    bookingsReassigned: 6,
    bookingsCancelled: 0,
    notificationSent: true,
    studentsNotified: 6,
    certificateNumber: 'ZLA/2024/09/0987',
    certificateExpected: false,
    attachmentUrl: '/documents/medical/ZLA-2024-09-0987.pdf',
    isCompanyWide: false,
    priority: 'URGENT'
  },

  // Instructor 1 - Future training
  {
    id: 'exception-10',
    instructorId: 'instructor-1',
    type: 'TRAINING',
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-02-14'),
    allDay: true,
    reason: 'Kurs egzaminatora',
    description: 'Szkolenie na egzaminatora WORD',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-10-15'),
    affectsBookings: true,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    notificationSent: false,
    studentsNotified: 0,
    compensationRate: 200,
    additionalCompensation: 3000,
    isPaid: false,
    isCompanyWide: false,
    priority: 'NORMAL'
  },

  // Multiple instructors - May holiday
  {
    id: 'exception-11',
    instructorId: 'instructor-1',
    type: 'HOLIDAY',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-03'),
    allDay: true,
    reason: 'Majówka',
    description: 'Święto Pracy i Konstytucji 3 Maja',
    status: 'APPROVED',
    isApproved: true,
    approvedBy: 'admin-1',
    approvedAt: new Date('2024-01-01'),
    affectsBookings: true,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    notificationSent: false,
    studentsNotified: 0,
    isCompanyWide: true,
    priority: 'HIGH'
  },

  // Instructor 2 - Personal leave for wedding
  {
    id: 'exception-12',
    instructorId: 'instructor-2',
    type: 'PERSONAL_LEAVE',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-21'),
    allDay: true,
    reason: 'Urlop okolicznościowy',
    description: 'Ślub',
    status: 'PENDING',
    isApproved: null,
    affectsBookings: true,
    bookingsCount: 0,
    bookingsReassigned: 0,
    bookingsCancelled: 0,
    notificationSent: false,
    studentsNotified: 0,
    isCompanyWide: false,
    priority: 'NORMAL'
  }
]

module.exports = async function seedScheduleExceptions(prisma, logger, options = {}) {
  try {
    let created = 0
    let failed = 0
    
    // CreateMany не працює з всіма полями, тому використовуємо create окремо
    for (const exception of scheduleExceptions) {
      try {
        await prisma.scheduleException.upsert({
          where: { id: exception.id },
          update: exception,
          create: exception
        })
        created++
      } catch (error) {
        // Спробуємо з мінімальними полями
        try {
          const minimalData = {
            id: exception.id,
            instructorId: exception.instructorId,
            type: exception.type,
            startDate: exception.startDate,
            endDate: exception.endDate,
            allDay: exception.allDay,
            reason: exception.reason,
            status: exception.status || 'PENDING',
            affectsBookings: exception.affectsBookings || true,
            bookingsCount: exception.bookingsCount || 0,
            bookingsReassigned: exception.bookingsReassigned || 0,
            bookingsCancelled: exception.bookingsCancelled || 0,
            notificationSent: exception.notificationSent || false,
            studentsNotified: exception.studentsNotified || 0,
            priority: exception.priority || 'NORMAL'
          }
          
          await prisma.scheduleException.upsert({
            where: { id: exception.id },
            update: minimalData,
            create: minimalData
          })
          created++
        } catch (minimalError) {
          failed++
          logger && logger.warn(`Failed to create exception ${exception.id}: ${minimalError.message}`)
        }
      }
    }
    
    logger && logger.success(`✓ Created ${created} schedule exceptions (${failed} failed)`)
    return created
  } catch (error) {
    logger && logger.error('✗ Failed to seed schedule exceptions:', error.message)
    throw error
  }
}