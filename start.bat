@echo off
echo ========================================
echo Healthcare Claims Processing System
echo ========================================
echo.
echo Starting Backend API Server...
echo.
start cmd /k "python api_server.py"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend...
echo.
cd frontend
start cmd /k "npm run dev"
cd ..
echo.
echo ========================================
echo System Started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
