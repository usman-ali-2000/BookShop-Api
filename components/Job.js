const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    email: String,
    job: String,
    date: String
  });
  
  const Job = mongoose.model('Job', jobSchema);
  
  module.exports = Job;
  
