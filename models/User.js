const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // Profile Fields
  dob: String,
  phone: String,
  address: String,
  profilePic: String,

  // Reset Password OTP
  resetOtp: String,
  resetOtpExpires: Date,
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
