// prisma/seed/data/schedules.js - HARMONOGRAMY INSTRUKTORÓW
const { faker } = require('@faker-js/faker')

// Різні шаблони роботи інструкторів
const schedulePatterns = {
  FULL_TIME: {
    name: 'Pełny etat',
    days: [1, 2, 3, 4, 5], // Пн-Пт
    hours: { start: 8, end: 18 },
    breaks: [{ start: 12, duration: 60 }],
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
    days: [1, 2, 4, 5],
    hours: { start: 9, end: 19 },
    breaks: [{ start: 13, duration: 45 }],
    saturday: { probability: 0.8, start: 10, end: 15 }
  },
  WEEKEND: {
    name: 'Weekendowy',
    days: [5, 6],
    hours: { start: 8, end: 20 },
    breaks: [{ start: 13, duration: 60 }],
    saturday: { probability: 1.0, start: 8, end: 18 }
  }
}

async function seedSchedules(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Отримати інструкторів і локації
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true
    }
  })
  
  const locations = await prisma.location.findMany({
    select: { id: true, name: true }
  })

  if (instructors.length === 0) {
    logger && logger.warn('No instructors found - skipping schedules')
    return 0
  }

  // Видалити старі розклади
  try {
    await prisma.instructorSchedule.deleteMany()
    logger && logger.info('Cleared old schedules')
  } catch (error) {
    logger && logger.warn('Could not clear old schedules')
  }

  let created = 0

  for (const instructor of instructors) {
    // Вибрати шаблон роботи
    const patternKeys = Object.keys(schedulePatterns)
    const randomPattern = patternKeys[Math.floor(Math.random() * patternKeys.length)]
    const pattern = schedulePatterns[randomPattern]

    // Вибрати локацію
    const primaryLocation = locations.length > 0 ? faker.helpers.arrayElement(locations) : null
    
    // Буфери часу
    const bufferBefore = faker.helpers.arrayElement([10, 15, 20])
    const bufferAfter = faker.helpers.arrayElement([10, 15, 20])

    // Створення розкладу для будніх днів
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
        maxBookings: Math.floor((pattern.hours.end - pattern.hours.start) / 2),
        currentBookings: 0, // Поточна кількість бронювань
        scheduleType: 'RECURRING', // Тип розкладу
        isPublished: true, // Опублікований
        notes: null
      }

      // Додати перерви якщо є
      if (pattern.breaks.length > 0) {
        const breakTime = pattern.breaks[0]
        daySchedule.breakStart = `${breakTime.start.toString().padStart(2, '0')}:00`
        daySchedule.breakEnd = `${(breakTime.start + Math.floor(breakTime.duration/60)).toString().padStart(2, '0')}:00`
      }

      // Спеціальні позначки
      if (pattern.hours.start <= 7) {
        daySchedule.earlyMorning = true
      }
      if (pattern.hours.end >= 19) {
        daySchedule.nightDriving = true
      }

      try {
        await prisma.instructorSchedule.upsert({
          where: {
            instructorId_dayOfWeek: {
              instructorId: instructor.id,
              dayOfWeek: dayOfWeek
            }
          },
          update: daySchedule,
          create: daySchedule
        })
        created++
      } catch (error) {
        logger && logger.warn(`Failed to create schedule: ${error.message}`)
      }
    }

    // Субота (якщо працює)
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
        currentBookings: 0,
        scheduleType: 'RECURRING',
        isPublished: true,
        weekend: true, // Позначка вихідного дня
        notes: 'Dostępność weekendowa'
      }

      try {
        await prisma.instructorSchedule.upsert({
          where: {
            instructorId_dayOfWeek: {
              instructorId: instructor.id,
              dayOfWeek: 6
            }
          },
          update: saturdaySchedule,
          create: saturdaySchedule
        })
        created++
      } catch (error) {
        logger && logger.warn(`Failed to create Saturday schedule: ${error.message}`)
      }
    }

    logger && logger.success(
      `Created schedule for ${instructor.firstName} ${instructor.lastName}: ${pattern.name} pattern`
    )
  }

  // Статистика
  try {
    const scheduleStats = await prisma.instructorSchedule.groupBy({
      by: ['dayOfWeek'],
      _count: true
    })

    const availabilityStats = await prisma.instructorSchedule.count({
      where: { isAvailable: true }
    })

    logger && logger.info('\n📊 Schedule Statistics:')
    logger && logger.info(`   Total schedule entries: ${created}`)
    logger && logger.info(`   Available slots: ${availabilityStats}`)

    logger && logger.info('\n   Coverage by day:')
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    scheduleStats
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .forEach(stat => {
        logger && logger.info(`   📅 ${dayNames[stat.dayOfWeek]}: ${stat._count} instructors`)
      })

  } catch (error) {
    logger && logger.warn(`Could not generate statistics: ${error.message}`)
  }

  return created
}

module.exports = seedSchedules