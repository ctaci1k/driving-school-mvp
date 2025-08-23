// prisma/seed/data/userPackages.js - ПОВНА ФІНАЛЬНА ВЕРСІЯ
const { faker } = require('@faker-js/faker')
const { addDays, subDays } = require('date-fns')

async function seedUserPackages(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz studentów i pakiety
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true,
      totalLessons: true,
      completedLessons: true
    }
  })
  
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { credits: 'asc' }
  })
  
  if (students.length === 0 || packages.length === 0) {
    logger.warn('No students or packages found - skipping user packages')
    return
  }
  
  const userPackages = []
  
  // Strategia przydziału pakietów:
  // - 70% studentów ma jakiś pakiet
  // - 30% studentów ma więcej niż jeden pakiet (historyczny)
  // - Popularniejsze pakiety częściej wybierane
  
  const studentsWithPackages = faker.helpers.arrayElements(
    students, 
    Math.floor(students.length * (isMinimal ? 0.5 : 0.7))
  )
  
  for (const student of studentsWithPackages) {
    // Określ ile pakietów ma student (1-3)
    const packageCount = faker.helpers.weightedArrayElement([
      { value: 1, weight: 70 },
      { value: 2, weight: 25 },
      { value: 3, weight: 5 }
    ])
    
    const studentPackages = []
    
    for (let i = 0; i < packageCount; i++) {
      // Wybierz pakiet (popularniejsze częściej)
      const pkg = faker.helpers.weightedArrayElement(
        packages.map(p => ({
          value: p,
          weight: p.isPopular ? 40 : p.credits <= 10 ? 30 : 20
        }))
      )
      
      // Określ status pakietu na podstawie lekcji studenta
      let status = 'ACTIVE'
      let creditsUsed = 0
      let creditsRemaining = pkg.credits
      
      // Jeśli to nie pierwszy pakiet, może być zużyty
      if (i > 0) {
        status = faker.helpers.weightedArrayElement([
          { value: 'DEPLETED', weight: 50 },
          { value: 'EXPIRED', weight: 20 },
          { value: 'ACTIVE', weight: 30 }
        ])
        
        if (status === 'DEPLETED') {
          creditsUsed = pkg.credits
          creditsRemaining = 0
        } else if (status === 'EXPIRED') {
          creditsUsed = faker.number.int({ min: 0, max: pkg.credits })
          creditsRemaining = pkg.credits - creditsUsed
        }
      } else {
        // Aktywny pakiet - częściowo wykorzystany
        if (student.completedLessons && student.completedLessons > 0) {
          creditsUsed = Math.min(
            faker.number.int({ min: 0, max: Math.min(student.completedLessons * 2, pkg.credits - 1) }),
            pkg.credits - 1
          )
          creditsRemaining = pkg.credits - creditsUsed
        }
      }
      
      // Daty zakupu i wygaśnięcia
      const purchasedAt = status === 'DEPLETED' || status === 'EXPIRED'
        ? subDays(new Date(), faker.number.int({ min: 30, max: 180 }))
        : subDays(new Date(), faker.number.int({ min: 1, max: 30 }))
      
      let expiresAt = addDays(purchasedAt, pkg.validityDays)
      
      // Jeśli status EXPIRED, ustaw datę wygaśnięcia w przeszłości
      if (status === 'EXPIRED') {
        expiresAt = subDays(new Date(), faker.number.int({ min: 1, max: 30 }))
      }
      
      // Czy to prezent? (10% szans)
      const isGift = faker.datatype.boolean({ probability: 0.1 })
      
      studentPackages.push({
        userId: student.id,
        packageId: pkg.id,
        creditsTotal: pkg.credits,
        creditsUsed,
        creditsRemaining,
        purchasedAt,
        expiresAt,
        status,
        purchasePrice: pkg.price * (isGift ? 1 : faker.datatype.boolean({ probability: 0.2 }) ? 0.9 : 1), // 20% ma rabat
        paymentId: null, // Będzie dodane przez seedPayments
        
        // Pola prezentowe
        isGift,
        giftFrom: isGift ? faker.helpers.arrayElement([
          'Rodzice',
          'Jan i Anna Kowalski',
          'Babcia i Dziadek',
          'Firma XYZ',
          'Przyjaciele'
        ]) : null,
        giftMessage: isGift ? faker.helpers.arrayElement([
          'Wszystkiego najlepszego! Powodzenia na drodze!',
          'Z okazji 18 urodzin! Powodzenia!',
          'Gratulacje z okazji matury!',
          'Świąteczny prezent dla Ciebie!',
          'Powodzenia na egzaminie!'
        ]) : null,
        
        notes: faker.helpers.arrayElement([
          null,
          'Prezent urodzinowy',
          'Promocja studencka',
          'Pakiet świąteczny',
          'Zniżka za polecenie',
          'Stały klient',
          'Pierwsza jazda gratis'
        ]),
        
        // Metadata jako JSON
        metadata: {
          source: faker.helpers.arrayElement(['WEBSITE', 'PHONE', 'OFFICE', 'PROMOTION', 'GIFT']),
          promoCode: faker.datatype.boolean({ probability: 0.2 }) 
            ? faker.helpers.arrayElement(['STUDENT20', 'WELCOME10', 'SUMMER15', 'FRIEND25', 'XMAS2024'])
            : null,
          referredBy: faker.datatype.boolean({ probability: 0.1 })
            ? faker.helpers.arrayElement(students.filter(s => s.id !== student.id))?.id
            : null,
          packageName: pkg.name,
          originalPrice: pkg.price,
          discount: faker.datatype.boolean({ probability: 0.2 }) ? 0.1 : 0,
          purchaseChannel: faker.helpers.arrayElement(['WEB', 'MOBILE', 'OFFICE', 'PHONE']),
          campaignId: faker.datatype.boolean({ probability: 0.3 }) 
            ? `CAMP-${faker.string.alphanumeric(6).toUpperCase()}`
            : null
        }
      })
    }
    
    userPackages.push(...studentPackages)
  }
  
  // Dodaj specjalne przypadki (tylko dla pełnego seed)
  if (!isMinimal && students.length >= 5) {
    // Przypadek 1: Student z wieloma pakietami (stały klient)
    const loyalStudent = students[0]
    const loyalPackages = packages.slice(0, Math.min(4, packages.length))
    
    for (const [index, pkg] of loyalPackages.entries()) {
      userPackages.push({
        userId: loyalStudent.id,
        packageId: pkg.id,
        creditsTotal: pkg.credits,
        creditsUsed: pkg.credits, // Wszystkie wykorzystane
        creditsRemaining: 0,
        purchasedAt: subDays(new Date(), 180 - (index * 30)),
        expiresAt: subDays(new Date(), 90 - (index * 30)),
        status: 'DEPLETED',
        purchasePrice: pkg.price * 0.9, // Stały klient ma rabat
        paymentId: null,
        isGift: false,
        giftFrom: null,
        giftMessage: null,
        notes: `Pakiet #${index + 1} - stały klient`,
        metadata: {
          source: 'OFFICE',
          loyaltyDiscount: 0.1,
          packageName: pkg.name,
          customerType: 'LOYAL',
          totalPurchases: index + 1
        }
      })
    }
    
    // Przypadek 2: Rodzina kupująca pakiety
    const familyPackage = packages.find(p => p.credits >= 20) || packages[packages.length - 1]
    if (familyPackage && students.length >= 3) {
      for (let i = 1; i <= Math.min(2, students.length - 1); i++) {
        userPackages.push({
          userId: students[i].id,
          packageId: familyPackage.id,
          creditsTotal: familyPackage.credits,
          creditsUsed: faker.number.int({ min: 2, max: Math.min(8, familyPackage.credits) }),
          creditsRemaining: familyPackage.credits - faker.number.int({ min: 2, max: Math.min(8, familyPackage.credits) }),
          purchasedAt: subDays(new Date(), 14),
          expiresAt: addDays(new Date(), familyPackage.validityDays - 14),
          status: 'ACTIVE',
          purchasePrice: familyPackage.price * 0.85, // Rabat rodzinny
          paymentId: null,
          isGift: false,
          giftFrom: null,
          giftMessage: null,
          notes: 'Pakiet rodzinny - rabat 15%',
          metadata: {
            source: 'OFFICE',
            familyDiscount: 0.15,
            familyGroupId: 'FAM-001',
            packageName: familyPackage.name,
            familyMembers: 2
          }
        })
      }
    }
    
    // Przypadek 3: Pakiet prezentowy na 18 urodziny
    const giftPackage = packages.find(p => p.credits === 10) || packages[Math.floor(packages.length / 2)]
    if (giftPackage && students.length >= 4) {
      userPackages.push({
        userId: students[3].id,
        packageId: giftPackage.id,
        creditsTotal: giftPackage.credits,
        creditsUsed: 0,
        creditsRemaining: giftPackage.credits,
        purchasedAt: subDays(new Date(), 7),
        expiresAt: addDays(new Date(), giftPackage.validityDays - 7),
        status: 'ACTIVE',
        purchasePrice: giftPackage.price,
        paymentId: null,
        isGift: true,
        giftFrom: 'Jan i Anna Kowalski',
        giftMessage: 'Wszystkiego najlepszego z okazji 18 urodzin! Powodzenia na drodze!',
        notes: 'Prezent od rodziców na 18 urodziny',
        metadata: {
          source: 'GIFT',
          occasion: 'BIRTHDAY_18',
          packageName: giftPackage.name,
          giftWrapping: true,
          giftCard: true,
          purchasedBy: 'Jan Kowalski',
          purchaserEmail: 'jan.kowalski@example.com'
        }
      })
    }
    
    // Przypadek 4: Pakiet firmowy (szkolenie pracowników)
    if (students.length >= 6) {
      const corporatePackage = packages.find(p => p.credits >= 15) || packages[packages.length - 2]
      if (corporatePackage) {
        for (let i = 4; i <= Math.min(5, students.length - 1); i++) {
          userPackages.push({
            userId: students[i].id,
            packageId: corporatePackage.id,
            creditsTotal: corporatePackage.credits,
            creditsUsed: faker.number.int({ min: 0, max: 5 }),
            creditsRemaining: corporatePackage.credits - faker.number.int({ min: 0, max: 5 }),
            purchasedAt: subDays(new Date(), 21),
            expiresAt: addDays(new Date(), corporatePackage.validityDays),
            status: 'ACTIVE',
            purchasePrice: corporatePackage.price * 0.8, // Rabat firmowy 20%
            paymentId: null,
            isGift: true,
            giftFrom: 'Firma ABC Sp. z o.o.',
            giftMessage: 'Benefit pracowniczy - powodzenia!',
            notes: 'Pakiet firmowy - benefit pracowniczy',
            metadata: {
              source: 'CORPORATE',
              companyName: 'ABC Sp. z o.o.',
              companyNIP: '1234567890',
              corporateDiscount: 0.2,
              packageName: corporatePackage.name,
              employeeId: `EMP-${faker.string.numeric(5)}`,
              invoiceRequired: true
            }
          })
        }
      }
    }
  }
  
  // Zapisz pakiety użytkowników
  let created = 0
  let skipped = 0
  
  for (const packageData of userPackages) {
    try {
      const userPackage = await prisma.userPackage.create({
        data: packageData
      })
      created++
      
      if (created <= 5 || created % 10 === 0) {
        const student = students.find(s => s.id === packageData.userId)
        const pkg = packages.find(p => p.id === packageData.packageId)
        logger.info(`Created package ${created}: ${pkg?.name || 'Unknown'} for ${student?.firstName} ${student?.lastName}`)
      }
    } catch (error) {
      skipped++
      if (skipped <= 3) {
        logger.warn(`Failed to create user package: ${error.message}`)
      }
    }
  }
  
  logger.success(`Created ${created} user packages (${skipped} skipped)`)
  
  // Statystyki
  if (created > 0) {
    const stats = await prisma.userPackage.groupBy({
      by: ['status'],
      _count: true,
      _sum: { 
        creditsTotal: true,
        creditsUsed: true,
        creditsRemaining: true
      }
    })
    
    const packageStats = await prisma.userPackage.groupBy({
      by: ['packageId'],
      _count: true
    })
    
    logger.info('\n📊 User Package Statistics:')
    logger.info(`   Total user packages: ${created}`)
    
    stats.forEach(stat => {
      logger.info(`   ${stat.status}:`)
      logger.info(`     Count: ${stat._count}`)
      logger.info(`     Total credits: ${stat._sum.creditsTotal || 0}`)
      logger.info(`     Used credits: ${stat._sum.creditsUsed || 0}`)
      logger.info(`     Remaining credits: ${stat._sum.creditsRemaining || 0}`)
    })
    
    // Najpopularniejsze pakiety
    logger.info('\n   Most popular packages:')
    const sortedPackages = packageStats
      .sort((a, b) => b._count - a._count)
      .slice(0, 3)
    
    for (const stat of sortedPackages) {
      const pkg = packages.find(p => p.id === stat.packageId)
      if (pkg) {
        logger.info(`     ${pkg.name}: ${stat._count} purchases`)
      }
    }
    
    // Pakiety prezentowe
    const giftPackages = await prisma.userPackage.count({
      where: { isGift: true }
    })
    
    logger.info(`\n   Gift packages: ${giftPackages}`)
    
    // Studenci z pakietami vs bez
    const studentsWithPackageCount = await prisma.user.count({
      where: {
        role: 'STUDENT',
        userPackages: {
          some: {
            status: 'ACTIVE'
          }
        }
      }
    })
    
    logger.info(`   Students with active packages: ${studentsWithPackageCount}/${students.length}`)
  }
}

module.exports = seedUserPackages