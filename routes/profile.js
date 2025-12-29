const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware – Token Check
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
}

// GET PROFILE
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// UPDATE PROFILE
router.put("/update", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, req.body);
  res.json({ message: "Profile Updated" });
});

module.exports = router;
