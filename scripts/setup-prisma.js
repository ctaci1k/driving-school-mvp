// scripts/setup-prisma.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Prisma schema...');

try {
  // Check if prisma-merge is installed
  if (!fs.existsSync(path.join(__dirname, '../node_modules/prisma-merge'))) {
    console.log('📦 Installing prisma-merge...');
    execSync('npm install --save-dev prisma-merge', { stdio: 'inherit' });
  }

  // Run merge
  console.log('🔀 Merging Prisma schemas...');
  execSync('npx prisma-merge', { stdio: 'inherit' });

  // Validate
  console.log('✅ Validating schema...');
  execSync('npx prisma validate', { stdio: 'inherit' });

  // Generate client
  console.log('🏗️ Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('✨ Prisma setup completed successfully!');
} catch (error) {
  console.error('❌ Error setting up Prisma:', error.message);
  process.exit(1);
}