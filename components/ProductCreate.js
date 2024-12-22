const mongoose = require('mongoose');

const productcreateSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true // Make 'category' required
  },
  product: {
    type: String,
    required: true // Make 'product' required
  },
  price: {
    type: Number,
    required: true // Make 'price' required
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true // Make 'timestamp' required
  }
});

const ProductCreateSchema = mongoose.model('productcreate', productcreateSchema);

module.exports = ProductCreateSchema;
