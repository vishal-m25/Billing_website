const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pid: Number,
  name: String,
  cp: Number,
  price: Number,
  stock: Number
});

module.exports = mongoose.model('Product', productSchema);
