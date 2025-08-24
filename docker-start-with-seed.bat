@echo off
REM docker-start-with-seed.bat

echo ========================================
echo   DRIVING SCHOOL - FIRST TIME SETUP
echo ========================================
echo.

REM Check Docker
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    pause
    exit /b 1
)

echo [1/6] Stopping old containers...
docker-compose down -v

echo.
echo [2/6] Building containers...
docker-compose build --no-cache

echo.
echo [3/6] Starting database services...
docker-compose up -d postgres redis

echo.
echo [4/6] Waiting for database...
timeout /t 10 /nobreak >nul

echo.
echo [5/6] Starting app with seed data...
docker-compose up -d app

echo.
echo [6/6] Waiting for seed to complete...
timeout /t 20 /nobreak >nul

echo.
echo ========================================
echo   SETUP COMPLETE WITH DEMO DATA!
echo ========================================
echo.
echo Application:  http://localhost:3000
echo Database UI:  http://localhost:8080
echo.
echo Demo users:
echo   Admin:      admin@driving-school.pl / Admin123!
echo   Instructor: instructor1@driving-school.pl / Test123!
echo   Student:    student1@driving-school.pl / Test123!
echo.
echo To view logs: docker-compose logs -f app
echo.
pause