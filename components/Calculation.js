const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
    soldNfuc: {
        type: Number,
        default: 0
    },
    usdt: {
        type: Number,
        default: 0
    },
    withdrawUsdt: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Calculation = mongoose.model('Calculation', CalculationSchema);

module.exports = Calculation;
