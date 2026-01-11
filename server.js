const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));

app.use(express.json());

/* =======================
   SERVER STATUS ROUTES
======================= */

// ✅ Root route (important for Render / monitoring)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "✅ Server is running successfully"
  });
});

// ✅ Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    server: "UP",
    timestamp: new Date().toISOString()
  });
});

/* =======================
   APPLICATION ROUTES
======================= */
app.use("/otp", require("./routes/otp"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

/* =======================
   DATABASE CONNECTION
======================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err.message);

  res.status(500).json({
    status: "ERROR",
    message: "Something went wrong in backend",
    error: err.message
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🟢 Backend status: ACTIVE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
