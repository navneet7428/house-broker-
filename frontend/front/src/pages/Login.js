import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveUser } from "../services/auth";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin/pending");
    else if (role === "seller") navigate("/my-houses");
    else navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", form);
      saveUser(data);
      redirectByRole(data.user?.role);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError("");

      const { data } = await API.post("/auth/google-login", {
        credential: credentialResponse.credential,
      });

      saveUser(data);
      redirectByRole(data.user?.role);
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="sub-text">Login to continue</p>

        {error && <div className="error">{error}</div>}

        {/* ✅ GOOGLE LOGIN */}
        <div style={{ marginBottom: "18px" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* ✅ NORMAL LOGIN */}
        <form onSubmit={handleSubmit}>
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

          <button type="submit">Login</button>
        </form>

        <p className="switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;