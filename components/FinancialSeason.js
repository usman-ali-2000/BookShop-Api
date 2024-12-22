
const mongoose = require("mongoose");

const financialseasonSchema = new mongoose.Schema({
    email:{
      type: String,
    },
    year:{
        type: String,
    },
    date:{
      type: String,
    }
  });

const uploadFinancialSeason = new mongoose.model('uploadFinancialSeason', financialseasonSchema);
module.exports = uploadFinancialSeason;
