// prisma/seed/data/vehicles.js - KOMPLETNA FLOTA POJAZDÓW
const { faker } = require('@faker-js/faker')

const vehicleModels = {
  'B': [
    { make: 'Toyota', model: 'Yaris', year: [2020, 2021, 2022, 2023] },
    { make: 'Volkswagen', model: 'Polo', year: [2020, 2021, 2022] },
    { make: 'Skoda', model: 'Fabia', year: [2021, 2022, 2023] },
    { make: 'Ford', model: 'Fiesta', year: [2020, 2021, 2022] },
    { make: 'Opel', model: 'Corsa', year: [2021, 2022, 2023] },
    { make: 'Renault', model: 'Clio', year: [2020, 2021, 2022] },
    { make: 'Peugeot', model: '208', year: [2021, 2022, 2023] },
    { make: 'Hyundai', model: 'i20', year: [2021, 2022, 2023] }
  ],
  'B_AUTOMATIC': [
    { make: 'Toyota', model: 'Corolla', year: [2021, 2022, 2023] },
    { make: 'Mazda', model: '3', year: [2021, 2022, 2023] },
    { make: 'Volkswagen', model: 'Golf', year: [2020, 2021, 2022] },
    { make: 'Mercedes-Benz', model: 'A-Class', year: [2022, 2023] },
    { make: 'BMW', model: '1 Series', year: [2021, 2022] },
    { make: 'Audi', model: 'A3', year: [2021, 2022, 2023] }
  ]
}

function generateVIN() {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
  let vin = ''
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)]
  }
  return vin
}

function generatePlateNumber() {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ'
  const prefix = 'WI' // Warszawa
  const numbers = faker.string.numeric(3)
  const suffix = faker.helpers.arrayElements(letters.split(''), 2).join('')
  return `${prefix} ${numbers}${suffix}`
}

async function seedVehicles(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz instruktorów i lokacje
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { id: true, firstName: true, lastName: true }
  })
  
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, code: true }
  })
  
  if (instructors.length === 0 || locations.length === 0) {
    logger.warn('No instructors or locations found - skipping vehicles')
    return
  }
  
  const vehicles = []
  const vehicleCount = isMinimal ? 10 : 25
  
  // Generuj pojazdy
  for (let i = 0; i < vehicleCount; i++) {
    const category = i < vehicleCount * 0.7 ? 'B' : 'B_AUTOMATIC' // 70% manual, 30% automatic
    const modelInfo = faker.helpers.arrayElement(vehicleModels[category])
    const year = faker.helpers.arrayElement(modelInfo.year)
    const isActive = faker.datatype.boolean({ probability: 0.9 }) // 90% active
    const currentMileage = faker.number.int({ min: 5000, max: 150000 })
    
    // Przypisz instruktora (niektóre pojazdy mogą być nieprzypisane)
    const assignedInstructor = faker.datatype.boolean({ probability: 0.8 }) 
      ? faker.helpers.arrayElement(instructors) 
      : null
    
    // Przypisz lokację
    const location = faker.helpers.arrayElement(locations)
    
    const vehicle = {
      plateNumber: generatePlateNumber(),
      registrationNumber: `REG-${faker.string.numeric(8)}`,
      vin: generateVIN(),
      make: modelInfo.make,
      model: modelInfo.model,
      year: year,
      category: category,
      transmission: category === 'B_AUTOMATIC' ? 'AUTOMATIC' : 'MANUAL',
      fuelType: faker.helpers.arrayElement(['PETROL', 'DIESEL', 'HYBRID']),
      color: faker.helpers.arrayElement(['Biały', 'Czarny', 'Srebrny', 'Niebieski', 'Czerwony', 'Szary']),
      ownershipType: faker.helpers.arrayElement(['OWNED', 'LEASED', 'RENTED']),
      assignedInstructorId: assignedInstructor?.id || null,
      baseLocationId: location.id,
      currentMileage: currentMileage,
      lastServiceMileage: currentMileage - faker.number.int({ min: 1000, max: 10000 }),
      nextServiceMileage: currentMileage + faker.number.int({ min: 5000, max: 15000 }),
      status: isActive ? 'ACTIVE' : faker.helpers.arrayElement(['MAINTENANCE', 'REPAIR']),
      insuranceExpiry: faker.date.future({ years: 1 }),
      inspectionExpiry: faker.date.future({ years: 1 }),
      insuranceCompany: faker.helpers.arrayElement(['PZU', 'Warta', 'Allianz', 'Generali', 'AXA']),
      insurancePolicyNumber: `POL-${faker.string.numeric(10)}`,
      insuranceStartDate: faker.date.past({ years: 1 }), 
      insuranceType: "OC+AC",
      purchaseDate: faker.date.past({ years: year === 2023 ? 1 : 3 }),
      purchasePrice: faker.number.int({ min: 50000, max: 150000 }),
      features: faker.helpers.arrayElements([
        'ABS', 'ESP', 'Klimatyzacja', 'Poduszki powietrzne', 'Czujniki parkowania',
        'Kamera cofania', 'Nawigacja GPS', 'Bluetooth', 'USB', 'Start-Stop',
        'Tempomat', 'Asystent pasa ruchu', 'Czujnik deszczu', 'Czujnik zmierzchu'
      ], { min: 5, max: 10 }),
      notes: faker.helpers.arrayElement([
        null,
        'Pojazd w idealnym stanie',
        'Wymaga przeglądu hamulców',
        'Nowe opony zamontowane',
        'Preferowany dla początkujących',
        'Używany głównie do egzaminów'
      ])
    }
    
    vehicles.push(vehicle)
  }
  
  // Zapisz pojazdy do bazy
  for (const vehicleData of vehicles) {
    try {
      const vehicle = await prisma.vehicle.create({
        data: vehicleData
      })
      
      const assignedTo = vehicleData.assignedInstructorId 
        ? instructors.find(i => i.id === vehicleData.assignedInstructorId)
        : null
      
      logger.success(
        `Created ${vehicle.category} vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})` +
        (assignedTo ? ` - assigned to ${assignedTo.firstName} ${assignedTo.lastName}` : ' - unassigned')
      )
    } catch (error) {
      logger.warn(`Failed to create vehicle: ${error.message}`)
    }
  }
  
  // Statystyki
  const stats = await prisma.vehicle.groupBy({
    by: ['category', 'status'],
    _count: true
  })
  
  logger.info('\n📊 Vehicle Fleet Statistics:')
  logger.info(`   Total vehicles: ${vehicles.length}`)
  
  const byCategory = {}
  stats.forEach(stat => {
    if (!byCategory[stat.category]) byCategory[stat.category] = {}
    byCategory[stat.category][stat.status] = stat._count
  })
  
  Object.entries(byCategory).forEach(([category, statuses]) => {
    logger.info(`   ${category}:`)
    Object.entries(statuses).forEach(([status, count]) => {
      logger.info(`     - ${status}: ${count}`)
    })
  })
  
  // Przypisanie pojazdów do instruktorów - podsumowanie
  const assigned = await prisma.vehicle.count({
    where: { assignedInstructorId: { not: null } }
  })
  const unassigned = await prisma.vehicle.count({
    where: { assignedInstructorId: null }
  })
  
  logger.info(`   Assigned to instructors: ${assigned}`)
  logger.info(`   Available (unassigned): ${unassigned}`)
}

module.exports = seedVehicles