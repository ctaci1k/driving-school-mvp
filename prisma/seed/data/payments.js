// prisma/seed/data/payments.js - ФІНАЛЬНА ВЕРСІЯ
const { faker } = require('@faker-js/faker')
const { subDays, subHours } = require('date-fns')

// Функція для розрахунку VAT
function calculateVAT(grossAmount, taxRate = 23) {
  const netAmount = grossAmount / (1 + taxRate / 100)
  const taxAmount = grossAmount - netAmount
  
  return {
    netAmount: Math.round(netAmount * 100) / 100,
    netReceived: Math.round(netAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
  }
}

// Генерація унікального ID транзакції
function generateTransactionId() {
  return `TRX-${Date.now()}-${faker.string.alphanumeric(8).toUpperCase()}`
}

async function seedPayments(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  const MAX_PAYMENTS = isMinimal ? 50 : 200  // Обмеження кількості
  
  // Отримуємо дані для платежів
  let bookings = []
  let userPackages = []
  
  try {
    bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { status: 'COMPLETED' },
          { status: 'CONFIRMED' },
          { status: 'IN_PROGRESS' }
        ],
        paymentId: null  // Тільки без платежів!
      },
      take: Math.floor(MAX_PAYMENTS / 2),  // Половина для bookings
      include: {
        student: true,
        instructor: true
      }
    })
  } catch (error) {
    logger && logger.warn('Could not fetch bookings for payments')
  }
  
  try {
    userPackages = await prisma.userPackage.findMany({
      where: {
        paymentId: null  // Тільки без платежів!
      },
      take: Math.floor(MAX_PAYMENTS / 2),  // Половина для packages
      include: {
        user: true,
        package: true
      }
    })
  } catch (error) {
    logger && logger.warn('Could not fetch user packages for payments')
  }
  
  if (bookings.length === 0 && userPackages.length === 0) {
    logger && logger.warn('No bookings or user packages found - skipping payments')
    return 0
  }
  
  // Для уникнення дублів
  const processedPackageIds = new Set()
  const processedBookingIds = new Set()
  const payments = []
  
  // 1. ПЛАТЕЖІ ЗА ПАКЕТИ (пріоритет - унікальне поле userPackageId)
  for (const userPackage of userPackages) {
    if (payments.length >= MAX_PAYMENTS / 2) break  // Обмеження
    if (!userPackage.package) continue
    if (processedPackageIds.has(userPackage.id)) continue
    
    processedPackageIds.add(userPackage.id)
    
    const amount = userPackage.purchasePrice || userPackage.package.price
    const { netAmount, netReceived, taxAmount } = calculateVAT(amount, 23)
    const createdAt = userPackage.purchasedAt || subDays(new Date(), faker.number.int({ min: 1, max: 60 }))
    
    payments.push({
      // Обов'язкові поля
      userId: userPackage.userId,
      amount: amount,
      netAmount: netAmount,
      netReceived: netReceived,
      taxAmount: taxAmount,
      currency: 'PLN',
      status: userPackage.status === 'ACTIVE' ? 'COMPLETED' : 'PENDING',
      method: faker.helpers.arrayElement(['P24', 'CARD', 'BLIK', 'PAYPAL', 'GOOGLE_PAY']),
      
      // Необов'язкові поля
      userPackageId: userPackage.id,  // Унікальне поле!
      transactionId: generateTransactionId(),
      description: `Pakiet: ${userPackage.package.name}`,
      createdAt: createdAt,
      completedAt: userPackage.status === 'ACTIVE' ? subHours(createdAt, -0.5) : null,
      metadata: {
        packageName: userPackage.package.name,
        packageCredits: userPackage.package.credits
      }
    })
  }
  
  // 2. ПЛАТЕЖІ ЗА БРОНЮВАННЯ
  for (const booking of bookings) {
    if (payments.length >= MAX_PAYMENTS) break  // Обмеження
    if (booking.usedCredits > 0) continue  // Пропустити якщо використані кредити
    if (processedBookingIds.has(booking.id)) continue
    
    processedBookingIds.add(booking.id)
    
    const paymentStatus = booking.isPaid ? 'COMPLETED' : 
      faker.helpers.weightedArrayElement([
        { value: 'COMPLETED', weight: 70 },
        { value: 'PENDING', weight: 20 },
        { value: 'PROCESSING', weight: 10 }
      ])
    
    const amount = booking.price || 200
    const { netAmount, netReceived, taxAmount } = calculateVAT(amount, 23)
    const createdAt = subHours(booking.startTime, faker.number.int({ min: 1, max: 48 }))
    
    payments.push({
      // Обов'язкові поля
      userId: booking.studentId,
      amount: amount,
      netAmount: netAmount,
      netReceived: netReceived,
      taxAmount: taxAmount,
      currency: 'PLN',
      status: paymentStatus,
      method: faker.helpers.arrayElement(['P24', 'CARD', 'CASH', 'BLIK']),
      
      // Необов'язкові поля
      bookingId: booking.id,
      transactionId: generateTransactionId(),
      description: `Lekcja jazdy`,
      createdAt: createdAt,
      completedAt: paymentStatus === 'COMPLETED' ? subHours(createdAt, -0.5) : null,
      metadata: {
        instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
        lessonDate: booking.startTime.toISOString()
      }
    })
  }
  
  // 3. ДОДАТКОВІ ПЛАТЕЖІ (обмежено)
  if (!isMinimal && payments.length < MAX_PAYMENTS) {
    // Кілька невдалих платежів
    const failedCount = Math.min(5, MAX_PAYMENTS - payments.length)
    
    for (let i = 0; i < failedCount; i++) {
      if (payments.length >= MAX_PAYMENTS) break
      
      const amount = faker.helpers.arrayElement([160, 180, 200])
      const { netAmount, netReceived, taxAmount } = calculateVAT(amount, 23)
      const createdAt = subDays(new Date(), faker.number.int({ min: 1, max: 14 }))
      
      payments.push({
        userId: bookings[i % bookings.length]?.studentId || userPackages[0]?.userId,
        amount: amount,
        netAmount: netAmount,
        netReceived: netReceived,
        taxAmount: taxAmount,
        currency: 'PLN',
        status: 'FAILED',
        method: faker.helpers.arrayElement(['CARD', 'BLIK']),
        transactionId: generateTransactionId(),
        description: 'Nieudana próba płatności',
        createdAt: createdAt,
        failedAt: subHours(createdAt, -0.5),
        metadata: {
          errorCode: 'INSUFFICIENT_FUNDS'
        }
      })
    }
  }
  
  // Створення платежів в БД
  let created = 0
  let skipped = 0
  
  for (const paymentData of payments) {
    if (created >= MAX_PAYMENTS) {
      logger && logger.info(`Reached payment limit of ${MAX_PAYMENTS}`)
      break
    }
    
    try {
      // Додаткова перевірка на дублі для userPackageId
      if (paymentData.userPackageId) {
        const existing = await prisma.payment.findFirst({
          where: { userPackageId: paymentData.userPackageId }
        })
        if (existing) {
          skipped++
          continue
        }
      }
      
      const payment = await prisma.payment.create({
        data: paymentData
      })
      created++
      
      // Оновлення зв'язаних записів
      if (payment.userPackageId && payment.status === 'COMPLETED') {
        try {
          await prisma.userPackage.update({
            where: { id: payment.userPackageId },
            data: { paymentId: payment.id }
          })
        } catch (error) {
          // Ігноруємо помилки
        }
      }
      
      if (payment.bookingId && payment.status === 'COMPLETED') {
        try {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { 
              isPaid: true,
              paymentId: payment.id
            }
          })
        } catch (error) {
          // Ігноруємо помилки
        }
      }
      
      // Логування прогресу
      if (created <= 5 || created % 20 === 0) {
        logger && logger.info(`Created payment ${created}: ${payment.status}`)
      }
    } catch (error) {
      skipped++
      
      // Пропускаємо дублі
      if (error.code === 'P2002') {
        continue
      }
      
      // Логуємо тільки перші помилки
      if (skipped <= 3) {
        logger && logger.warn(`Payment error: ${error.message}`)
      }
    }
  }
  
  logger && logger.success(`✓ Created ${created} payments (limit: ${MAX_PAYMENTS}, skipped: ${skipped})`)
  
  // Статистика
  if (created > 0) {
    try {
      const stats = await prisma.payment.groupBy({
        by: ['status'],
        _count: true,
        _sum: { amount: true }
      })
      
      logger && logger.info('\n📊 Payment Statistics:')
      stats.forEach(stat => {
        logger && logger.info(`   ${stat.status}: ${stat._count} payments`)
      })
    } catch (error) {
      // Ігноруємо помилки статистики
    }
  }
  
  return created
}

module.exports = seedPayments