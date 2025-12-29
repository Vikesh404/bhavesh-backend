const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User");
const OTP = require("../models/OTP");

// ----------------------------------------
// 🧾 SIGNUP (Register User)
// ----------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      dob: "",
      phone: "",
      address: "",
      profilePic: ""
    });

    res.json({ message: "Signup success" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------------------------------
// 🔐 LOGIN (Generate Token)
// ----------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ message: "Login Success", token, name: user.name });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------
// 🔁 RESET PASSWORD using OTP
// ----------------------------------------
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    const existingOtp = await OTP.findOne({ email });
    if (!existingOtp) return res.status(400).json({ message: "OTP not found" });

    if (existingOtp.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (existingOtp.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const hashedPass = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPass });

    await OTP.deleteMany({ email }); // remove used OTP

    return res.json({ message: "Password reset successful! Please login" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
