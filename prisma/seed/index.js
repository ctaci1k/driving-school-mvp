const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const seedUsers = require('./users')
const seedLocations = require('./locations')
const seedVehicles = require('./vehicles')
const seedSchedules = require('./schedules')
const seedBookings = require('./bookings')

async function main() {
  const args = process.argv.slice(2)
  
  console.log('🌱 Starting seed...')
  
  try {
    if (args.includes('--all') || args.length === 0) {
      // Seed everything
      await seedUsers(prisma)
      await seedLocations(prisma)
      await seedVehicles(prisma)
      await seedSchedules(prisma)
      await seedBookings(prisma)
    } else {
      // Seed specific parts
      if (args.includes('--users')) await seedUsers(prisma)
      if (args.includes('--schedules')) await seedSchedules(prisma)
      if (args.includes('--demo')) {
        await seedUsers(prisma)
        await seedSchedules(prisma)
        await seedBookings(prisma)
      }
    }
    
    console.log('✅ Seed completed!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })