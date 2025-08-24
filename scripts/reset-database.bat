@echo off
REM scripts/reset-database.bat
REM Script for complete database reset on Windows

echo ====================================
echo   Driving School - Database Reset
echo ====================================
echo.
echo WARNING: This will DELETE ALL DATA!
echo Press Ctrl+C to cancel, or any key to continue...
pause > nul

echo.
echo [1/5] Removing old migrations...
rmdir /s /q prisma\migrations 2>nul
echo       Done!

echo.
echo [2/5] Resetting database...
call npx prisma migrate reset --force --skip-seed
echo       Done!

echo.
echo [3/5] Creating new database schema...
call npx prisma db push
echo       Done!

echo.
echo [4/5] Generating Prisma Client...
call npx prisma generate
echo       Done!

echo.
echo [5/5] Seeding database with test data...
call npm run db:seed
echo       Done!

echo.
echo ====================================
echo    DATABASE RESET COMPLETE!
echo ====================================
echo.
echo Test credentials:
echo   Admin: admin@drivingschool.pl / Test123!
echo   Instructor: piotr.instructor@drivingschool.pl / Test123!
echo   Student: jan.kowalczyk@gmail.com / Test123!
echo.
echo Start the application with: npm run dev
echo.
pause