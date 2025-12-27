const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetOtp: String,
  resetOtpExpires: Date
});

// ⚠️ Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
