import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutService } from "../../services/authService";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = async () => {
    try { await logoutService(); } catch (_) {}
    logout();
    navigate("/login", { replace: true });
  };

  const items = [
    
    { icon: "📋", label: "My Subscriptions", action: () => navigate("/subscription") },
    { icon: "🧾", label: "Transactions",     action: () => navigate("/transactions") },
    { icon: "💰", label: "Refer & Earn", action: () => navigate("/refer") },
    { icon: "📱", label: "My Devices", action: () => navigate("/dashboard") },
  ];

  return (
    <div className="pp-page">
      <div className="pp-header-row">
        <button className="pp-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
      </div>

      {/* Avatar */}
      <div className="pp-avatar-wrap">
        <div className="pp-avatar">{initials}</div>
        <h2 className="pp-name">{user?.name || "User"}</h2>
        <p className="pp-mobile">+91 {user?.mobile}</p>
        {user?.city && <p className="pp-city">📍 {user.city}</p>}
      </div>

      {/* Menu list */}
      <div className="pp-menu">
        {items.map((item) => (
          <button key={item.label} className="pp-menu-item" onClick={item.action}>
            <span className="pp-menu-icon">{item.icon}</span>
            <span className="pp-menu-label">{item.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="pp-logout" onClick={handleLogout}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Log Out
      </button>
    </div>
  );
}