const Invoice = require('../models/Invoice.model');
const Customer = require('../models/customer.model');
const Product = require('../models/Product.model');

exports.createInvoice = async (req, res) => {
  try {
    const { customer, items, ...invoiceData } = req.body;

    // 1. Validate customer
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // 2. Loop through items to update stock
    for (let item of items) {
      const product = await Product.findById(item.partId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.partId} not found` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        });
      }

      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // 3. Create invoice
    const invoice = await Invoice.create({ ...invoiceData, customer, items });
    res.status(201).json(invoice);

  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customer');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
