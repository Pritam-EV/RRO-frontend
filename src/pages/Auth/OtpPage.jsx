import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  confirmFirebaseOtp, firebaseVerify,
  firebaseLogin, forgotPassword,
} from "../../services/authService";
import "./auth.css";

const META = {
  signup: { title: "Verify your number",  subtitle: "OTP sent for account creation", step: 1 },
  login:  { title: "Login with OTP",      subtitle: "OTP sent to your number",       step: null },
  reset:  { title: "Verify your identity", subtitle: "OTP sent to reset your password", step: 1 },
};

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const mobile  = location.state?.mobile  || "";
  const purpose = location.state?.purpose || "login";
  const meta    = META[purpose] || META.login;

  const [otp, setOtp]       = useState(["","","","","",""]);
  const [timer, setTimer]   = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    if (!mobile) navigate("/login", { replace: true });
  }, [mobile, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (otp.every((d) => d !== "")) handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const { idToken } = await confirmFirebaseOtp(code);
      if (purpose === "signup") {
        await firebaseVerify(idToken);
        navigate("/register", { state: { mobile }, replace: true });
      } else if (purpose === "login") {
      const res = await firebaseLogin(idToken);
      login(res.data?.user, res.data?.token);
        navigate("/dashboard", { replace: true });
      } else if (purpose === "reset") {
        const res = await forgotPassword(idToken);
        navigate("/forgot-password", {
          state: { step: 3, resetToken: res.data.resetToken }, replace: true,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP. Please try again.");
      setOtp(["","","","","",""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(["","","","","",""]);
    setError("");
    navigate(-1);
  };

  return (
    <div className="a-page">
      <div className="a-card">

        <button className="a-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>

        <div className="a-brand">
          <div className="a-brand-mark"><span>RRO</span></div>
        </div>

        <h1 className="a-title">{meta.title}</h1>
        <p className="a-subtitle">
          {meta.subtitle} to <strong>+91 {mobile}</strong>
        </p>

        {/* Step dots for signup/reset */}
        {purpose !== "login" && (
          <div className="a-steps">
            <div className="a-step-dot done" />
            <div className="a-step-dot active" />
            {purpose === "signup" && <div className="a-step-dot" />}
          </div>
        )}

        {error && <div className="a-error">{error}</div>}

        <div className="a-otp-row" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input key={idx}
              ref={(el) => (inputs.current[idx] = el)}
              type="text" inputMode="numeric" maxLength={1}
              className={`a-otp-input ${digit ? "filled" : ""}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              autoFocus={idx === 0}
              disabled={loading}
            />
          ))}
        </div>

        <button className="a-btn" onClick={handleVerify}
          disabled={otp.join("").length < 6 || loading}>
          {loading ? <span className="a-spinner" /> : "Verify OTP"}
        </button>

        <div className="a-resend">
          {timer > 0
            ? <p>Resend code in <span className="a-timer">{timer}s</span></p>
            : <button className="a-resend-btn" onClick={handleResend}>Resend OTP</button>
          }
        </div>

      </div>
    </div>
  );
}