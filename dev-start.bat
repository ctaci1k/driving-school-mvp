@echo off
REM dev-start.bat

echo ========================================
echo   DRIVING SCHOOL - DEVELOPMENT MODE
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install

echo.
echo [2/5] Merging Prisma schemas...
call npm run prisma:merge

echo.
echo [3/5] Starting database services...
docker-compose up -d postgres redis

echo.
echo [4/5] Waiting for database...
timeout /t 5 /nobreak >nul

echo.
echo [5/5] Running migrations...
call npm run prisma:migrate

echo.
echo ========================================
echo   STARTING DEVELOPMENT SERVER
echo ========================================
echo.
echo Database is running in Docker
echo Starting Next.js in development mode...
echo.
call npm run dev