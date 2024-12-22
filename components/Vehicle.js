const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  email: String,
  vehicle: String,
  date: Date
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
