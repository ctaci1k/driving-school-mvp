const fs = require('fs');
const path = require('path');

const schemaDir = path.join(__dirname, '../prisma/schema');
const outputFile = path.join(__dirname, '../prisma/schema.prisma');

const files = [
  'base.prisma',
  'enums.prisma', 
  'user.prisma',
  'auth.prisma',
  'notification.prisma',
  'student.prisma',
  'instructor.prisma',
  'booking.prisma',
  'payment.prisma',
  'vehicle.prisma',
  'location.prisma'
];

let content = '';
let isFirst = true;

files.forEach(file => {
  const filePath = path.join(schemaDir, file);
  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  if (!isFirst) {
    // Remove generator and datasource from non-base files
    fileContent = fileContent
      .replace(/generator[\s\S]*?}\n\n/g, '')
      .replace(/datasource[\s\S]*?}\n\n/g, '');
  }
  
  content += fileContent + '\n\n';
  isFirst = false;
});

fs.writeFileSync(outputFile, content);
console.log('✅ Schemas merged successfully!');