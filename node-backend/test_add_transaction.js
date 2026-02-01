const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const user = {
    id: "697e02f67ed1c1d374b4ba99",
    email: "achyuthamaniram1@gmail.com"
};

const secret = process.env.JWT_SECRET;
const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

const testTransaction = async () => {
    try {
        console.log('Sending transaction addition request...');
        const response = await axios.post('http://localhost:5000/api/transactions/add/', {
            type: 'credit',
            amount: 100.50,
            details: 'Test Credit Transaction'
        }, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('Error:', err.response ? err.response.status : err.message);
        if (err.response) {
            console.error('Error Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
};

testTransaction();
