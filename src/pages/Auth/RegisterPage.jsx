import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../services/authService";
import "./auth.css";

function scorePassword(pass) {
  let s = 0;
  if (pass.length >= 8)          s++;
  if (/[A-Z]/.test(pass))        s++;
  if (/[0-9]/.test(pass))        s++;
  if (/[^A-Za-z0-9]/.test(pass)) s++;
  return s;
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "weak", "medium", "medium", "strong"];

const EyeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function RegisterPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const mobile    = location.state?.mobile || "";

  const [form, setForm] = useState({
    name: "", city: "", email: "",
    password: "", confirmPassword: "", referralCode: "",
  });
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [fieldErrors,  setFieldErrors]  = useState({});

  useEffect(() => {
    if (!mobile) navigate("/signup", { replace: true });
  }, [mobile, navigate]);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setFieldErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())           errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!form.city.trim())           errs.city = "City is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
                                     errs.email = "Enter a valid email.";
    if (!form.password)              errs.password = "Password is required.";
    else if (form.password.length < 8)   errs.password = "Minimum 8 characters.";
    else if (!/[A-Z]/.test(form.password)) errs.password = "Add at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password)) errs.password = "Add at least one number.";
    if (!form.confirmPassword)       errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
                                     errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        mobile,
        name:            form.name.trim(),
        city:            form.city.trim(),
        password:        form.password,
        confirmPassword: form.confirmPassword,
        ...(form.email        && { email: form.email.trim().toLowerCase() }),
        ...(form.referralCode && { referralCode: form.referralCode.trim().toUpperCase() }),
      };
      const res = await register(payload);
      login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = scorePassword(form.password);

  return (
    <div className="a-page">
      <div className="a-card" style={{ maxWidth: 460 }}>

        <button className="a-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        <div className="a-brand">
          <div className="a-brand-mark"><span>RRO</span></div>
        </div>

        <h1 className="a-title">Complete your profile</h1>
        <p className="a-subtitle">
          Setting up account for <strong>+91&nbsp;{mobile}</strong>
        </p>

        <div className="a-steps">
          <div className="a-step-dot done" />
          <div className="a-step-dot done" />
          <div className="a-step-dot active" />
        </div>

        {error && <div className="a-error">{error}</div>}

        <form className="a-form" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="a-field">
            <label htmlFor="rp-name">Full Name <span className="req">*</span></label>
            <div className={`a-input-wrap ${fieldErrors.name ? "input-err" : ""}`}>
              <input id="rp-name" type="text" placeholder="Pritam Rokade"
                value={form.name} onChange={set("name")} autoFocus />
            </div>
            {fieldErrors.name && <span className="a-field-err">{fieldErrors.name}</span>}
          </div>

          {/* City */}
          <div className="a-field">
            <label htmlFor="rp-city">City <span className="req">*</span></label>
            <div className={`a-input-wrap ${fieldErrors.city ? "input-err" : ""}`}>
              <input id="rp-city" type="text" placeholder="Nagpur"
                value={form.city} onChange={set("city")} />
            </div>
            {fieldErrors.city && <span className="a-field-err">{fieldErrors.city}</span>}
          </div>

          {/* Email */}
          <div className="a-field">
            <label htmlFor="rp-email">Email <span className="opt">optional</span></label>
            <div className={`a-input-wrap ${fieldErrors.email ? "input-err" : ""}`}>
              <input id="rp-email" type="email" placeholder="you@example.com"
                value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            {fieldErrors.email && <span className="a-field-err">{fieldErrors.email}</span>}
          </div>

          {/* Password */}
          <div className="a-field">
            <label htmlFor="rp-password">Password <span className="req">*</span></label>
            <div className={`a-input-wrap ${fieldErrors.password ? "input-err" : ""}`}>
              <input id="rp-password"
                type={showPass ? "text" : "password"}
                placeholder="Min 8 chars · uppercase · number"
                value={form.password} onChange={set("password")}
                autoComplete="new-password" />
              <button type="button" className="a-eye"
                onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="a-strength-wrap">
                <div className="a-strength">
                  {[1,2,3,4].map((i) => (
                    <div key={i}
                      className={`a-strength-bar ${i <= strength ? STRENGTH_COLORS[strength] : ""}`} />
                  ))}
                </div>
                <span className="a-strength-label">{STRENGTH_LABELS[strength]}</span>
              </div>
            )}
            {fieldErrors.password && <span className="a-field-err">{fieldErrors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="a-field">
            <label htmlFor="rp-confirmPassword">
              Confirm Password <span className="req">*</span>
            </label>
            <div className={`a-input-wrap ${fieldErrors.confirmPassword ? "input-err" : ""}`}>
              <input id="rp-confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword} onChange={set("confirmPassword")}
                autoComplete="new-password" />
              <button type="button" className="a-eye"
                onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {form.confirmPassword && form.password && (
              <span className={`a-field-match ${
                form.password === form.confirmPassword ? "match" : "no-match"
              }`}>
                {form.password === form.confirmPassword
                  ? "✓ Passwords match" : "✗ Passwords don't match"}
              </span>
            )}
            {fieldErrors.confirmPassword && (
              <span className="a-field-err">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Referral Code */}
          <div className="a-field">
            <label htmlFor="rp-referralCode">
              Referral Code <span className="opt">optional</span>
            </label>
            <div className="a-input-wrap">
              <input id="rp-referralCode" type="text" placeholder="e.g. RRO3F9A"
                value={form.referralCode} onChange={set("referralCode")}
                maxLength={9}
                style={{ textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }} />
            </div>
            <p className="a-hint">Have a referral code? Both you and your referrer get rewarded!</p>
          </div>

          <button className="a-btn" type="submit" disabled={loading}
            style={{ marginTop: "0.5rem" }}>
            {loading
              ? <><span className="a-spinner" /><span style={{ marginLeft: 8 }}>Creating…</span></>
              : "Create Account 🎉"
            }
          </button>

        </form>

        <p className="a-hint" style={{ textAlign: "center", marginTop: "1rem" }}>
          By creating an account you agree to our{" "}
          <a href="/terms" style={{ color: "var(--a-blue)", textDecoration: "none", fontWeight: 500 }}>
            Terms
          </a>{" "}and{" "}
          <a href="/privacy" style={{ color: "var(--a-blue)", textDecoration: "none", fontWeight: 500 }}>
            Privacy Policy
          </a>.
        </p>

      </div>
    </div>
  );
}