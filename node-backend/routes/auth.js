const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id, email: user.email } };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('CRITICAL: JWT_SECRET is missing from environment variables');
            return res.status(500).json({ msg: 'Server configuration error: JWT_SECRET missing' });
        }

        jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Signing Error (Register):', err.message);
                return res.status(500).json({ msg: 'Error generating authentication token', error: err.message });
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, email: user.email } };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('CRITICAL: JWT_SECRET is missing from environment variables');
            return res.status(500).json({ msg: 'Server configuration error: JWT_SECRET missing' });
        }

        jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Signing Error (Login):', err.message);
                return res.status(500).json({ msg: 'Error generating authentication token', error: err.message });
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login', error: err.message });
    }
});

module.exports = router;
