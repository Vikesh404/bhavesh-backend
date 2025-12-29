require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");
const profileRoutes = require("./routes/profile");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

// CORS CONFIG (Allow frontend domain)
app.use(
  cors({
    origin: ["https://www.bhaveshrao.online", "http://localhost:3000"],
    credentials: true,
  })
);

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend running successfully 🎉",
  });
});

// ===== API ROUTES =====
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/profile", profileRoutes);

// ===== 404 HANDLER FOR WRONG API =====
app.use((req, res) => {
  return res.status(404).json({ error: "API route not found" });
});

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));


// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


