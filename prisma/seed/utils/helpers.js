// prisma/seed/utils/helpers.js
const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

// Generate valid Polish PESEL number
function generatePESEL(birthDate) {
  const date = new Date(birthDate);
  let year = date.getFullYear() % 100;
  let month = date.getMonth() + 1;
  const day = date.getDate();

  // Century encoding
  if (date.getFullYear() >= 2000) {
    month += 20;
  } else if (date.getFullYear() >= 1900) {
    // month stays the same
  } else if (date.getFullYear() >= 1800) {
    month += 80;
  }

  const yearStr = year.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  
  // Random serial number
  const serial = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Gender digit (odd for male, even for female)
  const gender = faker.datatype.boolean() ? 
    faker.number.int({ min: 0, max: 4 }) * 2 + 1 : 
    faker.number.int({ min: 0, max: 4 }) * 2;
  
  const partial = yearStr + monthStr + dayStr + serial + gender;
  
  // Calculate control digit
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(partial[i]) * weights[i];
  }
  const control = (10 - (sum % 10)) % 10;
  
  return partial + control;
}

// Generate Polish NIP (tax number)
function generateNIP() {
  const digits = [];
  for (let i = 0; i < 9; i++) {
    digits.push(faker.number.int({ min: 0, max: 9 }));
  }
  
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * weights[i];
  }
  const control = sum % 11;
  
  if (control === 10) {
    return generateNIP(); // Retry if control is 10
  }
  
  digits.push(control);
  return digits.join('');
}

// Generate Polish vehicle registration number
function generateRegistrationNumber(city = 'W') {
  const prefixes = {
    'W': ['WA', 'WB', 'WD', 'WE', 'WF', 'WH', 'WI', 'WJ', 'WK', 'WN', 'WT', 'WU', 'WW', 'WX', 'WY', 'WZ'],
    'K': ['KR', 'KK', 'KN', 'KT'],
    'P': ['PO', 'PZ', 'PL', 'PN']
  };
  
  const cityPrefixes = prefixes[city] || prefixes['W'];
  const prefix = faker.helpers.arrayElement(cityPrefixes);
  
  // Modern format: 2 letters + 5 characters (digits or letters)
  const suffix = faker.datatype.boolean() 
    ? faker.number.int({ min: 10000, max: 99999 }).toString()
    : faker.number.int({ min: 100, max: 999 }).toString() + 
      faker.string.alpha({ length: 2, casing: 'upper' });
  
  return `${prefix} ${suffix}`;
}

// Generate Polish phone number
function generatePhoneNumber() {
  const prefixes = ['50', '51', '53', '57', '60', '66', '69', '72', '73', '78', '79', '88'];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.number.int({ min: 1000000, max: 9999999 });
  return `+48 ${prefix} ${number.toString().match(/.{1,3}/g).join(' ')}`;
}

// Generate Polish address
function generateAddress(district) {
  const streets = [
    'ul. Marszałkowska', 'ul. Puławska', 'ul. Nowy Świat', 'al. Jerozolimskie',
    'ul. Krakowskie Przedmieście', 'ul. Świętokrzyska', 'ul. Chmielna',
    'ul. Złota', 'ul. Emilii Plater', 'ul. Hoża', 'ul. Krucza', 'ul. Piękna',
    'ul. Wilcza', 'ul. Poznańska', 'ul. Lwowska', 'ul. Mokotowska'
  ];
  
  const street = faker.helpers.arrayElement(streets);
  const number = faker.number.int({ min: 1, max: 200 });
  const apartment = faker.datatype.boolean() ? `/${faker.number.int({ min: 1, max: 50 })}` : '';
  
  return `${street} ${number}${apartment}`;
}

// Generate invoice number
function generateInvoiceNumber(date = new Date()) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const sequential = faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0');
  return `FV/${year}/${month}/${sequential}`;
}

// Generate support ticket number
function generateTicketNumber() {
  const prefix = 'TK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = faker.string.alphanumeric({ length: 4, casing: 'upper' });
  return `${prefix}-${timestamp}-${random}`;
}

// Generate random skills progress
function generateSkillsProgress() {
  const skills = ['parking', 'cityDriving', 'highwayDriving', 'nightDriving', 'emergencyBraking'];
  const progress = {};
  
  skills.forEach(skill => {
    progress[skill] = faker.number.int({ min: 0, max: 100 });
  });
  
  return progress;
}

// Generate weather preferences
function generateWeatherPreferences() {
  return {
    rain: faker.datatype.boolean(),
    snow: faker.datatype.boolean(),
    fog: faker.datatype.boolean(),
    night: faker.datatype.boolean()
  };
}

// Generate availability schedule
function generateAvailabilitySchedule() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const schedule = {};
  
  days.forEach(day => {
    if (day === 'saturday' && faker.datatype.boolean()) {
      schedule[day] = null; // Some instructors don't work on Saturdays
    } else {
      schedule[day] = {
        start: day === 'saturday' ? '09:00' : '08:00',
        end: day === 'saturday' ? '15:00' : faker.helpers.arrayElement(['18:00', '19:00', '20:00']),
        breaks: [
          { start: '12:00', end: '13:00' }
        ]
      };
    }
  });
  
  schedule.sunday = null; // Closed on Sundays
  
  return schedule;
}

// Generate working hours for location
function generateWorkingHours() {
  return {
    monday: { open: '08:00', close: '20:00' },
    tuesday: { open: '08:00', close: '20:00' },
    wednesday: { open: '08:00', close: '20:00' },
    thursday: { open: '08:00', close: '20:00' },
    friday: { open: '08:00', close: '20:00' },
    saturday: { open: '09:00', close: '15:00' },
    sunday: null
  };
}

// Calculate invoice details
function calculateInvoiceAmounts(subtotal, vatRate = 23) {
  const taxAmount = subtotal * (vatRate / 100);
  const total = subtotal + taxAmount;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}

// Generate date in range
function generateDateInRange(startMonthsAgo = 6, endMonthsAhead = 6) {
  const start = new Date();
  start.setMonth(start.getMonth() - startMonthsAgo);
  
  const end = new Date();
  end.setMonth(end.getMonth() + endMonthsAhead);
  
  return faker.date.between({ from: start, to: end });
}

// Generate past date
function generatePastDate(monthsAgo = 6) {
  const start = new Date();
  start.setMonth(start.getMonth() - monthsAgo);
  
  return faker.date.between({ from: start, to: new Date() });
}

// Generate future date
function generateFutureDate(monthsAhead = 6) {
  const end = new Date();
  end.setMonth(end.getMonth() + monthsAhead);
  
  return faker.date.between({ from: new Date(), to: end });
}

module.exports = {
  generatePESEL,
  generateNIP,
  generateRegistrationNumber,
  generatePhoneNumber,
  generateAddress,
  generateInvoiceNumber,
  generateTicketNumber,
  generateSkillsProgress,
  generateWeatherPreferences,
  generateAvailabilitySchedule,
  generateWorkingHours,
  calculateInvoiceAmounts,
  generateDateInRange,
  generatePastDate,
  generateFutureDate
};