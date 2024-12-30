const mongoose = require('mongoose');

const TransHistorySchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    receiver: {
        type: String,
    },
    nfuc: {
        type: Number,
        default: 0
    },
    usdt: {
        type: Number,
        default: 0
    },
    pending: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TransHistory = mongoose.model('TransHistory', TransHistorySchema);

module.exports = TransHistory;
