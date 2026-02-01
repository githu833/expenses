# Start all services for Expense Tracker

echo "Starting Expense Tracker Services..."

# 1. Start Node Gateway
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'node-backend'; npm start" -Title "Node Gateway (Port 5000)"

# 2. Start Django Transaction Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'django-backend'; .\venv\Scripts\activate; python manage.py runserver 8000" -Title "Django Service (Port 8000)"

# 3. Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'client'; npm run dev" -Title "Frontend (Vite)"

echo "Services are starting in separate windows."
echo "Node Gateway: http://127.0.0.1:5000"
echo "Django Service: http://127.0.0.1:8000"
echo "Frontend: Check Vite output (usually http://localhost:5173)"
