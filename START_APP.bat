@echo off
echo ========================================
echo   FundMeUp - Web3 Scholarship Platform
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend Server...
start "FundMeUp Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server...
if exist "frontend" (
    start "FundMeUp Frontend" cmd /k "cd frontend && npm run dev"
) else (
    echo ERROR: Frontend directory not found!
    echo Expected directory: frontend
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul

echo [3/3] Opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo   Press any key to exit...
pause >nul

