@echo off
echo Starting HireViva Platform...

start "HireViva Server" cmd /k "cd /d %~dp0server && npm start"
start "HireViva Client" cmd /k "cd /d %~dp0client && npm run dev"

echo All services started!
echo Client: http://localhost:5173
echo Server: http://localhost:5000
