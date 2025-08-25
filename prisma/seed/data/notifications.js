// prisma/seed/data/notifications.js - SYSTEM POWIADOMIEŃ
const { faker } = require('@faker-js/faker')
const { subDays, subHours, addHours } = require('date-fns')

const notificationTemplates = {
  SYSTEM_NOTIFICATION: {
    title: 'Potwierdzenie rezerwacji',
    template: 'Twoja jazda z instruktorem {instructorName} została potwierdzona na {date} o godzinie {time}.',
    priority: 'MEDIUM',
    channels: ['EMAIL', 'SMS', 'PUSH']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Przypomnienie o jeździe',
    template: 'Przypominamy o jutrzejszej jeździe o godzinie {time}. Instruktor: {instructorName}, miejsce: {location}.',
    priority: 'HIGH',
    channels: ['SMS', 'PUSH']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Anulowanie jazdy',
    template: 'Twoja jazda zaplanowana na {date} została anulowana. Powód: {reason}. Prosimy o kontakt w celu ustalenia nowego terminu.',
    priority: 'HIGH',
    channels: ['EMAIL', 'SMS', 'PUSH']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Płatność potwierdzona',
    template: 'Otrzymaliśmy Twoją płatność w wysokości {amount} PLN. Dziękujemy!',
    priority: 'MEDIUM',
    channels: ['EMAIL']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Problem z płatnością',
    template: 'Nie udało się przetworzyć płatności. Prosimy spróbować ponownie lub skontaktować się z nami.',
    priority: 'HIGH',
    channels: ['EMAIL', 'SMS']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Pakiet wkrótce wygasa',
    template: 'Twój pakiet "{packageName}" wygasa za {days} dni. Pozostało {credits} godzin do wykorzystania.',
    priority: 'MEDIUM',
    channels: ['EMAIL', 'PUSH']
  },
  INSTRUCTOR_MESSAGE: {
    title: 'Wiadomość od instruktora',
    template: '{instructorName} przesłał Ci wiadomość: "{message}"',
    priority: 'MEDIUM',
    channels: ['PUSH', 'EMAIL']
  },
  EXAM_PREPARATION: {
    title: 'Przygotowanie do egzaminu',
    template: 'Twój egzamin odbędzie się {date}. Zalecamy dodatkową jazdę treningową. Powodzenia!',
    priority: 'HIGH',
    channels: ['EMAIL', 'SMS']
  },
  SYSTEM_NOTIFICATION: {
    title: 'Wszystkiego najlepszego!',
    template: 'Z okazji urodzin życzymy Ci samych udanych jazd i szybkiego zdania egzaminu! Specjalny rabat 10% czeka w panelu.',
    priority: 'LOW',
    channels: ['EMAIL']
  },
  SYSTEM_MAINTENANCE: {
    title: 'Przerwa techniczna',
    template: 'W dniu {date} między {startTime} a {endTime} system będzie niedostępny z powodu prac konserwacyjnych.',
    priority: 'MEDIUM',
    channels: ['EMAIL']
  }
}

async function seedNotifications(prisma, logger, options = {}) {
  const isMinimal = options.minimal || false
  
  // Pobierz użytkowników i rezerwacje
  const users = await prisma.user.findMany({
    select: { 
      id: true, 
      role: true, 
      firstName: true, 
      lastName: true,
      email: true,
      phone: true
    }
  })
  
  const bookings = await prisma.booking.findMany({
    include: {
      student: true,
      instructor: true,
      location: true
    },
    take: isMinimal ? 20 : 100
  })
  
  const payments = await prisma.payment.findMany({
    include: {
      user: true
    },
    take: isMinimal ? 10 : 50
  })
  
  const userPackages = await prisma.userPackage.findMany({
    where: { status: 'ACTIVE' },
    include: {
      user: true,
      package: true
    },
    take: isMinimal ? 10 : 30
  })
  
  const notifications = []
  
  // 1. POWIADOMIENIA O REZERWACJACH
  for (const booking of bookings) {
    // Potwierdzenie rezerwacji
    if (booking.status === 'CONFIRMED') {
      notifications.push({
        userId: booking.studentId,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template
          .replace('{instructorName}', `${booking.instructor.firstName} ${booking.instructor.lastName}`)
          .replace('{date}', booking.startTime.toLocaleDateString('pl-PL'))
          .replace('{time}', booking.startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })),
        priority: 'MEDIUM',
        channel: faker.helpers.arrayElement(['EMAIL', 'SMS', 'PUSH']),
        status: 'SENT',
        sentAt: subHours(booking.startTime, 24),
        readAt: faker.datatype.boolean({ probability: 0.7 }) ? subHours(booking.startTime, 20) : null,
        metadata: {
          bookingId: booking.id,
          template: 'SYSTEM_NOTIFICATION',
          instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
          location: booking.location?.name
        }
      })
      
      // Przypomnienie (24h przed)
      if (booking.startTime > subDays(new Date(), 7)) {
        notifications.push({
          userId: booking.studentId,
          type: 'SYSTEM_NOTIFICATION',
          title: notificationTemplates.SYSTEM_NOTIFICATION.title,
          message: notificationTemplates.SYSTEM_NOTIFICATION.template
            .replace('{time}', booking.startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }))
            .replace('{instructorName}', `${booking.instructor.firstName} ${booking.instructor.lastName}`)
            .replace('{location}', booking.location?.name || 'Biuro główne'),
          priority: 'HIGH',
          channel: 'SMS',
          status: booking.startTime < new Date() ? 'SENT' : 'SCHEDULED',
          scheduledFor: subHours(booking.startTime, 24),
          sentAt: booking.startTime < new Date() ? subHours(booking.startTime, 24) : null,
          metadata: {
            bookingId: booking.id,
            template: 'SYSTEM_NOTIFICATION'
          }
        })
      }
    }
    
    // Anulowanie
    if (booking.status === 'CANCELLED') {
      notifications.push({
        userId: booking.studentId,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template
          .replace('{date}', booking.startTime.toLocaleDateString('pl-PL'))
          .replace('{reason}', booking.cancellationReason || 'Nieoczekiwane okoliczności'),
        priority: 'HIGH',
        channel: 'EMAIL',
        status: 'SENT',
        sentAt: booking.updatedAt || subDays(booking.startTime, 1),
        readAt: faker.datatype.boolean({ probability: 0.8 }) ? addHours(booking.updatedAt || subDays(booking.startTime, 1), 2) : null,
        metadata: {
          bookingId: booking.id,
          template: 'SYSTEM_NOTIFICATION',
          reason: booking.cancellationReason
        }
      })
    }
  }
  
  // 2. POWIADOMIENIA O PŁATNOŚCIACH
  for (const payment of payments) {
    if (!payment.user) continue
    
    if (payment.status === 'COMPLETED' && payment.amount > 0) {
      notifications.push({
        userId: payment.userId,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template
          .replace('{amount}', payment.amount.toString()),
        priority: 'MEDIUM',
        channel: 'EMAIL',
        status: 'SENT',
        sentAt: payment.completedAt || payment.createdAt,
        readAt: faker.datatype.boolean({ probability: 0.9 }) ? addHours(payment.completedAt || payment.createdAt, 1) : null,
        metadata: {
          paymentId: payment.id,
          template: 'SYSTEM_NOTIFICATION',
          amount: payment.amount,
          method: payment.method
        }
      })
    }
    
    if (payment.status === 'FAILED') {
      notifications.push({
        userId: payment.userId,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template,
        priority: 'HIGH',
        channel: faker.helpers.arrayElement(['EMAIL', 'SMS']),
        status: 'SENT',
        sentAt: payment.failedAt || payment.createdAt,
        readAt: faker.datatype.boolean({ probability: 0.6 }) ? addHours(payment.failedAt || payment.createdAt, 0.5) : null,
        metadata: {
          paymentId: payment.id,
          template: 'SYSTEM_NOTIFICATION',
          failureReason: payment.failureReason
        }
      })
    }
  }
  
  // 3. POWIADOMIENIA O PAKIETACH
  for (const userPackage of userPackages) {
    if (!userPackage.user || !userPackage.package) continue
    
    const daysUntilExpiry = Math.floor((userPackage.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0 && userPackage.creditsRemaining > 0) {
      notifications.push({
        userId: userPackage.userId,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template
          .replace('{packageName}', userPackage.package.name)
          .replace('{days}', daysUntilExpiry.toString())
          .replace('{credits}', userPackage.creditsRemaining.toString()),
        priority: 'MEDIUM',
        channel: faker.helpers.arrayElement(['EMAIL', 'PUSH']),
        status: 'SENT',
        sentAt: subDays(userPackage.expiresAt, 7),
        readAt: faker.datatype.boolean({ probability: 0.5 }) ? subDays(userPackage.expiresAt, 6) : null,
        metadata: {
          userPackageId: userPackage.id,
          template: 'SYSTEM_NOTIFICATION',
          packageName: userPackage.package.name,
          creditsRemaining: userPackage.creditsRemaining
        }
      })
    }
  }
  
  // 4. DODATKOWE POWIADOMIENIA
  if (!isMinimal) {
    // Wiadomości od instruktorów
    const instructors = users.filter(u => u.role === 'INSTRUCTOR')
    const students = users.filter(u => u.role === 'STUDENT')
    
    for (let i = 0; i < 10; i++) {
      const instructor = faker.helpers.arrayElement(instructors)
      const student = faker.helpers.arrayElement(students)
      
      notifications.push({
        userId: student.id,
        type: 'SYSTEM_NOTIFICATION', 
        title: notificationTemplates.INSTRUCTOR_MESSAGE.title,
        message: notificationTemplates.INSTRUCTOR_MESSAGE.template
          .replace('{instructorName}', `${instructor.firstName} ${instructor.lastName}`)
          .replace('{message}', faker.helpers.arrayElement([
            'Świetnie Ci poszło na ostatniej jeździe!',
            'Pamiętaj o dokumentach na następną lekcję',
            'Czy możemy przesunąć jutrzejszą jazdę o 30 minut?',
            'Gratulacje! Jesteś gotowy do egzaminu',
            'Proszę powtórzyć teorię dotyczącą pierwszeństwa przejazdu'
          ])),
        priority: 'MEDIUM',
        channel: faker.helpers.arrayElement(['PUSH', 'EMAIL']),
        status: 'SENT',
        sentAt: subDays(new Date(), faker.number.int({ min: 1, max: 14 })),
        readAt: faker.datatype.boolean({ probability: 0.8 }) 
          ? subDays(new Date(), faker.number.int({ min: 0, max: 13 }))
          : null,
        metadata: {
          fromUserId: instructor.id,
          template: 'SYSTEM_NOTIFICATION'
        }
      })
    }
    
    // Powiadomienia systemowe
    notifications.push({
      userId: null, // Broadcast do wszystkich
      type: 'SYSTEM_NOTIFICATION',
      title: notificationTemplates.SYSTEM_MAINTENANCE.title,
      message: notificationTemplates.SYSTEM_MAINTENANCE.template
        .replace('{date}', '2024-02-15')
        .replace('{startTime}', '02:00')
        .replace('{endTime}', '04:00'),
      priority: 'MEDIUM',
      channel: 'EMAIL',
      status: 'SENT',
      sentAt: subDays(new Date(), 5),
      isBroadcast: true,
      metadata: {
        template: 'SYSTEM_NOTIFICATION',
        affectedUsers: 'ALL'
      }
    })
    
    // Życzenia urodzinowe
    const birthdayStudents = students.slice(0, 3)
    for (const student of birthdayStudents) {
      notifications.push({
        userId: student.id,
        type: 'SYSTEM_NOTIFICATION',
        title: notificationTemplates.SYSTEM_NOTIFICATION.title,
        message: notificationTemplates.SYSTEM_NOTIFICATION.template,
        priority: 'LOW',
        channel: 'EMAIL',
        status: 'SENT',
        sentAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
        readAt: faker.datatype.boolean({ probability: 0.9 }) 
          ? subDays(new Date(), faker.number.int({ min: 0, max: 29 }))
          : null,
        metadata: {
          template: 'SYSTEM_NOTIFICATION',
          promoCode: 'BIRTHDAY10'
        }
      })
    }
  }
  
  // Zapisz powiadomienia
  let created = 0
  let skipped = 0
  
  for (const notificationData of notifications) {
    try {
      await prisma.notification.create({
        data: notificationData
      })
      created++
      
      if (created <= 5 || created % 20 === 0) {
        logger.info(`Created notification ${created}: ${notificationData.type}`)
      }
    } catch (error) {
      skipped++
      if (skipped <= 3) {
        logger.warn(`Failed to create notification: ${error.message}`)
      }
    }
  }
  
  logger.success(`Created ${created} notifications (${skipped} skipped)`)
  
  // Statystyki
  const stats = await prisma.notification.groupBy({
    by: ['type', 'status'],
    _count: true
  })
  
  const channelStats = await prisma.notification.groupBy({
    by: ['channel'],
    _count: true
  })
  
  const readStats = await prisma.notification.aggregate({
    where: { readAt: { not: null } },
    _count: true
  })
  
  logger.info('\n📊 Notification Statistics:')
  logger.info(`   Total notifications: ${created}`)
  logger.info(`   Read notifications: ${readStats._count}`)
  
  logger.info('\n   By type and status:')
  const typeGroups = {}
  stats.forEach(stat => {
    if (!typeGroups[stat.type]) typeGroups[stat.type] = {}
    typeGroups[stat.type][stat.status] = stat._count
  })
  
  Object.entries(typeGroups).forEach(([type, statuses]) => {
    logger.info(`   ${type}:`)
    Object.entries(statuses).forEach(([status, count]) => {
      logger.info(`     ${status}: ${count}`)
    })
  })
  
  logger.info('\n   By channel:')
  channelStats.forEach(stat => {
    logger.info(`   ${stat.channel}: ${stat._count}`)
  })
}

module.exports = seedNotifications