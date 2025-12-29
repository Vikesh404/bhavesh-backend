const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: Number,
  expiresAt: Number,
});

module.exports = mongoose.model("OTP", otpSchema);
