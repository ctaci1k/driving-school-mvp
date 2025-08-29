// prisma/seed/data/02-infrastructure.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');
const { 
  generateRegistrationNumber, 
  generatePhoneNumber,
  generateWorkingHours 
} = require('../utils/helpers.js');

async function seedInfrastructure(prisma, users) {
  const result = {
    locations: [],
    vehicles: []
  };

  // 1. Create Locations
  const locationData = [
    {
      name: 'Centrala Warszawa Śródmieście',
      type: 'branch',
      address: 'ul. Marszałkowska 140',
      city: 'Warszawa',
      postalCode: '00-061',
      district: 'Śródmieście',
      lat: 52.2297,
      lng: 21.0122
    },
    {
      name: 'Oddział Mokotów',
      type: 'branch',
      address: 'ul. Puławska 266',
      city: 'Warszawa',
      postalCode: '02-684',
      district: 'Mokotów',
      lat: 52.1801,
      lng: 21.0233
    },
    {
      name: 'Plac Egzaminacyjny WORD',
      type: 'exam_center',
      address: 'ul. Odlewnicza 8',
      city: 'Warszawa',
      postalCode: '03-231',
      district: 'Praga-Południe',
      lat: 52.2581,
      lng: 21.0881
    },
    {
      name: 'Punkt Spotkań Ursynów',
      type: 'meeting_point',
      address: 'al. KEN 61',
      city: 'Warszawa',
      postalCode: '02-777',
      district: 'Ursynów',
      lat: 52.1512,
      lng: 21.0467
    },
    {
      name: 'Oddział Wola',
      type: 'branch',
      address: 'ul. Górczewska 124',
      city: 'Warszawa',
      postalCode: '01-460',
      district: 'Wola',
      lat: 52.2389,
      lng: 20.9324
    }
  ];

  for (const data of locationData) {
    const location = await prisma.location.create({
      data: {
        name: data.name,
        type: data.type,
        status: 'active',
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: 'Poland',
        lat: data.lat,
        lng: data.lng,
        phone: generatePhoneNumber(),
        email: `${data.district.toLowerCase()}@drivingschool.pl`,
        website: 'https://drivingschool.pl',
        workingHours: generateWorkingHours(),
        totalStudents: faker.number.int({ min: 50, max: 200 }),
        activeStudents: faker.number.int({ min: 20, max: 80 }),
        monthlyRevenue: parseFloat(faker.number.float({ min: 15000, max: 50000, precision: 0.01 }).toFixed(2))
      }
    });
    result.locations.push(location);
  }

  // 2. Create Vehicles
  const vehicleData = [
    {
      make: 'Toyota',
      model: 'Yaris',
      year: 2023,
      transmission: 'manual',
      fuelType: 'petrol'
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      transmission: 'manual',
      fuelType: 'diesel'
    },
    {
      make: 'Skoda',
      model: 'Fabia',
      year: 2023,
      transmission: 'automatic',
      fuelType: 'petrol'
    },
    {
      make: 'Toyota',
      model: 'Corolla',
      year: 2024,
      transmission: 'automatic',
      fuelType: 'hybrid'
    },
    {
      make: 'Volkswagen',
      model: 'Polo',
      year: 2022,
      transmission: 'manual',
      fuelType: 'petrol'
    }
  ];

  for (let i = 0; i < vehicleData.length; i++) {
    const data = vehicleData[i];
    const location = faker.helpers.arrayElement(result.locations);
    
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber: generateRegistrationNumber('W'),
        make: data.make,
        model: data.model,
        year: data.year,
        transmission: data.transmission,
        fuelType: data.fuelType,
        insuranceExpiry: faker.date.future({ years: 1 }),
        inspectionExpiry: faker.date.future({ years: 1 }),
        status: faker.helpers.weightedArrayElement([
          { weight: 7, value: 'available' },
          { weight: 2, value: 'in_use' },
          { weight: 1, value: 'maintenance' }
        ]),
        locationId: location.id
      }
    });
    result.vehicles.push(vehicle);
  }

  // 3. Assign Instructors to Locations
  for (const instructor of users.instructors) {
    const primaryLocation = faker.helpers.arrayElement(result.locations.filter(l => l.type === 'branch'));
    const secondaryLocation = faker.helpers.arrayElement(result.locations.filter(l => l.id !== primaryLocation.id));
    
    await prisma.instructorLocation.createMany({
      data: [
        {
          instructorId: instructor.id,
          locationId: primaryLocation.id,
          isPrimary: true
        },
        {
          instructorId: instructor.id,
          locationId: secondaryLocation.id,
          isPrimary: false
        }
      ]
    });
  }

  // 4. Assign Instructors to Vehicles
  for (const instructor of users.instructors) {
    const assignedVehicles = faker.helpers.arrayElements(result.vehicles, { min: 2, max: 3 });
    
    for (let i = 0; i < assignedVehicles.length; i++) {
      await prisma.instructorVehicle.create({
        data: {
          instructorId: instructor.id,
          vehicleId: assignedVehicles[i].id,
          isPreferred: i === 0
        }
      });
    }
  }

  return result;
}

module.exports = { seedInfrastructure };