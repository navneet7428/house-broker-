import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { isLoggedIn } from "../services/auth";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const [houses, setHouses] = useState([]);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // FILTER STATES
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bedFilter, setBedFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // ===============================
  // FETCH APPROVED HOUSES
  // ===============================
  useEffect(() => {
    API.get("/houses/approved")
      .then((res) => {
        setHouses(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // ===============================
  // FETCH USER WISHLIST
  // ===============================
  useEffect(() => {
    if (isLoggedIn()) {
      API.get("/wishlist")
        .then((res) => {
          setWishlist(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => setWishlist([]));
    }
  }, []);

  // ===============================
  // SEARCH BUTTON
  // ===============================
  const handleSearch = () => {
    setQuery(searchInput);
  };

  // ===============================
  // TOGGLE WISHLIST
  // ===============================
  const handleWishlist = async (houseId) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await API.post(`/wishlist/toggle/${houseId}`);
      setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []);
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // SEARCH + FILTER LOGIC
  // ===============================
  const filtered = houses.filter((h) => {
    const searchMatch =
      h.title?.toLowerCase().includes(query.toLowerCase()) ||
      h.location?.toLowerCase().includes(query.toLowerCase());

    const locationMatch =
      !locationFilter || h.location === locationFilter;

    const typeMatch =
      !typeFilter || h.type === typeFilter;

    const bedMatch =
      !bedFilter || Number(h.bedrooms) === Number(bedFilter);

    const priceMatch =
      !priceFilter || Number(h.price) <= Number(priceFilter);

    return searchMatch && locationMatch && typeMatch && bedMatch && priceMatch;
  });

  return (
    <div className="home-page">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">

        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="Luxury_Real_Estate_Hero_Video_Creation.mp4"
            type="video/mp4"
          />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Find Your Dream Home</h1>
          <p>Discover luxury properties in the most exclusive locations</p>

          {/* SEARCH BAR */}
          <div className="search-bar">

            <input
              type="text"
              placeholder="Search by location or property name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button onClick={handleSearch}>
              Search
            </button>

          </div>
        </div>

      </section>

      {/* ================= FILTER SECTION ================= */}
      <section className="filter-section">

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Location</option>
          {[...new Set(houses.map((h) => h.location))].map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Property Type</option>
          {[...new Set(houses.map((h) => h.type))].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={bedFilter}
          onChange={(e) => setBedFilter(e.target.value)}
        >
          <option value="">Bedrooms</option>
          {[...new Set(houses.map((h) => h.bedrooms))].map((bed) => (
            <option key={bed} value={bed}>{bed} Beds</option>
          ))}
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="">Max Price</option>
          <option value="2000000">Under 20L</option>
          <option value="5000000">Under 50L</option>
          <option value="10000000">Under 1Cr</option>
        </select>

      </section>

      {/* ================= LISTING SECTION ================= */}
      <section className="listing-section">
        <h2>Available Properties ({filtered.length})</h2>

        {filtered.map((h) => {

          const isWishlisted = wishlist.some(
            (id) => id === h._id || id?._id === h._id
          );

          return (
            <div className="property-card" key={h._id}>

              {/* IMAGE */}
              <div className="property-image">

                <img
                  src={`http://localhost:3001${h.images?.[0]}`}
                  alt={h.title}
                  onClick={() => navigate(`/houses/${h._id}`)}
                />

                {/* WISHLIST */}
                <div
                  className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
                  onClick={() => handleWishlist(h._id)}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </div>

                <span className="tag">For Sale</span>

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

                  <div>
                    <strong>₹ {h.price}</strong>
                    <small>₹ {h.pricePerSqft || "-"} / sqft</small>
                  </div>

                  <button
                    className="details-btn"
                    onClick={() => navigate(`/houses/${h._id}`)}
                  >
                    View Details
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </section>

    </div>
  );
}

export default Home;