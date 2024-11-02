// models/Post.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    views: [{
        type: mongoose.Schema.Types.ObjectId,
    }], // Array of user IDs who viewed the post
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Task = mongoose.model('Post', taskSchema);

module.exports = Task;
