import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Home.css";

function Wishlist() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    API.get("/wishlist")
      .then((res) => {
        setHouses(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-page">

      <section className="listing-section">
        <h2>My Wishlist ({houses.length})</h2>

        {houses.length === 0 && (
          <p style={{marginTop:"20px"}}>No saved properties yet</p>
        )}

        {houses.map((h) => (
          <div className="property-card" key={h._id}>

            <div className="property-image">
              <img
                src={`http://localhost:3001${h.images?.[0]}`}
                alt={h.title}
                onClick={() => navigate(`/houses/${h._id}`)}
              />
            </div>

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