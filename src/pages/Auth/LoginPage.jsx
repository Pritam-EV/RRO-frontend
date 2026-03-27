import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import logo from "../../assets/images/logo.png";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile.trim().length !== 10) return;
    // TODO: call backend to send OTP
    navigate("/otp", { state: { mobile }, replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="AquaRental Logo" className="auth-logo-img" />
          <h1 className="auth-title">AquaRental</h1>
          <p className="auth-subtitle">Smart RO at monthly rental</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="mobile">
            Mobile number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className="auth-input"
            placeholder="Enter your 10‑digit mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          />

          <button type="submit" className="auth-btn-primary">
            Sign up or Login
          </button>
        </form>

        <p className="auth-terms">
          By continuing, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
