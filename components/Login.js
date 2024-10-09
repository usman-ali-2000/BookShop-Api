const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Check if model already exists, and use it if available to avoid OverwriteModelError
const uploadLogin = mongoose.models.uploadLogin || mongoose.model('uploadLogin', loginSchema);

module.exports = uploadLogin;
