@echo off
echo ========================================
echo  Testing School Management Backend
echo ========================================
echo.

echo [1/3] Testing backend health...
curl -s http://localhost:5000/api/health
echo.
echo.

echo [2/3] Testing login API...
curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
echo.
echo.

echo [3/3] Checking backend process...
netstat -ano | findstr :5000
echo.

echo ========================================
echo  Test Complete!
echo ========================================
echo.
echo If you see:
echo  - Health: success true
echo  - Login: token returned
echo  - Process: LISTENING on port 5000
echo.
echo Then backend is working correctly!
echo.
echo Now open: super-admin-panel/login.html
echo Login with: admin@test.com / admin123
echo.
pause
