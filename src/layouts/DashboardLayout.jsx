// src/layouts/DashboardLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>AquaRental</h1>
        <button className="header-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/topup">Top‑up</NavLink>
        <NavLink to="/dashboard/usage">Usage</NavLink>
        <NavLink to="/dashboard/payments">Payments</NavLink>
        <NavLink to="/dashboard/wallet">Wallet</NavLink>
      </nav>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
