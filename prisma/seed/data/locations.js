
// prisma/seed/data/locations.js
async function seedLocations(prisma, logger) {
  const locations = [
    {
      name: 'Warszawa Centrum',
      code: 'WAW-01',
      address: 'ul. Marszałkowska 100',
      city: 'Warszawa',
      postalCode: '00-001',
      maxInstructors: 5,
      maxVehicles: 10,
      isActive: true,
      isPrimary: true
    },
    {
      name: 'Warszawa Mokotów',
      code: 'WAW-02',
      address: 'ul. Puławska 50',
      city: 'Warszawa',
      postalCode: '02-508',
      maxInstructors: 3,
      maxVehicles: 5,
      isActive: true,
      isPrimary: false
    },
    {
      name: 'Warszawa Ursynów',
      code: 'WAW-03',
      address: 'ul. KEN 20',
      city: 'Warszawa',
      postalCode: '02-777',
      maxInstructors: 2,
      maxVehicles: 3,
      isActive: true,
      isPrimary: false
    }
  ]
  
  for (const location of locations) {
    const created = await prisma.location.upsert({
      where: { code: location.code },
      update: {},
      create: location
    })
    
    logger.success(`Created location: ${created.name} (${created.code})`)
  }
}

module.exports = seedLocations