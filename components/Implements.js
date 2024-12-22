const mongoose = require('mongoose');

const implementsSchema = new mongoose.Schema({
  id: String,
  email: String,
  name: String,
  date: Date,
  stageid: String,
  stage: String
});

const Implements = mongoose.model('Implements', implementsSchema);

module.exports = Implements;
