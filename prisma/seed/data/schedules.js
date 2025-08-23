// prisma/seed/data/schedules.js - ROZBUDOWANE HARMONOGRAMY INSTRUKTORÓW
const { faker } = require('@faker-js/faker')

// Różne wzorce pracy instruktorów
const schedulePatterns = {
  FULL_TIME: {
    name: 'Pełny etat',
    days: [1, 2, 3, 4, 5], // Pon-Pt
    hours: { start: 8, end: 18 },
    breaks: [{ start: 12, duration: 60 }], // Przerwa obiadowa
    saturday: { probability: 0.7, start: 9, end: 14 }
  },
  PART_TIME_MORNING: {
    name: 'Część etatu - rano',
    days: [1, 2, 3, 4, 5],
    hours: { start: 7, end: 13 },
    breaks: [],
    saturday: { probability: 0.3, start: 8, end: 12 }
  },
  PART_TIME_AFTERNOON: {
    name: 'Część etatu - popołudnie',
    days: [1, 2, 3, 4, 5],
    hours: { start: 14, end: 20 },
    breaks: [],
    saturday: { probability: 0.5, start: 12, end: 16 }
  },
  FLEXIBLE: {
    name: 'Elastyczny',
    days: [1, 2, 4, 5], // Bez środy
    hours: { start: 9, end: 19 },
    breaks: [{ start: 13, duration: 45 }],
    saturday: { probability: 0.8, start: 10, end: 15 }
  },
  WEEKEND: {
    name: 'Weekendowy',
    days: [5, 6], // Pt-Sob
    hours: { start: 8, end: 20 },
    breaks: [{ start: 13, duration: 60 }],
    saturday: { probability: 1.0, start: 8, end: 18 }
  }
}

// Specjalne dostępności
const specialAvailabilities = [
  { name: 'Jazdy nocne', hours: { start: 18, end: 22 }, days: [3, 4] },
  { name: 'Wczesne poranki', hours: { start: 6, end: 8 }, days: [1, 2, 3] },
  { name: 'Intensywne weekendy', hours: { start: 8, end: 20 }, days: [6] }
]

async function seedSchedules(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz instruktorów i lokacje
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true,
      yearsOfExperience: true,
      specializations: true
    }
  })
  
  const locations = await prisma.location.findMany({
    select: { id: true, name: true }
  })

  if (instructors.length === 0) {
    logger.warn('No instructors found - skipping schedules')
    return
  }

  if (locations.length === 0) {
    logger.warn('No locations found - using null location')
  }

  // Usuń stare harmonogramy
  await prisma.instructorSchedule.deleteMany()
  logger.info('Cleared old schedules')

  let created = 0
  let templateCount = 0

  for (const instructor of instructors) {
    // Wybierz wzorzec pracy na podstawie doświadczenia
    let pattern
    if (instructor.yearsOfExperience >= 5) {
      // Doświadczeni instruktorzy - pełny etat lub elastyczny
      pattern = faker.helpers.weightedArrayElement([
        { value: schedulePatterns.FULL_TIME, weight: 60 },
        { value: schedulePatterns.FLEXIBLE, weight: 30 },
        { value: schedulePatterns.WEEKEND, weight: 10 }
      ])
    } else {
      // Młodsi instruktorzy - różne opcje
      pattern = faker.helpers.weightedArrayElement([
        { value: schedulePatterns.FULL_TIME, weight: 40 },
        { value: schedulePatterns.PART_TIME_MORNING, weight: 20 },
        { value: schedulePatterns.PART_TIME_AFTERNOON, weight: 20 },
        { value: schedulePatterns.FLEXIBLE, weight: 15 },
        { value: schedulePatterns.WEEKEND, weight: 5 }
      ])
    }

    // Wybierz główną lokację
    const primaryLocation = faker.helpers.arrayElement(locations)
    
    // Bufory czasowe (czas między jazdami)
    const bufferBefore = faker.helpers.arrayElement([10, 15, 20]) // minuty
    const bufferAfter = faker.helpers.arrayElement([10, 15, 20])

    // TWORZENIE HARMONOGRAMU
    
    // Dni powszednie
    for (const dayOfWeek of pattern.days) {
      const daySchedule = {
        instructorId: instructor.id,
        dayOfWeek,
        startTime: `${pattern.hours.start.toString().padStart(2, '0')}:00`,
        endTime: `${pattern.hours.end.toString().padStart(2, '0')}:00`,
        isAvailable: true,
        bufferBefore,
        bufferAfter,
        locationId: primaryLocation?.id || null,
        maxBookings: Math.floor((pattern.hours.end - pattern.hours.start) / 2), // Max jazd dziennie
        notes: null
      }

      // Dodaj przerwy
      if (pattern.breaks.length > 0) {
        for (const breakTime of pattern.breaks) {
          daySchedule.breakStart = `${breakTime.start.toString().padStart(2, '0')}:00`
          daySchedule.breakDuration = breakTime.duration
        }
      }

      // Niektórzy instruktorzy mają specjalne godziny w określone dni
      if (!isMinimal && faker.datatype.boolean({ probability: 0.2 })) {
        const special = faker.helpers.arrayElement(specialAvailabilities)
        if (special.days.includes(dayOfWeek)) {
          daySchedule.notes = special.name
          if (special.name === 'Jazdy nocne') {
            daySchedule.endTime = `${special.hours.end}:00`
            daySchedule.nightDriving = true
          } else if (special.name === 'Wczesne poranki') {
            daySchedule.startTime = `${special.hours.start}:00`
            daySchedule.earlyMorning = true
          }
        }
      }

      try {
        await prisma.instructorSchedule.create({
          data: daySchedule
        })
        created++
      } catch (error) {
        logger.warn(`Failed to create schedule: ${error.message}`)
      }
    }

    // Sobota (opcjonalna)
    if (faker.datatype.boolean({ probability: pattern.saturday.probability })) {
      const saturdaySchedule = {
        instructorId: instructor.id,
        dayOfWeek: 6,
        startTime: `${pattern.saturday.start.toString().padStart(2, '0')}:00`,
        endTime: `${pattern.saturday.end.toString().padStart(2, '0')}:00`,
        isAvailable: true,
        bufferBefore,
        bufferAfter,
        locationId: primaryLocation?.id || null,
        maxBookings: Math.floor((pattern.saturday.end - pattern.saturday.start) / 2),
        notes: 'Dostępność weekendowa'
      }

      try {
        await prisma.instructorSchedule.create({
          data: saturdaySchedule
        })
        created++
      } catch (error) {
        logger.warn(`Failed to create Saturday schedule: ${error.message}`)
      }
    }

    // TWORZENIE SZABLONÓW HARMONOGRAMU (dla zaawansowanych funkcji)
    if (!isMinimal) {
      // Szablon standardowy
      const template = {
        instructorId: instructor.id,
        name: `Szablon ${pattern.name} - ${instructor.firstName} ${instructor.lastName}`,
        description: `Standardowy harmonogram pracy instruktora`,
        weekPattern: pattern.days.map(day => ({
          dayOfWeek: day,
          startTime: `${pattern.hours.start}:00`,
          endTime: `${pattern.hours.end}:00`,
          locationId: primaryLocation?.id
        })),
        validFrom: new Date(),
        validTo: null, // Bezterminowy
        isActive: true,
        priority: 1,
        metadata: {
          pattern: pattern.name,
          createdBy: 'system',
          buffers: { before: bufferBefore, after: bufferAfter }
        }
      }

      try {
        await prisma.scheduleTemplate.create({
          data: template
        })
        templateCount++
      } catch (error) {
        // Tabela scheduleTemplate może nie istnieć w podstawowej wersji
        if (error.code !== 'P2021') {
          logger.warn(`Failed to create template: ${error.message}`)
        }
      }

      // Szablon wakacyjny (letni)
      if (faker.datatype.boolean({ probability: 0.3 })) {
        const summerTemplate = {
          instructorId: instructor.id,
          name: `Szablon letni - ${instructor.firstName} ${instructor.lastName}`,
          description: 'Harmonogram na okres wakacyjny',
          weekPattern: pattern.days.map(day => ({
            dayOfWeek: day,
            startTime: '07:00',
            endTime: '15:00', // Krócej w lecie
            locationId: primaryLocation?.id
          })),
          validFrom: new Date('2024-07-01'),
          validTo: new Date('2024-08-31'),
          isActive: false, // Nieaktywny poza sezonem
          priority: 2,
          metadata: {
            season: 'summer',
            reducedHours: true
          }
        }

        try {
          await prisma.scheduleTemplate.create({
            data: summerTemplate
          })
          templateCount++
        } catch (error) {
          // Ignoruj jeśli tabela nie istnieje
        }
      }
    }

    logger.success(
      `Created schedule for ${instructor.firstName} ${instructor.lastName}: ${pattern.name} pattern`
    )
  }

  // Statystyki
  const scheduleStats = await prisma.instructorSchedule.groupBy({
    by: ['dayOfWeek'],
    _count: true
  })

  const availabilityStats = await prisma.instructorSchedule.aggregate({
    where: { isAvailable: true },
    _count: true
  })

  logger.info('\n📊 Schedule Statistics:')
  logger.info(`   Total schedule entries: ${created}`)
  logger.info(`   Available slots: ${availabilityStats._count}`)
  if (templateCount > 0) {
    logger.info(`   Schedule templates: ${templateCount}`)
  }

  logger.info('\n   Coverage by day:')
  const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  scheduleStats
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .forEach(stat => {
      const emoji = 
        stat.dayOfWeek === 6 ? '🌟' : 
        stat.dayOfWeek === 0 ? '🚫' : 
        '📅'
      logger.info(`   ${emoji} ${dayNames[stat.dayOfWeek]}: ${stat._count} instructors`)
    })

  // Analiza dostępności
  const morningShifts = await prisma.instructorSchedule.count({
    where: {
      startTime: { lte: '09:00' }
    }
  })

  const eveningShifts = await prisma.instructorSchedule.count({
    where: {
      endTime: { gte: '18:00' }
    }
  })

  const weekendShifts = await prisma.instructorSchedule.count({
    where: {
      dayOfWeek: { in: [6, 0] }
    }
  })

  logger.info('\n   Special availability:')
  logger.info(`   Early morning shifts: ${morningShifts}`)
  logger.info(`   Evening shifts: ${eveningShifts}`)
  logger.info(`   Weekend shifts: ${weekendShifts}`)

  // Podsumowanie godzin pracy
  const totalHours = await prisma.$queryRawUnsafe(`
    SELECT 
      SUM(
        EXTRACT(HOUR FROM (end_time::time - start_time::time))
      ) as total_hours
    FROM instructor_schedules
    WHERE is_available = true
  `).catch(() => null)

  if (totalHours && totalHours[0]) {
    logger.info(`\n   Total weekly capacity: ~${Math.round(totalHours[0].total_hours)} hours`)
    logger.info(`   Potential lessons per week: ~${Math.round(totalHours[0].total_hours / 2)} lessons`)
  }
}

module.exports = seedSchedules