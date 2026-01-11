const express = require("express");
const router = express.Router();
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");

/* ================= SEND OTP ================= */
router.post("/signup-send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    console.log(`🔐 OTP for ${email} = ${otp}`);

    // 🔹 Send Email
    const emailSent = await sendEmail(
      email,
      "Your OTP Code – BhaveshRao",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "OTP generated but email delivery failed"
      });
    }

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/signup-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ message: "OTP invalid or expired" });
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    await OTP.deleteMany({ email });
    res.json({ message: "OTP verified" });

  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ message: "OTP verify failed" });
  }
});

module.exports = router;
