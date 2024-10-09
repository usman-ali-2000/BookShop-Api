const mongoose = require('mongoose');

const dailyEntrySchema = new mongoose.Schema({
  id: String,
  farm: String,
  plot: String,
  season:String,
  area: String,
  stage: String,
  type: String,
  deal: String,
  time: String,
  mean: String,
  fuel: String,
  person: String,
  quantity: String,
  moga: String,
  units: String,
  email: String,
  date: String,
  year:String,
});

const DailyEntry = mongoose.model('DailyEntry', dailyEntrySchema);

module.exports = DailyEntry;
