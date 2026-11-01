@echo off
title Rio Banking Platform - Presentation Demo
color 0b

echo ========================================================
echo          RIO BANKING - ENTERPRISE DEMO RUNNER
echo ========================================================
echo Starting 3 tiers:
echo   1. Python Risk and Analytics Microservice (:8000)
echo   2. Node.js Secure Backend (:5000)
echo   3. Next.js Frontend Presentation Portal (:3000)
echo ========================================================
echo.

REM 1. Start Python Microservice
echo [1/3] Starting Python Microservice on port 8000...
start "Rio Microservice (:8000)" cmd /k "cd /d "%~dp0data-service\app" && python main.py"

REM 2. Start Node.js Backend
echo [2/3] Starting Node.js API Gateway on port 5000...
start "Rio Backend API (:5000)" cmd /k "cd /d "%~dp0backend" && node src/server.js"

REM 3. Start Next.js Frontend
echo [3/3] Starting Next.js Presentation Frontend on port 3000...
start "Rio Frontend (:3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All tiers launched in separate windows!
echo Opening browser to http://localhost:3000...
start http://localhost:3000

echo ========================================================
echo Rio Banking is LIVE at http://localhost:3000
echo ========================================================


