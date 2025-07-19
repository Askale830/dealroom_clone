# Robust PowerShell script to start Django backend
Write-Host "=== Django Backend Startup Script ===" -ForegroundColor Cyan

# Kill any existing Python processes
Write-Host "Stopping any existing Python processes..." -ForegroundColor Yellow
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Change to backend directory
Write-Host "Changing to backend directory..." -ForegroundColor Yellow
Set-Location "c:\Users\user\dealroom_clone\backend"

# Check if virtual environment exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & ".venv\Scripts\Activate.ps1"
} else {
    Write-Host "Virtual environment not found! Creating one..." -ForegroundColor Red
    python -m venv .venv
    & ".venv\Scripts\Activate.ps1"
    pip install -r requirements.txt
}

# Check if manage.py exists
if (Test-Path "manage.py") {
    Write-Host "Found manage.py, checking database..." -ForegroundColor Yellow
    
    # Run migrations if needed
    python manage.py migrate --run-syncdb
    
    Write-Host "Starting Django development server on 0.0.0.0:8000..." -ForegroundColor Green
    Write-Host "Server will be accessible at:" -ForegroundColor Cyan
    Write-Host "  - http://localhost:8000" -ForegroundColor White
    Write-Host "  - http://127.0.0.1:8000" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Cyan
    
    # Start server on all interfaces
    python manage.py runserver 0.0.0.0:8000
} else {
    Write-Host "ERROR: manage.py not found in backend directory!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Red
    pause
}