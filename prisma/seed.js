const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.booking.deleteMany()
  await prisma.instructorSchedule.deleteMany()
  await prisma.user.deleteMany()

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@driving-school.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin:', admin.email)

  // Create instructors
  const instructorPassword = await bcrypt.hash('instructor123', 10)
  const instructors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.instructor@driving-school.com',
        passwordHash: instructorPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'INSTRUCTOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.instructor@driving-school.com',
        passwordHash: instructorPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'INSTRUCTOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.instructor@driving-school.com',
        passwordHash: instructorPassword,
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'INSTRUCTOR',
      },
    }),
  ])
  console.log('✅ Created', instructors.length, 'instructors')

  // Create instructor schedules (Monday to Friday, 9-17)
  for (const instructor of instructors) {
    for (let day = 1; day <= 5; day++) {
      await prisma.instructorSchedule.create({
        data: {
          instructorId: instructor.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        },
      })
    }
  }
  console.log('✅ Created instructor schedules')

  // Create students
  const studentPassword = await bcrypt.hash('student123', 10)
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice.student@example.com',
        passwordHash: studentPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.student@example.com',
        passwordHash: studentPassword,
        firstName: 'Bob',
        lastName: 'Williams',
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie.student@example.com',
        passwordHash: studentPassword,
        firstName: 'Charlie',
        lastName: 'Brown',
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana.student@example.com',
        passwordHash: studentPassword,
        firstName: 'Diana',
        lastName: 'Davis',
        role: 'STUDENT',
      },
    }),
  ])
  console.log('✅ Created', students.length, 'students')

  // Create sample bookings
  const now = new Date()
  const bookingsData = [
    // Today's bookings
    {
      studentId: students[0].id,
      instructorId: instructors[0].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      status: 'CONFIRMED',
      notes: 'Parallel parking practice',
    },
    {
      studentId: students[1].id,
      instructorId: instructors[0].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      status: 'CONFIRMED',
      notes: 'Highway driving',
    },
    // Tomorrow's bookings
    {
      studentId: students[2].id,
      instructorId: instructors[1].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
      status: 'CONFIRMED',
      notes: 'First lesson',
    },
    {
      studentId: students[0].id,
      instructorId: instructors[1].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
      status: 'CONFIRMED',
      notes: 'City driving',
    },
    // Future bookings
    {
      studentId: students[3].id,
      instructorId: instructors[2].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 13, 0),
      status: 'CONFIRMED',
      notes: 'Pre-test practice',
    },
    // Past bookings
    {
      studentId: students[0].id,
      instructorId: instructors[0].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 10, 0),
      status: 'COMPLETED',
      notes: 'Basic maneuvers',
    },
    {
      studentId: students[1].id,
      instructorId: instructors[1].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 14, 0),
      status: 'COMPLETED',
      notes: 'Traffic rules',
    },
    // Cancelled booking
    {
      studentId: students[2].id,
      instructorId: instructors[2].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 0),
      status: 'CANCELLED',
      notes: 'Student was sick',
    },
  ]

  for (const booking of bookingsData) {
    await prisma.booking.create({
      data: {
        ...booking,
        endTime: new Date(booking.startTime.getTime() + 2 * 60 * 60 * 1000), // +2 hours
      },
    })
  }
  console.log('✅ Created', bookingsData.length, 'sample bookings')

  console.log('\n📋 Test credentials:')
  console.log('================================')
  console.log('Admin:      admin@driving-school.com / admin123')
  console.log('Instructor: john.instructor@driving-school.com / instructor123')
  console.log('Student:    alice.student@example.com / student123')
  console.log('================================')
  console.log('\n✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })