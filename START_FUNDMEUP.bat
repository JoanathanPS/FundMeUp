@echo off
echo ============================================================
echo    FUNDMEUP FRONTEND - STARTUP SCRIPT
echo ============================================================
echo.

echo [1/4] Checking if .env exists...
if not exist .env (
    echo Creating .env file...
    (
        echo VITE_API_URL=http://localhost:5000
        echo VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
        echo VITE_RPC_URL=http://127.0.0.1:8545
        echo VITE_CHAIN_ID=31337
        echo VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
        echo VITE_ALCHEMY_API_KEY=your-alchemy-api-key
        echo VITE_ENABLE_WEB3=true
        echo VITE_ENABLE_AI=true
        echo VITE_ENABLE_NOTIFICATIONS=true
        echo VITE_NODE_ENV=development
    ) > .env
    echo ✅ .env created
) else (
    echo ✅ .env already exists
)

echo.
echo [2/4] Checking node_modules...
if not exist node_modules (
    echo Installing dependencies (this may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo [3/4] Checking backend server...
echo Testing backend at http://localhost:5000...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  WARNING: Backend server not responding!
    echo.
    echo Please start the backend first:
    echo   1. Open a new terminal
    echo   2. cd ../backend
    echo   3. npm run dev
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo ✅ Backend is running
)

echo.
echo [4/4] Starting FundMeUp frontend...
echo.
echo ============================================================
echo    🚀 FUNDMEUP FRONTEND STARTING...
echo ============================================================
echo.
echo Frontend will open at: http://localhost:5173
echo.
echo Features:
echo   🎓 Student Dashboard
echo   💰 Donor Interface  
echo   📊 Impact Feed
echo   🏆 Leaderboard
echo   🔗 Web3 Integration
echo   🤖 AI Features
echo.
echo To stop the server, press Ctrl+C
echo.
echo ============================================================

npm run dev

echo.
echo Server stopped.
pause


