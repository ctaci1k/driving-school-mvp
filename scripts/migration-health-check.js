// scripts/migration-health-check.js
// Enterprise-grade migration health check script

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Test results tracking
const results = {
  passed: [],
  failed: [],
  warnings: []
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('')
  log('=' .repeat(60), 'blue')
  log(title, 'cyan')
  log('=' .repeat(60), 'blue')
}

async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    results.passed.push('Database connection')
    log('✅ Database connection successful', 'green')
    return true
  } catch (error) {
    results.failed.push('Database connection')
    log(`❌ Database connection failed: ${error.message}`, 'red')
    return false
  }
}

async function testEnums() {
  logSection('TESTING ENUMS')
  
  const enumTests = [
    { table: 'Booking', column: 'lessonType', expectedType: 'LessonType' },
    { table: 'Booking', column: 'status', expectedType: 'BookingStatus' },
    { table: 'Vehicle', column: 'category', expectedType: 'VehicleCategory' },
    { table: 'Vehicle', column: 'transmission', expectedType: 'Transmission' },
    { table: 'Vehicle', column: 'fuelType', expectedType: 'FuelType' },
    { table: 'Vehicle', column: 'status', expectedType: 'VehicleStatus' },
    { table: 'Payment', column: 'status', expectedType: 'PaymentStatus' },
    { table: 'Payment', column: 'method', expectedType: 'PaymentMethod' },
    { table: 'User', column: 'role', expectedType: 'UserRole' },
    { table: 'User', column: 'status', expectedType: 'UserStatus' },
  ]
  
  for (const test of enumTests) {
    try {
      const result = await prisma.$queryRaw`
        SELECT data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = ${test.table}
        AND column_name = ${test.column}
      `
      
      if (result.length > 0 && result[0].data_type === 'USER-DEFINED') {
        results.passed.push(`${test.table}.${test.column} enum`)
        log(`  ✅ ${test.table}.${test.column}: ${result[0].udt_name}`, 'green')
      } else {
        results.failed.push(`${test.table}.${test.column} enum`)
        log(`  ❌ ${test.table}.${test.column}: Not an enum`, 'red')
      }
    } catch (error) {
      results.failed.push(`${test.table}.${test.column} enum`)
      log(`  ❌ ${test.table}.${test.column}: ${error.message}`, 'red')
    }
  }
}

async function testTables() {
  logSection('TESTING TABLES')
  
  const requiredTables = [
    'User', 'Location', 'Vehicle', 'Package', 'UserPackage',
    'Payment', 'Booking', 'InstructorSchedule', 'Notification',
    'MaintenanceLog', 'ScheduleTemplate', 'ScheduleException'
  ]
  
  for (const table of requiredTables) {
    try {
      const count = await prisma[table.charAt(0).toLowerCase() + table.slice(1)].count()
      results.passed.push(`Table ${table}`)
      log(`  ✅ ${table}: ${count} records`, 'green')
    } catch (error) {
      results.failed.push(`Table ${table}`)
      log(`  ❌ ${table}: ${error.message}`, 'red')
    }
  }
}

async function testRelations() {
  logSection('TESTING RELATIONS')
  
  try {
    // Test Booking relations
    const booking = await prisma.booking.findFirst({
      include: {
        student: true,
        instructor: true,
        vehicle: true,
        location: true,
        payment: true
      }
    })
    
    if (booking) {
      results.passed.push('Booking relations')
      log('  ✅ Booking relations working', 'green')
    } else {
      results.warnings.push('No bookings to test relations')
      log('  ⚠️  No bookings found for relation test', 'yellow')
    }
    
    // Test Vehicle relations
    const vehicle = await prisma.vehicle.findFirst({
      include: {
        assignedInstructor: true,
        baseLocation: true,
        bookings: true,
        maintenanceLogs: true
      }
    })
    
    if (vehicle) {
      results.passed.push('Vehicle relations')
      log('  ✅ Vehicle relations working', 'green')
    } else {
      results.warnings.push('No vehicles to test relations')
      log('  ⚠️  No vehicles found for relation test', 'yellow')
    }
    
    // Test Payment relations
    const payment = await prisma.payment.findFirst({
      include: {
        user: true,
        booking: true,
        userPackage: true
      }
    })
    
    if (payment) {
      results.passed.push('Payment relations')
      log('  ✅ Payment relations working', 'green')
    } else {
      results.warnings.push('No payments to test relations')
      log('  ⚠️  No payments found for relation test', 'yellow')
    }
    
  } catch (error) {
    results.failed.push('Relations test')
    log(`  ❌ Relations test failed: ${error.message}`, 'red')
  }
}

async function testCriticalQueries() {
  logSection('TESTING CRITICAL QUERIES')
  
  const queries = [
    {
      name: 'Find active instructors',
      test: async () => {
        const instructors = await prisma.user.findMany({
          where: {
            role: 'instructor',
            status: 'ACTIVE'
          }
        })
        return instructors.length
      }
    },
    {
      name: 'Find available vehicles',
      test: async () => {
        const vehicles = await prisma.vehicle.findMany({
          where: {
            status: 'ACTIVE'
          }
        })
        return vehicles.length
      }
    },
    {
      name: 'Find upcoming bookings',
      test: async () => {
        const bookings = await prisma.booking.findMany({
          where: {
            startTime: {
              gte: new Date()
            },
            status: 'CONFIRMED'
          }
        })
        return bookings.length
      }
    },
    {
      name: 'Find active packages',
      test: async () => {
        const packages = await prisma.package.findMany({
          where: {
            isActive: true
          }
        })
        return packages.length
      }
    }
  ]
  
  for (const query of queries) {
    try {
      const result = await query.test()
      results.passed.push(query.name)
      log(`  ✅ ${query.name}: ${result} found`, 'green')
    } catch (error) {
      results.failed.push(query.name)
      log(`  ❌ ${query.name}: ${error.message}`, 'red')
    }
  }
}

async function testDataIntegrity() {
  logSection('TESTING DATA INTEGRITY')
  
  try {
    // Check for orphaned records
    const orphanedBookings = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Booking" b
      LEFT JOIN "User" s ON b."studentId" = s.id
      LEFT JOIN "User" i ON b."instructorId" = i.id
      WHERE s.id IS NULL OR i.id IS NULL
    `
    
    if (orphanedBookings[0].count === '0') {
      results.passed.push('No orphaned bookings')
      log('  ✅ No orphaned bookings found', 'green')
    } else {
      results.warnings.push(`${orphanedBookings[0].count} orphaned bookings`)
      log(`  ⚠️  Found ${orphanedBookings[0].count} orphaned bookings`, 'yellow')
    }
    
    // Check for invalid enum values
    const invalidStatuses = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Booking"
      WHERE status NOT IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED')
    `
    
    if (invalidStatuses[0].count === '0') {
      results.passed.push('All booking statuses valid')
      log('  ✅ All booking statuses are valid', 'green')
    } else {
      results.failed.push(`${invalidStatuses[0].count} invalid booking statuses`)
      log(`  ❌ Found ${invalidStatuses[0].count} invalid booking statuses`, 'red')
    }
    
  } catch (error) {
    results.failed.push('Data integrity check')
    log(`  ❌ Data integrity check failed: ${error.message}`, 'red')
  }
}

async function generateReport() {
  logSection('MIGRATION HEALTH CHECK REPORT')
  
  const totalTests = results.passed.length + results.failed.length
  const passRate = totalTests > 0 ? (results.passed.length / totalTests * 100).toFixed(1) : 0
  
  log(`\nTest Results:`, 'bright')
  log(`  ✅ Passed: ${results.passed.length}`, 'green')
  log(`  ❌ Failed: ${results.failed.length}`, 'red')
  log(`  ⚠️  Warnings: ${results.warnings.length}`, 'yellow')
  log(`  📊 Pass Rate: ${passRate}%`, 'cyan')
  
  if (results.failed.length > 0) {
    log(`\nFailed Tests:`, 'red')
    results.failed.forEach(test => {
      log(`  • ${test}`, 'red')
    })
  }
  
  if (results.warnings.length > 0) {
    log(`\nWarnings:`, 'yellow')
    results.warnings.forEach(warning => {
      log(`  • ${warning}`, 'yellow')
    })
  }
  
  // Overall status
  log('\n' + '=' .repeat(60), 'blue')
  if (results.failed.length === 0) {
    log('✅ MIGRATION HEALTH CHECK: PASSED', 'green')
    log('All critical systems operational', 'green')
  } else if (results.failed.length <= 2) {
    log('⚠️  MIGRATION HEALTH CHECK: PASSED WITH WARNINGS', 'yellow')
    log('Minor issues detected, manual review recommended', 'yellow')
  } else {
    log('❌ MIGRATION HEALTH CHECK: FAILED', 'red')
    log('Critical issues detected, immediate action required', 'red')
  }
  log('=' .repeat(60), 'blue')
  
  // Exit code
  process.exit(results.failed.length > 2 ? 1 : 0)
}

async function main() {
  log('\n🏥 DRIVING SCHOOL MIGRATION HEALTH CHECK', 'magenta')
  log('Version 1.0.0', 'magenta')
  log('=' .repeat(60), 'blue')
  
  try {
    // Run all tests
    const connected = await testDatabaseConnection()
    
    if (!connected) {
      log('\n❌ Cannot proceed without database connection', 'red')
      process.exit(1)
    }
    
    await testTables()
    await testEnums()
    await testRelations()
    await testCriticalQueries()
    await testDataIntegrity()
    
    // Generate report
    await generateReport()
    
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run health check
main().catch(console.error)