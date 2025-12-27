require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");

const app = express();



// MIDDLEWARE
app.use(cors());
app.use(express.json());   // <<<<<<<<<< IMPORTANT (Fixes req.body undefined)

// ROUTES
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);


// CONNECT MONGO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });

// START SERVER
const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
