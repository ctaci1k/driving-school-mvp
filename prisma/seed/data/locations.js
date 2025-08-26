// prisma/seed/data/locations.js
async function seedLocations(prisma, logger) {
  const locations = [
    {
      id: 'location-warsaw-1',
      name: 'Warszawa Centrum',
      code: 'WAW-01',
      address: 'ul. Marszałkowska 100',
      city: 'Warszawa',
      postalCode: '00-001',
          phone: '+48 22 123 45 67',  // <-- ДОДАТИ
    email: 'warsaw@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 8,
      maxVehicles: 15,
      isActive: true,
      isPrimary: true,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
    },
    {
      id: 'location-warsaw-2',
      name: 'Warszawa Mokotów',
      code: 'WAW-02',
      address: 'ul. Puławska 50',
      city: 'Warszawa',
      postalCode: '02-508',
          phone: '+48 22 123 45 67',  // <-- ДОДАТИ
    email: 'warsaw2@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 5,
      maxVehicles: 8,
      isActive: true,
      isPrimary: false,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
    },
    {
      id: 'location-krakow-1',
      name: 'Kraków Centrum',
      code: 'KRK-01',
      address: 'ul. Floriańska 15',
      city: 'Kraków',
      postalCode: '31-021',
          phone: '+48 12 987 65 43',  // <-- ДОДАТИ
    email: 'krakow@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 6,
      maxVehicles: 10,
      isActive: true,
      isPrimary: false,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
    },
    {
      id: 'location-wroclaw-1',
      name: 'Wrocław Centrum',
      code: 'WRO-01',
      address: 'ul. Świdnicka 10',
      city: 'Wrocław',
      postalCode: '50-066',
                phone: '+48 12 987 65 43',  // <-- ДОДАТИ
    email: 'wroclaw@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 5,
      maxVehicles: 8,
      isActive: true,
      isPrimary: false,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
    },
    {
      id: 'location-poznan-1',
      name: 'Poznań Centrum',
      code: 'POZ-01',
      address: 'ul. Święty Marcin 30',
      city: 'Poznań',
      postalCode: '60-001',
                      phone: '+48 12 987 65 43',  // <-- ДОДАТИ
    email: 'poznan@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 4,
      maxVehicles: 7,
      isActive: true,
      isPrimary: false,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
    },
    {
      id: 'location-gdansk-1',
      name: 'Gdańsk Centrum',
      code: 'GDA-01',
      address: 'ul. Długa 45',
      city: 'Gdańsk',
      postalCode: '80-001',
                            phone: '+48 12 987 65 43',  // <-- ДОДАТИ
    email: 'gdansk@driving-school.pl',  // <-- ДОДАТИ
      maxInstructors: 4,
      maxVehicles: 6,
      isActive: true,
      isPrimary: false,
          operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { closed: true }
    }
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
  
  return locations
}

module.exports = seedLocations

