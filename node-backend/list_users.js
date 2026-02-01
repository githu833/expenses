const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await User.find({}, { email: 1, _id: 1 });
        console.log('Users:', JSON.stringify(users, null, 2));
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
