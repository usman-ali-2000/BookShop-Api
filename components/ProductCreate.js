const mongoose = require('mongoose');

const productcreateSchema = new mongoose.Schema({
  category: String,
  product: String,
  price:Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ProductCreateSchema = mongoose.model('productcreate', productcreateSchema);

module.exports = ProductCreateSchema;
