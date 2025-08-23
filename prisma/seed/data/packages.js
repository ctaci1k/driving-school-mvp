// prisma/seed/data/packages.js - SYSTEM PAKIETÓW I CENNIKÓW (ОНОВЛЕНИЙ)
async function seedPackages(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // PAKIETY GODZINOWE - базова структура згідно схеми Prisma
  const packages = [
    // PAKIETY PODSTAWOWE
    {
      name: 'Starter - 5 godzin',
      description: 'Idealny na początek nauki jazdy. Poznaj podstawy i poczuj się pewnie za kierownicą.',
      credits: 5,
      price: 350, // 70 PLN/h
      validityDays: 60,
      isActive: true,
      isPopular: false,
      sortOrder: 1
    },
    {
      name: 'Standard - 10 godzin',
      description: 'Najpopularniejszy wybór! Wystarczająco czasu, aby opanować wszystkie manewry. Rabat 50 PLN!',
      credits: 10,
      price: 650, // 65 PLN/h - rabat
      validityDays: 90,
      isActive: true,
      isPopular: true, // Oznaczony jako popularny
      sortOrder: 2
    },
    {
      name: 'Intensywny - 20 godzin',
      description: 'Dla zdecydowanych! Kompleksowe przygotowanie do egzaminu w krótkim czasie. Rabat 200 PLN!',
      credits: 20,
      price: 1200, // 60 PLN/h - większy rabat
      validityDays: 120,
      isActive: true,
      isPopular: false,
      sortOrder: 3
    },
    {
      name: 'Premium - 30 godzin',
      description: 'Pełny kurs od podstaw do egzaminu. Gwarancja sukcesu lub dodatkowe godziny gratis! Rabat 450 PLN!',
      credits: 30,
      price: 1650, // 55 PLN/h - najlepszy rabat
      validityDays: 180,
      isActive: true,
      isPopular: false,
      sortOrder: 4
    },
    
    // PAKIETY SPECJALNE
    {
      name: 'Egzaminacyjny - 3 godziny',
      description: 'Ostatnie szlify przed egzaminem. Symulacja egzaminu i poprawa błędów.',
      credits: 3,
      price: 240, // 80 PLN/h - droższy bo specjalistyczny
      validityDays: 30,
      isActive: true,
      isPopular: false,
      sortOrder: 5
    },
    {
      name: 'Weekendowy - 8 godzin',
      description: 'Tylko weekendy! Dla zapracowanych, którzy mogą się uczyć w soboty i niedziele.',
      credits: 8,
      price: 560, // 70 PLN/h
      validityDays: 90,
      isActive: true,
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
        description: 'Nauka jazdy na automacie. Prostsza nauka, szybsze rezultaty. Tylko pojazdy automatyczne!',
        credits: 10,
        price: 750, // 75 PLN/h - droższy bo automat
        validityDays: 90,
        isActive: true,
        isPopular: false,
        sortOrder: 7
      },
      {
        name: 'Student - 15 godzin',
        description: 'Specjalna oferta dla studentów! Pokaż legitymację i oszczędź. Rabat studencki 15%!',
        credits: 15,
        price: 900, // 60 PLN/h
        validityDays: 120,
        isActive: true,
        isPopular: false,
        sortOrder: 8
      },
      {
        name: 'Ekspresowy - 40 godzin',
        description: 'Kurs ekspresowy - 2 tygodnie intensywnej nauki. Od zera do egzaminu! Rabat 800 PLN!',
        credits: 40,
        price: 2000, // 50 PLN/h - super rabat
        validityDays: 30,
        isActive: true,
        isPopular: false,
        sortOrder: 9
      }
    )
  }
  
  // Zapisz pakiety
  let created = 0
  let updated = 0
  
  for (const packageData of packagesToAdd) {
    try {
      // Sprawdź czy pakiet już istnieje
      const existing = await prisma.package.findFirst({
        where: { name: packageData.name }
      })
      
      if (existing) {
        // Aktualizuj istniejący
        const pkg = await prisma.package.update({
          where: { id: existing.id },
          data: {
            ...packageData,
            updatedAt: new Date()
          }
        })
        updated++
        logger.info(`Updated package: ${pkg.name}`)
      } else {
        // Utwórz nowy
        const pkg = await prisma.package.create({
          data: {
            ...packageData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        created++
        logger.success(`Created package: ${pkg.name} - ${pkg.credits}h for ${pkg.price} PLN`)
      }
    } catch (error) {
      logger.error(`Failed to create/update package: ${error.message}`)
      
      // Jeśli brakuje kolumn, spróbuj z minimalnym zestawem
      try {
        const minimalData = {
          name: packageData.name,
          credits: packageData.credits,
          price: packageData.price,
          validityDays: packageData.validityDays,
          isActive: true
        }
        
        const pkg = await prisma.package.upsert({
          where: { name: packageData.name },
          update: minimalData,
          create: minimalData
        })
        
        created++
        logger.success(`Created package (minimal): ${pkg.name}`)
      } catch (minimalError) {
        logger.warn(`Skipped package ${packageData.name}: ${minimalError.message}`)
      }
    }
  }
  
  logger.info(`Packages: ${created} created, ${updated} updated`)
  
  // Statystyki
  try {
    const packageCount = await prisma.package.count()
    const activePackages = await prisma.package.count({ where: { isActive: true } })
    
    // Pobierz wszystkie pakiety dla statystyk
    const allPackages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    
    if (allPackages.length > 0) {
      const totalCredits = allPackages.reduce((sum, p) => sum + p.credits, 0)
      const avgPrice = allPackages.reduce((sum, p) => sum + p.price, 0) / allPackages.length
      const minPricePerHour = Math.min(...allPackages.map(p => p.price / p.credits))
      const maxPricePerHour = Math.max(...allPackages.map(p => p.price / p.credits))
      
      logger.info('\n📊 Package Statistics:')
      logger.info(`   Total packages: ${packageCount}`)
      logger.info(`   Active packages: ${activePackages}`)
      logger.info(`   Total credits in all packages: ${totalCredits} hours`)
      logger.info(`   Average package price: ${avgPrice.toFixed(2)} PLN`)
      logger.info(`   Price per hour range: ${minPricePerHour.toFixed(0)}-${maxPricePerHour.toFixed(0)} PLN/h`)
      
      // Lista pakietów z cenami za godzinę
      logger.info('\n   Package details:')
      allPackages.forEach(pkg => {
        const pricePerHour = (pkg.price / pkg.credits).toFixed(0)
        const popular = pkg.isPopular ? ' ⭐ POPULAR' : ''
        logger.info(`   • ${pkg.name}: ${pkg.credits}h / ${pkg.price} PLN (${pricePerHour} PLN/h)${popular}`)
      })
      
      // Najlepsze oferty (najniższa cena za godzinę)
      const bestDeals = allPackages
        .map(p => ({ ...p, pricePerHour: p.price / p.credits }))
        .sort((a, b) => a.pricePerHour - b.pricePerHour)
        .slice(0, 3)
      
      logger.info('\n   💰 Best deals (lowest price per hour):')
      bestDeals.forEach((pkg, index) => {
        logger.info(`   ${index + 1}. ${pkg.name}: ${pkg.pricePerHour.toFixed(0)} PLN/h`)
      })
    }
  } catch (error) {
    logger.warn(`Could not generate statistics: ${error.message}`)
  }
}

module.exports = seedPackages