const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model'); 

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const generateCustomerId = async () => {
  const lastCustomer = await Customer.findOne().sort({ createdAt: -1 }).limit(1);
  if (!lastCustomer || !lastCustomer.id) return "C001";

  const lastIdNum = parseInt(lastCustomer.id.substring(1)) || 0;
  const newIdNum = lastIdNum + 1;
  return `C${String(newIdNum).padStart(3, '0')}`;
};

// POST new customer
router.post('/', async (req, res) => {
  try {
    console.log("recieved");  
    const newId = await generateCustomerId();

    const customer = new Customer({
      id: newId,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    });

    const savedCustomer = await customer.save();
    console.log(customer);
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
