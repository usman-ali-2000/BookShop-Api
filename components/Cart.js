const mongoose = require('mongoose');

// Schema for individual cart item
const cartItemSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  product: { 
    type: String,  // Changed to String, assuming it's the product name
    required: true 
  },
  qty: { 
    type: Number, 
    required: true 
  },
  title: { 
    type: String,  // Changed to String, assuming it's the title of the product
    required: true 
  }
});

// Schema for Cart
const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending', 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  items: [cartItemSchema]  // Array to hold multiple cart items
});

// Model for individual cart
const Cart = mongoose.model('Cart', cartSchema);

// Model for CartCollection (optional, as this could be part of Cart itself)
const CartCollection = mongoose.model('CartCollection', new mongoose.Schema({
  categories: [cartItemSchema]  // Just a collection of cart items (not necessary if included in Cart schema)
}));

module.exports = { Cart, CartCollection };
