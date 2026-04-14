const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    location: String,
    type: String,
    description: String,

    images: [String],

    sellerName: String,
    sellerPhone: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      default: "pending",
    },

    /* ===== NEW FIELDS START ===== */

    // PRICE DETAILS
    bookingAmount: Number,
    pricePerSqft: Number,
    registrationCharges: Number,
    maintenancePerMonth: Number,

    // PROPERTY DETAILS
    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    coveredParking: Number,
    carpetArea: Number,
    floor: Number,
    totalFloors: Number,
    facing: String,
    furnishing: String,
    transactionType: String,

    // PROJECT DETAILS
    projectName: String,
    developer: String,
    totalTowers: Number,
    totalUnits: Number,

    // AMENITIES
    amenities: [String],

    // ADDRESS & MAP
    fullAddress: String,
    landmark: String,
    latitude: Number,
    longitude: Number,

    /* ===== NEW FIELDS END ===== */
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);