// prisma/seed/mock/constants.js

// Enum values from Prisma schema
const ENUMS = {
  BookingStatus: {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
  },

  BookingType: {
    THEORY: 'theory',
    PRACTICAL: 'practical',
    EXAM: 'exam'
  },

  CancellationStatus: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },

  ConversationType: {
    DIRECT: 'direct',
    GROUP: 'group',
    ANNOUNCEMENT: 'announcement'
  },

  DocumentCategory: {
    LICENSE: 'license',
    MEDICAL: 'medical',
    CONTRACT: 'contract',
    CERTIFICATE: 'certificate'
  },

  DocumentStatus: {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
  },

  DocumentType: {
    PDF: 'pdf',
    IMAGE: 'image',
    OTHER: 'other'
  },

  InvoiceStatus: {
    DRAFT: 'draft',
    ISSUED: 'issued',
    PAID: 'paid',
    CANCELLED: 'cancelled'
  },

  InvoiceType: {
    REGULAR: 'regular',
    PROFORMA: 'proforma',
    CORRECTION: 'correction'
  },

  LocationStatus: {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  },

  LocationType: {
    BRANCH: 'branch',
    EXAM_CENTER: 'exam_center',
    MEETING_POINT: 'meeting_point'
  },

  MessageStatus: {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read'
  },

  MessageType: {
    TEXT: 'text',
    FILE: 'file',
    LESSON_INFO: 'lesson_info'
  },

  PackageCategory: {
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium',
    INTENSIVE: 'intensive'
  },

  PackageStatus: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ARCHIVED: 'archived'
  },

  PaymentMethod: {
    CASH: 'cash',
    CARD: 'card',
    TRANSFER: 'transfer',
    BLIK: 'blik'
  },

  PaymentStatus: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  Role: {
    student: 'student',
    instructor: 'instructor',
    admin: 'admin'
  },

  TicketCategory: {
    TECHNICAL: 'technical',
    BILLING: 'billing',
    SCHEDULING: 'scheduling',
    OTHER: 'other'
  },

  TicketPriority: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  TicketStatus: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  },

  VehicleFuelType: {
    PETROL: 'petrol',
    DIESEL: 'diesel',
    ELECTRIC: 'electric',
    HYBRID: 'hybrid'
  },

  VehicleStatus: {
    AVAILABLE: 'available',
    IN_USE: 'in_use',
    MAINTENANCE: 'maintenance'
  },

  VehicleTransmission: {
    MANUAL: 'manual',
    AUTOMATIC: 'automatic'
  }
};

// Business constants
const BUSINESS = {
  // Default passwords for test users
  DEFAULT_PASSWORD: 'Test123!',
  
  // Time slots
  LESSON_SLOTS: {
    MORNING: { start: '08:00', end: '12:00' },
    AFTERNOON: { start: '12:00', end: '17:00' },
    EVENING: { start: '17:00', end: '20:00' }
  },
  
  // Lesson durations in minutes
  LESSON_DURATIONS: {
    SHORT: 45,
    STANDARD: 60,
    EXTENDED: 90,
    DOUBLE: 120
  },
  
  // Price ranges in PLN
  PRICING: {
    THEORY_HOUR: { min: 50, max: 100 },
    PRACTICAL_HOUR: { min: 120, max: 200 },
    EXAM_FEE: { min: 200, max: 400 },
    PACKAGE_BASIC: { min: 1800, max: 2500 },
    PACKAGE_STANDARD: { min: 2500, max: 3500 },
    PACKAGE_PREMIUM: { min: 3500, max: 5000 }
  },
  
  // Polish VAT rates
  VAT_RATES: {
    STANDARD: 23,
    REDUCED_A: 8,
    REDUCED_B: 5,
    ZERO: 0
  },
  
  // Cancellation policy (hours before lesson)
  CANCELLATION_POLICY: {
    FREE_CANCELLATION: 24,
    HALF_CHARGE: 12,
    FULL_CHARGE: 6
  },
  
  // License categories
  LICENSE_CATEGORIES: {
    MOPED: 'AM',
    MOTORCYCLE_SMALL: 'A1',
    MOTORCYCLE_MEDIUM: 'A2',
    MOTORCYCLE: 'A',
    CAR: 'B',
    CAR_TRAILER: 'B+E',
    TRUCK_SMALL: 'C1',
    TRUCK_MEDIUM: 'C',
    BUS_SMALL: 'D1',
    BUS: 'D'
  },
  
  // Skills to track
  DRIVING_SKILLS: [
    'parking',
    'cityDriving',
    'highwayDriving',
    'nightDriving',
    'emergencyBraking',
    'hillStart',
    'reverseParking',
    'parallelParking',
    'roundabouts',
    'overtaking'
  ],
  
  // Weather conditions
  WEATHER_CONDITIONS: [
    'sunny',
    'rain',
    'snow',
    'fog',
    'night',
    'ice',
    'wind'
  ]
};

// Polish specific data
const POLISH = {
  // Warsaw districts with codes
  WARSAW_DISTRICTS: {
    'Śródmieście': { code: '00', prefix: 'WA' },
    'Mokotów': { code: '02', prefix: 'WM' },
    'Ochota': { code: '02', prefix: 'WO' },
    'Wola': { code: '01', prefix: 'WD' },
    'Praga-Południe': { code: '04', prefix: 'WE' },
    'Praga-Północ': { code: '03', prefix: 'WH' },
    'Ursynów': { code: '02', prefix: 'WU' },
    'Bielany': { code: '01', prefix: 'WB' },
    'Targówek': { code: '03', prefix: 'WT' },
    'Bemowo': { code: '01', prefix: 'WF' },
    'Białołęka': { code: '03', prefix: 'WI' },
    'Wilanów': { code: '02', prefix: 'WN' },
    'Włochy': { code: '02', prefix: 'WW' },
    'Wawer': { code: '04', prefix: 'WZ' },
    'Wesoła': { code: '05', prefix: 'WK' },
    'Żoliborz': { code: '01', prefix: 'WJ' },
    'Ursus': { code: '02', prefix: 'WY' },
    'Rembertów': { code: '04', prefix: 'WX' }
  },
  
  // Phone operator prefixes
  PHONE_PREFIXES: {
    MOBILE: ['50', '51', '53', '57', '60', '66', '69', '72', '73', '78', '79', '88'],
    LANDLINE_WARSAW: ['22']
  },
  
  // Bank codes for IBAN
  BANK_CODES: {
    'mBank': '1140',
    'ING': '1050',
    'PKO BP': '1020',
    'Bank Pekao': '1240',
    'Santander': '1090',
    'BNP Paribas': '1750',
    'Alior Bank': '2490',
    'Bank Millennium': '1160'
  }
};

// Date/Time constants
const DATETIME = {
  // Working days (0 = Sunday, 6 = Saturday)
  WORKING_DAYS: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  
  // Business hours
  BUSINESS_HOURS: {
    WEEKDAY: { open: '08:00', close: '20:00' },
    SATURDAY: { open: '09:00', close: '15:00' },
    SUNDAY: null // Closed
  },
  
  // Holidays (Polish national holidays)
  HOLIDAYS_2025: [
    '2025-01-01', // New Year
    '2025-01-06', // Epiphany
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-05-03', // Constitution Day
    '2025-06-19', // Corpus Christi
    '2025-08-15', // Assumption of Mary
    '2025-11-01', // All Saints
    '2025-11-11', // Independence Day
    '2025-12-25', // Christmas
    '2025-12-26'  // Boxing Day
  ]
};

// File upload limits
const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    DOCUMENTS: ['pdf', 'doc', 'docx'],
    IMAGES: ['jpg', 'jpeg', 'png', 'gif'],
    ALL: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif']
  }
};

module.exports = {
  ENUMS,
  BUSINESS,
  POLISH,
  DATETIME,
  FILE_LIMITS
};