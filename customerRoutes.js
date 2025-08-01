
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Route to register a new customer
router.post('/register', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering customer', details: error });
  }
});
// Route to get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers', details: error });
  }
});

// Request OTP
router.post("/request-otp", async (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  try {
    await Customer.updateOne(
      { mobileNumber },
      { $set: { otp, otpExpiry } },
      { upsert: false }
    );
    console.log('OTP for ${mobileNumber} is ${otp}');
    res.status(200).json({ message: "OTP sent successfully (check console)" });
  } catch (err) {
    res.status(500).json({ error: "Error generating OTP", details: err });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const customer = await Customer.findOne({ mobileNumber });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (
      customer.otp == otp &&
      customer.otpExpiry &&
      new Date(customer.otpExpiry) > new Date()
    ) {
      // OTP is valid
      res.status(200).json({ message: "Login successful", customerId: customer._id });
    } else {
      res.status(401).json({ error: "Invalid or expired OTP" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error verifying OTP", details: err });
  }
});

// In routes/customerRoutes.js

router.get('/get-customer/:mobileNumber', async (req, res) => {
  const { mobileNumber } = req.params;

  try {
    const customer = await Customer.findOne({ mobileNumber });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer', details: error.message });
  }
});


module.exports = router;