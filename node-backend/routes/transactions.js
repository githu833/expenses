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

let djangoUrl = process.env.DJANGO_API_URL || 'http://localhost:8000';
if (!djangoUrl.startsWith('http')) {
    djangoUrl = `http://${djangoUrl}`;
}
const DJANGO_URL = djangoUrl;

// Proxy transaction requests to Django
router.use('/', auth, async (req, res) => {
    try {
        const url = `${DJANGO_URL}${req.url}`;
        console.log(`Proxying ${req.method} request to: ${url}`);

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
        console.log(`Successfully proxied to ${url}, status: ${response.status}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        const status = err.response ? err.response.status : 500;
        const data = err.response ? err.response.data : { msg: 'Django server error' };
        console.error(`Proxy error to ${DJANGO_URL}${req.url}: Status ${status}`, data);
        res.status(status).json(data);
    }
});

module.exports = router;
