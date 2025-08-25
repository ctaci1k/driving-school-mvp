// prisma/seed/data/userPackages.js - ВИПРАВЛЕНА ВЕРСІЯ
const { faker } = require('@faker-js/faker')
const { addDays, subDays } = require('date-fns')

async function seedUserPackages(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Отримати студентів і пакети - БЕЗ невірних полів
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true
    }
  })
  
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { credits: 'asc' }
  })
  
  if (students.length === 0 || packages.length === 0) {
    logger && logger.warn('No students or packages found - skipping user packages')
    return 0
  }
  
  const userPackages = []
  
  // Стратегія розподілу пакетів
  const studentsWithPackages = faker.helpers.arrayElements(
    students, 
    Math.floor(students.length * (isMinimal ? 0.5 : 0.7))
  )
  


for (const student of studentsWithPackages) {
  const pkg = faker.helpers.arrayElement(packages)
  
  // Визначити знижку
  const hasDiscount = faker.datatype.boolean({ probability: 0.2 })
  const discountPercent = hasDiscount ? 0.1 : 0  // 10% знижка
  const finalPrice = pkg.price * (1 - discountPercent)
  
  // Визначити статус і кредити
  const status = faker.helpers.arrayElement(['ACTIVE', 'DEPLETED', 'EXPIRED'])
  let creditsUsed = 0
  let creditsRemaining = pkg.credits
  
  if (status === 'DEPLETED') {
    creditsUsed = pkg.credits
    creditsRemaining = 0
  } else if (status === 'EXPIRED') {
    creditsUsed = faker.number.int({ min: 0, max: pkg.credits })
    creditsRemaining = pkg.credits - creditsUsed
  } else {
    creditsUsed = faker.number.int({ min: 0, max: Math.max(0, pkg.credits - 1) })
    creditsRemaining = pkg.credits - creditsUsed
  }
  
  // Дати
  const purchasedAt = subDays(new Date(), faker.number.int({ min: 1, max: 90 }))
  const activatedAt = purchasedAt
  const expiresAt = status === 'EXPIRED' 
    ? subDays(new Date(), faker.number.int({ min: 1, max: 30 }))
    : addDays(purchasedAt, pkg.validityDays)
  
  // Подарунок?
  const isGift = faker.datatype.boolean({ probability: 0.1 })
  
  userPackages.push({
    // Обов'язкові поля
    userId: student.id,
    packageId: pkg.id,
    status: status,
    purchasedAt: purchasedAt,
    activatedAt: activatedAt,
    expiresAt: expiresAt,
    creditsTotal: pkg.credits,
    creditsUsed: creditsUsed,
    creditsRemaining: creditsRemaining,
    purchasePrice: pkg.price,
    finalPrice: pkg.price,
    
    // Необов'язкові поля
    paymentId: null,
    isGift: isGift,
    giftFrom: isGift ? 'Jan Kowalski' : null,
    giftMessage: isGift ? 'Wszystkiego najlepszego!' : null,
    notes: hasDiscount ? 'Promocja -10%' : null,
    
    // Metadata
    metadata: {
      source: faker.helpers.arrayElement(['WEBSITE', 'OFFICE', 'PHONE']),
      packageName: pkg.name,
      discount: hasDiscount ? '10%' : null,
      originalPrice: pkg.price
    }
  })
}



  // Додати спеціальні випадки
  if (!isMinimal && students.length >= 3 && packages.length > 0) {
    // Випадок 1: Студент з завершеним пакетом
    const completedPackage = {
      userId: students[0].id,
      packageId: packages[0].id,
      status: 'DEPLETED',
      purchasedAt: subDays(new Date(), 90),
      activatedAt: subDays(new Date(), 90),
      expiresAt: addDays(subDays(new Date(), 90), packages[0].validityDays),
      creditsTotal: packages[0].credits,
      creditsUsed: packages[0].credits,
      creditsRemaining: 0,
      purchasePrice: packages[0].price,
finalPrice: packages[0].price,
      isGift: false,
      giftFrom: null,
      giftMessage: null,
      notes: 'Pakiet ukończony',

      metadata: {
        completedLessons: packages[0].credits,
        source: 'OFFICE'
      }
    }
    userPackages.push(completedPackage)
    
    // Випадок 2: Подарунковий пакет
    if (packages.length > 1 && students.length > 1) {
      const giftPackage = {
        userId: students[1].id,
        packageId: packages[1].id,
        status: 'ACTIVE',
        purchasedAt: subDays(new Date(), 7),
        activatedAt: subDays(new Date(), 5),
        expiresAt: addDays(new Date(), packages[1].validityDays - 7),
        creditsTotal: packages[1].credits,
        creditsUsed: 0,
        creditsRemaining: packages[1].credits,
        purchasePrice: packages[1].price,
        finalPrice: packages[1].price,
       
        isGift: true,
        giftFrom: 'Jan i Anna Kowalski',
        giftMessage: 'Z okazji 18 urodzin! Powodzenia!',
        notes: 'Prezent urodzinowy',

        metadata: {
          occasion: 'BIRTHDAY_18',
          source: 'GIFT'
        }
      }
      userPackages.push(giftPackage)
    }
    
    // Випадок 3: Пакет з промокодом
    if (packages.length > 2 && students.length > 2) {
      const promoPackage = {
        userId: students[2].id,
        packageId: packages[2].id,
        status: 'ACTIVE',
        purchasedAt: subDays(new Date(), 14),
        activatedAt: subDays(new Date(), 14),
        expiresAt: addDays(new Date(), packages[2].validityDays - 14),
        creditsTotal: packages[2].credits,
        creditsUsed: 2,
        creditsRemaining: packages[2].credits - 2,
        purchasePrice: packages[2].price,
       
        finalPrice: packages[2].price * 0.8,
        isGift: false,
        giftFrom: null,
        giftMessage: null,
        notes: 'Zniżka studencka 20%',

        metadata: {
          studentDiscount: true,
          source: 'WEBSITE'
        }
      }
      userPackages.push(promoPackage)
    }
  }
  
  // Записати пакети користувачів
  let created = 0
  let skipped = 0
  
for (const packageData of userPackages) {
  try {
    await prisma.userPackage.create({
      data: packageData
    })
    created++
    
    const student = students.find(s => s.id === packageData.userId)
    logger && logger.info(`✓ Created package for ${student?.firstName} ${student?.lastName}`)
  } catch (error) {
    skipped++
    logger && logger.warn(`Failed to create user package: ${error.message}`)
  }
}

  
  logger && logger.success(`✓ Created ${created} user packages (${skipped} skipped)`)
  
  // Статистика
  if (created > 0) {
    try {
      const stats = await prisma.userPackage.groupBy({
        by: ['status'],
        _count: true,
        _sum: { 
          creditsTotal: true,
          creditsUsed: true,
          creditsRemaining: true
        }
      })
      
      logger && logger.info('\n📊 User Package Statistics:')
      logger && logger.info(`   Total user packages: ${created}`)
      
      stats.forEach(stat => {
        logger && logger.info(`   ${stat.status}: ${stat._count} packages`)
      })
      
      // Подарункові пакети
      const giftPackages = await prisma.userPackage.count({
        where: { isGift: true }
      })
      
      logger && logger.info(`   Gift packages: ${giftPackages}`)
      
    } catch (error) {
      logger && logger.warn(`Could not generate statistics: ${error.message}`)
    }
  }
  
  return created
}

module.exports = seedUserPackages