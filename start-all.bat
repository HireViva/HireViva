@echo off
echo Starting HireViva Platform...

start "HireViva Server" cmd /k "cd server && npm start"
start "HireViva Client" cmd /k "cd client && npm run dev"

echo Starting AI Interview Service...
start "AI Interview Server" cmd /k "cd AI-Interview\server && npm start"
start "AI Interview Client" cmd /k "cd AI-Interview\client && npm run dev"

echo All services started!
