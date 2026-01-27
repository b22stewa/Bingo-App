@echo off
echo ====================================
echo   Bingo App - Quick Start Script
echo ====================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ====================================
echo   Dependencies installed!
echo ====================================
echo.
echo IMPORTANT: Make sure you have created:
echo   - backend/.env (with database credentials)
echo   - frontend/.env (with API URL)
echo.
echo Starting the app...
echo.

call npm run dev

pause










