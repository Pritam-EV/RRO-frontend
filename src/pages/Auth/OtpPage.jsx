import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpPage.css";
import { useAuth } from "../../context/AuthContext.jsx";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const mobile = location.state?.mobile || "";

  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 4) return;
    // TODO: backend verification
    login({ mobile, name: null, city: null });
    navigate("/profile", { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card otp-card">
        <h1 className="otp-title">Verify OTP</h1>
        <p className="otp-info">
          Enter the 4‑digit code sent to <strong>{mobile}</strong>
        </p>

        <div className="otp-box">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              className="otp-input"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          ))}
        </div>

        <button className="auth-btn-primary" onClick={handleVerify}>
          Verify &amp; continue
        </button>

        <p className="otp-resend">
          Didn&apos;t receive OTP?{" "}
          <button className="otp-resend-btn" type="button">
            Resend
          </button>
        </p>
      </div>
    </section>
  );
};

export default OtpPage;
