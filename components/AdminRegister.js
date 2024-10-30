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
    }
});

// Define the model
const AdminRegister = mongoose.model('adminSchema', adminSchema);

// Export the model
module.exports = AdminRegister;

