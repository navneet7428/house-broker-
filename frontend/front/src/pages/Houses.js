import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedHouses, deleteHouse } from "../services/api";
import "../styles/houses.css";

function Houses() {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // SAFE URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://house-broker-backend.onrender.com/api";

  const IMAGE_URL = API_URL.replace("/api", "");

  const load = () => {
    getApprovedHouses()
      .then((res) => {
        const data = res.data.map((h) => ({
          ...h,
          imageIndex: 0,
        }));
        setHouses(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    load();
  }, []);

  const nextImage = (id) => {
    setHouses((prev) =>
      prev.map((h) =>
        h._id === id
          ? {
              ...h,
              imageIndex:
                (h.imageIndex + 1) % (h.images?.length || 1),
            }
          : h
      )
    );
  };

  const prevImage = (id) => {
    setHouses((prev) =>
      prev.map((h) =>
        h._id === id
          ? {
              ...h,
              imageIndex:
                (h.imageIndex - 1 + (h.images?.length || 1)) %
                (h.images?.length || 1),
            }
          : h
      )
    );
  };

  return (
    <div className="listing-page">
      <h2 className="page-title">Available Properties</h2>

      {houses.map((h) => (
        <div className="listing-card" key={h._id}>
          {/* IMAGE */}
          <div className="listing-image">
            <img
              src={`${IMAGE_URL}${h.images?.[h.imageIndex] || ""}`}
              alt={h.title}
              onClick={() => navigate(`/houses/${h._id}`)}
            />

            {h.images && h.images.length > 1 && (
              <>
                <button
                  className="img-btn left"
                  onClick={() => prevImage(h._id)}
                >
                  ‹
                </button>

                <button
                  className="img-btn right"
                  onClick={() => nextImage(h._id)}
                >
                  ›
                </button>
              </>
            )}

            <span className="photo-count">
              {h.images?.length || 0} Photos
            </span>
          </div>

          {/* DETAILS */}
          <div
            className="listing-details"
            onClick={() => navigate(`/houses/${h._id}`)}
          >
            <h3>{h.title}</h3>

            <p className="sub-location">{h.location}</p>

            <p>
              {h.description
                ? `${h.description.slice(0, 100)}...`
                : "No description available"}
            </p>
          </div>

          {/* ACTION */}
          <div className="listing-action">
            <div className="price">₹ {h.price}</div>

            <button
              className="btn primary"
              onClick={() => navigate(`/houses/${h._id}`)}
            >
              View Details
            </button>

            {user?.role === "admin" && (
              <button
                className="btn danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this property permanently?"
                    )
                  ) {
                    deleteHouse(h._id).then(load);
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Houses;