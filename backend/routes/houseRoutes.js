const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const House = require("../models/House");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* =========================
   SAFE NUMBER FUNCTION
========================= */
const toNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

/* =========================
   ADD HOUSE (SELLER)
========================= */
router.post(
  "/add",
  protect,
  upload.array("images", 6),
  async (req, res) => {
    try {

      if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Only sellers can add houses" });
      }

      const imagePaths = req.files.map(
        (file) => `/uploads/images/${file.filename}`
      );

      const house = new House({
        title: req.body.title || "",
        price: toNumber(req.body.price),
        location: req.body.location || "",
        type: req.body.type || "",
        description: req.body.description || "",

        images: imagePaths,

        sellerName: req.body.sellerName || "",
        sellerPhone: req.body.sellerPhone || "",

        owner: new mongoose.Types.ObjectId(req.user.id),
        status: "pending",

        /* PROPERTY */
        bedrooms: toNumber(req.body.bedrooms),
        bathrooms: toNumber(req.body.bathrooms),
        carpetArea: toNumber(req.body.carpetArea),

        facing: req.body.facing || "",
        furnishing: req.body.furnishing || "",
        floor: toNumber(req.body.floor),
        totalFloors: toNumber(req.body.totalFloors),

        /* PRICE */
        bookingAmount: toNumber(req.body.bookingAmount),
        registrationCharges: toNumber(req.body.registrationCharges),
        maintenancePerMonth: toNumber(req.body.maintenancePerMonth),
        pricePerSqft: toNumber(req.body.pricePerSqft),

        /* PROJECT */
        projectName: req.body.projectName || "",
        developer: req.body.developer || "",

        /* ADDRESS */
        fullAddress: req.body.fullAddress || "",

        /* AMENITIES */
        amenities: req.body.amenities || [],
      });

      await house.save();

      res.status(201).json({
        message: "House added (pending approval)",
        house,
      });

    } catch (err) {
      console.error("ADD HOUSE ERROR:", err);
      res.status(500).json({ message: "Add house failed" });
    }
  }
);

/* =========================
   UPDATE HOUSE
========================= */
router.put("/update/:id", protect, async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid house ID" });
    }

    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (
      req.user.role !== "admin" &&
      house.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedHouse);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   MY HOUSES
========================= */
router.get("/my", protect, async (req, res) => {
  try {

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Seller only" });
    }

    const houses = await House.find({
      owner: new mongoose.Types.ObjectId(req.user.id),
    }).sort({ createdAt: -1 });

    res.json(houses);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch houses" });
  }
});

/* =========================
   APPROVED
========================= */
router.get("/approved", async (req, res) => {
  try {
    const houses = await House.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch houses" });
  }
});

/* =========================
   PENDING (ADMIN)
========================= */
router.get("/pending", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const houses = await House.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(houses);

  } catch (err) {
    console.error("PENDING ERROR:", err);
    res.status(500).json({ message: "Failed to fetch pending houses" });
  }
});

/* =========================
   APPROVE
========================= */
router.put("/approve/:id", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const house = await House.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json({ message: "House approved", house });

  } catch (err) {
    res.status(500).json({ message: "Approve failed" });
  }
});

/* =========================
   REJECT
========================= */
router.put("/reject/:id", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const house = await House.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json({ message: "House rejected", house });

  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
});

/* =========================
   DELETE
========================= */
router.delete("/delete/:id", protect, async (req, res) => {
  try {

    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    house.images.forEach((img) => {
      const imgPath = path.join(__dirname, "..", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await house.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   DETAILS
========================= */
router.get("/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid house ID" });
    }

    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    res.json(house);

  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

module.exports = router;