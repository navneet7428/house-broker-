const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// TOGGLE WISHLIST
router.post("/toggle/:houseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.wishlist) user.wishlist = [];

    const houseId = req.params.houseId;

    const exists = user.wishlist.some(
      (id) => id.toString() === houseId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== houseId
      );
    } else {
      user.wishlist.push(houseId);
    }

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Wishlist error" });
  }
});

// GET WISHLIST
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

module.exports = router;