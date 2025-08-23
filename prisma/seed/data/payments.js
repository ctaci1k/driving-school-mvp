// prisma/seed/data/payments.js - ВИПРАВЛЕНА ВЕРСІЯ З БЕЗПЕЧНОЮ ОБРОБКОЮ
const { faker } = require('@faker-js/faker')
const { subDays, subHours } = require('date-fns')

function generateP24SessionId() {
  return `DS-${Date.now()}-${faker.string.alphanumeric(8)}`
}

function generateP24OrderId() {
  return faker.number.int({ min: 1000000, max: 9999999 }).toString()
}

async function seedPayments(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Отримуємо дані для платежів
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { status: 'COMPLETED' },
        { status: 'CONFIRMED' },
        { status: 'IN_PROGRESS' }
      ]
    },
    include: {
      student: true,
      instructor: true
    }
  })
  
  const userPackages = await prisma.userPackage.findMany({
    include: {
      user: true,
      package: true
    }
  })
  
  if (bookings.length === 0 && userPackages.length === 0) {
    logger.warn('No bookings or user packages found - skipping payments')
    return
  }
  
  const payments = []
  
  // 1. ПЛАТЕЖІ ЗА БРОНЮВАННЯ
  for (const booking of bookings) {
    // Пропускаємо якщо використані кредити
    if (booking.usedCredits > 0) continue
    
    const shouldHavePayment = 
      booking.status === 'COMPLETED' ? true :
      booking.status === 'CONFIRMED' ? faker.datatype.boolean({ probability: 0.7 }) :
      faker.datatype.boolean({ probability: 0.3 })
    
    if (!shouldHavePayment) continue
    
    const paymentStatus = booking.isPaid ? 'COMPLETED' : faker.helpers.weightedArrayElement([
      { value: 'COMPLETED', weight: 50 },
      { value: 'PENDING', weight: 30 },
      { value: 'PROCESSING', weight: 20 }
    ])
    
    const createdAt = subHours(booking.startTime, faker.number.int({ min: 1, max: 48 }))
    
    payments.push({
      userId: booking.studentId,
      bookingId: booking.id,
      amount: booking.price || 200,
      currency: 'PLN',
      status: paymentStatus,
      method: faker.helpers.arrayElement(['P24', 'BLIK', 'CARD', 'TRANSFER']),
      provider: 'PRZELEWY24',
      description: `Opłata za lekcję jazdy - ${booking.instructor.firstName} ${booking.instructor.lastName}`,
      createdAt,
      completedAt: paymentStatus === 'COMPLETED' ? subHours(createdAt, -0.5) : null
      // Видаляємо всі P24 специфічні поля якщо їх немає в схемі
    })
  }
  
  // 2. ПЛАТЕЖІ ЗА ПАКЕТИ
  for (const userPackage of userPackages) {
    if (!userPackage.package) continue
    
    const createdAt = userPackage.purchasedAt || subDays(new Date(), faker.number.int({ min: 1, max: 60 }))
    
    payments.push({
      userId: userPackage.userId,
      userPackageId: userPackage.id,
      amount: userPackage.package.price,
      currency: 'PLN',
      status: userPackage.status === 'ACTIVE' ? 'COMPLETED' : 'PENDING',
      method: faker.helpers.arrayElement(['P24', 'BLIK', 'CARD']),
      provider: 'PRZELEWY24',
      description: `Zakup pakietu: ${userPackage.package.name} (${userPackage.package.credits} godzin)`,
      createdAt,
      completedAt: userPackage.status === 'ACTIVE' ? subHours(createdAt, -0.5) : null
    })
  }
  
  // 3. ДОДАТКОВІ ПЛАТЕЖІ (тільки якщо є дані)
  if (!isMinimal && bookings.length > 0) {
    // Кілька невдалих платежів
    const failedCount = Math.min(5, Math.floor(bookings.length * 0.1))
    
    for (let i = 0; i < failedCount; i++) {
      const randomBooking = bookings[i % bookings.length] // Безпечний вибір
      
      payments.push({
        userId: randomBooking.studentId,
        amount: faker.helpers.arrayElement([160, 180, 200]),
        currency: 'PLN',
        status: 'FAILED',
        method: faker.helpers.arrayElement(['P24', 'BLIK', 'CARD']),
        provider: 'PRZELEWY24',
        description: 'Nieudana próba płatności',
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 14 }))
      })
    }
    
    // Кілька zwrotów (тільки якщо є userPackages)
    if (userPackages.length > 0) {
      const refundCount = Math.min(3, Math.floor(userPackages.length * 0.05))
      
      for (let i = 0; i < refundCount; i++) {
        const randomPackage = userPackages[i % userPackages.length] // Безпечний вибір
        
        payments.push({
          userId: randomPackage.userId,
          amount: -Math.floor(randomPackage.purchasePrice * 0.5), // Частковий zwrot
          currency: 'PLN',
          status: 'COMPLETED',
          method: 'P24',
          provider: 'PRZELEWY24',
          description: 'Zwrot środków - anulowanie',
          createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 }))
        })
      }
    }
  }
  
  // Записуємо платежі
  let created = 0
  let skipped = 0
  
  for (const paymentData of payments) {
    try {
      const payment = await prisma.payment.create({
        data: paymentData
      })
      created++
      
      // Оновлюємо booking якщо платіж успішний
      if (payment.bookingId && payment.status === 'COMPLETED') {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { 
            isPaid: true,
            paymentId: payment.id
          }
        }).catch(() => {}) // Ігноруємо помилки оновлення
      }
      
      // Оновлюємо userPackage якщо є
      if (payment.userPackageId && payment.status === 'COMPLETED') {
        await prisma.userPackage.update({
          where: { id: payment.userPackageId },
          data: { 
            paymentId: payment.id
          }
        }).catch(() => {}) // Ігноруємо якщо поля немає
      }
      
      if (created <= 5 || created % 20 === 0) {
        logger.info(`Created payment ${created}: ${payment.status} - ${payment.amount} PLN`)
      }
    } catch (error) {
      skipped++
      if (skipped <= 3) {
        logger.warn(`Failed to create payment: ${error.message}`)
      }
    }
  }
  
  logger.success(`Created ${created} payments (${skipped} skipped)`)
  
  // Статистики
  if (created > 0) {
    const stats = await prisma.payment.groupBy({
      by: ['status'],
      _count: true,
      _sum: { amount: true }
    })
    
    logger.info('\n📊 Payment Statistics:')
    logger.info(`   Total transactions: ${created}`)
    
    stats.forEach(stat => {
      logger.info(`   ${stat.status}: ${stat._count} (${stat._sum.amount || 0} PLN)`)
    })
    
    const revenue = await prisma.payment.aggregate({
      where: { 
        status: 'COMPLETED',
        amount: { gt: 0 }
      },
      _sum: { amount: true }
    })
    
    logger.info(`   Total revenue: ${revenue._sum.amount || 0} PLN`)
  }
}

module.exports = seedPayments