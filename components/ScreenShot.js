const mongoose = require('mongoose');

const ScreenShotSchema = new mongoose.Schema({
    image1: {
        type: String,
        required: true
    },
    payerId: {
        type: String,
        required: true
    },
    referId: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    verify: {
        type: Boolean,
        default: false
    },
    scam: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ScreenShot = mongoose.model('ScreenShot', ScreenShotSchema);

module.exports = ScreenShot;
