const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🚀 Reset Password using OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // check otp from db
    const OTP = require("../models/OTP");
    const existingOtp = await OTP.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPass });

    await OTP.deleteMany({ email });

    return res.json({ message: "Password reset successful! Please login" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
