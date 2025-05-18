const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice.model');

router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('customer').populate('items.partId');
  res.json(invoices);
});



router.post('/', async (req, res) => {
  const invoice = new Invoice(req.body);
  const saved = await invoice.save();
  res.json(saved);
});

module.exports = router;
