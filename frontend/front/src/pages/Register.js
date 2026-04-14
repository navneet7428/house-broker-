import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveUser } from "../services/auth";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const redirectByRole = (role) => {
    if (role === "seller") navigate("/my-houses");
    else navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { data } = await API.post("/auth/register", form);

      // ✅ Normal register ke baad direct login karwana hai to:
      saveUser(data);
      redirectByRole(data.user?.role);

      // ✅ Agar tu chahe user ko login page pe bhejna ho:
      // setSuccess("Registration successful. Please login.");
      // setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Google Register
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      setError("");

      const { data } = await API.post("/auth/google-register", {
        credential: credentialResponse.credential,
        role: form.role, // ✅ buyer/seller chosen role
      });

      saveUser(data);
      redirectByRole(data.user?.role);

    } catch (err) {
      setError(err.response?.data?.message || "Google register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="sub-text">Join HouseBroker today</p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* ✅ ROLE SELECT FOR BOTH NORMAL + GOOGLE */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="role-select"
          style={{ marginBottom: "16px" }}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {/* ✅ GOOGLE REGISTER */}
        <div style={{ marginBottom: "18px" }}>
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={() => setError("Google register failed")}
          />
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* ✅ NORMAL REGISTER */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;