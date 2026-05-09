import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="dl-root">
      {/* ── Top Header ── */}
      <header className="dl-header">
        <div className="dl-header-left">
          <div className="dl-brand-mark"><span>RRO</span></div>
          <span className="dl-brand-name">Smart Water</span>
        </div>
        <button className="dl-avatar" onClick={() => navigate("/profile-page")} aria-label="My Profile">
          {initials}
        </button>
      </header>

      {/* ── Page content ── */}
      <main className="dl-main">
        <Outlet />
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="dl-bottom-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => "dl-nav-item" + (isActive ? " active" : "")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink to="/subscription" className={({ isActive }) => "dl-nav-item" + (isActive ? " active" : "")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <span>My Plan</span>
        </NavLink>

        <NavLink to="/product" className={({ isActive }) => "dl-nav-item" + (isActive ? " active" : "")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.97-1.67l1.38-7.33H6"/>
          </svg>
          <span>Shop</span>
        </NavLink>

        <NavLink to="/dashboard/wallet" className={({ isActive }) => "dl-nav-item" + (isActive ? " active" : "")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>Wallet</span>
        </NavLink>
      </nav>
    </div>
  );
}