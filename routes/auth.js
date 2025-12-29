const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    return res.json({ message: "Account created successfully", user });
  } catch (err) {
    console.log("AUTH SIGNUP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "SECRET_KEY");

    return res.json({ message: "Login successful", token, name: user.name });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
