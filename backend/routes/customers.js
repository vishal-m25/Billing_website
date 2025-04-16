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
  const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });

  let lastId = 0;

  if (lastCustomer && lastCustomer.id) {
    const match = lastCustomer.id.match(/C(\d+)/);
    if (match) {
      lastId = parseInt(match[1]);
    }
  }

  let newId;
  let exists = true;

  // Loop to ensure uniqueness
  do {
    lastId += 1;
    newId = `C${String(lastId).padStart(3, "0")}`;
    exists = await Customer.exists({ id: newId });
  } while (exists);

  return newId;
};


router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer({
      id: await generateCustomerId(),
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    });

    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Customer creation error:", err.message);
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
