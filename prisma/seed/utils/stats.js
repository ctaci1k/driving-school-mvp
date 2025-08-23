// prisma/seed/utils/stats.js - GENERATOR STATYSTYK
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

async function generateStats(prisma, logger) {
  logger.title('📈 DATABASE STATISTICS REPORT')
  
  try {
    // Users Statistics
    const userStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })
    
    const totalUsers = await prisma.user.count()
    
    logger.section('USERS')
    logger.info(`Total users: ${colors.bright}${totalUsers}${colors.reset}`)
    userStats.forEach(stat => {
      const emoji = 
        stat.role === 'ADMIN' ? '👨‍💼' :
        stat.role === 'INSTRUCTOR' ? '👨‍🏫' :
        stat.role === 'STUDENT' ? '👨‍🎓' :
        stat.role === 'BRANCH_MANAGER' ? '🏢' :
        '👤'
      logger.info(`${emoji} ${stat.role}: ${stat._count}`)
    })
    
    // Vehicles Statistics
    const vehicleStats = await prisma.vehicle.aggregate({
      _count: true,
      where: { status: 'ACTIVE' }
    })
    
    const vehicleCategories = await prisma.vehicle.groupBy({
      by: ['category'],
      _count: true
    })
    
    logger.section('VEHICLES')
    logger.info(`Total vehicles: ${colors.bright}${vehicleStats._count}${colors.reset}`)
    vehicleCategories.forEach(stat => {
      const emoji = stat.category === 'B_AUTOMATIC' ? '🚗' : '🚙'
      logger.info(`${emoji} ${stat.category}: ${stat._count}`)
    })
    
    // Bookings Statistics
    const bookingStats = await prisma.booking.aggregate({
      _count: true,
      _sum: { price: true }
    })
    
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: true,
      _sum: { price: true }
    })
    
    logger.section('BOOKINGS')
    logger.info(`Total bookings: ${colors.bright}${bookingStats._count}${colors.reset}`)
    logger.info(`Total value: ${colors.green}${bookingStats._sum.price || 0} PLN${colors.reset}`)
    
    bookingsByStatus.forEach(stat => {
      const emoji = 
        stat.status === 'COMPLETED' ? '✅' :
        stat.status === 'CONFIRMED' ? '📅' :
        stat.status === 'CANCELLED' ? '❌' :
        stat.status === 'IN_PROGRESS' ? '🚗' :
        '📝'
      logger.info(`${emoji} ${stat.status}: ${stat._count} (${stat._sum.price || 0} PLN)`)
    })
    
    // Payments Statistics
    const paymentStats = await prisma.payment.aggregate({
      where: { 
        status: 'COMPLETED',
        amount: { gt: 0 }
      },
      _count: true,
      _sum: { amount: true }
    })
    
    const refundStats = await prisma.payment.aggregate({
      where: { 
        status: 'COMPLETED',
        amount: { lt: 0 }
      },
      _sum: { amount: true }
    })
    
    logger.section('PAYMENTS')
    logger.info(`Successful payments: ${colors.bright}${paymentStats._count}${colors.reset}`)
    logger.info(`Total revenue: ${colors.green}${paymentStats._sum.amount || 0} PLN${colors.reset}`)
    logger.info(`Total refunds: ${colors.red}${Math.abs(refundStats._sum.amount || 0)} PLN${colors.reset}`)
    logger.info(`Net revenue: ${colors.bright}${colors.green}${(paymentStats._sum.amount || 0) + (refundStats._sum.amount || 0)} PLN${colors.reset}`)
    
    // Packages Statistics
    const packageStats = await prisma.package.count({ where: { isActive: true } })
    
    const userPackageStats = await prisma.userPackage.aggregate({
      where: { status: 'ACTIVE' },
      _count: true,
      _sum: { 
        creditsTotal: true,
        creditsUsed: true,
        creditsRemaining: true
      }
    })
    
    logger.section('PACKAGES')
    logger.info(`Active packages: ${colors.bright}${packageStats}${colors.reset}`)
    logger.info(`Active user packages: ${colors.bright}${userPackageStats._count}${colors.reset}`)
    logger.info(`Total credits sold: ${userPackageStats._sum.creditsTotal || 0}`)
    logger.info(`Credits used: ${userPackageStats._sum.creditsUsed || 0}`)
    logger.info(`Credits remaining: ${colors.yellow}${userPackageStats._sum.creditsRemaining || 0}${colors.reset}`)
    
    // Notifications Statistics
    const notificationStats = await prisma.notification.aggregate({
      _count: true
    })
    
    const unreadNotifications = await prisma.notification.count({
      where: { readAt: null }
    })
    
    logger.section('NOTIFICATIONS')
    logger.info(`Total notifications: ${colors.bright}${notificationStats._count}${colors.reset}`)
    logger.info(`Unread: ${colors.yellow}${unreadNotifications}${colors.reset}`)
    logger.info(`Read rate: ${colors.green}${Math.round(((notificationStats._count - unreadNotifications) / notificationStats._count) * 100)}%${colors.reset}`)
    
    // Top Performers
    const topInstructors = await prisma.booking.groupBy({
      by: ['instructorId'],
      where: { status: 'COMPLETED' },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { instructorId: 'desc' } },
      take: 3
    })
    
    logger.section('TOP PERFORMERS')
    logger.info('Top Instructors by bookings:')
    
    for (const instructor of topInstructors) {
      const user = await prisma.user.findUnique({
        where: { id: instructor.instructorId },
        select: { firstName: true, lastName: true }
      })
      if (user) {
        logger.info(`  🏆 ${user.firstName} ${user.lastName}: ${instructor._count} lessons, ${instructor._sum.price || 0} PLN`)
      }
    }
    
    // System Health
    logger.section('SYSTEM HEALTH')
    
    const now = new Date()
    const upcomingBookings = await prisma.booking.count({
      where: {
        startTime: { gte: now },
        status: 'CONFIRMED'
      }
    })
    
    const pendingPayments = await prisma.payment.count({
      where: { status: 'PENDING' }
    })
    
    const expiringSoonPackages = await prisma.userPackage.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        creditsRemaining: { gt: 0 }
      }
    })
    
    logger.info(`Upcoming bookings: ${colors.cyan}${upcomingBookings}${colors.reset}`)
    logger.info(`Pending payments: ${pendingPayments > 0 ? colors.yellow : colors.green}${pendingPayments}${colors.reset}`)
    logger.info(`Packages expiring soon: ${expiringSoonPackages > 0 ? colors.yellow : colors.green}${expiringSoonPackages}${colors.reset}`)
    
    // Data Quality
    logger.section('DATA QUALITY')
    
    const bookingsWithoutVehicle = await prisma.booking.count({
      where: { 
        vehicleId: null,
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      }
    })
    
    const bookingsWithoutPayment = await prisma.booking.count({
      where: {
        isPaid: false,
        status: 'COMPLETED',
        usedCredits: 0
      }
    })
    
    const orphanedPayments = await prisma.payment.count({
      where: {
        bookingId: null,
        userPackageId: null
      }
    })
    
    logger.info(`Bookings without vehicle: ${bookingsWithoutVehicle > 0 ? colors.yellow : colors.green}${bookingsWithoutVehicle}${colors.reset}`)
    logger.info(`Unpaid completed bookings: ${bookingsWithoutPayment > 0 ? colors.yellow : colors.green}${bookingsWithoutPayment}${colors.reset}`)
    logger.info(`Orphaned payments: ${orphanedPayments > 0 ? colors.red : colors.green}${orphanedPayments}${colors.reset}`)
    
    // Summary
    logger.title('✨ SEED COMPLETE')
    logger.success(`Database is ready for testing with ${colors.bright}${totalUsers}${colors.reset} users and ${colors.bright}${bookingStats._count}${colors.reset} bookings!`)
    
  } catch (error) {
    logger.error('Failed to generate statistics:', error.message)
  }
}

module.exports = { generateStats }