import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../services/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`nav ${isHome ? "nav-transparent" : "nav-solid"}`}>
      <div className="nav-inner">

        <h2 className="logo">
          <Link to="/">HOUSE BROKER</Link>
        </h2>

        <nav className="links">

          <Link to="/">Properties</Link>

          {isLoggedIn() && user?.role === "buyer" && (
            <Link to="/wishlist">Wishlist</Link>
          )}

          {isLoggedIn() && user?.role === "seller" && (
            <Link to="/my-houses">My Properties</Link>
          )}

          {isLoggedIn() && user?.role === "admin" && (
            <Link to="/admin/pending">Admin</Link>
          )}

          {!isLoggedIn() ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;