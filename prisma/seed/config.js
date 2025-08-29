// prisma/seed/config.js

const config = {
  // Database
  cleanBeforeSeed: true,
  
  // Data volumes
  counts: {
    admin: 1,
    instructors: 5,
    students: 5,
    locations: 5,
    vehicles: 5,
    packages: 5,
    bookings: 15,
    payments: 10,
    invoices: 5,
    conversations: 5,
    messages: 20,
    supportTickets: 5,
    documents: 5,
    faqs: 10,
    announcements: 3,
    availabilitySlots: 30
  },

  // Polish specific
  locale: {
    country: 'Poland',
    currency: 'PLN',
    phonePrefix: '+48',
    vatRate: 23,
    specialVatRates: {
      education: 0,
      reducedA: 8,
      reducedB: 5
    }
  },

  // Business rules
  business: {
    workingHours: {
      weekday: { start: '08:00', end: '20:00' },
      saturday: { start: '09:00', end: '15:00' },
      sunday: { start: null, end: null }
    },
    lessonDurations: [45, 60, 90],
    packageValidityMonths: [3, 6, 12],
    pricing: {
      theory: { min: 50, max: 100 },
      practical: { min: 120, max: 200 },
      packages: { min: 2000, max: 5000 }
    },
    skillCategories: [
      'parking',
      'cityDriving', 
      'highwayDriving',
      'nightDriving',
      'emergencyBraking'
    ],
    weatherTypes: ['rain', 'snow', 'fog', 'night']
  },

  // Date ranges
  dates: {
    pastMonths: 6,
    futureMonths: 6
  },

  // Warsaw locations
  warsawDistricts: [
    { name: 'Śródmieście', postalCode: '00-001' },
    { name: 'Mokotów', postalCode: '02-001' },
    { name: 'Wola', postalCode: '01-001' },
    { name: 'Praga-Południe', postalCode: '04-001' },
    { name: 'Ursynów', postalCode: '02-777' }
  ],

  // Vehicle data
  vehicles: {
    makes: [
      { make: 'Toyota', models: ['Yaris', 'Corolla'] },
      { make: 'Volkswagen', models: ['Golf', 'Polo'] },
      { make: 'Skoda', models: ['Fabia', 'Octavia'] }
    ],
    yearRange: { min: 2019, max: 2024 }
  }
};

module.exports = { config };