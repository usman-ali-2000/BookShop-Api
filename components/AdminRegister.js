const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    generatedId: {
        type: String,
    },
    userId: {
        type: String,
    },
    password: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    coin: {
        type: Number,
        default: 0
    },
    referCoin: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
    },
    nfuc: {
        type: Number,
        default: 0
    },
    nfucRefer: {
        type: Number,
        default: 0
    },
    usdt: {
        type: Number,
        default: 0
    },
    accType:{
        type: String,
    },
    date: {
        type: String,
        default: new Date().toString()
    }
});

// Define the model
const AdminRegister = mongoose.model('adminSchema', adminSchema);

// Export the model
module.exports = AdminRegister;

