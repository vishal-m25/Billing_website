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
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode,
        country: req.body.address.country,
      },
    });

    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Customer creation error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /customers/:id
router.delete('/:id', async (req, res) => {
  try {
    console.log("delete customer recieved",req.params.id);
    const deletedCustomer = await Customer.findOneAndDelete({ _id: req.params.id });

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    console.error('Error deleting customer:', err.message);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
