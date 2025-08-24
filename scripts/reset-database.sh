#!/bin/bash

# scripts/reset-database.sh
# Скрипт для повного перестворення бази даних з нуля

echo "🗑️  Driving School - Complete Database Reset"
echo "==========================================="
echo ""
echo "⚠️  WARNING: This will DELETE ALL DATA!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "📦 Step 1: Removing old migrations folder..."
rm -rf prisma/migrations

echo "✅ Old migrations removed"
echo ""

echo "📦 Step 2: Resetting database..."
npx prisma migrate reset --force --skip-seed

echo ""
echo "📦 Step 3: Creating new database schema..."
npx prisma db push

echo ""
echo "📦 Step 4: Generating Prisma Client..."
npx prisma generate

echo ""
echo "📦 Step 5: Seeding database with test data..."
npm run db:seed

echo ""
echo "✅ DATABASE RESET COMPLETE!"
echo "==========================================="
echo ""
echo "Test credentials:"
echo "Admin: admin@drivingschool.pl / Test123!"
echo "Instructor: piotr.instructor@drivingschool.pl / Test123!"
echo "Student: jan.kowalczyk@gmail.com / Test123!"
echo ""
echo "🚀 You can now start the application with: npm run dev"