# Smart Farmer Marketplace PowerShell Orchestrator
Write-Host "========================================================" -ForegroundColor Green
Write-Host "       Starting Smart Farmer Marketplace System         " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start ML Service
Write-Host "`n[1/3] Starting FastAPI Machine Learning Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\ml-service'; python -m uvicorn main:app --host 0.0.0.0 --port 8000"

Start-Sleep -Seconds 3

# 2. Start Web Frontend
Write-Host "[2/3] Starting Next.js Web Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\web-frontend'; npm run dev"

Start-Sleep -Seconds 4

# 3. Launch Browser
Write-Host "[3/3] Opening Browser at http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`nAll services initialized! Enjoy exploring Smart Farmer Marketplace." -ForegroundColor Green
