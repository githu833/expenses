require('dotenv').config();
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

// Env Verification
console.log('--- STARTING UP (ENV VERIFICATION) ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('--------------------------------------');

// Root Route & Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Expense Tracker API Gateway is online',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('CRITICAL: MONGO_URI is not defined.');
} else {
    mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds
        socketTimeoutMS: 45000,       // 45 seconds
    })
        .then(() => console.log('MongoDB: Connected successfully'))
        .catch(err => {
            console.error('MongoDB: Connection failed:', err.message);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- STARTUP SUCCESSFUL ---`);
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Live URL: http://0.0.0.0:${PORT}`);
});
