const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

/* 🔥 Prevent OverwriteModelError */
module.exports = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
