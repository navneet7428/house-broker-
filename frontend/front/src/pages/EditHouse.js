import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/editHouse.css";

function EditHouse() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [house, setHouse] = useState({
    title: "",
    price: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    API.get(`/houses/${id}`).then(res => {
      setHouse(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setHouse({
      ...house,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put(`/houses/update/${id}`, house);

    navigate("/my-houses");
  };

  return (
    <div className="edit-page">

      <div className="edit-card">

        <h2>Edit Property</h2>

        <form onSubmit={handleSubmit} className="edit-form">

          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={house.title}
              onChange={handleChange}
              placeholder="Property title"
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              value={house.price}
              onChange={handleChange}
              placeholder="Property price"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={house.location}
              onChange={handleChange}
              placeholder="City / Area"
            />
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              name="description"
              value={house.description}
              onChange={handleChange}
              placeholder="Property description"
            />
          </div>

          <button className="update-btn" type="submit">
            Update Property
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditHouse;