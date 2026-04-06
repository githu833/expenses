const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');

            // Get user from the token using Firebase uid
            const user = await User.findOne({ uid: decoded.uid });

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Ensure uid is always available from the verified token
            req.user = user.toObject();
            req.user.uid = decoded.uid;

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
