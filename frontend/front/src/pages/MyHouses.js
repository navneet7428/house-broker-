import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyHouses, deleteHouse } from "../services/api";
import ImageSlider from "../components/ImageSlider";
import "../styles/myHouses.css";

function MyHouses() {
  const [houses, setHouses] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const load = () => {
    getMyHouses()
      .then((res) => setHouses(res.data))
      .catch(console.log);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredHouses =
    filter === "all"
      ? houses
      : houses.filter((h) => h.status === filter);

  return (
    <div className="my-properties-page">
      {/* HEADER */}
      <div className="mp-header">
        <div>
          <h1>My Properties</h1>
          <p>Manage your property listings</p>
        </div>

        <button
          className="add-btn"
          onClick={() => navigate("/add-house")}
        >
          + Add New Property
        </button>
      </div>

      {/* FILTERS */}
      <div className="mp-filters">
        {["all", "approved", "pending", "rejected"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="mp-grid">
        {filteredHouses.map((h) => (
          <div className="mp-card" key={h._id}>
            {/* IMAGE */}
            <div className="mp-image">
              <ImageSlider images={h.images} />
              <span className={`badge ${h.status}`}>
                {h.status}
              </span>
            </div>

            {/* CONTENT */}
            <div className="mp-content">
              <h3>{h.title}</h3>
              <p className="location">{h.location}</p>

              <div className="meta">
                🛏 {h.bedrooms} &nbsp; 🛁 {h.bathrooms} &nbsp; 📐 {h.carpetArea} sqft
              </div>

              <div className="price">₹ {h.price}</div>

              {/* ACTIONS */}
              <div className="actions">
                <button onClick={() => navigate(`/houses/${h._id}`)}>
                  View
                </button>
                <button onClick={() => navigate(`/edit-house/${h._id}`)}>
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    if (window.confirm("Delete this property?")) {
                      deleteHouse(h._id).then(load);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHouses.length === 0 && (
        <p className="empty">No properties found</p>
      )}
    </div>
  );
}

export default MyHouses;