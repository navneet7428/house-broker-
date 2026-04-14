const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

/* ============================= */
/* MIDDLEWARE */
/* ============================= */

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================= */
/* ROUTES */
/* ============================= */

const authRoutes = require("./routes/authRoutes");
const houseRoutes = require("./routes/houseRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Test route (important to avoid "Cannot GET /")
app.get("/", (req, res) => {
  res.send("House Broker API Running 🚀");
});

/* ============================= */
/* DATABASE CONNECTION */
/* ============================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

/* ============================= */
/* GLOBAL ERROR HANDLER */
/* ============================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ============================= */
/* START SERVER */
/* ============================= */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});