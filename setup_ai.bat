@echo off
echo Setting up Python environment...
cd ai-service
.\venv\Scripts\python.exe -m pip install -r requirements.txt
echo Setup complete.
pause
