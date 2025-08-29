// prisma/seed/utils/validators.js

// Validate PESEL number
function validatePESEL(pesel) {
  if (!pesel || pesel.length !== 11) {
    return false;
  }

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(pesel[10]);
}

// Validate NIP number
function validateNIP(nip) {
  if (!nip || nip.length !== 10) {
    return false;
  }

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(nip[i]) * weights[i];
  }

  const checkDigit = sum % 11;
  return checkDigit === parseInt(nip[9]) && checkDigit !== 10;
}

// Validate REGON number
function validateREGON(regon) {
  if (!regon || (regon.length !== 9 && regon.length !== 14)) {
    return false;
  }

  const weights9 = [8, 9, 2, 3, 4, 5, 6, 7];
  const weights14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];

  if (regon.length === 9) {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(regon[i]) * weights9[i];
    }
    const checkDigit = sum % 11;
    return checkDigit === parseInt(regon[8]);
  } else {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(regon[i]) * weights14[i];
    }
    const checkDigit = sum % 11;
    return checkDigit === parseInt(regon[13]);
  }
}

// Validate Polish phone number
function validatePhoneNumber(phone) {
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check Polish format: +48XXXXXXXXX or 48XXXXXXXXX or XXXXXXXXX
  const patterns = [
    /^\+48\d{9}$/,
    /^48\d{9}$/,
    /^\d{9}$/
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

// Validate Polish postal code
function validatePostalCode(code) {
  // Polish format: XX-XXX
  return /^\d{2}-\d{3}$/.test(code);
}

// Validate email
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Validate vehicle registration number
function validateRegistrationNumber(registration) {
  // Polish format examples: WX 12345, WW 123AB
  const patterns = [
    /^[A-Z]{2,3}\s\d{4,5}$/,
    /^[A-Z]{2,3}\s\d{3}[A-Z]{2}$/,
    /^[A-Z]{2,3}\s[A-Z]\d{4}$/
  ];
  
  return patterns.some(pattern => pattern.test(registration));
}

// Validate date range
function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
}

// Validate working hours
function validateWorkingHours(hours) {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
  if (!hours || typeof hours !== 'object') {
    return false;
  }
  
  for (const day in hours) {
    if (hours[day] === null) continue;
    
    if (!hours[day].open || !hours[day].close) {
      return false;
    }
    
    if (!timePattern.test(hours[day].open) || !timePattern.test(hours[day].close)) {
      return false;
    }
    
    // Check if close time is after open time
    const [openHour, openMin] = hours[day].open.split(':').map(Number);
    const [closeHour, closeMin] = hours[day].close.split(':').map(Number);
    
    if (openHour > closeHour || (openHour === closeHour && openMin >= closeMin)) {
      return false;
    }
  }
  
  return true;
}

// Validate price
function validatePrice(price) {
  return typeof price === 'number' && price >= 0 && price <= 1000000;
}

// Validate percentage
function validatePercentage(value) {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

// Validate license category
function validateLicenseCategory(category) {
  const validCategories = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'B+E', 'C1', 'C1+E', 'C', 'C+E', 'D1', 'D1+E', 'D', 'D+E', 'T'];
  return validCategories.includes(category);
}

// Validate payment method
function validatePaymentMethod(method) {
  const validMethods = ['cash', 'card', 'transfer', 'blik'];
  return validMethods.includes(method);
}

// Validate booking status
function validateBookingStatus(status) {
  const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show'];
  return validStatuses.includes(status);
}

// Validate user role
function validateUserRole(role) {
  const validRoles = ['student', 'instructor', 'admin'];
  return validRoles.includes(role);
}

module.exports = {
  validatePESEL,
  validateNIP,
  validateREGON,
  validatePhoneNumber,
  validatePostalCode,
  validateEmail,
  validateRegistrationNumber,
  validateDateRange,
  validateWorkingHours,
  validatePrice,
  validatePercentage,
  validateLicenseCategory,
  validatePaymentMethod,
  validateBookingStatus,
  validateUserRole
};