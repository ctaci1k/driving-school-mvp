// prisma/seed/data/bookings.js - ВИПРАВЛЕНА ВЕРСІЯ З БАГАТЬМА ДАНИМИ
const { faker } = require('@faker-js/faker')
const { addDays, subDays, setHours, setMinutes } = require('date-fns')

async function seedBookings(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, firstName: true, lastName: true }
  })
  
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { id: true, firstName: true, lastName: true }
  })
  
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, registrationNumber: true }
  })
  
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  })
  
  if (students.length === 0 || instructors.length === 0) {
    logger.warn('No students or instructors - skipping bookings')
    return
  }
  
  const bookings = []
  const now = new Date()
  const bookingCount = isMinimal ? 20 : 100 // Збільшуємо кількість
  
  // 1. ІСТОРИЧНІ БРОНЮВАННЯ (40%)
  const historicalCount = Math.floor(bookingCount * 0.4)
  for (let i = 0; i < historicalCount; i++) {
    const daysAgo = faker.number.int({ min: 1, max: 90 })
    const bookingDate = subDays(now, daysAgo)
    const hour = faker.helpers.arrayElement([8, 10, 12, 14, 16, 18])
    const startTime = setMinutes(setHours(bookingDate, hour), 0)
    const endTime = addDays(startTime, 0) // Same day
    endTime.setHours(startTime.getHours() + 2)
    
    bookings.push({
      studentId: faker.helpers.arrayElement(students).id,
      instructorId: faker.helpers.arrayElement(instructors).id,
      vehicleId: vehicles.length > 0 ? faker.helpers.arrayElement(vehicles).id : null,
      locationId: locations.length > 0 ? faker.helpers.arrayElement(locations).id : null,
      startTime,
      endTime,
      duration: 120,
      status: faker.helpers.weightedArrayElement([
        { value: 'COMPLETED', weight: 70 },
        { value: 'CANCELLED', weight: 20 },
        { value: 'NO_SHOW', weight: 10 }
      ]),
      price: faker.helpers.arrayElement([160, 180, 200]),
      isPaid: faker.datatype.boolean({ probability: 0.7 }),
      usedCredits: faker.datatype.boolean({ probability: 0.3 }) ? 2 : 0
    })
  }
  
  // 2. ПОТОЧНІ БРОНЮВАННЯ (30%)
  const currentCount = Math.floor(bookingCount * 0.3)
  for (let i = 0; i < currentCount; i++) {
    const daysFromNow = faker.number.int({ min: -3, max: 3 })
    const bookingDate = addDays(now, daysFromNow)
    
    // Пропускаємо неділі
    if (bookingDate.getDay() === 0) continue
    
    const hour = faker.helpers.arrayElement([8, 10, 12, 14, 16, 18])
    const startTime = setMinutes(setHours(bookingDate, hour), 0)
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 2)
    
    bookings.push({
      studentId: faker.helpers.arrayElement(students).id,
      instructorId: faker.helpers.arrayElement(instructors).id,
      vehicleId: vehicles.length > 0 ? faker.helpers.arrayElement(vehicles).id : null,
      locationId: locations.length > 0 ? faker.helpers.arrayElement(locations).id : null,
      startTime,
      endTime,
      duration: 120,
      status: daysFromNow < 0 ? 'COMPLETED' : 'CONFIRMED',
      price: faker.helpers.arrayElement([160, 180, 200]),
      isPaid: faker.datatype.boolean({ probability: 0.6 }),
      usedCredits: faker.datatype.boolean({ probability: 0.2 }) ? 2 : 0
    })
  }
  
  // 3. МАЙБУТНІ БРОНЮВАННЯ (30%)
  const futureCount = bookingCount - historicalCount - currentCount
  for (let i = 0; i < futureCount; i++) {
    const daysFromNow = faker.number.int({ min: 4, max: 30 })
    const bookingDate = addDays(now, daysFromNow)
    
    // Пропускаємо неділі
    if (bookingDate.getDay() === 0) continue
    
    const hour = faker.helpers.arrayElement([8, 10, 12, 14, 16, 18])
    const startTime = setMinutes(setHours(bookingDate, hour), 0)
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 2)
    
    bookings.push({
      studentId: faker.helpers.arrayElement(students).id,
      instructorId: faker.helpers.arrayElement(instructors).id,
      vehicleId: vehicles.length > 0 ? faker.helpers.arrayElement(vehicles).id : null,
      locationId: locations.length > 0 ? faker.helpers.arrayElement(locations).id : null,
      startTime,
      endTime,
      duration: 120,
      status: faker.helpers.weightedArrayElement([
        { value: 'CONFIRMED', weight: 80 },
        { value: 'PENDING', weight: 20 }
      ]),
      price: faker.helpers.arrayElement([160, 180, 200]),
      isPaid: faker.datatype.boolean({ probability: 0.4 }),
      usedCredits: 0
    })
  }
  
  // Записуємо бронювання
  let created = 0
  let skipped = 0
  
  for (const bookingData of bookings) {
    try {
      await prisma.booking.create({
        data: bookingData
      })
      created++
      
      if (created <= 5 || created % 20 === 0) {
        logger.info(`Created booking ${created}: ${bookingData.status} on ${bookingData.startTime.toLocaleDateString()}`)
      }
    } catch (error) {
      skipped++
      // Ігноруємо конфлікти розкладу
    }
  }
  
  logger.success(`Created ${created} bookings (${skipped} skipped due to conflicts)`)
  
  // Статистика
  const stats = await prisma.booking.groupBy({
    by: ['status'],
    _count: true
  })
  
  logger.info('\n📊 Booking Statistics:')
  stats.forEach(stat => {
    logger.info(`   ${stat.status}: ${stat._count}`)
  })
}

module.exports = seedBookings