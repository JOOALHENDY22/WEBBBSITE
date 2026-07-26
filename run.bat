@echo off
echo ===================================================
echo Starting YMH Exams Development Server...
echo ===================================================
echo.
cd /d "%~dp0"
echo Opening browser...
start http://localhost:3005
call npm run dev -- -p 3005
pause
