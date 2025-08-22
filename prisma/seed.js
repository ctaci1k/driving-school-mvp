// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Test123!', 10)

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true
    }
  })

  // Instructor 1
  await prisma.user.upsert({
    where: { email: 'instructor1@test.com' },
    update: {},
    create: {
      email: 'instructor1@test.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Instructor',
      role: 'INSTRUCTOR',
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true
    }
  })

  // Instructor 2
  await prisma.user.upsert({
    where: { email: 'instructor2@test.com' },
    update: {},
    create: {
      email: 'instructor2@test.com',
      passwordHash: hashedPassword,
      firstName: 'Mary',
      lastName: 'Teacher',
      role: 'INSTRUCTOR',
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true
    }
  })

  // Student 1
  await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      passwordHash: hashedPassword,
      firstName: 'Tom',
      lastName: 'Student',
      role: 'STUDENT',
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true
    }
  })

  // Student 2
  await prisma.user.upsert({
    where: { email: 'student2@test.com' },
    update: {},
    create: {
      email: 'student2@test.com',
      passwordHash: hashedPassword,
      firstName: 'Anna',
      lastName: 'Learner',
      role: 'STUDENT',
      language: 'pl',
      emailNotifications: true,
      smsNotifications: true
    }
  })

  console.log('✅ Всі користувачі створені!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())