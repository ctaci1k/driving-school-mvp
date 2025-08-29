// prisma/seed/data/04-bookings.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');
const { generateDateInRange, generatePastDate, generateFutureDate } = require('../utils/helpers.js');

async function seedBookings(prisma, users, infrastructure) {
  const result = {
    bookings: [],
    availabilitySlots: [],
    cancellationRequests: []
  };

  // 1. Create Availability Slots for Instructors
  for (const instructor of users.instructors) {
    const daysAhead = 30;
    
    for (let day = 0; day < daysAhead; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);
      
      const dayOfWeek = date.getDay();
      
      // Skip Sundays
      if (dayOfWeek === 0) continue;
      
      // Different hours for Saturday
      const startHour = dayOfWeek === 6 ? 9 : 8;
      const endHour = dayOfWeek === 6 ? 15 : 20;
      
      // Create hourly slots
      for (let hour = startHour; hour < endHour; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        // Skip lunch break (12-13)
        if (hour === 12) continue;
        
        // Random availability
        const isAvailable = faker.datatype.boolean({ probability: 0.7 });
        
        const slot = await prisma.availabilitySlot.create({
          data: {
            instructorId: instructor.id,
            date: date,
            startTime: startTime,
            endTime: endTime,
            isAvailable: isAvailable
          }
        });
        
        if (day < 7) { // Only add first week to result
          result.availabilitySlots.push(slot);
        }
      }
    }
  }

  // 2. Create Bookings
  const bookingTypes = ['theory', 'practical', 'practical', 'practical']; // More practical lessons
  const bookingStatuses = ['completed', 'completed', 'scheduled', 'scheduled', 'cancelled'];
  
  for (let i = 0; i < config.counts.bookings; i++) {
    const student = faker.helpers.arrayElement(users.students);
    const instructor = faker.helpers.arrayElement(users.instructors);
    const location = faker.helpers.arrayElement(infrastructure.locations);
    const type = faker.helpers.arrayElement(bookingTypes);
    const status = faker.helpers.arrayElement(bookingStatuses);
    
    // Vehicle only for practical lessons
    const vehicle = type === 'practical' 
      ? faker.helpers.arrayElement(infrastructure.vehicles.filter(v => v.status === 'available'))
      : null;
    
    // Generate appropriate date based on status
    let startTime;
    if (status === 'completed' || status === 'cancelled') {
      startTime = generatePastDate(3);
    } else {
      startTime = generateFutureDate(1);
    }
    
    // Set to working hours
    const hour = faker.number.int({ min: 8, max: 18 });
    startTime.setHours(hour, 0, 0, 0);
    
    // Duration based on type
    const durationMinutes = type === 'theory' 
      ? faker.helpers.arrayElement([45, 60])
      : faker.helpers.arrayElement([60, 90]);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    
    // Price calculation
    const hourlyRate = type === 'theory' 
      ? faker.number.int({ min: 50, max: 100 })
      : faker.number.int({ min: 120, max: 200 });
    const price = (hourlyRate * durationMinutes) / 60;
    
    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        instructorId: instructor.id,
        vehicleId: vehicle?.id,
        locationId: location.id,
        startTime,
        endTime,
        type,
        status,
        notes: faker.datatype.boolean() 
          ? faker.helpers.arrayElement([
              'Jazda w ruchu miejskim',
              'Ćwiczenie parkowania równoległego',
              'Przygotowanie do egzaminu',
              'Jazda nocna',
              'Rondo i skrzyżowania'
            ])
          : null,
        price: parseFloat(price.toFixed(2)),
        durationMinutes
      }
    });
    result.bookings.push(booking);
    
    // Create cancellation request for cancelled bookings
    if (status === 'cancelled' && faker.datatype.boolean()) {
      const cancellationRequest = await prisma.cancellationRequest.create({
        data: {
          bookingId: booking.id,
          requestedBy: faker.datatype.boolean() ? student.id : instructor.id,
          reason: faker.helpers.arrayElement([
            'Choroba',
            'Pilna sprawa rodzinna',
            'Złe warunki pogodowe',
            'Konflikt terminów',
            'Awaria samochodu'
          ]),
          status: 'approved',
          createdAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000) // Day before
        }
      });
      result.cancellationRequests.push(cancellationRequest);
    }
  }

  // 3. Mark some availability slots as booked
  for (const booking of result.bookings) {
    if (booking.status === 'scheduled') {
      await prisma.availabilitySlot.updateMany({
        where: {
          instructorId: booking.instructorId,
          date: {
            equals: new Date(booking.startTime).setHours(0, 0, 0, 0)
          },
          startTime: {
            lte: booking.startTime
          },
          endTime: {
            gte: booking.endTime
          }
        },
        data: {
          isAvailable: false
        }
      });
    }
  }

  return result;
}

module.exports = { seedBookings };