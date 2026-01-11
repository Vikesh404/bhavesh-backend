const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:10000",
  "http://127.0.0.1:10000",

  // ✅ REAL VERCEL FRONTEND (IMPORTANT)
  "https://bhavesh-rho.vercel.app",

  // (optional – keep if you plan another frontend)
  "https://bhavesh-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());

/* =======================
   SERVER STATUS ROUTES
======================= */

// Root route (Render health check)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "✅ Server is running successfully"
  });
});

// Health check
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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🟢 Backend status: ACTIVE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
