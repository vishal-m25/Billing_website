const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const app = express();
require('dotenv').config();


connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/customers', require('./routes/customers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/invoices', require('./routes/invoices'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
