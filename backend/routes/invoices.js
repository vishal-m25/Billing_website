const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('customerId').populate('items.productId');
  res.json(invoices);
});

router.post('/', async (req, res) => {
  const invoice = new Invoice(req.body);
  const saved = await invoice.save();
  res.json(saved);
});

module.exports = router;
