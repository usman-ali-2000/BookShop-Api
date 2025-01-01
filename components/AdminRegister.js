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
        unique: true, // Ensure this field is unique
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
        default: "fresh"
    },
    date: {
        type: String,
        default: new Date().toString()
    }
});

// Middleware to generate a unique ID
adminSchema.pre("save", async function (next) {
    if (!this.generatedId) {
        const date = new Date();
        const dateString = date.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD

        // Use a counter collection or generate a random number as fallback
        const counter = await AdminRegister.countDocuments({ date: dateString });

        // Assign unique ID
        this.generatedId = `${dateString}${counter + 1}`;
    }
    next();
});

// Define the model
const AdminRegister = mongoose.model('AdminRegister', adminSchema);

// Export the model
module.exports = AdminRegister;
