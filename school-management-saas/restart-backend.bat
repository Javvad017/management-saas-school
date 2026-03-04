@echo off
echo ========================================
echo  Restarting School Management Backend
echo ========================================
echo.

echo Stopping existing backend process...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq backend*" 2>nul

echo.
echo Starting backend server...
cd backend
start "backend" node server.js

echo.
echo ========================================
echo  Backend server started!
echo  Running on: http://localhost:5000
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
