const express = require("express");
const router = express.Router();
const OTP = require("../models/OTP");
const sendEmail = require("../Utils/sendEmail");

// Send OTP
router.post("/request", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000;

  await OTP.create({ email, otp, expiresAt });

  await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent successfully" });
});

// VERIFY OTP
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const existingOtp = await OTP.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({ error: "OTP not found. Request again." });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // success → delete otp
    await OTP.deleteOne({ email });

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signup-send", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  await OTP.create({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  await sendEmail(email, `Your OTP is ${otp}`);
  res.json({ message: "OTP sent" });
});

router.post("/signup-verify", async (req, res) => {
  const { email, otp } = req.body;
  const record = await OTP.findOne({ email });

  if (!record) return res.status(400).json({ error: "OTP not found" });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
  if (record.expiresAt < Date.now()) return res.status(400).json({ error: "OTP expired" });

  // delete otp
  await OTP.deleteOne({ email });

  return res.json({
    verified: true,
    token: Buffer.from(email).toString("base64")  // temporary auth token
  });
});



module.exports = router;
