const express = require("express");
const router = express.Router();
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");

// SEND OTP (Signup)
router.post("/signup-send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await OTP.deleteMany({ email }); // clear old OTPs
    await OTP.create({ email, otp, expiresAt });

    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.log("OTP SEND ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// VERIFY OTP (Signup)
router.post("/signup-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ error: "Missing fields" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ error: "OTP not found" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    if (record.otp !== Number(otp))
      return res.status(400).json({ error: "Invalid OTP" });

    await OTP.deleteMany({ email });

    return res.json({ message: "OTP verified", verified: true });
  } catch (err) {
    console.log("OTP VERIFY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
