const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  imageUrl:{
    type:String,
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
