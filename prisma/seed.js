// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Створити тестових користувачів
  const hashedPassword = await bcrypt.hash('Test123!', 10)

  // Створити адміна
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+48123456789',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Admin created:', admin.email)

  // Створити інструкторів
  const instructor1 = await prisma.user.upsert({
    where: { email: 'instructor1@test.com' },
    update: {},
    create: {
      email: 'instructor1@test.com',
      passwordHash: hashedPassword,
      firstName: 'Jan',
      lastName: 'Kowalski',
      role: 'INSTRUCTOR',
      phone: '+48123456790',
      status: 'ACTIVE',
    },
  })

  const instructor2 = await prisma.user.upsert({
    where: { email: 'instructor2@test.com' },
    update: {},
    create: {
      email: 'instructor2@test.com',
      passwordHash: hashedPassword,
      firstName: 'Anna',
      lastName: 'Nowak',
      role: 'INSTRUCTOR',
      phone: '+48123456791',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Instructors created')

  // Створити студентів
  const student1 = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      passwordHash: hashedPassword,
      firstName: 'Piotr',
      lastName: 'Wiśniewski',
      role: 'STUDENT',
      phone: '+48123456792',
      status: 'ACTIVE',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@test.com' },
    update: {},
    create: {
      email: 'student2@test.com',
      passwordHash: hashedPassword,
      firstName: 'Maria',
      lastName: 'Dąbrowska',
      role: 'STUDENT',
      phone: '+48123456793',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Students created')

  // Створити розклад для інструкторів
  for (let day = 1; day <= 5; day++) { // Понеділок - П'ятниця
    await prisma.instructorSchedule.upsert({
      where: {
        instructorId_dayOfWeek: {
          instructorId: instructor1.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        instructorId: instructor1.id,
        dayOfWeek: day,
        startTime: '08:00',
        endTime: '18:00',
        isAvailable: true,
      },
    })

    await prisma.instructorSchedule.upsert({
      where: {
        instructorId_dayOfWeek: {
          instructorId: instructor2.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        instructorId: instructor2.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
      },
    })
  }

  console.log('✅ Schedules created')

  // Створити локації (Phase 2)
  const location1 = await prisma.location.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Główna Szkoła',
      code: 'MAIN',
      address: 'ul. Główna 1',
      city: 'Warszawa',
      postalCode: '00-001',
      isActive: true,
      isPrimary: true,
    },
  })

  const location2 = await prisma.location.upsert({
    where: { code: 'NORTH' },
    update: {},
    create: {
      name: 'Filia Północ',
      code: 'NORTH',
      address: 'ul. Północna 10',
      city: 'Warszawa',
      postalCode: '01-001',
      isActive: true,
      isPrimary: false,
    },
  })

  console.log('✅ Locations created')

  // Створити автомобілі (Phase 2)
  try {
    const vehicle1 = await prisma.vehicle.create({
      data: {
        registrationNumber: 'WX 12345',
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Silver',
        category: 'B',
        transmission: 'MANUAL',
        fuelType: 'PETROL',
        assignedInstructorId: instructor1.id,
        baseLocationId: location1.id,
        insuranceExpiry: new Date('2025-12-31'),
        inspectionExpiry: new Date('2025-06-30'),
        status: 'ACTIVE',
      },
    })

    const vehicle2 = await prisma.vehicle.create({
      data: {
        registrationNumber: 'WX 67890',
        make: 'Volkswagen',
        model: 'Golf',
        year: 2023,
        color: 'Blue',
        category: 'B_AUTOMATIC',
        transmission: 'AUTOMATIC',
        fuelType: 'DIESEL',
        assignedInstructorId: instructor2.id,
        baseLocationId: location1.id,
        insuranceExpiry: new Date('2025-12-31'),
        inspectionExpiry: new Date('2025-06-30'),
        status: 'ACTIVE',
      },
    })

    console.log('✅ Vehicles created')
  } catch (error) {
    console.log('⚠️ Vehicles might already exist, skipping...')
  }

  // Створити пакети (Phase 2)
  try {
    await prisma.package.create({
      data: {
        name: 'Pakiet Startowy',
        description: '5 lekcji na dobry początek',
        credits: 5,
        price: 900,
        validityDays: 90,
        isActive: true,
        isPopular: false,
        sortOrder: 1,
      },
    })

    await prisma.package.create({
      data: {
        name: 'Pakiet Standard',
        description: '10 lekcji - najpopularniejszy wybór',
        credits: 10,
        price: 1700,
        validityDays: 120,
        isActive: true,
        isPopular: true,
        sortOrder: 2,
      },
    })

    await prisma.package.create({
      data: {
        name: 'Pakiet Premium',
        description: '20 lekcji - najlepsza cena za lekcję',
        credits: 20,
        price: 3200,
        validityDays: 180,
        isActive: true,
        isPopular: false,
        sortOrder: 3,
      },
    })

    console.log('✅ Packages created')
  } catch (error) {
    console.log('⚠️ Packages might already exist, skipping...')
  }

  console.log(`
  🎉 Seed completed successfully!
  
  Test accounts:
  -------------------------
  Admin:       admin@test.com / Test123!
  Instructor1: instructor1@test.com / Test123!
  Instructor2: instructor2@test.com / Test123!
  Student:     student@test.com / Test123!
  Student2:    student2@test.com / Test123!
  -------------------------
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })