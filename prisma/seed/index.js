// prisma/seed/index.js - ГОЛОВНИЙ ФАЙЛ SEED СИСТЕМИ
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Import all seed modules
const seedUsers = require('./data/users')
const seedLocations = require('./data/locations')
const seedVehicles = require('./data/vehicles')
const seedPackages = require('./data/packages')
const seedSchedules = require('./data/schedules')
const seedUserPackages = require('./data/userPackages')
const seedBookings = require('./data/bookings')
const seedPayments = require('./data/payments')
const seedNotifications = require('./data/notifications')
const seedScheduleExceptions = require('./data/scheduleExceptions')
const seedMaintenanceLogs = require('./data/maintenanceLogs')
const { logger } = require('./utils/logger')
const { generateStats } = require('./utils/stats')

async function main() {
  const args = process.argv.slice(2)
  const startTime = Date.now()
  
  logger.title('🌱 PROFESSIONAL SEED DATABASE SYSTEM')
  logger.info('Phase 2: Enhanced MVP Data Generation')
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'local'}`)
  
  try {
    // Check for --fresh flag (повне очищення)
    if (args.includes('--fresh')) {
      logger.warn('🗑️  Full database reset requested...')
      await clearDatabase()
    }
    
    // Check for --minimal flag (мінімальний набір)
    if (args.includes('--minimal')) {
      logger.info('Creating minimal dataset...')
      await seedMinimal()
    }
    // Check for --only flag (тільки конкретний модуль)
    else if (args.includes('--only')) {
      const onlyIndex = args.indexOf('--only')
      const module = args[onlyIndex + 1]
      if (module) {
        logger.info(`Seeding only: ${module}`)
        await seedSpecific(module)
      } else {
        logger.error('Please specify module name after --only')
        showAvailableModules()
      }
    }
    // Default - повний seed
    else {
      logger.info('Creating full professional dataset...')
      await seedAll()
    }
    
    // Generate statistics
    if (!args.includes('--no-stats')) {
      await generateStats(prisma, logger)
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    logger.success(`✅ Database seeded successfully in ${duration} seconds!`)
    
  } catch (error) {
    logger.error('❌ Seeding failed:', error.message)
    logger.error('Stack:', error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function clearDatabase() {
  const tables = [
    'notification',
    'payment',
    'booking',
    'userPackage',
    'scheduleException',
    'scheduleTemplate',
    'instructorSchedule',
    'maintenanceLog',
    'vehicle',
    'package',
    'location',
    'user'
  ]
  
  for (const table of tables) {
    try {
      await prisma[table].deleteMany()
      logger.info(`Cleared table: ${table}`)
    } catch (error) {
      logger.warn(`Could not clear ${table}: ${error.message}`)
    }
  }
  
  logger.success('Database cleared successfully')
}

async function seedMinimal() {
  // Мінімальний набір для швидкого тестування
  logger.section('Minimal Dataset')
  
  await seedUsers(prisma, logger, { minimal: true })
  await seedLocations(prisma, logger, { minimal: true })
  await seedVehicles(prisma, logger, { minimal: true })
  await seedPackages(prisma, logger, { minimal: true })
  await seedSchedules(prisma, logger, { minimal: true })
  await seedBookings(prisma, logger, { minimal: true })
}

async function seedAll() {
  // ПОВНИЙ ПРОФЕСІЙНИЙ НАБІР ДАНИХ
  
  // 1. БАЗОВІ СУТНОСТІ
  logger.section('1. LOCATIONS & BRANCHES')
  await seedLocations(prisma, logger)

  logger.section('2. USERS & AUTHENTICATION')
  await seedUsers(prisma, logger)
    
  // 2. ТРАНСПОРТ
  logger.section('3. VEHICLES & FLEET')
  await seedVehicles(prisma, logger)
  
  // 3. ПАКЕТИ ТА ТАРИФИ
  logger.section('4. PACKAGES & PRICING')
  await seedPackages(prisma, logger)
  
  // 4. РОЗКЛАДИ
  logger.section('5. INSTRUCTOR SCHEDULES')
  await seedSchedules(prisma, logger)
  
  logger.section('6. SCHEDULE EXCEPTIONS')
  await seedScheduleExceptions(prisma, logger)
  
  // 5. КОРИСТУВАЦЬКІ ПАКЕТИ
  logger.section('7. USER PACKAGES & CREDITS')
  await seedUserPackages(prisma, logger)
  
  // 6. БРОНЮВАННЯ
  logger.section('8. BOOKINGS & LESSONS')
  await seedBookings(prisma, logger)
  
  // 7. ПЛАТЕЖІ
  logger.section('9. PAYMENTS & TRANSACTIONS')
  await seedPayments(prisma, logger)
  
  // 8. СПОВІЩЕННЯ
  logger.section('10. NOTIFICATIONS')
  await seedNotifications(prisma, logger)
  
  // 9. ТЕХНІЧНЕ ОБСЛУГОВУВАННЯ
  logger.section('11. VEHICLE MAINTENANCE')
  await seedMaintenanceLogs(prisma, logger)
}

async function seedSpecific(module) {
  const seedMap = {
    users: seedUsers,
    locations: seedLocations,
    vehicles: seedVehicles,
    packages: seedPackages,
    schedules: seedSchedules,
    exceptions: seedScheduleExceptions,
    userPackages: seedUserPackages,
    bookings: seedBookings,
    payments: seedPayments,
    notifications: seedNotifications,
    maintenance: seedMaintenanceLogs,
  }
  
  if (seedMap[module]) {
    await seedMap[module](prisma, logger)
  } else {
    logger.error(`Unknown seed module: ${module}`)
    showAvailableModules()
  }
}

function showAvailableModules() {
  logger.info('\nAvailable modules:')
  logger.info('  users         - Users and authentication')
  logger.info('  locations     - Branches and locations')
  logger.info('  vehicles      - Vehicle fleet')
  logger.info('  packages      - Lesson packages')
  logger.info('  schedules     - Instructor schedules')
  logger.info('  exceptions    - Schedule exceptions')
  logger.info('  userPackages  - Purchased packages')
  logger.info('  bookings      - Lesson bookings')
  logger.info('  payments      - Payment records')
  logger.info('  notifications - System notifications')
  logger.info('  maintenance   - Vehicle maintenance logs')
  logger.info('\nUsage examples:')
  logger.info('  npm run db:seed                  # Full seed')
  logger.info('  npm run db:seed -- --fresh       # Clear and seed')
  logger.info('  npm run db:seed -- --minimal     # Minimal dataset')
  logger.info('  npm run db:seed -- --only users  # Only users')
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { main, clearDatabase }