@echo off
title Auto Clipper App Launcher
echo ===================================================
echo           Auto Clipper Web App Launcher
echo ===================================================
echo.
echo [1/3] Starting Python Backend Server (Port 8000)...
start "Auto Clipper Backend" /min cmd /c "py -3.13 -m backend.main"

echo [2/3] Waiting for Backend Server...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Web App & Opening Browser...
echo.
echo App ready at http://localhost:5173
echo.
npm run dev -- --open

pause
