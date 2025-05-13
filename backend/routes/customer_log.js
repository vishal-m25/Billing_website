const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model');
const invoice = require('../models/Invoice')

router.get('/:id/invoices', async (req, res) => {
    try {
      const customerId = req.params.id;
      const invoices = await invoice.find({ customer }).populate('items.partId');
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch invoices for customer' });
    }
  });
  
module.exports = router;
