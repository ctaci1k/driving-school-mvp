// prisma/seed/data/maintenanceLogs.js - HISTORIA SERWISOWA POJAZDÓW
const { faker } = require('@faker-js/faker')
const { subDays, addDays } = require('date-fns')

const maintenanceTypes = {
  REGULAR_SERVICE: {
    name: 'Przegląd okresowy',
    tasks: [
      'Wymiana oleju silnikowego',
      'Wymiana filtra oleju',
      'Wymiana filtra powietrza',
      'Sprawdzenie poziomu płynów',
      'Kontrola układu hamulcowego',
      'Kontrola zawieszenia'
    ],
    avgCost: { min: 300, max: 600 },
    frequency: 180 // dni
  },
  OIL_CHANGE: {
    name: 'Wymiana oleju',
    tasks: [
      'Wymiana oleju silnikowego',
      'Wymiana filtra oleju',
      'Kontrola poziomu płynów'
    ],
    avgCost: { min: 150, max: 300 },
    frequency: 90
  },
  TIRE_CHANGE: {
    name: 'Wymiana opon',
    tasks: [
      'Wymiana opon na letnie/zimowe',
      'Wyważenie kół',
      'Kontrola ciśnienia',
      'Kontrola zużycia bieżnika'
    ],
    avgCost: { min: 200, max: 800 },
    frequency: 180
  },
  BRAKE_SERVICE: {
    name: 'Serwis hamulców',
    tasks: [
      'Wymiana klocków hamulcowych',
      'Sprawdzenie tarcz hamulcowych',
      'Wymiana płynu hamulcowego',
      'Kontrola przewodów'
    ],
    avgCost: { min: 400, max: 1200 },
    frequency: 365
  },
  INSPECTION: {
    name: 'Przegląd techniczny',
    tasks: [
      'Badanie techniczne pojazdu',
      'Kontrola emisji spalin',
      'Sprawdzenie świateł',
      'Test hamulców'
    ],
    avgCost: { min: 99, max: 200 },
    frequency: 365
  },
  REPAIR: {
    name: 'Naprawa',
    tasks: [
      'Naprawa usterki',
      'Wymiana części',
      'Diagnostyka komputerowa'
    ],
    avgCost: { min: 200, max: 3000 },
    frequency: null
  },
  CLEANING: {
    name: 'Czyszczenie',
    tasks: [
      'Mycie zewnętrzne',
      'Odkurzanie wnętrza',
      'Czyszczenie tapicerki',
      'Dezynfekcja'
    ],
    avgCost: { min: 50, max: 150 },
    frequency: 30
  }
}

const serviceProviders = [
  { name: 'AutoSerwis Warszawa', address: 'ul. Mechaników 15, Warszawa', phone: '+48 22 123 45 67' },
  { name: 'Toyota Autoryzowany Serwis', address: 'ul. Puławska 256, Warszawa', phone: '+48 22 234 56 78' },
  { name: 'Volkswagen Centrum', address: 'al. Krakowska 100, Warszawa', phone: '+48 22 345 67 89' },
  { name: 'EuroCAR Service', address: 'ul. Modlińska 45, Warszawa', phone: '+48 22 456 78 90' },
  { name: 'QuickFix Auto', address: 'ul. Grochowska 123, Warszawa', phone: '+48 22 567 89 01' },
  { name: 'Bosch Car Service', address: 'ul. Ostrobramska 75, Warszawa', phone: '+48 22 678 90 12' }
]

async function seedMaintenanceLogs(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz pojazdy
  const vehicles = await prisma.vehicle.findMany({
    select: { 
      id: true, 
      registrationNumber: true, 
      make: true, 
      model: true,
      currentMileage: true,
      lastServiceMileage: true
    }
  })
  
  if (vehicles.length === 0) {
    logger.warn('No vehicles found - skipping maintenance logs')
    return
  }
  
  const maintenanceLogs = []
  const now = new Date()
  
  // Dla każdego pojazdu generuj historię serwisową
  for (const vehicle of vehicles) {
    const logsPerVehicle = isMinimal ? 3 : faker.number.int({ min: 5, max: 15 })
    
    for (let i = 0; i < logsPerVehicle; i++) {
      const daysAgo = faker.number.int({ min: 1, max: 365 })
      const serviceDate = subDays(now, daysAgo)
      
      // Wybierz typ serwisu (częstsze dla regularnych przeglądów)
      const maintenanceType = faker.helpers.weightedArrayElement([
        { value: 'REGULAR_SERVICE', weight: 25 },
        { value: 'OIL_CHANGE', weight: 20 },
        { value: 'TIRE_CHANGE', weight: 15 },
        { value: 'BRAKE_SERVICE', weight: 10 },
        { value: 'INSPECTION', weight: 10 },
        { value: 'REPAIR', weight: 15 },
        { value: 'CLEANING', weight: 5 }
      ])
      
      const typeInfo = maintenanceTypes[maintenanceType]
      const provider = faker.helpers.arrayElement(serviceProviders)
      
      // Oblicz przebieg w momencie serwisu
      const mileageAtService = vehicle.currentMileage - (daysAgo * faker.number.int({ min: 20, max: 100 }))
      
      // Określ status
      let status = 'COMPLETED'
      let scheduledDate = serviceDate
      
      // Niektóre mogą być zaplanowane na przyszłość
      if (i === 0 && faker.datatype.boolean({ probability: 0.3 })) {
        status = 'SCHEDULED'
        scheduledDate = addDays(now, faker.number.int({ min: 1, max: 30 }))
      }
      
      const cost = faker.number.int(typeInfo.avgCost)
      const invoiceNumber = status === 'COMPLETED' 
        ? `FV/${serviceDate.getFullYear()}/${faker.number.int({ min: 1000, max: 9999 })}`
        : null
      
      maintenanceLogs.push({
        vehicleId: vehicle.id,
        type: maintenanceType,
        status,
        scheduledDate,
        completedDate: status === 'COMPLETED' ? serviceDate : null,
        mileageAtService: Math.max(0, mileageAtService),
        nextServiceMileage: mileageAtService + faker.number.int({ min: 5000, max: 15000 }),
        description: typeInfo.name,
        performedTasks: status === 'COMPLETED' 
          ? faker.helpers.arrayElements(typeInfo.tasks, { min: 2, max: typeInfo.tasks.length })
          : typeInfo.tasks,
        servicedBy: provider.name,
        serviceLocation: provider.address,
        cost: status === 'COMPLETED' ? cost : null,
        invoiceNumber,
        notes: faker.helpers.arrayElement([
          null,
          'Serwis wykonany terminowo',
          'Zalecana wymiana płynu hamulcowego przy następnym przeglądzie',
          'Pojazd w dobrym stanie technicznym',
          'Wykryto niewielki wyciek oleju - do obserwacji',
          'Zalecana wymiana akumulatora w ciągu 3 miesięcy'
        ]),
        partsReplaced: maintenanceType === 'REPAIR' || maintenanceType === 'BRAKE_SERVICE'
          ? faker.helpers.arrayElements([
              'Klocki hamulcowe przód',
              'Klocki hamulcowe tył',
              'Tarcze hamulcowe',
              'Świece zapłonowe',
              'Akumulator',
              'Alternator',
              'Pasek rozrządu',
              'Pompa wody',
              'Termostat',
              'Filtr kabinowy',
              'Amortyzatory przód',
              'Wahacze'
            ], { min: 1, max: 3 })
          : [],
        warranty: maintenanceType === 'REPAIR' 
          ? faker.helpers.arrayElement([6, 12, 24]) // miesiące
          : null,
        warrantyExpiresAt: maintenanceType === 'REPAIR' && status === 'COMPLETED'
          ? addDays(serviceDate, faker.helpers.arrayElement([180, 365, 730]))
          : null,
        isUnderWarranty: faker.datatype.boolean({ probability: 0.2 }),
        vehicleDowntime: maintenanceType === 'REPAIR' 
          ? faker.number.int({ min: 1, max: 5 }) // dni
          : 0,
        metadata: {
          vehicleInfo: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
          providerPhone: provider.phone,
          isEmergency: maintenanceType === 'REPAIR' && faker.datatype.boolean({ probability: 0.3 }),
          affectedBookings: maintenanceType === 'REPAIR' ? faker.number.int({ min: 0, max: 5 }) : 0
        }
      })
    }
  }
  
  // Dodaj specjalne przypadki
  if (!isMinimal && vehicles.length > 0) {
    // Przypadek 1: Poważna awaria
    const majorRepair = {
      vehicleId: vehicles[0].id,
      type: 'REPAIR',
      status: 'COMPLETED',
      scheduledDate: subDays(now, 45),
      completedDate: subDays(now, 40),
      mileageAtService: vehicles[0].currentMileage - 5000,
      description: 'Poważna awaria silnika',
      performedTasks: [
        'Wymiana uszczelki pod głowicą',
        'Szlifowanie głowicy',
        'Wymiana rozrządu',
        'Wymiana pompy wody',
        'Wymiana płynów eksploatacyjnych'
      ],
      servicedBy: serviceProviders[1].name,
      serviceLocation: serviceProviders[1].address,
      cost: 4500,
      invoiceNumber: `FV/2024/${faker.number.int({ min: 1000, max: 9999 })}`,
      notes: 'Awaria spowodowana przegrzaniem silnika. Pojazd wyłączony z użytku na 5 dni.',
      partsReplaced: [
        'Uszczelka pod głowicą',
        'Pasek rozrządu',
        'Rolki rozrządu',
        'Pompa wody',
        'Termostat',
        'Płyn chłodniczy'
      ],
      warranty: 24,
      warrantyExpiresAt: addDays(subDays(now, 40), 730),
      vehicleDowntime: 5,
      metadata: {
        vehicleInfo: `${vehicles[0].make} ${vehicles[0].model} (${vehicles[0].registrationNumber})`,
        isEmergency: true,
        affectedBookings: 8,
        totalLoss: 1600 // Utracone przychody
      }
    }
    maintenanceLogs.push(majorRepair)
    
    // Przypadek 2: Przygotowanie do zimy
    for (let i = 0; i < Math.min(3, vehicles.length); i++) {
      maintenanceLogs.push({
        vehicleId: vehicles[i].id,
        type: 'TIRE_CHANGE',
        status: 'COMPLETED',
        scheduledDate: subDays(now, 30),
        completedDate: subDays(now, 30),
        mileageAtService: vehicles[i].currentMileage - 3000,
        description: 'Wymiana opon na zimowe',
        performedTasks: [
          'Wymiana opon letnich na zimowe',
          'Wyważenie kół',
          'Kontrola ciśnienia',
          'Przechowanie opon letnich'
        ],
        servicedBy: serviceProviders[2].name,
        serviceLocation: serviceProviders[2].address,
        cost: 320,
        invoiceNumber: `FV/2024/${faker.number.int({ min: 5000, max: 9999 })}`,
        notes: 'Opony zimowe w dobrym stanie, zalecana wymiana w następnym sezonie',
        metadata: {
          vehicleInfo: `${vehicles[i].make} ${vehicles[i].model} (${vehicles[i].registrationNumber})`,
          tiresBrand: faker.helpers.arrayElement(['Michelin', 'Continental', 'Bridgestone', 'Goodyear']),
          tireSize: '195/65 R15',
          treadDepth: faker.number.float({ min: 4, max: 8, precision: 0.1 }) // mm
        }
      })
    }
    
    // Przypadek 3: Zaplanowane przeglądy
    const upcomingServices = Math.min(5, vehicles.length)
    for (let i = 0; i < upcomingServices; i++) {
      const scheduledIn = faker.number.int({ min: 1, max: 30 })
      
      maintenanceLogs.push({
        vehicleId: vehicles[i].id,
        type: faker.helpers.arrayElement(['REGULAR_SERVICE', 'INSPECTION', 'OIL_CHANGE']),
        status: 'SCHEDULED',
        scheduledDate: addDays(now, scheduledIn),
        mileageAtService: vehicles[i].currentMileage + (scheduledIn * 50),
        description: 'Zaplanowany przegląd okresowy',
        performedTasks: maintenanceTypes.REGULAR_SERVICE.tasks,
        servicedBy: faker.helpers.arrayElement(serviceProviders).name,
        estimatedCost: faker.number.int({ min: 300, max: 600 }),
        notes: 'Przypomnienie wysłane do kierownika floty',
        reminderSent: true,
        metadata: {
          vehicleInfo: `${vehicles[i].make} ${vehicles[i].model} (${vehicles[i].registrationNumber})`,
          bookedSlot: `${9 + faker.number.int({ min: 0, max: 7 })}:00`,
          estimatedDuration: faker.number.int({ min: 2, max: 4 }) // godziny
        }
      })
    }
  }
  
  // Zapisz logi serwisowe
  let created = 0
  let skipped = 0
  
  for (const logData of maintenanceLogs) {
    try {
      const log = await prisma.maintenanceLog.create({
        data: logData
      })
      created++
      
      if (created <= 5 || created % 20 === 0) {
        const vehicle = vehicles.find(v => v.id === logData.vehicleId)
        logger.info(
          `Created maintenance log ${created}: ${log.type} for ${vehicle?.registrationNumber} (${log.status})`
        )
      }
    } catch (error) {
      skipped++
      if (skipped <= 3) {
        logger.warn(`Failed to create maintenance log: ${error.message}`)
      }
    }
  }
  
  logger.success(`Created ${created} maintenance logs (${skipped} skipped)`)
  
  // Statystyki
  const stats = await prisma.maintenanceLog.groupBy({
    by: ['type', 'status'],
    _count: true,
    _sum: { cost: true }
  })
  
  const totalCost = await prisma.maintenanceLog.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { cost: true }
  })
  
  const scheduledCount = await prisma.maintenanceLog.count({
    where: { status: 'SCHEDULED' }
  })
  
  logger.info('\n📊 Maintenance Statistics:')
  logger.info(`   Total logs: ${created}`)
  logger.info(`   Total maintenance cost: ${totalCost._sum.cost || 0} PLN`)
  logger.info(`   Scheduled services: ${scheduledCount}`)
  
  logger.info('\n   By type and status:')
  const typeGroups = {}
  stats.forEach(stat => {
    if (!typeGroups[stat.type]) typeGroups[stat.type] = []
    typeGroups[stat.type].push({
      status: stat.status,
      count: stat._count,
      totalCost: stat._sum.cost || 0
    })
  })
  
  Object.entries(typeGroups).forEach(([type, statuses]) => {
    const emoji = 
      type === 'REGULAR_SERVICE' ? '🔧' :
      type === 'OIL_CHANGE' ? '🛢️' :
      type === 'TIRE_CHANGE' ? '🛞' :
      type === 'BRAKE_SERVICE' ? '🛑' :
      type === 'INSPECTION' ? '📋' :
      type === 'REPAIR' ? '🔨' :
      type === 'CLEANING' ? '🧹' :
      '🚗'
    
    logger.info(`   ${emoji} ${type}:`)
    statuses.forEach(s => {
      logger.info(`     ${s.status}: ${s.count} (${s.totalCost} PLN)`)
    })
  })
  
  // Pojazdy z najwyższymi kosztami
  const vehicleCosts = await prisma.maintenanceLog.groupBy({
    by: ['vehicleId'],
    where: { status: 'COMPLETED' },
    _sum: { cost: true },
    _count: true,
    orderBy: { _sum: { cost: 'desc' } },
    take: 3
  })
  
  if (vehicleCosts.length > 0) {
    logger.info('\n   Top 3 vehicles by maintenance cost:')
    for (const stat of vehicleCosts) {
      const vehicle = vehicles.find(v => v.id === stat.vehicleId)
      if (vehicle) {
        logger.info(`     ${vehicle.registrationNumber}: ${stat._sum.cost} PLN (${stat._count} services)`)
      }
    }
  }
}

module.exports = seedMaintenanceLogs