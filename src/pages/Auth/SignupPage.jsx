import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setupRecaptcha, sendFirebaseOtp } from "../../services/authService";
import "./auth.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [mobile, setMobile]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    setupRecaptcha("recaptcha-signup");
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile))
      return setError("Enter a valid 10-digit Indian mobile number.");
    setLoading(true);
    try {
      await sendFirebaseOtp(mobile);
      navigate("/otp", { state: { mobile, purpose: "signup" } });
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
      setupRecaptcha("recaptcha-signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="a-page">
      <div id="recaptcha-signup" />
      <div className="a-card">

        <div className="a-brand">
          <div className="a-brand-mark"><span>RRO</span></div>
        </div>

        <h1 className="a-title">Create account</h1>
        <p className="a-subtitle">Enter your mobile number to get started</p>

        <div className="a-steps">
          <div className="a-step-dot active" />
          <div className="a-step-dot" />
          <div className="a-step-dot" />
        </div>

        {error && <div className="a-error">{error}</div>}

        <form className="a-form" onSubmit={handleSendOtp} noValidate>
          <div className="a-field">
            <label htmlFor="su-mobile">
              Mobile Number <span className="req">*</span>
            </label>
            <div className="a-input-wrap">
              <span className="a-prefix">+91</span>
              <input
                id="su-mobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                autoFocus
                autoComplete="tel"
              />
            </div>
          </div>

          <p className="a-hint">
            We'll send a 6-digit OTP via SMS to verify your number.
          </p>

          <button
            className="a-btn"
            type="submit"
            disabled={loading || mobile.length !== 10}
          >
            {loading ? <span className="a-spinner" /> : "Send OTP →"}
          </button>
        </form>

        <p className="a-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}