const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ================= NORMAL REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "seller" ? "seller" : "buyer",
      authProvider: "local",
      wishlist: [],
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= NORMAL LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GOOGLE REGISTER =================
router.post("/google-register", async (req, res) => {
  try {
    const { credential, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists. Please login.",
      });
    }

    const user = new User({
      name,
      email,
      password: null,
      role: role === "seller" ? "seller" : "buyer",
      authProvider: "google",
      wishlist: [],
    });

    await user.save();

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Google register failed" });
  }
});

// ================= GOOGLE LOGIN =================
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Account not found. Please register first.",
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Google login failed" });
  }
});

module.exports = router;