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

const testSummary = async () => {
    try {
        console.log('Fetching summary...');
        const response = await axios.get('http://127.0.0.1:5000/api/transactions/summary/', {
            headers: {
                'x-auth-token': token
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

const testHistory = async () => {
    try {
        console.log('Fetching history...');
        const response = await axios.get('http://127.0.0.1:5000/api/transactions/history/', {
            headers: {
                'x-auth-token': token
            }
        });
        console.log('Response Status:', response.status);
        console.log('Response Data Length:', response.data.length);
        if (response.data.length > 0) {
            console.log('First Transaction:', JSON.stringify(response.data[0], null, 2));
        }
    } catch (err) {
        console.error('Error:', err.response ? err.response.status : err.message);
        if (err.response) {
            console.error('Error Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
};

const runTests = async () => {
    await testSummary();
    await testHistory();
};

runTests();
