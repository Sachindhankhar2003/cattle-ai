@echo off
echo Starting Buffalo Breed Recognition Application...

echo Starting AI Service on port 8000...
start "AI Service" cmd /k "cd ai-service && .\venv\Scripts\python.exe predict_api.py"

echo Starting Node Backend on port 5000...
start "Node Backend" cmd /k "cd server && npm run dev"

echo Starting React Frontend...
start "React Frontend" cmd /k "cd client && npm run dev"

echo All services have been launched in separate windows!
pause
