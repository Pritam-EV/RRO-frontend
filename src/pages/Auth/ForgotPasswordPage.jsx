import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { setupRecaptcha, sendFirebaseOtp, resetPassword } from "../../services/authService";
import "./auth.css";

function getStrength(pass) {
  let s = 0;
  if (pass.length >= 8) s++;
  if (/[A-Z]/.test(pass)) s++;
  if (/[0-9]/.test(pass)) s++;
  if (/[^A-Za-z0-9]/.test(pass)) s++;
  return s;
}

export default function ForgotPasswordPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const incomingStep  = location.state?.step  || 1;
  const incomingToken = location.state?.resetToken || null;

  const [step, setStep]   = useState(incomingStep);
  const [resetToken]      = useState(incomingToken);

  const [mobile, setMobile]             = useState("");
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [done, setDone]                 = useState(false);

  useEffect(() => {
    if (step === 1) setupRecaptcha("recaptcha-container");
  }, [step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      await sendFirebaseOtp(mobile);
      navigate("/otp", { state: { mobile, purpose: "reset" } });
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
      setupRecaptcha("recaptcha-container");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8)          return setError("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))      return setError("Password needs at least one uppercase letter.");
    if (!/[0-9]/.test(password))      return setError("Password needs at least one number.");
    if (password !== confirm)         return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetPassword({ resetToken, password, confirmPassword: confirm });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "weak", "medium", "medium", "strong"][strength];

  return (
    <div className="a-page">
      <div id="recaptcha-container" />
      <div className="a-card">

        {!done && (
          <button className="a-back" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
        )}

        <div className="a-brand">
          <div className="a-brand-mark"><span>RRO</span></div>
        </div>

        {/* ── Success state ── */}
        {done ? (
          <div className="a-success-box">
            <div className="a-success-icon">✅</div>
            <h2>Password reset!</h2>
            <p>Taking you to sign in…</p>
          </div>
        ) : (
          <>
            {/* Step dots */}
            <div className="a-steps">
              <div className={`a-step-dot ${step >= 1 ? (step > 1 ? "done" : "active") : ""}`} />
              <div className={`a-step-dot ${step >= 2 ? (step > 2 ? "done" : "active") : ""}`} />
              <div className={`a-step-dot ${step === 3 ? "active" : ""}`} />
            </div>

            {error && <div className="a-error">{error}</div>}

            {/* ── Step 1: Enter mobile ── */}
            {step === 1 && (
              <>
                <h1 className="a-title">Forgot password</h1>
                <p className="a-subtitle">Enter your mobile. We'll send an OTP to verify.</p>
                <form className="a-form" onSubmit={handleSendOtp} noValidate>
                  <div className="a-field">
                    <label>Mobile Number</label>
                    <div className="a-input-wrap">
                      <span className="a-prefix">+91</span>
                      <input type="tel" inputMode="numeric" maxLength={10}
                        placeholder="98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                        autoFocus autoComplete="tel" />
                    </div>
                  </div>
                  <button className="a-btn" type="submit" disabled={loading}>
                    {loading ? <span className="a-spinner" /> : "Send OTP →"}
                  </button>
                </form>
                <p className="a-switch">Remember it? <Link to="/login">Sign in</Link></p>
              </>
            )}

            {/* ── Step 3: New password ── */}
            {step === 3 && (
              <>
                <h1 className="a-title">Set new password</h1>
                <p className="a-subtitle">Choose a strong password for your account.</p>
                <form className="a-form" onSubmit={handleReset} noValidate>

                  <div className="a-field">
                    <label>New Password</label>
                    <div className="a-input-wrap">
                      <input type={showPass ? "text" : "password"}
                        placeholder="Min 8 chars · 1 uppercase · 1 number"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        autoFocus autoComplete="new-password" />
                      <button type="button" className="a-eye"
                        onClick={() => setShowPass(!showPass)}>
                        {showPass
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {password && (
                      <div>
                        <div className="a-strength">
                          {[1,2,3,4].map((i) => (
                            <div key={i} className={`a-strength-bar ${i <= strength ? strengthColor : ""}`} />
                          ))}
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "var(--a-muted)" }}>{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  <div className="a-field">
                    <label>Confirm Password</label>
                    <div className="a-input-wrap">
                      <input type="password" placeholder="Re-enter your password"
                        value={confirm} onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password" />
                    </div>
                  </div>

                  <button className="a-btn" type="submit" disabled={loading}>
                    {loading ? <span className="a-spinner" /> : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}