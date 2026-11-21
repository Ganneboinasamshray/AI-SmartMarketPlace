@echo off
echo Starting Smart Farmer Marketplace...

echo [1/3] Starting ML Prediction Service (FastAPI on Port 8000)...
start "SmartFarmer - ML Service" cmd /k "cd /d "%~dp0ml-service" && "C:\Program Files\Python312\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000"

echo [2/3] Starting Spring Boot Backend API (Port 8081)...
start "SmartFarmer - Backend API" cmd /k "cd /d "%~dp0backend-spring-boot" && "C:\Program Files\Java\jdk-27.0.1.0.3\bin\java.exe" "@jvm_args.txt""

echo [3/3] Starting Next.js Web Frontend (Port 3000)...
start "SmartFarmer - Frontend" cmd /k "cd /d "%~dp0web-frontend" && npm run dev"

echo All services launched!
echo Web Frontend: http://localhost:3000
echo Backend API:  http://localhost:8081/api
echo ML Service:   http://localhost:8000
