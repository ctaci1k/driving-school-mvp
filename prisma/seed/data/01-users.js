// prisma/seed/data/01-users.js
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');
const { 
  generatePESEL, 
  generatePhoneNumber, 
  generateAddress,
  generateSkillsProgress,
  generateWeatherPreferences,
  generateAvailabilitySchedule
} = require('../utils/helpers.js');
const { polishNames } = require('../mock/polish-data.js');

async function seedUsers(prisma) {
  const users = {
    admin: null,
    instructors: [],
    students: [],
    totalCount: 0
  };

  // Default password for all test users
  const defaultPassword = await bcrypt.hash('Test123!', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@drivingschool.pl',
      passwordHash: defaultPassword,
      firstName: 'Piotr',
      lastName: 'Kowalski',
      phone: generatePhoneNumber(),
      avatarUrl: `https://ui-avatars.com/api/?name=Piotr+Kowalski&background=6366f1&color=fff`,
      role: 'admin',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: true,
      twoFactorMethod: 'email',
      lastLogin: faker.date.recent({ days: 1 }),
      createdAt: faker.date.past({ years: 2 })
    }
  });
  users.admin = admin;
  users.totalCount++;

  // 2. Create Instructors
  const instructorNames = [
    { firstName: 'Marek', lastName: 'Nowak' },
    { firstName: 'Anna', lastName: 'Wisniewska' },
    { firstName: 'Tomasz', lastName: 'Wojcik' },
    { firstName: 'Katarzyna', lastName: 'Kaminska' },
    { firstName: 'Robert', lastName: 'Lewandowski' }
  ];

  for (let i = 0; i < config.counts.instructors; i++) {
    const name = instructorNames[i];
    const email = `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@drivingschool.pl`;
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: defaultPassword,
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generatePhoneNumber(),
        avatarUrl: `https://ui-avatars.com/api/?name=${name.firstName}+${name.lastName}&background=10b981&color=fff`,
        role: 'instructor',
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: faker.datatype.boolean(),
        twoFactorMethod: faker.datatype.boolean() ? 'email' : 'sms',
        lastLogin: faker.date.recent({ days: 7 }),
        createdAt: faker.date.past({ years: 1 }),
        instructor: {
          create: {
            licenseNumber: `INS${faker.number.int({ min: 100000, max: 999999 })}`,
            licenseExpiry: faker.date.future({ years: 3 }),
            yearsExperience: faker.number.int({ min: 2, max: 15 }),
            rating: parseFloat(faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }).toFixed(2)),
            totalReviews: faker.number.int({ min: 10, max: 200 }),
            availabilitySchedule: generateAvailabilitySchedule(),
            specializations: ['category_B', 'automatic', 'manual'],
            morningAvailable: faker.datatype.boolean(),
            afternoonAvailable: true,
            eveningAvailable: faker.datatype.boolean(),
            weekendAvailable: faker.datatype.boolean()
          }
        }
      },
      include: { instructor: true }
    });
    
    users.instructors.push(user);
    users.totalCount++;
  }

  // 3. Create Students
  const studentNames = [
    { firstName: 'Jakub', lastName: 'Zielinski' },
    { firstName: 'Magdalena', lastName: 'Szymanska' },
    { firstName: 'Michal', lastName: 'Dąbrowski' },
    { firstName: 'Aleksandra', lastName: 'Mazur' },
    { firstName: 'Pawel', lastName: 'Jankowski' }
  ];

  for (let i = 0; i < config.counts.students; i++) {
    const name = studentNames[i];
    const email = `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}@gmail.com`;
    const birthDate = faker.date.birthdate({ min: 18, max: 35, mode: 'age' });
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: defaultPassword,
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generatePhoneNumber(),
        avatarUrl: `https://ui-avatars.com/api/?name=${name.firstName}+${name.lastName}&background=3b82f6&color=fff`,
        role: 'student',
        emailVerified: true,
        phoneVerified: faker.datatype.boolean(),
        twoFactorEnabled: false,
        lastLogin: faker.date.recent({ days: 3 }),
        createdAt: faker.date.past({ years: 0.5 }),
        student: {
          create: {
            pesel: generatePESEL(birthDate),
            birthDate,
            address: generateAddress(),
            city: 'Warszawa',
            postalCode: faker.helpers.arrayElement(['00-001', '02-777', '01-100', '03-450', '04-028']),
            drivingLicenseNumber: faker.datatype.boolean() ? `PKK${faker.number.int({ min: 1000000, max: 9999999 })}` : null,
            licenseCategory: 'B',
            theoryHoursCompleted: faker.number.int({ min: 0, max: 30 }),
            practicalHoursCompleted: faker.number.int({ min: 0, max: 25 }),
            totalCredits: faker.number.int({ min: 10, max: 50 }),
            usedCredits: faker.number.int({ min: 0, max: 20 }),
            packageExpiry: faker.date.future({ years: 1 }),
            skillsProgress: generateSkillsProgress(),
            weatherPreferences: generateWeatherPreferences()
          }
        }
      },
      include: { student: true }
    });
    
    users.students.push(user);
    users.totalCount++;
  }

  return users;
}

module.exports = { seedUsers };