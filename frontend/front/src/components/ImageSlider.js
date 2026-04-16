import React, { useState } from "react";
import "../styles/imageSlider.css";

function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const IMAGE_URL = process.env.REACT_APP_API_URL.replace("/api", "");

  const prev = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const next = () => {
    setIndex(index === images.length - 1 ? 0 : index + 1);
  };

  return (
    <div className="slider">
      <img
        src={`${IMAGE_URL}${images[index]}`}
        alt="house"
        className="slider-img"
      />

      {images.length > 1 && (
        <>
          <button className="slider-btn left" onClick={prev}>
            ‹
          </button>

          <button className="slider-btn right" onClick={next}>
            ›
          </button>
        </>
      )}

      <div className="slider-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;