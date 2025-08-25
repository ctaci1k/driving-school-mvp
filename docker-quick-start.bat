@echo off
REM docker-quick-start.bat

echo ========================================
echo   DRIVING SCHOOL - QUICK START
echo ========================================
echo.

REM Check if containers are already running
docker ps | findstr driving-school-postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo Containers are already running!
    echo.
    goto :SHOW_INFO
)

echo [1/4] Merging Prisma schemas...
call npm run prisma:merge

echo.
echo [2/4] Starting database services...
docker-compose up -d postgres redis

echo.
echo [3/4] Waiting for database...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting application...
docker-compose up -d app

echo.
echo Waiting for application to start...
timeout /t 10 /nobreak >nul

:SHOW_INFO
echo.
echo ========================================
echo   APPLICATION IS RUNNING!
echo ========================================
echo.
echo 📱 Application:  http://localhost:3000
echo 🗄️  Database UI:  http://localhost:8080
echo.
echo To view logs: docker-compose logs -f app
echo.
pause