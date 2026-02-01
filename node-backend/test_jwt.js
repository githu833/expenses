const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const jwt = require('jsonwebtoken');

console.log('--- JWT Environment Test ---');
console.log('__dirname:', __dirname);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
if (process.env.JWT_SECRET) {
    console.log('JWT_SECRET value length:', process.env.JWT_SECRET.length);
}

const payload = { test: 'data' };
try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT Sign Success: Token generated');
} catch (err) {
    console.error('JWT Sign Failed:', err.message);
}
console.log('---------------------------');
