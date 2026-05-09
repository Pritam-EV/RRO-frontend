import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setupRecaptcha, sendFirebaseOtp, signin } from "../../services/authService";
import "./auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab] = useState("password"); // "password" | "otp"
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otpMobile, setOtpMobile] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mobileRef = useRef();

  useEffect(() => {
    mobileRef.current?.focus();
    setupRecaptcha("recaptcha-container");
  }, []);

  useEffect(() => {
    if (tab === "otp") setupRecaptcha("recaptcha-container");
    setError("");
  }, [tab]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError("Enter a valid 10-digit mobile number.");
    if (!password) return setError("Password is required.");
    setLoading(true);
    try {
      const res = await signin(mobile, password);
      login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect mobile or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(otpMobile)) return setError("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      await sendFirebaseOtp(otpMobile);
      navigate("/otp", { state: { mobile: otpMobile, purpose: "login" } });
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
      setupRecaptcha("recaptcha-container");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="a-page">
      <div id="recaptcha-container" />
      <div className="a-card">

        <div className="a-brand">
          <div className="a-brand-mark"><span>RRO</span></div>
        </div>

        <h1 className="a-title">Welcome back</h1>
        <p className="a-subtitle">Sign in to continue to RRO</p>

        <div className="a-tabs">
          <button className={`a-tab ${tab === "password" ? "active" : ""}`}
            onClick={() => setTab("password")} type="button">
            Password
          </button>
          <button className={`a-tab ${tab === "otp" ? "active" : ""}`}
            onClick={() => setTab("otp")} type="button">
            Login with OTP
          </button>
        </div>

        {error && <div className="a-error">{error}</div>}

        {tab === "password" && (
          <form className="a-form" onSubmit={handlePasswordLogin} noValidate>
            <div className="a-field">
              <label htmlFor="lp-mobile">Mobile Number</label>
              <div className="a-input-wrap">
                <span className="a-prefix">+91</span>
                <input id="lp-mobile" ref={mobileRef} type="tel" inputMode="numeric"
                  maxLength={10} placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  autoComplete="tel" />
              </div>
            </div>

            <div className="a-field">
              <label htmlFor="lp-pass">Password</label>
              <div className="a-input-wrap">
                <input id="lp-pass" type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" />
                <button type="button" className="a-eye"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility">
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div className="a-forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className="a-btn" type="submit" disabled={loading}>
              {loading ? <span className="a-spinner" /> : "Sign In"}
            </button>
          </form>
        )}

        {tab === "otp" && (
          <form className="a-form" onSubmit={handleOtpLogin} noValidate>
            <div className="a-field">
              <label htmlFor="lp-otp-mobile">Mobile Number</label>
              <div className="a-input-wrap">
                <span className="a-prefix">+91</span>
                <input id="lp-otp-mobile" type="tel" inputMode="numeric"
                  maxLength={10} placeholder="98765 43210"
                  value={otpMobile}
                  onChange={(e) => setOtpMobile(e.target.value.replace(/\D/g, ""))}
                  autoComplete="tel" autoFocus />
              </div>
            </div>
            <p className="a-hint">A 6-digit OTP will be sent via SMS to verify your number.</p>
            <button className="a-btn" type="submit" disabled={loading}>
              {loading ? <span className="a-spinner" /> : "Send OTP →"}
            </button>
          </form>
        )}

        <p className="a-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}