import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./OverviewPage.css";

// Mock — replace with real API call later
const MOCK_ROS = []; // empty = no RO linked

export default function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const linkedROs = MOCK_ROS;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="ov-page">

      {/* ── Greeting ── */}
      <div className="ov-greet">
        <p className="ov-greet-sub">{greeting()},</p>
        <h1 className="ov-greet-name">{user?.name?.split(" ")[0] || "User"} 👋</h1>
      </div>

      {/* ── RO Section ── */}
      {linkedROs.length === 0 ? (
        <div className="ov-empty">
          <div className="ov-empty-icon">💧</div>
          <h2 className="ov-empty-title">No RO linked yet</h2>
          <p className="ov-empty-sub">Connect your smart RO system or purchase a new one to get started.</p>

          <div className="ov-empty-actions">
            <button className="ov-btn-primary" onClick={() => navigate("/device/connect")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add RO Device
            </button>
            <button className="ov-btn-ghost" onClick={() => navigate("/product")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.97-1.67l1.38-7.33H6"/></svg>
              Purchase RO
            </button>
          </div>
        </div>
      ) : (
        <div className="ov-ro-list">
          {linkedROs.map((ro) => (
            <div key={ro.id} className="ov-ro-card" onClick={() => navigate("/dashboard/usage")}>
              <div className="ov-ro-icon">💧</div>
              <div className="ov-ro-info">
                <p className="ov-ro-name">{ro.name}</p>
                <p className="ov-ro-status online">● Online</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ov-ro-arrow"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          ))}

          <button className="ov-btn-outline" onClick={() => navigate("/device/connect")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Another RO
          </button>
        </div>
      )}

      {/* ── Quick Stats (shown when RO linked) ── */}
      {linkedROs.length > 0 && (
        <div className="ov-stats">
          <div className="ov-stat-card" onClick={() => navigate("/dashboard/usage")}>
            <span className="ov-stat-icon">📊</span>
            <span className="ov-stat-label">Usage Today</span>
            <span className="ov-stat-val">—</span>
          </div>
          <div className="ov-stat-card" onClick={() => navigate("/dashboard/wallet")}>
            <span className="ov-stat-icon">💳</span>
            <span className="ov-stat-label">Wallet</span>
            <span className="ov-stat-val">₹—</span>
          </div>
          <div className="ov-stat-card" onClick={() => navigate("/dashboard/payments")}>
            <span className="ov-stat-icon">🧾</span>
            <span className="ov-stat-label">Last Bill</span>
            <span className="ov-stat-val">₹—</span>
          </div>
        </div>
      )}

    </div>
  );
}