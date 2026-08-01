@echo off
title Auto Clipper Online Tunnel Launcher
echo ===================================================
echo   Auto Clipper Online Tunnel (Zero Credit Card)
echo ===================================================
echo.
echo [1/2] Starting Python Backend Server (Port 8000)...
start "Auto Clipper Backend" /min cmd /c "py -3.13 -m backend.main"

echo [2/2] Creating Secure HTTPS Tunnel for Netlify...
echo.
echo Salin URL HTTPS yang muncul di bawah ini ke menu Settings di Netlify:
echo.
npx --yes localtunnel --port 8000

pause
