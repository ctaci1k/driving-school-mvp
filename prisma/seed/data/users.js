// prisma/seed/data/users.js - ПОВНИЙ НАБІР КОРИСТУВАЧІВ
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

// Польські імена та прізвища для реалістичності
const polishFirstNames = {
  male: ['Piotr', 'Krzysztof', 'Andrzej', 'Tomasz', 'Paweł', 'Jan', 'Michał', 'Marcin', 'Marek', 'Grzegorz', 'Adam', 'Łukasz', 'Zbigniew', 'Jerzy', 'Tadeusz', 'Mateusz', 'Dariusz', 'Mariusz', 'Wojciech', 'Ryszard'],
  female: ['Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Barbara', 'Ewa', 'Krystyna', 'Elżbieta', 'Magdalena', 'Joanna', 'Aleksandra', 'Monika', 'Teresa', 'Danuta', 'Karolina', 'Marta', 'Dorota', 'Jadwiga', 'Janina']
}

const polishLastNames = ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Pawłowski', 'Michalski']

const warsawDistricts = ['Mokotów', 'Praga-Południe', 'Wola', 'Ursynów', 'Bielany', 'Śródmieście', 'Targówek', 'Bemowo', 'Ochota', 'Żoliborz']

function generatePolishPhone() {
  // Polish mobile numbers: +48 5XX XXX XXX, 6XX XXX XXX, 7XX XXX XXX, 8XX XXX XXX
  const prefix = faker.helpers.arrayElement(['50', '51', '53', '57', '60', '66', '69', '72', '73', '78', '79', '88'])
  return `+48${prefix}${faker.string.numeric(7)}`
}

function generatePolishAddress() {
  const streets = ['Marszałkowska', 'Puławska', 'Aleje Jerozolimskie', 'Świętokrzyska', 'Nowy Świat', 'Krakowskie Przedmieście', 'Grójecka', 'Wołoska', 'Wilanowska', 'Sobieskiego']
  const street = faker.helpers.arrayElement(streets)
  const number = faker.number.int({ min: 1, max: 200 })
  const apartment = faker.datatype.boolean() ? `/${faker.number.int({ min: 1, max: 50 })}` : ''
  
  return {
    street: `ul. ${street} ${number}${apartment}`,
    district: faker.helpers.arrayElement(warsawDistricts),
    city: 'Warszawa',
    postalCode: `0${faker.number.int({ min: 1, max: 9 })}-${faker.string.numeric(3)}`
  }
}

async function seedUsers(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  const hashedPassword = await bcrypt.hash('Test123!', 10)
  
  // Zawsze tworzymy podstawowych użytkowników dla łatwego testowania
  const coreUsers = [
    // ADMINI (2)
    {
      email: 'admin@drivingschool.pl',
      passwordHash: hashedPassword,
      firstName: 'Mariusz',
      lastName: 'Kowalski',
      phone: '+48501234567',
      role: 'ADMIN',
      dateOfBirth: new Date('1975-03-15'),
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Marszałkowska 100/45',
      city: 'Warszawa',
      postalCode: '00-001',
      emergencyContact: 'Anna Kowalska',
      emergencyPhone: '+48501234568'
    },
    {
      email: 'manager@drivingschool.pl',
      passwordHash: hashedPassword,
      firstName: 'Anna',
      lastName: 'Nowak',
      phone: '+48509876543',
      role: 'BRANCH_MANAGER',
      dateOfBirth: new Date('1980-07-22'),
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Puławska 25',
      city: 'Warszawa',
      postalCode: '02-508'
    },
    
    // INSTRUKTORZY (5 głównych)
    {
      email: 'piotr.instructor@drivingschool.pl',
      passwordHash: hashedPassword,
      firstName: 'Piotr',
      lastName: 'Wiśniewski',
      phone: '+48602345678',
      role: 'INSTRUCTOR',
      dateOfBirth: new Date('1985-11-10'),
      language: 'pl',
      licenseNumber: 'WAW123456',
      licenseCategories: ['B', 'B1'],
      licenseIssuedDate: new Date('2010-05-15'),
      licenseExpiryDate: new Date('2030-05-15'),
      instructorLicenseNumber: 'INST/WAW/2015/0123',
      instructorLicenseDate: new Date('2015-09-01'),
      yearsOfExperience: 8,
      specializations: ['Początkujący', 'Egzamin', 'Jazda miejska'],
      rating: 4.8,
      totalLessons: 2456,
      successRate: 0.87,
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Grójecka 45/12',
      city: 'Warszawa',
      postalCode: '02-031'
    },
    {
      email: 'katarzyna.instructor@drivingschool.pl',
      passwordHash: hashedPassword,
      firstName: 'Katarzyna',
      lastName: 'Lewandowska',
      phone: '+48603456789',
      role: 'INSTRUCTOR',
      dateOfBirth: new Date('1990-04-18'),
      language: 'pl',
      licenseNumber: 'WAW234567',
      licenseCategories: ['B', 'B1', 'BE'],
      licenseIssuedDate: new Date('2012-08-20'),
      licenseExpiryDate: new Date('2032-08-20'),
      instructorLicenseNumber: 'INST/WAW/2017/0234',
      instructorLicenseDate: new Date('2017-03-15'),
      yearsOfExperience: 6,
      specializations: ['Kobiety', 'Automatyczna skrzynia', 'Parking'],
      rating: 4.9,
      totalLessons: 1834,
      successRate: 0.91,
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. KEN 15/8',
      city: 'Warszawa',
      postalCode: '02-797'
    },
    {
      email: 'tomasz.instructor@drivingschool.pl',
      passwordHash: hashedPassword,
      firstName: 'Tomasz',
      lastName: 'Kamiński',
      phone: '+48604567890',
      role: 'INSTRUCTOR',
      dateOfBirth: new Date('1988-09-05'),
      language: 'pl',
      licenseNumber: 'WAW345678',
      licenseCategories: ['B', 'C', 'CE'],
      licenseIssuedDate: new Date('2009-03-10'),
      licenseExpiryDate: new Date('2029-03-10'),
      instructorLicenseNumber: 'INST/WAW/2014/0345',
      instructorLicenseDate: new Date('2014-06-20'),
      yearsOfExperience: 9,
      specializations: ['Jazda nocna', 'Autostrada', 'Manewry'],
      rating: 4.7,
      totalLessons: 3102,
      successRate: 0.85,
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Sobieskiego 100',
      city: 'Warszawa',
      postalCode: '00-764'
    },
    
    // STUDENCI (10 podstawowych)
    {
      email: 'jan.kowalczyk@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Jan',
      lastName: 'Kowalczyk',
      phone: '+48701234567',
      role: 'STUDENT',
      dateOfBirth: new Date('2005-03-20'),
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Mokotowska 25/3',
      city: 'Warszawa',
      postalCode: '00-551',
      totalLessons: 15,
      completedLessons: 12,
      examAttempts: 0,
      preferredInstructorId: null // Will be set later
    },
    {
      email: 'anna.wojcik@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Anna',
      lastName: 'Wójcik',
      phone: '+48702345678',
      role: 'STUDENT',
      dateOfBirth: new Date('2004-07-15'),
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true,
      address: 'ul. Racławicka 99',
      city: 'Warszawa',
      postalCode: '02-634',
      totalLessons: 25,
      completedLessons: 25,
      examAttempts: 1,
      examPassed: true,
      examPassedDate: new Date('2024-01-15')
    },
    {
      email: 'marcin.zielinski@outlook.com',
      passwordHash: hashedPassword,
      firstName: 'Marcin',
      lastName: 'Zieliński',
      phone: '+48703456789',
      role: 'STUDENT',
      dateOfBirth: new Date('2006-01-10'),
      language: 'pl',
      emailNotifications: true,
      smsNotifications: false,
      address: 'ul. Wilanowska 45',
      city: 'Warszawa',
      postalCode: '02-765',
      totalLessons: 8,
      completedLessons: 6,
      examAttempts: 0
    }
  ]
  
  // Dodajemy podstawowych użytkowników
  for (const userData of coreUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData
    })
    logger.success(`Created ${user.role}: ${user.firstName} ${user.lastName} (${user.email})`)
  }
  
  // Jeśli nie minimal, dodajemy więcej użytkowników
  if (!isMinimal) {
    // Dodatkowi instruktorzy (5)
    for (let i = 1; i <= 5; i++) {
      const isMale = faker.datatype.boolean()
      const firstName = faker.helpers.arrayElement(isMale ? polishFirstNames.male : polishFirstNames.female)
      const lastName = faker.helpers.arrayElement(polishLastNames)
      const address = generatePolishAddress()
      
      const instructor = await prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@drivingschool.pl`,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          phone: generatePolishPhone(),
          role: 'INSTRUCTOR',
          dateOfBirth: faker.date.birthdate({ min: 30, max: 55, mode: 'age' }),
          language: 'pl',
          licenseNumber: `WAW${faker.string.numeric(6)}`,
          licenseCategories: faker.helpers.arrayElements(['B', 'B1', 'BE', 'C', 'CE'], { min: 1, max: 3 }),
          licenseIssuedDate: faker.date.past({ years: 15 }),
          licenseExpiryDate: faker.date.future({ years: 10 }),
          instructorLicenseNumber: `INST/WAW/${2015 + i}/${faker.string.numeric(4)}`,
          instructorLicenseDate: faker.date.past({ years: 8 }),
          yearsOfExperience: faker.number.int({ min: 3, max: 15 }),
          specializations: faker.helpers.arrayElements(
            ['Początkujący', 'Egzamin', 'Jazda miejska', 'Autostrada', 'Parking', 'Jazda nocna', 'Manewry'],
            { min: 2, max: 4 }
          ),
          rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
          totalLessons: faker.number.int({ min: 500, max: 5000 }),
          successRate: faker.number.float({ min: 0.75, max: 0.95, precision: 0.01 }),
          emailNotifications: true,
          smsNotifications: faker.datatype.boolean(),
          address: address.street,
          city: address.city,
          postalCode: address.postalCode
        }
      })
      logger.info(`Created additional instructor: ${instructor.firstName} ${instructor.lastName}`)
    }
    
    // Dodatkowi studenci (30)
    for (let i = 1; i <= 30; i++) {
      const isMale = faker.datatype.boolean()
      const firstName = faker.helpers.arrayElement(isMale ? polishFirstNames.male : polishFirstNames.female)
      const lastName = faker.helpers.arrayElement(polishLastNames)
      const address = generatePolishAddress()
      const totalLessons = faker.number.int({ min: 0, max: 40 })
      const completedLessons = faker.number.int({ min: 0, max: totalLessons })
      const examAttempts = completedLessons >= 20 ? faker.number.int({ min: 0, max: 3 }) : 0
      const examPassed = examAttempts > 0 && faker.datatype.boolean({ probability: 0.7 })
      
      const student = await prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.string.numeric(3)}@${faker.helpers.arrayElement(['gmail.com', 'outlook.com', 'wp.pl', 'onet.pl'])}`,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          phone: generatePolishPhone(),
          role: 'STUDENT',
          dateOfBirth: faker.date.birthdate({ min: 18, max: 45, mode: 'age' }),
          language: faker.helpers.arrayElement(['pl', 'pl', 'pl', 'en']), // 75% Polish
          emailNotifications: faker.datatype.boolean({ probability: 0.8 }),
          smsNotifications: faker.datatype.boolean({ probability: 0.6 }),
          address: address.street,
          city: address.city,
          postalCode: address.postalCode,
          emergencyContact: faker.datatype.boolean() ? `${faker.person.firstName()} ${lastName}` : null,
          emergencyPhone: faker.datatype.boolean() ? generatePolishPhone() : null,
          totalLessons,
          completedLessons,
          examAttempts,
          examPassed,
          examPassedDate: examPassed ? faker.date.recent({ days: 90 }) : null,
          notes: faker.helpers.arrayElement([
            null,
            'Preferuje jazdę po południu',
            'Uczy się szybko',
            'Potrzebuje więcej praktyki z parkowaniem',
            'Świetnie radzi sobie w ruchu miejskim',
            'Nerwowy podczas egzaminów'
          ])
        }
      })
      logger.info(`Created student ${i}/30: ${student.firstName} ${student.lastName}`)
    }
    
    // Dispatcher (1)
    await prisma.user.create({
      data: {
        email: 'dispatcher@drivingschool.pl',
        passwordHash: hashedPassword,
        firstName: 'Magdalena',
        lastName: 'Dąbrowska',
        phone: '+48605678901',
        role: 'DISPATCHER',
        dateOfBirth: new Date('1992-06-12'),
        language: 'pl',
        emailNotifications: true,
        smsNotifications: true,
        address: 'ul. Złota 44',
        city: 'Warszawa',
        postalCode: '00-120'
      }
    })
    
    logger.success('Created dispatcher account')
  }
  
  // Podsumowanie
  const userCounts = await prisma.user.groupBy({
    by: ['role'],
    _count: true
  })
  
  logger.info('\n📊 User Statistics:')
  userCounts.forEach(stat => {
    logger.info(`   ${stat.role}: ${stat._count} users`)
  })
}
module.exports = seedUsers