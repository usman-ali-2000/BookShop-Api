const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
    email:{
      type: String,
    },
    farm:{
        type: String,
    },
    date:{
      type: String,
    }
  });

const uploadFarm = new mongoose.model('uploadFarm', farmSchema);
module.exports = uploadFarm;