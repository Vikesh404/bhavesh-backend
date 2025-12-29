require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
}));

// Routes
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/profile", profileRoutes);

// Fallback
app.use((req, res) => res.status(404).json({ error: "API route not found" }));

// DB CONNECT + SERVER START
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(10000, () => console.log("🚀 Server running on port 10000"));
  })
  .catch(err => console.error("DB Error:", err));
