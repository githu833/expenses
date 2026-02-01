# Start all services for Expense Tracker

Write-Output "Starting Expense Tracker Services..."

# 1. Start Node Gateway
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'node-backend'; cmd /c npm start"

# 2. Start Django Transaction Service
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'django-backend'; .\venv\Scripts\python.exe manage.py runserver 8000"

# 3. Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'client'; cmd /c npm run dev"

Write-Output "Services are starting in separate windows."
Write-Output "Node Gateway: http://127.0.0.1:5000"
Write-Output "Django Service: http://127.0.0.1:8000"
Write-Output "Frontend: Check Vite output (usually http://127.0.0.1:5173)"
