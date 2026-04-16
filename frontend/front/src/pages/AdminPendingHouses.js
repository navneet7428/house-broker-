import React, { useEffect, useState } from "react";
import {
  getPendingHouses,
  getApprovedHouses,
  approveHouse,
  deleteHouse,
} from "../services/api";
import "../styles/adminPending.css";

function AdminPendingHouses() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [approvedToday, setApprovedToday] = useState(0);

  // SAFE URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://house-broker-backend.onrender.com/api";

  const IMAGE_URL = API_URL.replace("/api", "");

  const loadData = async () => {
    try {
      const pendingRes = await getPendingHouses();
      const approvedRes = await getApprovedHouses();

      const pendingData = Array.isArray(
        pendingRes.data
      )
        ? pendingRes.data
        : [];

      const approvedData = Array.isArray(
        approvedRes.data
      )
        ? approvedRes.data
        : [];

      setPending(pendingData);
      setApproved(approvedData);

      const today = new Date()
        .toISOString()
        .slice(0, 10);

      const todayApproved =
        approvedData.filter(
          (h) =>
            h.approvedAt?.slice(0, 10) ===
            today
        );

      setApprovedToday(
        todayApproved.length
      );
    } catch (err) {
      console.log(err);
      setPending([]);
      setApproved([]);
      setApprovedToday(0);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalProperties =
    pending.length + approved.length;

  const plural = (n, text) =>
    n === 1 ? text : `${text}s`;

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>
          Manage property listings and
          approvals
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Pending Approval</p>
          <h3>{pending.length}</h3>
        </div>

        <div className="stat-card success">
          <p>Approved Today</p>
          <h3>{approvedToday}</h3>
        </div>

        <div className="stat-card">
          <p>
            Total{" "}
            {plural(
              totalProperties,
              "Property"
            )}
          </p>
          <h3>{totalProperties}</h3>
        </div>
      </div>

      {/* LIST */}
      <div className="pending-box">
        <h3>Pending Approvals</h3>

        {pending.length === 0 ? (
          <p className="empty">
            No pending approvals
          </p>
        ) : (
          pending.map((h) => (
            <div
              className="pending-card"
              key={h._id}
            >
              <img
                src={`${IMAGE_URL}${
                  h.images?.[0] || ""
                }`}
                alt={h.title}
              />

              <div className="info">
                <h4>{h.title}</h4>
                <p>{h.location}</p>

                <div className="meta">
                  <span>
                    {h.bedrooms || "-"} Beds
                  </span>
                  <span>
                    {h.bathrooms || "-"} Baths
                  </span>
                  <span>
                    {h.carpetArea || "-"} sqft
                  </span>
                </div>

                <p className="price">
                  ₹ {h.price}
                </p>

                <div className="actions">
                  <button
                    className="approve"
                    onClick={() =>
                      approveHouse(
                        h._id
                      ).then(loadData)
                    }
                  >
                    ✓ Approve
                  </button>

                  <button
                    className="reject"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Reject this property?"
                        )
                      ) {
                        deleteHouse(
                          h._id
                        ).then(loadData);
                      }
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPendingHouses;