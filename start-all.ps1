# Start all services for Expense Tracker

echo "Starting Expense Tracker Services..."

# 1. Start Node Gateway
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'node-backend'; cmd /c npm start"

# 2. Start Django Transaction Service
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'django-backend'; .\venv\Scripts\python.exe manage.py runserver 8000"

# 3. Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd 'client'; cmd /c npm run dev"

echo "Services are starting in separate windows."
echo "Node Gateway: http://127.0.0.1:5000"
echo "Django Service: http://127.0.0.1:8000"
echo "Frontend: Check Vite output (usually http://localhost:5173)"
