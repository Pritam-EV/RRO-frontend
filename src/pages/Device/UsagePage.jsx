import React from "react";
import "./UsagePage.css";

const UsagePage = () => {
  const fakeDays = ["M", "T", "W", "T", "F", "S", "S"];
  const litres = [14, 18, 12, 20, 16, 11, 9]; // demo

  const max = Math.max(...litres);

  return (
    <div className="usage-page">
      <h2 className="usage-title">Usage history</h2>
      <p className="usage-subtitle">
        Track your last 7 days water consumption and manage patterns.
      </p>

      <div className="usage-summary-card">
        <div>
          <div className="usage-summary-label">This week</div>
          <div className="usage-summary-value">100 L</div>
          <div className="usage-summary-meta">Daily avg ~ 14.3 L</div>
        </div>
        <div className="usage-summary-chip">Within limit</div>
      </div>

      <div className="usage-chart">
        {fakeDays.map((d, idx) => (
          <div key={d + idx} className="usage-bar-col">
            <div
              className="usage-bar-inner"
              style={{ height: `${(litres[idx] / max) * 100}%` }}
            />
            <span className="usage-bar-label">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsagePage;
