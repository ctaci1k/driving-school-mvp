@echo off
REM docker-start-with-seed.bat

echo ========================================
echo   DRIVING SCHOOL MVP - PRODUCTION SETUP
echo ========================================
echo.

REM Check Docker
docker version >nul 2>&1
if %errorlevel% neq 0 (
   echo ERROR: Docker Desktop is not running!
   echo Please start Docker Desktop and try again.
   pause
   exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
   echo ERROR: Node.js is not installed!
   pause
   exit /b 1
)

echo [1/12] Installing Node dependencies...
if not exist node_modules (
   call npm install
)

echo.
echo [2/12] Merging Prisma schemas...
call npm run prisma:merge
if %errorlevel% neq 0 (
   echo ERROR: Failed to merge Prisma schemas!
   pause
   exit /b 1
)

echo.
echo [3/12] Validating Prisma schema...
call npx prisma validate
if %errorlevel% neq 0 (
   echo ERROR: Prisma schema is invalid!
   pause
   exit /b 1
)

echo.
echo [4/12] Generating Prisma Client...
call npx prisma generate

echo.
echo [5/12] Stopping old containers...
docker-compose down

echo.
echo [6/12] Cleaning Docker volumes...
echo Do you want to DELETE ALL DATA? (y/n)
set /p confirm=
if /i "%confirm%"=="y" (
   docker volume rm driving-school-mvp_postgres-data 2>nul
   docker volume rm driving-school-mvp_redis-data 2>nul
   echo Data cleared!
)

echo.
echo [7/12] Building Docker images...
docker-compose build --no-cache app

echo.
echo [8/12] Starting database services...
docker-compose up -d postgres redis

echo.
echo [9/12] Waiting for database...
:WAIT_DB
timeout /t 2 /nobreak >nul
docker exec driving-school-db pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
   echo Waiting for PostgreSQL...
   goto WAIT_DB
)
echo Database is ready!

echo.
echo [10/12] Starting application...
docker-compose up -d app

echo.
echo [11/12] Application is initializing...
echo Creating tables and seeding data...
echo This may take 30-60 seconds...

REM Show logs while waiting
timeout /t 5 /nobreak >nul
docker-compose logs --tail=20 app

timeout /t 25 /nobreak >nul

echo.
echo [12/12] Verifying installation...
docker-compose ps

REM Check if app is running
docker-compose ps app | findstr "Up" >nul
if %errorlevel% equ 0 (
   echo ✅ Application is running!
) else (
   echo ⚠️ Application may still be starting...
   echo Check logs: docker-compose logs app
)

echo.
echo ========================================
echo   🚀 SETUP COMPLETE!
echo ========================================
echo.
echo 📱 Application:      http://localhost:3000
echo 🗄️  Database Admin:   http://localhost:8080
echo    - Server:        postgres
echo    - Username:      postgres
echo    - Password:      postgres123
echo    - Database:      driving_school
echo.
echo ========================================
echo   DEMO ACCOUNTS (if seeded)
echo ========================================
echo.
echo 👨‍💼 Admin:
echo    admin@driving-school.pl / Admin123!
echo.
echo 👨‍🏫 Instructors:
echo    instructor1@driving-school.pl / Test123!
echo    instructor2@driving-school.pl / Test123!
echo.
echo 🎓 Students:
echo    student1@driving-school.pl / Test123!
echo    student2@driving-school.pl / Test123!
echo.
echo ========================================
echo   USEFUL COMMANDS
echo ========================================
echo.
echo 📋 View logs:         docker-compose logs -f app
echo 🔄 Restart app:       docker-compose restart app
echo 🛑 Stop all:          docker-compose down
echo 🗑️  Reset all data:    docker-compose down -v
echo 📊 Prisma Studio:     npx prisma studio
echo 🌱 Re-seed data:      docker exec driving-school-app node prisma/seed/index.js
echo 💾 Backup database:   docker exec driving-school-db pg_dump -U postgres driving_school ^> backup.sql
echo.
echo ========================================
echo   TROUBLESHOOTING
echo ========================================
echo.
echo If application doesn't work:
echo   1. Check logs: docker-compose logs app
echo   2. Restart: docker-compose restart app
echo   3. Rebuild: docker-compose down ^&^& docker-compose up --build
echo.
pause