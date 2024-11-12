// models/Post.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner: {
        type: String,
        required: true
    }
});

const Banner = mongoose.model('bannerSchema', bannerSchema);

module.exports = Banner;
