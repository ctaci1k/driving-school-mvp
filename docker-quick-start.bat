@echo off
REM docker-quick-start.bat

echo Starting services...
docker-compose up -d
echo.
echo Services started!
echo App: http://localhost:3000
echo.
pause