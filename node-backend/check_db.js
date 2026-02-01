const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('transactions');

        const recent = await collection.find().sort({ timestamp: -1 }).limit(5).toArray();
        console.log('Recent Transactions:', JSON.stringify(recent, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkTransactions();
