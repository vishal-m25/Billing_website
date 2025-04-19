const mongoose = require('mongoose');

// Define the Product schema based on the interface you provided
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  partNumber: {
    type: String,
    required: true
  },
  description: {
    type: String
    },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Product model
module.exports = mongoose.model('Product', productSchema);
