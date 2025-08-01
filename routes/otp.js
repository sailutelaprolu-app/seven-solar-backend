const express = require('express');
const router = express.Router();
const Otp = require('../models/otp');

// Route to generate OTP
router.post('/generate-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const newOtp = new Otp({
      mobileNumber,
      otp: otpCode,
      createdAt: new Date(),
    });

    await newOtp.save();
         console.log("📩 OTP creation started...");
         console.log(`Generated OTP for ${mobileNumber}: ${otpCode}`);
         console.log("✅ OTP saved to MongoDB");


    res.status(200).json({ message: 'OTP sent successfully', otp: otpCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate OTP', details: error.message });
  }
});

// Route to verify OTP (with debug logs)
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;

  console.log("\n🟡 Incoming OTP Verification Request");
  console.log("📲 Mobile Number:", mobileNumber);
  console.log("🔢 OTP Received:", otp);

  if (!mobileNumber || !otp) {
    console.log("❌ Missing mobile number or OTP");
    return res.status(400).json({ error: 'Mobile number and OTP are required' });
  }

  try {
    const latestOtp = await Otp.findOne({ mobileNumber }).sort({ createdAt: -1 });

    if (!latestOtp) {
      console.log("❌ No OTP found in DB for this number");
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log("✅ OTP Found in DB:", latestOtp.otp);
    console.log("🕒 OTP Created At:", latestOtp.createdAt);

    const now = new Date();
    const otpAge = (now - latestOtp.createdAt) / 1000; // in seconds
    console.log("⏱️ OTP Age (seconds):", otpAge);

    if (otpAge > 300) {
      console.log("❌ OTP has expired");
      return res.status(401).json({ error: 'OTP expired' });
    }

    if (Number(latestOtp.otp) === Number(otp)) {
      console.log("✅ OTP matched!");
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      console.log("❌ OTP mismatch");
      return res.status(400).json({ error: 'Invalid OTP' });
    }

  } catch (error) {
    console.error("🔥 Error during OTP verification:", error);
    return res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
  }
});

module.exports = router;
