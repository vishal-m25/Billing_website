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
// Update an existing product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// routes/products.js
router.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
