# PowerShell script to start Django backend
Set-Location "c:\Users\user\dealroom_clone\backend"
& ".venv\Scripts\Activate.ps1"
Write-Host "Starting Django development server..." -ForegroundColor Green
python manage.py runserver