# Expense Tracker (24/7 Cross-Device)

A full-stack expense tracking application featuring a React frontend, Node.js API Gateway, and Django Business Logic service. Designed for 24/7 accessibility on all devices via cloud deployment.

## Deployment Strategy (Hybrid)

This project is optimized for a hybrid deployment:
- **Frontend**: [Netlify](https://www.netlify.com/)
- **Backends**: [Render](https://render.com/)

### 1. Backend Deployment (Render)
1. Sign in to Render and create a new **Blueprint**.
2. Connect this repository. Render will automatically detect `render.yaml`.
3. Provide the required environment variables (`MONGO_URI`, `JWT_SECRET`, `DJANGO_SECRET_KEY`).
4. Copy the URL of the `expense-node` service once deployed.

### 2. Frontend Deployment (Netlify)
1. Sign in to Netlify and **Import from Git**.
2. Select this repository and set the base directory to `client`.
3. Set the build command to `npm run build` and publish directory to `dist`.
4. Add an environment variable `VITE_API_URL` set to your Render Node URL + `/api`.

## Features
- **PWA Support**: Installable on iOS/Android home screens.
- **Glassmorphic UI**: Modern, premium design.
- **Microservices**: Scalable architecture with Node.js and Django.
