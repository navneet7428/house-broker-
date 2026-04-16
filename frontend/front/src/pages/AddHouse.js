import React, { useState } from "react";
import API from "../services/api";
import "../styles/addHouse.css";

function AddHouse() {
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    price: "",
    bookingAmount: "",
    pricePerSqft: "",
    registrationCharges: "",
    maintenancePerMonth: "",
    bedrooms: "",
    bathrooms: "",
    carpetArea: "",
    facing: "",
    furnishing: "",
    floor: "",
    totalFloors: "",
    projectName: "",
    developer: "",
    fullAddress: "",
    sellerName: "",
    sellerPhone: "",
    amenities: [],
  });

  const amenitiesList = [
    "High-Speed WiFi",
    "Fitness Center",
    "Swimming Pool",
    "24/7 Security",
    "Garden & Landscaping",
    "Central AC",
    "Smart Home",
    "Power Backup",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
      ...form,
      [name]: value,
    };

    // Auto calculate price per sqft
    if (name === "price" || name === "carpetArea") {
      const price = Number(name === "price" ? value : form.price);
      const area = Number(name === "carpetArea" ? value : form.carpetArea);

      if (price > 0 && area > 0) {
        updated.pricePerSqft = Math.round(price / area);
      } else {
        updated.pricePerSqft = "";
      }
    }

    setForm(updated);
  };

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 6));
  };

  const removeImage = (i) => {
    setImages(images.filter((_, index) => index !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (Array.isArray(form[key])) {
        form[key].forEach((v) => data.append(key, v));
      } else {
        data.append(key, form[key]);
      }
    });

    images.forEach((img) => data.append("images", img));

    try {
      await API.post("/houses/add", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Property submitted for review");

      setForm({
        title: "",
        description: "",
        type: "",
        location: "",
        price: "",
        bookingAmount: "",
        pricePerSqft: "",
        registrationCharges: "",
        maintenancePerMonth: "",
        bedrooms: "",
        bathrooms: "",
        carpetArea: "",
        facing: "",
        furnishing: "",
        floor: "",
        totalFloors: "",
        projectName: "",
        developer: "",
        fullAddress: "",
        sellerName: "",
        sellerPhone: "",
        amenities: [],
      });

      setImages([]);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="add-house-page">
      <div className="page-header">
        <h1>Add New Property</h1>
        <p>Fill in the details to list your property</p>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="form-section">
        <h3>Property Images (Max 6)</h3>

        <div className="image-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="image-box" key={i}>
              {images[i] ? (
                <>
                  <img src={URL.createObjectURL(images[i])} alt="" />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => removeImage(i)}
                  >
                    ×
                  </button>
                </>
              ) : (
                <label className="upload-placeholder">
                  Click to upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="house-form">

        {/* BASIC */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <input name="title" value={form.title} placeholder="Property Title" onChange={handleChange} />

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
          />

          <input name="type" value={form.type} placeholder="Sale / Rent" onChange={handleChange} />
        </div>

        {/* LOCATION */}
        <div className="form-section">
          <h3>Location & Pricing</h3>

          <input name="location" value={form.location} placeholder="Location" onChange={handleChange} />

          <input
            name="price"
            type="number"
            value={form.price}
            placeholder="Total Price"
            onChange={handleChange}
          />

          <input
            name="bookingAmount"
            type="number"
            value={form.bookingAmount}
            placeholder="Booking Amount"
            onChange={handleChange}
          />

          <input
            name="pricePerSqft"
            type="number"
            value={form.pricePerSqft}
            placeholder="Price per Sqft"
            readOnly
          />

          <input
            name="registrationCharges"
            type="number"
            value={form.registrationCharges}
            placeholder="Registration Charges"
            onChange={handleChange}
          />

          <input
            name="maintenancePerMonth"
            type="number"
            value={form.maintenancePerMonth}
            placeholder="Maintenance / Month"
            onChange={handleChange}
          />
        </div>

        {/* PROPERTY */}
        <div className="form-section">
          <h3>Property Details</h3>

          <input name="bedrooms" type="number" value={form.bedrooms} placeholder="Bedrooms" onChange={handleChange} />
          <input name="bathrooms" type="number" value={form.bathrooms} placeholder="Bathrooms" onChange={handleChange} />
          <input name="carpetArea" type="number" value={form.carpetArea} placeholder="Carpet Area (sqft)" onChange={handleChange} />
          <input name="facing" value={form.facing} placeholder="Facing (North / East etc)" onChange={handleChange} />
          <input name="furnishing" value={form.furnishing} placeholder="Furnishing" onChange={handleChange} />
          <input name="floor" type="number" value={form.floor} placeholder="Floor" onChange={handleChange} />
          <input name="totalFloors" type="number" value={form.totalFloors} placeholder="Total Floors" onChange={handleChange} />
        </div>

        {/* PROJECT */}
        <div className="form-section">
          <h3>Project Details</h3>

          <input name="projectName" value={form.projectName} placeholder="Project Name" onChange={handleChange} />
          <input name="developer" value={form.developer} placeholder="Developer" onChange={handleChange} />
        </div>

        {/* AMENITIES */}
        <div className="form-section">
          <h3>Amenities</h3>

          <div className="amenities-grid">
            {amenitiesList.map((a) => (
              <label key={a}>
                <input
                  type="checkbox"
                  checked={form.amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="form-section">
          <h3>Address</h3>

          <textarea
            name="fullAddress"
            value={form.fullAddress}
            placeholder="Full Address"
            onChange={handleChange}
          />
        </div>

        {/* SELLER */}
        <div className="form-section">
          <h3>Seller Info</h3>

          <input name="sellerName" value={form.sellerName} placeholder="Seller Name" onChange={handleChange} />
          <input name="sellerPhone" value={form.sellerPhone} placeholder="Seller Phone" onChange={handleChange} />
        </div>

        <button className="submit-btn">
          Submit Property for Review
        </button>

      </form>
    </div>
  );
}

export default AddHouse;