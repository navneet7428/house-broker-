import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Home.css";

function Wishlist() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);

  // SAFE URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://house-broker-backend.onrender.com/api";

  const IMAGE_URL = API_URL.replace("/api", "");

  useEffect(() => {
    API.get("/wishlist")
      .then((res) => {
        setHouses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setHouses([]);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="listing-section">
        <h2>My Wishlist ({houses.length})</h2>

        {houses.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No saved properties yet
          </p>
        )}

        {houses.map((h) => (
          <div className="property-card" key={h._id}>
            {/* IMAGE */}
            <div className="property-image">
              <img
                src={`${IMAGE_URL}${h.images?.[0] || ""}`}
                alt={h.title}
                onClick={() => navigate(`/houses/${h._id}`)}
              />
            </div>

            {/* INFO */}
            <div className="property-info">
              <h3>{h.title}</h3>

              <p className="location">{h.location}</p>

              <div className="specs">
                <span>{h.bedrooms || "-"} Beds</span>
                <span>{h.bathrooms || "-"} Baths</span>
                <span>{h.carpetArea || "-"} sqft</span>
              </div>

              <div className="price-row">
                <strong>₹ {h.price}</strong>

                <button
                  className="details-btn"
                  onClick={() => navigate(`/houses/${h._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Wishlist;