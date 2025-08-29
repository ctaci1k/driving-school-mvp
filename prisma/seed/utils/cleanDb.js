// prisma/seed/utils/cleanDb.js

async function cleanDatabase(prisma) {
  // Order matters due to foreign key constraints
  const deleteOrder = [
    // Messages and conversations
    'ticketMessage',
    'message',
    'conversation',
    
    // Support
    'supportTicket',
    'FAQ',
    
    // Documents
    'document',
    'announcement',
    
    // Financial
    'invoice',
    'payment',
    
    // Bookings
    'cancellationRequest',
    'booking',
    'availabilitySlot',
    
    // Packages
    'studentPackage',
    'package',
    
    // Vehicles and locations
    'instructorVehicle',
    'instructorLocation',
    'vehicle',
    'location',
    
    // Users
    'instructor',
    'student',
    'user'
  ];

  for (const model of deleteOrder) {
    try {
      await prisma[model].deleteMany({});
      console.log(`  ✓ Cleaned ${model}`);
    } catch (error) {
      console.warn(`  ⚠ Could not clean ${model}:`, error.message);
    }
  }
  
  console.log('  ✓ Database cleaned successfully');
}

module.exports = { cleanDatabase };