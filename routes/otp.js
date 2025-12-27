const express = require("express");
const router = express.Router();
const OTP = require("../models/OTP");
const sendEmail = require("../Utils/sendEmail");

// Send OTP
router.post("/request", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000;

  await OTP.create({ email, otp, expiresAt });

  await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent successfully" });
});

// VERIFY OTP
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const existingOtp = await OTP.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({ error: "OTP not found. Request again." });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // success → delete otp
    await OTP.deleteOne({ email });

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
