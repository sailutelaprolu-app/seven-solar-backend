const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'https://sailutelaprolu-app.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb+srv://sevensolaradmin:7Solar%40789@sevensolardb.gmxn76z.mongodb.net/sevensolarDB?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// 👉 Load Routes
console.log("✅ otp.js file loaded!");
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

const otpRoutes = require('./routes/otp');
app.use('/api/customers', otpRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Seven Solar Backend is Running!');
});

// Start Server
app.listen(port, () => {
  console.log(' Server is running on http://localhost:5000');
});