// models/Post.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    appIcon: {
        type: String,
        required: true
    },
    ad: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    instagram: {
        type: String,
        required: true
    },
    twitter: {
        type: String,
        required: true
    },
    tiktok: {
        type: String,
        required: true
    },
    youtube: {
        type: String,
        required: true
    },
    telegram: {
        type: String,
        required: true
    },
    discord: {
        type: String,
        required: true
    }
});

const Asset = mongoose.model('assetSchema', assetSchema);

module.exports = Asset;
