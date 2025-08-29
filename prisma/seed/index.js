// prisma/seed/index.js
const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');
const ora = require('ora');
const { config } = require('./config.js');
const { cleanDatabase } = require('./utils/cleanDb.js');
const { seedUsers } = require('./data/01-users.js');
const { seedInfrastructure } = require('./data/02-infrastructure.js');
const { seedPackages } = require('./data/03-packages.js');
const { seedBookings } = require('./data/04-bookings.js');
const { seedFinancial } = require('./data/05-financial.js');
const { seedCommunication } = require('./data/06-communication.js');
const { seedSupport } = require('./data/07-support.js');
const { seedDocuments } = require('./data/08-documents.js');

const prisma = new PrismaClient();

async function main() {
  console.log(chalk.blue.bold('\n🚗 Driving School LMS - Database Seeding\n'));
  
  const startTime = Date.now();
  let spinner;

  try {
    // Clean database
    if (config.cleanBeforeSeed) {
      spinner = ora('Cleaning database...').start();
      await cleanDatabase(prisma);
      spinner.succeed('Database cleaned');
    }

    // 1. Users, Students, Instructors
    spinner = ora('Creating users...').start();
    const users = await seedUsers(prisma);
    spinner.succeed(`Created ${users.totalCount} users (1 admin, ${users.instructors.length} instructors, ${users.students.length} students)`);

    // 2. Locations and Vehicles
    spinner = ora('Setting up infrastructure...').start();
    const infrastructure = await seedInfrastructure(prisma, users);
    spinner.succeed(`Created ${infrastructure.locations.length} locations and ${infrastructure.vehicles.length} vehicles`);

    // 3. Packages and Student Packages
    spinner = ora('Creating packages...').start();
    const packages = await seedPackages(prisma, users);
    spinner.succeed(`Created ${packages.packages.length} packages and ${packages.studentPackages.length} student assignments`);

    // 4. Bookings and Availability
    spinner = ora('Generating bookings...').start();
    const bookings = await seedBookings(prisma, users, infrastructure);
    spinner.succeed(`Created ${bookings.bookings.length} bookings and ${bookings.availabilitySlots.length} availability slots`);

    // 5. Payments and Invoices
    spinner = ora('Processing financial data...').start();
    const financial = await seedFinancial(prisma, users, bookings, packages);
    spinner.succeed(`Created ${financial.payments.length} payments and ${financial.invoices.length} invoices`);

    // 6. Conversations and Messages
    spinner = ora('Creating communications...').start();
    const communication = await seedCommunication(prisma, users);
    spinner.succeed(`Created ${communication.conversations.length} conversations with ${communication.messages.length} messages`);

    // 7. Support Tickets
    spinner = ora('Setting up support system...').start();
    const support = await seedSupport(prisma, users);
    spinner.succeed(`Created ${support.tickets.length} tickets and ${support.faqs.length} FAQs`);

    // 8. Documents and Announcements
    spinner = ora('Uploading documents...').start();
    const documents = await seedDocuments(prisma, users);
    spinner.succeed(`Created ${documents.documents.length} documents and ${documents.announcements.length} announcements`);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(chalk.green.bold(`\n✅ Seeding completed successfully in ${duration}s\n`));
    
    // Summary
    console.log(chalk.cyan('📊 Database Summary:'));
    console.log(chalk.gray('├─ Users:'), users.totalCount);
    console.log(chalk.gray('├─ Locations:'), infrastructure.locations.length);
    console.log(chalk.gray('├─ Vehicles:'), infrastructure.vehicles.length);
    console.log(chalk.gray('├─ Packages:'), packages.packages.length);
    console.log(chalk.gray('├─ Bookings:'), bookings.bookings.length);
    console.log(chalk.gray('├─ Payments:'), financial.payments.length);
    console.log(chalk.gray('├─ Conversations:'), communication.conversations.length);
    console.log(chalk.gray('├─ Support Tickets:'), support.tickets.length);
    console.log(chalk.gray('└─ Documents:'), documents.documents.length);

  } catch (error) {
    console.error(chalk.red.bold('\n❌ Seeding failed:'), error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(chalk.red('Fatal error:'), e);
    process.exit(1);
  });