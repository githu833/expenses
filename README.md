# Full-Stack Expense Tracker

A modern expense tracking application built with Node.js, Express, MongoDB, and React.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally

## Setup Instructions

### Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one has been created for you) with the following content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=secret_key_12345
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

## Troubleshooting (Windows)

### PowerShell Script Error
If you see an error like `File ... cannot be loaded because running scripts is disabled on this system`, you have two options:

**Option 1: Use Command Prompt (CMD)**
Open `cmd` instead of PowerShell and run the commands there.

**Option 2: Bypass Policy in PowerShell**
Run this command in your PowerShell terminal once to allow scripts for the current session:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then try `npm run dev` again.
