Write-Host "Starting Smart Farmer Marketplace..." -ForegroundColor Green

Write-Host "[1/3] Starting ML Prediction Service (FastAPI on Port 8000)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k', "cd /d `"$PSScriptRoot\ml-service`" && `"C:\Program Files\Python312\python.exe`" -m uvicorn main:app --host 0.0.0.0 --port 8000"

Write-Host "[2/3] Starting Spring Boot Backend API (Port 8081)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k', "cd /d `"$PSScriptRoot\backend-spring-boot`" && `"C:\Program Files\Java\jdk-27.0.1.0.3\bin\java.exe`" `"@jvm_args.txt`""

Write-Host "[3/3] Starting Next.js Web Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k', "cd /d `"$PSScriptRoot\web-frontend`" && npm run dev"

Write-Host "All services launched successfully!" -ForegroundColor Green
Write-Host "Web Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend API:  http://localhost:8081/api" -ForegroundColor Yellow
Write-Host "ML Service:   http://localhost:8000" -ForegroundColor Yellow
