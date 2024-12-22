const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  farm: String,
  block: String,
  plot: String,
  area: String,
  season: String,
  rowspace: String,
  variety: String,
  email: String,
  date: String
});

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
