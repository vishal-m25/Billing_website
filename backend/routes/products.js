const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Use the Product model

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body); // Create new Product from the request body
    const savedProduct = await newProduct.save(); // Save the new product to the database
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
