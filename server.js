require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");
const profileRoutes = require("./routes/profile");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// FRONTEND STATIC FILES
app.use(
  express.static(path.join(__dirname, "../frontend"), { extensions: ["html"] })
);

// API ROUTES
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/profile", profileRoutes);

// FALLBACK HANDLER
app.use((req, res) => {
  if (req.originalUrl.startsWith("/auth") ||
      req.originalUrl.startsWith("/otp") ||
      req.originalUrl.startsWith("/profile"))
    return res.status(404).json({ error: "API route not found" });

  return res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
