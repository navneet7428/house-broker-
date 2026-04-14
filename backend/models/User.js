const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, default: null },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    // ✅ WISHLIST FIELD ADDED PROPERLY
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);