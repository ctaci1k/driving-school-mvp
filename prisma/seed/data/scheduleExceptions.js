// prisma/seed/data/scheduleExceptions.js - WYJĄTKI W HARMONOGRAMIE
const { faker } = require('@faker-js/faker')
const { addDays, subDays, setHours, setMinutes } = require('date-fns')

async function seedScheduleExceptions(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz instruktorów
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { id: true, firstName: true, lastName: true }
  })
  
  if (instructors.length === 0) {
    logger.warn('No instructors found - skipping schedule exceptions')
    return
  }
  
  const exceptions = []
  const now = new Date()
  
  // 1. URLOPY (długoterminowe)
  const vacationInstructors = faker.helpers.arrayElements(
    instructors, 
    Math.min(2, Math.floor(instructors.length * 0.3))
  )
  
  for (const instructor of vacationInstructors) {
    const vacationStart = faker.helpers.arrayElement([
      addDays(now, faker.number.int({ min: 30, max: 60 })), // Przyszły urlop
      subDays(now, faker.number.int({ min: 30, max: 60 }))  // Miniony urlop
    ])
    
    const vacationEnd = addDays(vacationStart, faker.number.int({ min: 7, max: 14 }))
    
    exceptions.push({
      instructorId: instructor.id,
      type: 'VACATION',
      startDate: vacationStart,
      endDate: vacationEnd,
      allDay: true,
      reason: faker.helpers.arrayElement([
        'Urlop wypoczynkowy',
        'Urlop rodzinny',
        'Wyjazd zagraniczny',
        'Urlop regeneracyjny'
      ]),
      isApproved: true,
      approvedBy: 'manager@drivingschool.pl',
      approvedAt: subDays(vacationStart, faker.number.int({ min: 14, max: 30 })),
      affectsBookings: true,
      bookingsReassigned: faker.number.int({ min: 5, max: 15 }),
      notes: `${instructor.firstName} ${instructor.lastName} - urlop zaplanowany`,
      notificationSent: true
    })
  }
  
  // 2. ZWOLNIENIA LEKARSKIE (krótkoterminowe)
  const sickLeaves = isMinimal ? 2 : 5
  for (let i = 0; i < Math.min(sickLeaves, instructors.length); i++) {
    const instructor = faker.helpers.arrayElement(instructors)
    const sickStart = subDays(now, faker.number.int({ min: 1, max: 14 }))
    const sickEnd = addDays(sickStart, faker.number.int({ min: 1, max: 5 }))
    
    exceptions.push({
      instructorId: instructor.id,
      type: 'SICK_LEAVE',
      startDate: sickStart,
      endDate: sickEnd <= now ? sickEnd : now, // Nie może kończyć się w przyszłości jeśli zaczął w przeszłości
      allDay: true,
      reason: faker.helpers.arrayElement([
        'Zwolnienie lekarskie',
        'Choroba',
        'Wizyta u specjalisty',
        'Badania medyczne'
      ]),
      isApproved: true,
      approvedBy: 'admin@drivingschool.pl',
      approvedAt: sickStart,
      affectsBookings: true,
      bookingsReassigned: faker.number.int({ min: 2, max: 8 }),
      notes: 'L4 dostarczone',
      notificationSent: true,
      medicalCertificateNumber: `L4/${sickStart.getFullYear()}/${faker.number.int({ min: 1000, max: 9999 })}`
    })
  }
  
  // 3. SZKOLENIA (jednodniowe)
  if (!isMinimal) {
    const trainingCount = Math.min(4, instructors.length)
    const trainingInstructors = faker.helpers.arrayElements(instructors, trainingCount)
    
    for (const instructor of trainingInstructors) {
      const trainingDate = faker.helpers.arrayElement([
        addDays(now, faker.number.int({ min: 7, max: 30 })),
        subDays(now, faker.number.int({ min: 7, max: 30 }))
      ])
      
      exceptions.push({
        instructorId: instructor.id,
        type: 'TRAINING',
        startDate: setHours(setMinutes(trainingDate, 0), 9),
        endDate: setHours(setMinutes(trainingDate, 0), 17),
        allDay: false,
        reason: faker.helpers.arrayElement([
          'Szkolenie BHP',
          'Kurs doskonalenia techniki jazdy',
          'Szkolenie z pierwszej pomocy',
          'Warsztaty pedagogiczne',
          'Szkolenie z nowych przepisów',
          'Kurs języka migowego',
          'Szkolenie z obsługi klienta'
        ]),
        isApproved: true,
        approvedBy: 'manager@drivingschool.pl',
        approvedAt: subDays(trainingDate, 7),
        affectsBookings: true,
        bookingsReassigned: faker.number.int({ min: 1, max: 4 }),
        location: faker.helpers.arrayElement([
          'Centrum Szkoleniowe Warszawa',
          'WORD Warszawa',
          'Hotel Marriott - sala konferencyjna',
          'Online - platforma Zoom',
          'Ośrodek Doskonalenia Techniki Jazdy Bemowo'
        ]),
        notes: 'Szkolenie obowiązkowe',
        certificateExpected: true,
        notificationSent: true
      })
    }
    
    // 4. SPRAWY OSOBISTE (krótkie nieobecności)
    for (let i = 0; i < 5; i++) {
      const instructor = faker.helpers.arrayElement(instructors)
      const personalDate = faker.helpers.arrayElement([
        addDays(now, faker.number.int({ min: 1, max: 14 })),
        subDays(now, faker.number.int({ min: 1, max: 14 }))
      ])
      
      const startHour = faker.helpers.arrayElement([8, 10, 12, 14])
      const duration = faker.helpers.arrayElement([2, 3, 4])
      
      exceptions.push({
        instructorId: instructor.id,
        type: 'PERSONAL',
        startDate: setMinutes(setHours(personalDate, startHour), 0),
        endDate: setMinutes(setHours(personalDate, startHour + duration), 0),
        allDay: false,
        reason: faker.helpers.arrayElement([
          'Sprawy rodzinne',
          'Wizyta w urzędzie',
          'Sprawy osobiste',
          'Pilna sprawa rodzinna',
          'Wizyta u lekarza',
          'Odbiór dziecka ze szkoły',
          'Pogrzeb'
        ]),
        isApproved: faker.datatype.boolean({ probability: 0.9 }),
        approvedBy: faker.datatype.boolean({ probability: 0.9 }) ? 'manager@drivingschool.pl' : null,
        approvedAt: faker.datatype.boolean({ probability: 0.9 }) 
          ? subDays(personalDate, faker.number.int({ min: 1, max: 3 }))
          : null,
        affectsBookings: true,
        bookingsReassigned: faker.number.int({ min: 0, max: 2 }),
        notes: null,
        notificationSent: faker.datatype.boolean({ probability: 0.7 })
      })
    }
    
    // 5. ŚWIĘTA FIRMOWE / WYDARZENIA
    const companyEvent = {
      instructorId: null, // Dotyczy wszystkich
      type: 'COMPANY_EVENT',
      startDate: setHours(setMinutes(addDays(now, 45), 0), 14),
      endDate: setHours(setMinutes(addDays(now, 45), 0), 20),
      allDay: false,
      reason: 'Wigilia firmowa',
      isApproved: true,
      approvedBy: 'admin@drivingschool.pl',
      approvedAt: subDays(addDays(now, 45), 30),
      affectsBookings: true,
      bookingsReassigned: 0,
      isCompanyWide: true,
      location: 'Restauracja Belvedere, ul. Parkowa 1, Warszawa',
      notes: 'Obowiązkowa obecność wszystkich pracowników',
      notificationSent: true
    }
    exceptions.push(companyEvent)
    
    // 6. EGZAMINY INSTRUKTORSKIE (obowiązki egzaminatora)
    const examDuties = Math.min(2, instructors.length)
    for (let i = 0; i < examDuties; i++) {
      const examInstructor = faker.helpers.arrayElement(instructors)
      const examDate = addDays(now, faker.number.int({ min: 5, max: 20 }))
      
      exceptions.push({
        instructorId: examInstructor.id,
        type: 'EXAM_DUTY',
        startDate: setHours(setMinutes(examDate, 0), 8),
        endDate: setHours(setMinutes(examDate, 0), 16),
        allDay: false,
        reason: 'Egzaminator w WORD',
        isApproved: true,
        approvedBy: 'manager@drivingschool.pl',
        approvedAt: subDays(examDate, 14),
        affectsBookings: true,
        bookingsReassigned: faker.number.int({ min: 3, max: 6 }),
        location: 'WORD Warszawa, ul. Odlewnicza 8',
        notes: 'Wyznaczony jako egzaminator pomocniczy',
        compensationRate: 150, // PLN za dzień
        notificationSent: true
      })
    }
    
    // 7. ZASTĘPSTWA (instruktor zastępuje innego)
    const substitutions = 3
    for (let i = 0; i < Math.min(substitutions, instructors.length - 1); i++) {
      const substituteInstructor = instructors[i]
      const absentInstructor = instructors[i + 1] || instructors[0]
      const substitutionDate = addDays(now, faker.number.int({ min: 1, max: 7 }))
      
      exceptions.push({
        instructorId: substituteInstructor.id,
        type: 'SUBSTITUTION',
        startDate: setHours(setMinutes(substitutionDate, 0), 8),
        endDate: setHours(setMinutes(substitutionDate, 0), 18),
        allDay: false,
        reason: `Zastępstwo za ${absentInstructor.firstName} ${absentInstructor.lastName}`,
        isApproved: true,
        approvedBy: 'dispatcher@drivingschool.pl',
        approvedAt: subDays(substitutionDate, 1),
        affectsBookings: false, // Nie wpływa na jego własne rezerwacje
        substitutingForId: absentInstructor.id,
        notes: 'Przejęcie wszystkich jazd',
        additionalCompensation: 100, // Bonus za zastępstwo
        notificationSent: true
      })
    }
  }
  
  // Zapisz wyjątki
  let created = 0
  let skipped = 0
  
  for (const exceptionData of exceptions) {
    try {
      // Sprawdź czy tabela istnieje
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'schedule_exceptions'
        );
      `.catch(() => false)
      
      if (!tableExists || !tableExists[0]?.exists) {
        logger.warn('Table schedule_exceptions does not exist - creating minimal version')
        
        // Jeśli tabela nie istnieje, spróbuj utworzyć minimalną wersję
        // lub pomiń ten moduł
        logger.info('Skipping schedule exceptions - table not found')
        return
      }
      
      const exception = await prisma.scheduleException.create({
        data: exceptionData
      })
      created++
      
      const instructor = exceptionData.instructorId 
        ? instructors.find(i => i.id === exceptionData.instructorId)
        : null
      
      if (created <= 5 || created % 10 === 0) {
        logger.info(
          `Created exception: ${exception.type} for ${
            instructor ? `${instructor.firstName} ${instructor.lastName}` : 'ALL'
          } (${exception.startDate.toLocaleDateString('pl-PL')})`
        )
      }
    } catch (error) {
      // Jeśli tabela nie istnieje, pomiń
      if (error.code === 'P2021') {
        logger.warn('ScheduleException table not found in schema - skipping module')
        return
      }
      
      skipped++
      if (skipped <= 3) {
        logger.warn(`Failed to create exception: ${error.message}`)
      }
    }
  }
  
  if (created > 0) {
    logger.success(`Created ${created} schedule exceptions (${skipped} skipped)`)
    
    // Statystyki (tylko jeśli coś utworzono)
    try {
      const stats = await prisma.scheduleException.groupBy({
        by: ['type'],
        _count: true
      })
      
      const approved = await prisma.scheduleException.count({
        where: { isApproved: true }
      })
      
      const pending = await prisma.scheduleException.count({
        where: { isApproved: false }
      })
      
      const futureExceptions = await prisma.scheduleException.count({
        where: { startDate: { gt: now } }
      })
      
      logger.info('\n📊 Schedule Exception Statistics:')
      logger.info(`   Total exceptions: ${created}`)
      logger.info(`   Approved: ${approved}`)
      logger.info(`   Pending approval: ${pending}`)
      logger.info(`   Future exceptions: ${futureExceptions}`)
      
      logger.info('\n   By type:')
      stats.forEach(stat => {
        const emoji = 
          stat.type === 'VACATION' ? '🏖️' :
          stat.type === 'SICK_LEAVE' ? '🏥' :
          stat.type === 'TRAINING' ? '📚' :
          stat.type === 'PERSONAL' ? '👤' :
          stat.type === 'COMPANY_EVENT' ? '🎉' :
          stat.type === 'EXAM_DUTY' ? '📝' :
          stat.type === 'SUBSTITUTION' ? '🔄' :
          '📅'
        logger.info(`   ${emoji} ${stat.type}: ${stat._count}`)
      })
      
      // Wpływ na rezerwacje
      const affectingBookings = await prisma.scheduleException.count({
        where: { affectsBookings: true }
      })
      
      const totalReassigned = await prisma.scheduleException.aggregate({
        _sum: { bookingsReassigned: true }
      })
      
      logger.info('\n   Impact on bookings:')
      logger.info(`   Exceptions affecting bookings: ${affectingBookings}`)
      logger.info(`   Total bookings reassigned: ${totalReassigned._sum.bookingsReassigned || 0}`)
      
    } catch (error) {
      // Ignoruj błędy statystyk
    }
  } else {
    logger.info('Schedule exceptions module skipped (table may not exist)')
  }
}

module.exports = seedScheduleExceptions