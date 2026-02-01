const path = require('path');
// Explicitly load .env from the current directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Global Exception Handlers
process.on('uncaughtException', (err) => {
    console.error('FATAL: Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL: Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Env Verification & Validation
console.log('--- STARTING UP (ENV VERIFICATION) ---');
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

console.log(`DJANGO_API_URL exists: ${!!process.env.DJANGO_API_URL}`);
if (process.env.DJANGO_API_URL) {
    console.log(`DJANGO_API_URL value: ${process.env.DJANGO_API_URL}`);
}

if (missingEnv.length > 0) {
    console.error('CRITICAL ERROR: Missing required environment variables:', missingEnv.join(', '));
    console.error('Please ensure they are defined in your .env file or environment.');
    process.exit(1);
}

console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || 5000);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('--------------------------------------');


let lastMongoError = null;

// Root Route & Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Expense Tracker API Gateway is online',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
        mongoError: lastMongoError
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('CRITICAL: MONGO_URI is not defined.');
    lastMongoError = "MONGO_URI is missing from environment variables";
} else {
    mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds
        socketTimeoutMS: 45000,       // 45 seconds
    })
        .then(() => {
            console.log('MongoDB: Connected successfully');
            lastMongoError = null;
        })
        .catch(err => {
            console.error('MongoDB: Connection failed:', err.message);
            lastMongoError = err.message;
        });
}

// Routes
console.log('Registering routes...');
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/transactions', require('./routes/transactions'));
    console.log('Routes registered successfully');
} catch (err) {
    console.error('CRITICAL: Failed to register routes:', err.message);
    process.exit(1);
}

// Global 404 handler for API
app.use('/api/*', (req, res) => {
    console.warn(`[404] Resource not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        msg: 'Route not found on API Gateway',
        endpoint: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- STARTUP SUCCESSFUL ---`);
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Live URL: http://0.0.0.0:${PORT}`);
});
