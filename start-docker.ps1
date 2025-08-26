# docker-start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DRIVING SCHOOL DOCKER SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
try {
    docker version | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[1/4] Cleaning up..." -ForegroundColor Yellow
docker-compose down 2>$null

Write-Host "[2/4] Building containers..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "[3/4] Starting services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "[4/4] Waiting for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  App:        http://localhost:3000" -ForegroundColor White
Write-Host "  Database:   http://localhost:8080" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"