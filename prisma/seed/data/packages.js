// prisma/seed/data/packages.js - SYSTEM PAKIETÓW I CENNIKÓW
async function seedPackages(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // PAKIETY GODZINOWE - всі обов'язкові поля згідно схеми Prisma
  const packages = [
    // PAKIETY PODSTAWOWE
    {
      name: 'Starter - 5 godzin',
      slug: 'starter-5h',
      description: 'Idealny na początek nauki jazdy. Poznaj podstawy i poczuj się pewnie za kierownicą.',
      type: 'STANDARD',  // Обов'язкове поле
      category: 'DRIVING_LESSONS',  // Обов'язкове поле
      credits: 5,
      lessonsIncluded: 5,  // Обов'язкове поле
      price: 350,
      currency: 'PLN',  // За замовчуванням PLN
      validityDays: 60,
      validityType: 'FROM_PURCHASE',  // Обов'язкове поле
      isActive: true,
      isPublic: true,
      isFeatured: false,
      isPopular: false,
      sortOrder: 1
    },
    {
      name: 'Standard - 10 godzin',
      slug: 'standard-10h',
      description: 'Najpopularniejszy wybór! Wystarczająco czasu, aby opanować wszystkie manewry. Rabat 50 PLN!',
      type: 'STANDARD',
      category: 'DRIVING_LESSONS',
      credits: 10,
      lessonsIncluded: 10,
      price: 650,
      currency: 'PLN',
      validityDays: 90,
      validityType: 'FROM_PURCHASE',
      isActive: true,
      isPublic: true,
      isFeatured: true,
      isPopular: true,
      sortOrder: 2
    },
    {
      name: 'Intensywny - 20 godzin',
      slug: 'intensive-20h',
      description: 'Dla zdecydowanych! Kompleksowe przygotowanie do egzaminu w krótkim czasie. Rabat 200 PLN!',
      type: 'INTENSIVE',
      category: 'DRIVING_LESSONS',
      credits: 20,
      lessonsIncluded: 20,
      price: 1200,
      currency: 'PLN',
      validityDays: 120,
      validityType: 'FROM_PURCHASE',
      isActive: true,
      isPublic: true,
      isFeatured: false,
      isPopular: false,
      sortOrder: 3
    },
    {
      name: 'Premium - 30 godzin',
      slug: 'premium-30h',
      description: 'Pełny kurs od podstaw do egzaminu. Gwarancja sukcesu lub dodatkowe godziny gratis! Rabat 450 PLN!',
      type: 'COMPLETE',
      category: 'DRIVING_LESSONS',
      credits: 30,
      lessonsIncluded: 30,
      price: 1650,
      currency: 'PLN',
      validityDays: 180,
      validityType: 'FROM_PURCHASE',
      isActive: true,
      isPublic: true,
      isFeatured: false,
      isPopular: false,
      sortOrder: 4
    },
    
    // PAKIETY SPECJALNE
    {
      name: 'Egzaminacyjny - 3 godziny',
      slug: 'exam-prep-3h',
      description: 'Ostatnie szlify przed egzaminem. Symulacja egzaminu i poprawa błędów.',
      type: 'EXAM_PREP',
      category: 'EXAM_PACKAGE',
      credits: 3,
      lessonsIncluded: 3,
      price: 240,
      currency: 'PLN',
      validityDays: 30,
      validityType: 'FROM_PURCHASE',
      isActive: true,
      isPublic: true,
      isFeatured: false,
      isPopular: false,
      sortOrder: 5
    },
    {
      name: 'Weekendowy - 8 godzin',
      slug: 'weekend-8h',
      description: 'Tylko weekendy! Dla zapracowanych, którzy mogą się uczyć w soboty i niedziele.',
      type: 'STANDARD',
      category: 'DRIVING_LESSONS',
      credits: 8,
      lessonsIncluded: 8,
      price: 560,
      currency: 'PLN',
      validityDays: 90,
      validityType: 'FROM_PURCHASE',
      isActive: true,
      isPublic: true,
      isFeatured: false,
      isPopular: false,
      sortOrder: 6
    }
  ]
  
  // Dodaj tylko część pakietów jeśli minimal
  const packagesToAdd = isMinimal ? packages.slice(0, 3) : packages
  
  // PAKIETY DODATKOWE (tylko dla pełnego seed)
  if (!isMinimal) {
    packagesToAdd.push(
      {
        name: 'Automatyczna skrzynia - 10 godzin',
        slug: 'automatic-10h',
        description: 'Nauka jazdy na automacie. Prostsza nauka, szybsze rezultaty. Tylko pojazdy automatyczne!',
        type: 'STANDARD',
        category: 'DRIVING_LESSONS',
        credits: 10,
        lessonsIncluded: 10,
        price: 750,
        currency: 'PLN',
        validityDays: 90,
        validityType: 'FROM_PURCHASE',
        isActive: true,
        isPublic: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 7
      },
      {
        name: 'Student - 15 godzin',
        slug: 'student-15h',
        description: 'Specjalna oferta dla studentów! Pokaż legitymację i oszczędź. Rabat studencki 15%!',
        type: 'STANDARD',
        category: 'DRIVING_LESSONS',
        credits: 15,
        lessonsIncluded: 15,
        price: 900,
        currency: 'PLN',
        validityDays: 120,
        validityType: 'FROM_PURCHASE',
        isActive: true,
        isPublic: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 8
      },
      {
        name: 'Ekspresowy - 40 godzin',
        slug: 'express-40h',
        description: 'Kurs ekspresowy - 2 tygodnie intensywnej nauki. Od zera do egzaminu! Rabat 800 PLN!',
        type: 'INTENSIVE',
        category: 'DRIVING_LESSONS',
        credits: 40,
        lessonsIncluded: 40,
        price: 2000,
        currency: 'PLN',
        validityDays: 30,
        validityType: 'FROM_ACTIVATION',  // Aktywacja wymagana
        isActive: true,
        isPublic: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 9
      },
      {
        name: 'Teoria Online',
        slug: 'theory-online',
        description: 'Pełny kurs teorii online. Dostęp do platformy e-learning, testy, materiały.',
        type: 'THEORY_ONLY',
        category: 'THEORY_COURSE',
        credits: 0,
        lessonsIncluded: 0,
        theoryLessonsIncluded: 30,  // Lekcje teorii
        theoryTestsIncluded: 100,    // Testy
        theoryUnlimited: true,        // Nieograniczony dostęp
        price: 199,
        currency: 'PLN',
        validityDays: 365,
        validityType: 'FROM_PURCHASE',
        isActive: true,
        isPublic: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 10
      },
      {
        name: 'Odświeżający - 5 godzin',
        slug: 'refresher-5h',
        description: 'Dla osób z prawem jazdy, które chcą odświeżyć umiejętności po przerwie.',
        type: 'REFRESHER',
        category: 'REFRESHER_COURSE',
        credits: 5,
        lessonsIncluded: 5,
        price: 400,
        currency: 'PLN',
        validityDays: 60,
        validityType: 'FROM_PURCHASE',
        isActive: true,
        isPublic: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 11
      }
    )
  }
  
  // Zapisz pakiety
  let created = 0
  let updated = 0
  
  for (const packageData of packagesToAdd) {
    try {
      // Użyj upsert z unikalnym slug
      const pkg = await prisma.package.upsert({
        where: { slug: packageData.slug },
        update: {
          ...packageData,
          updatedAt: new Date()
        },
        create: {
          ...packageData,
          // Ustaw domyślne wartości dla opcjonalnych pól
          theoryLessonsIncluded: packageData.theoryLessonsIncluded || 0,
          theoryTestsIncluded: packageData.theoryTestsIncluded || 0,
          theoryUnlimited: packageData.theoryUnlimited || false,
          practicalHours: packageData.lessonsIncluded * 1.5 || 0,  // 1.5h na lekcję
          practicalTestsIncluded: 0,
          examIncluded: false,
          examRetakeIncluded: 0,
          taxRate: 23,  // VAT 23%
          priceIncludesTax: true,
          activationRequired: packageData.validityType === 'FROM_ACTIVATION',
          forBeginners: true,
          forIntermediate: true,
          forAdvanced: packageData.type === 'REFRESHER',
          features: [
            'Profesjonalni instruktorzy',
            'Elastyczne terminy',
            'Nowoczesne pojazdy',
            'Materiały szkoleniowe'
          ],
          highlights: [
            `${packageData.lessonsIncluded} godzin jazdy`,
            `Ważność ${packageData.validityDays} dni`,
            packageData.isPopular ? 'Najpopularniejszy wybór!' : null,
            packageData.type === 'INTENSIVE' ? 'Kurs intensywny' : null
          ].filter(Boolean),
          freePickup: packageData.credits >= 10,  // Darmowy odbiór dla większych pakietów
          flexibleScheduling: true,
          onlineTheoryAccess: packageData.theoryUnlimited || false,
          progressTracking: true,
          certificateIncluded: true,
          badges: packageData.isPopular ? ['BEST_VALUE'] : [],
          tags: [packageData.type, packageData.category],
          searchKeywords: [
            'kurs jazdy',
            'prawo jazdy',
            packageData.name.toLowerCase(),
            `${packageData.credits} godzin`
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      if (pkg) {
        created++
        logger && logger.success(`✓ Package: ${pkg.name} - ${pkg.credits}h for ${pkg.price} PLN`)
      }
    } catch (error) {
      logger && logger.error(`Failed to create/update package ${packageData.name}: ${error.message}`)
    }
  }
  
  logger && logger.info(`Packages: ${created} processed`)
  
  // Statystyki
  try {
    const packageCount = await prisma.package.count()
    const activePackages = await prisma.package.count({ where: { isActive: true } })
    
    logger && logger.info(`📊 Package Statistics:`)
    logger && logger.info(`   Total packages: ${packageCount}`)
    logger && logger.info(`   Active packages: ${activePackages}`)
  } catch (error) {
    logger && logger.warn(`Could not generate statistics: ${error.message}`)
  }
  
  return created
}

module.exports = seedPackages