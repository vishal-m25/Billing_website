const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      partId: String,
      partName: String,
      partNumber: String,
      quantity: Number,
      unitPrice: Number,
      discount: Number,
      total: Number,
    },
  ],
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  dueDate: Date,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
