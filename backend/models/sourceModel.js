const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Source name is required'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Source', sourceSchema);
