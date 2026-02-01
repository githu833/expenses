const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

let djangoUrl = process.env.DJANGO_API_URL;
let urlSource = 'Environment Variable';

if (!djangoUrl) {
    if (process.env.RENDER) {
        // Render often uses the service name as host, but let's try a few variants
        djangoUrl = 'http://expense-django:10000';
        urlSource = 'Render internal fallback';
        console.log(`[Proxy] DJANGO_API_URL missing. Using ${urlSource}: ${djangoUrl}`);
    } else {
        djangoUrl = 'http://127.0.0.1:8000';
        urlSource = 'Local default';
    }
} else {
    console.log(`[Proxy] Using DJANGO_API_URL from environment: ${djangoUrl}`);
}

// Clean up the URL
djangoUrl = djangoUrl.replace(/\/$/, '');
if (!djangoUrl.startsWith('http')) {
    djangoUrl = `http://${djangoUrl}`;
}
const DJANGO_URL = djangoUrl;

// Proxy transaction requests to Django
router.use('/', auth, async (req, res) => {
    try {
        const url = `${DJANGO_URL}${req.url}`;
        console.log(`[Proxy] ${req.method} ${req.url} -> ${url}`);
        console.log(`[Proxy] Headers:`, { 'X-User-ID': req.user.id });

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            params: req.query,
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': req.user.id,
                'X-User-Email': req.user.email
            }
        });
        console.log(`[Proxy] Success: ${url}, status: ${response.status}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(`[Proxy Error] Error talking to Django at ${DJANGO_URL}${req.url}`);

        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = err.response.status;
            let data = err.response.data;

            if (typeof data === 'string') {
                console.error(`[Proxy] Django returned HTML/Text (Status ${status})`);
                data = { msg: 'Internal Django Error', detail: data.substring(0, 200) + '...' };
            } else {
                console.error(`[Proxy] Django responded with error:`, JSON.stringify(data));
            }
            res.status(status).json(data);
        } else if (err.request) {
            // The request was made but no response was received
            console.error(`[Proxy] No response received from Django. Is it running?`, err.message);
            res.status(503).json({
                msg: 'Django server connection failed',
                error: 'CONNECTION_FAILED',
                detail: `Node could not reach Django at ${DJANGO_URL}. Underlying error: ${err.message}`
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log(`[Proxy] Proxy Setup Error:`, err.message);
            res.status(500).json({
                msg: 'Django Server Error',
                error: 'PROXY_SETUP_ERROR',
                detail: err.message
            });
        }
    }
});

module.exports = router;
