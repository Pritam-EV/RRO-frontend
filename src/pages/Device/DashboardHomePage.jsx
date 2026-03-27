import React from "react";
import "./DashboardHomePage.css";

const DashboardHomePage = () => {
  return (
    <div className="dash-home">
      <section className="dash-card dash-main-card">
        <div className="dash-main-left">
          <h2>Kitchen RO ‑ Living</h2>
          <p className="dash-main-status">Active • Online</p>
          <p className="dash-main-plan">Plan: 20 L / day • ₹649 / month</p>
        </div>
        <div className="dash-main-right">
          <span className="dash-badge">Safe to drink</span>
          <div className="dash-tds">
            <div className="dash-tds-label">Outlet TDS</div>
            <div className="dash-tds-value">28 ppm</div>
          </div>
        </div>
      </section>

      <section className="dash-grid">
        <div className="dash-card dash-usage-card">
          <div className="dash-card-header">
            <span>Today&apos;s usage</span>
            <span className="dash-chip">Live</span>
          </div>
          <div className="dash-usage-value">7.4 L</div>
          <div className="dash-usage-bar">
            <div className="dash-usage-bar-fill" />
          </div>
          <p className="dash-usage-sub">of 20 L daily quota</p>
        </div>

        <div className="dash-card dash-wallet-card">
          <div className="dash-card-header">
            <span>Wallet balance</span>
          </div>
          <div className="dash-wallet-main">
            <span className="dash-wallet-amount">₹ 420</span>
            <span className="dash-wallet-tag">~ 13 days left</span>
          </div>
          <button className="dash-btn-secondary">Add money</button>
        </div>
      </section>

      <section className="dash-actions">
        <h3>Quick actions</h3>
        <div className="dash-actions-row">
          <button className="dash-action-chip">Top‑up usage</button>
          <button className="dash-action-chip">View payments</button>
          <button className="dash-action-chip">Pause purifier</button>
        </div>
      </section>
    </div>
  );
};

export default DashboardHomePage;
