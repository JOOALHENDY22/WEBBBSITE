@echo off
echo ===================================================
echo   Mini Doctors - Starting Development Server...
echo ===================================================
echo.
cd /d "%~dp0"
echo Opening browser at http://localhost:3000
timeout /t 2 /nobreak >nul
start http://localhost:3000
call npm run dev
pause
