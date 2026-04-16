import React, { useState } from "react";
import "../styles/imageSlider.css";

function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  // SAFE URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://house-broker-backend.onrender.com/api";

  const IMAGE_URL = API_URL.replace("/api", "");

  const prev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0
        ? images.length - 1
        : prevIndex - 1
    );
  };

  const next = () => {
    setIndex((prevIndex) =>
      prevIndex === images.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  return (
    <div className="slider">
      <img
        src={`${IMAGE_URL}${images[index] || ""}`}
        alt="house"
        className="slider-img"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="slider-btn left"
            onClick={prev}
          >
            ‹
          </button>

          <button
            type="button"
            className="slider-btn right"
            onClick={next}
          >
            ›
          </button>
        </>
      )}

      <div className="slider-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={
              i === index
                ? "dot active"
                : "dot"
            }
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;