@echo off
cd /d "%~dp0"
"C:\Program Files\Python312\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
