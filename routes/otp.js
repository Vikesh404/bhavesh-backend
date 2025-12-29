const express = require("express");
const router = express.Router();
const OTP = require("../models/OTP");
const sendEmail = require("../Utils/sendEmail");

// SEND OTP (Signup)
router.post("/signup-send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await OTP.create({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await sendEmail(email, "Signup OTP", `Your OTP is ${otp}`); // FIXED

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Signup OTP Error:", err);
    return res.status(500).json({ error: "Server error sending OTP" });
  }
});

// VERIFY SIGNUP OTP
router.post("/signup-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ error: "OTP not found" });
    if (record.expiresAt < Date.now()) return res.status(400).json({ error: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    await OTP.deleteOne({ email });

    return res.json({ verified: true });
  } catch (err) {
    console.error("Signup Verify Error:", err);
    return res.status(500).json({ error: "Server error verifying OTP" });
  }
});
