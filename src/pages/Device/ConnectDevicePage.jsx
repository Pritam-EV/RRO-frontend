import React from "react";
import "./ConnectDevicePage.css";

const ConnectDevicePage = () => {
  return (
    <div className="connect-page">
      <h2 className="connect-title">Connect your purifier</h2>
      <p className="connect-subtitle">
        Scan the QR code on the RO or enter the device ID printed on the
        sticker.
      </p>

      <div className="connect-card">
        <div className="connect-qr-placeholder">
          <span>QR scanner coming soon</span>
        </div>

        <div className="connect-divider">
          <span>or</span>
        </div>

        <label className="connect-label" htmlFor="deviceId">
          Enter device ID
        </label>
        <input
          id="deviceId"
          className="connect-input"
          placeholder="e.g. GLIDE05‑X8F23"
        />

        <button className="connect-btn-primary">Link purifier</button>
      </div>
    </div>
  );
};

export default ConnectDevicePage;
