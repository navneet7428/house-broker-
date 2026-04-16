import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/houseDetails.css";

function HouseDetails() {
  const { id } = useParams();

  const [house, setHouse] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [interest, setInterest] = useState(7.5);
  const [tenure, setTenure] = useState(20);

  // SAFE URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://house-broker-backend.onrender.com/api";

  const IMAGE_URL = API_URL.replace("/api", "");

  useEffect(() => {
    API.get(`/houses/${id}`)
      .then((res) => {
        setHouse(res.data);
        setActiveImg(0);
      })
      .catch((err) => {
        console.log("Error fetching house", err);
      });
  }, [id]);

  if (!house) return <h2 className="center">Loading...</h2>;

  const images = house.images || [];

  const getValue = (val) =>
    val !== undefined && val !== null && val !== ""
      ? val
      : "Not Provided";

  const price = Number(house.price || 0);
  const downPayment = Number(house.bookingAmount || 0);
  const loanAmount = Math.max(price - downPayment, 0);

  const monthlyRate = interest / 12 / 100;
  const months = tenure * 12;

  const emi =
    loanAmount > 0
      ? Math.round(
          (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1)
        )
      : 0;

  return (
    <div className="hd-page">
      {/* GALLERY */}
      <div className="hd-gallery">
        <div className="hd-main-img">
          <img
            src={`${IMAGE_URL}${images[activeImg] || ""}`}
            alt="house"
          />

          <span className="img-count">
            {images.length > 0
              ? `${activeImg + 1}/${images.length}`
              : "0/0"}
          </span>
        </div>

        <div className="hd-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={`${IMAGE_URL}${img}`}
              alt="thumb"
              className={activeImg === i ? "active" : ""}
              onClick={() => setActiveImg(i)}
            />
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="hd-layout">
        {/* LEFT */}
        <div className="hd-left">
          <h1>{getValue(house.title)}</h1>
          <p className="hd-location">{getValue(house.location)}</p>

          <div className="hd-tags">
            <span>{getValue(house.type)}</span>
            <span>{getValue(house.status)}</span>
          </div>

          <div className="hd-price">₹ {price}</div>

          <div className="hd-features">
            <div>🛏 {getValue(house.bedrooms)} Beds</div>
            <div>🛁 {getValue(house.bathrooms)} Baths</div>
            <div>📐 {getValue(house.carpetArea)} sqft</div>
            <div>🚗 Parking</div>
          </div>

          <div className="hd-card">
            <h3>About This Property</h3>
            <p>{getValue(house.description)}</p>
          </div>

          <div className="hd-card">
            <h3>Property Details</h3>

            <div className="hd-grid">
              <div>Facing: {getValue(house.facing)}</div>
              <div>Furnishing: {getValue(house.furnishing)}</div>
              <div>Floor: {getValue(house.floor)}</div>
              <div>Total Floors: {getValue(house.totalFloors)}</div>
            </div>
          </div>

          <div className="hd-card beige">
            <h3>Price Breakdown</h3>

            <div className="price-row">
              <span>Property Price</span>
              <b>₹ {price}</b>
            </div>

            <div className="price-row">
              <span>Booking Amount</span>
              <b>₹ {getValue(house.bookingAmount)}</b>
            </div>

            <div className="price-row">
              <span>Registration Charges</span>
              <b>₹ {getValue(house.registrationCharges)}</b>
            </div>

            <div className="price-row">
              <span>Maintenance / Month</span>
              <b>₹ {getValue(house.maintenancePerMonth)}</b>
            </div>

            <div className="price-row highlight">
              <span>Price per Sqft</span>
              <b>₹ {getValue(house.pricePerSqft)}</b>
            </div>
          </div>

          <div className="hd-card">
            <h3>Amenities</h3>

            <div className="hd-amenities wide">
              {house.amenities?.length > 0 ? (
                house.amenities.map((a, i) => (
                  <div key={i} className="amenity-card">
                    {a}
                  </div>
                ))
              ) : (
                <p>Not Provided</p>
              )}
            </div>
          </div>

          {house.location && (
            <div className="hd-card">
              <h3>Location</h3>

              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  house.location
                )}&z=15&output=embed`}
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="hd-right">
          <div className="hd-seller">
            <h3>Contact Seller</h3>

            <p className="seller-name">
              {getValue(house.sellerName)}
            </p>

            <p className="seller-role">Property Agent</p>

            <p>📞 {getValue(house.sellerPhone)}</p>

            <button
              className="btn-primary"
              onClick={() =>
                house.sellerPhone &&
                window.open(`tel:${house.sellerPhone}`)
              }
            >
              📞 Call Now
            </button>

            <button
              className="btn-whatsapp"
              onClick={() =>
                house.sellerPhone &&
                window.open(
                  `https://wa.me/91${house.sellerPhone}?text=Hi, I am interested in ${house.title}`
                )
              }
            >
              💬 WhatsApp Message
            </button>
          </div>

          <div className="hd-emi">
            <h3>EMI Calculator</h3>

            <label>Loan Amount</label>
            <input
              type="range"
              min="100000"
              max="10000000"
              value={loanAmount}
              readOnly
            />

            <label>
              Interest Rate: <b>{interest}%</b>
            </label>

            <input
              type="range"
              min="3"
              max="15"
              step="0.1"
              value={interest}
              onChange={(e) =>
                setInterest(Number(e.target.value))
              }
            />

            <label>
              Loan Tenure: <b>{tenure} Years</b>
            </label>

            <input
              type="range"
              min="5"
              max="30"
              value={tenure}
              onChange={(e) =>
                setTenure(Number(e.target.value))
              }
            />

            <div className="emi-result">
              <span>Monthly EMI</span>
              <strong>₹ {emi}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetails;