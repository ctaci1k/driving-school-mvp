// prisma\seedSchedules.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Отримуємо всіх інструкторів
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' }
  })

  if (instructors.length === 0) {
    console.log('Немає інструкторів! Спочатку створіть інструкторів.')
    return
  }

  // Для кожного інструктора створюємо розклад
  for (const instructor of instructors) {
    console.log(`Створюємо розклад для ${instructor.firstName} ${instructor.lastName}`)
    
    // Видаляємо старий розклад
    await prisma.instructorSchedule.deleteMany({
      where: { instructorId: instructor.id }
    })
    
    // Створюємо новий розклад (Пн-Пт)
    const schedules = [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' }, // Понеділок
      { dayOfWeek: 2, startTime: '09:00', endTime: '19:00' }, // Вівторок
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00' }, // Середа
      { dayOfWeek: 4, startTime: '10:00', endTime: '20:00' }, // Четвер
      { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' }, // П'ятниця
      { dayOfWeek: 6, startTime: '09:00', endTime: '14:00' }, // Субота
    ]
    
    await prisma.instructorSchedule.createMany({
      data: schedules.map(s => ({
        instructorId: instructor.id,
        ...s,
        isAvailable: true
      }))
    })
  }
  
  console.log('Розклади створено!')
  
  // Додаємо кілька тестових бронювань
  const student = await prisma.user.findFirst({
    where: { role: 'STUDENT' }
  })
  
  if (student && instructors[0]) {
    // Створюємо кілька бронювань на поточний тиждень
    const today = new Date()
    const bookings = []
    
    // Додаємо 5 тестових бронювань
    for (let i = 0; i < 5; i++) {
      const bookingDate = new Date(today)
      bookingDate.setDate(today.getDate() + i)
      bookingDate.setHours(10 + (i * 2), 0, 0, 0)
      
      const endTime = new Date(bookingDate)
      endTime.setHours(bookingDate.getHours() + 2)
      
      bookings.push({
        studentId: student.id,
        instructorId: instructors[0].id,
        startTime: bookingDate,
        endTime: endTime,
        status: 'CONFIRMED'
      })
    }
    
    await prisma.booking.createMany({
      data: bookings,
      skipDuplicates: true
    })
    
    console.log('Тестові бронювання створено!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })