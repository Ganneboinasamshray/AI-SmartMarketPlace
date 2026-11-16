@echo off
title Smart Farmer Marketplace Launcher
echo ========================================================
echo       Starting Smart Farmer Marketplace System
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Launching FastAPI Machine Learning Service (Port 8000)...
start "Smart Farmer ML Service" cmd /k "cd ml-service && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Next.js Web Frontend (Port 3000)...
start "Smart Farmer Web Application" cmd /k "cd web-frontend && npm run dev"

timeout /t 4 /nobreak >nul

echo [3/3] Opening Smart Farmer Marketplace in browser...
start http://localhost:3000

echo.
echo ========================================================
echo System online!
echo Web Application: http://localhost:3000
echo ML Service API:   http://localhost:8000/docs
echo Spring Boot Code: backend-spring-boot/ (port 8080)
echo ========================================================
echo.
pause
