@echo off
cd /d "c:\Users\user\dealroom_clone\backend"
call .venv\Scripts\activate.bat
echo Starting Django development server...
python manage.py runserver
pause