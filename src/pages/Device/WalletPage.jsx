import React from "react";
import "./WalletPage.css";

const WalletPage = () => {
  return (
    <div className="wallet-page">
      <h2 className="wallet-title">Wallet</h2>
      <p className="wallet-subtitle">
        Add money once and let auto‑debit handle your monthly rent.
      </p>

      <div className="wallet-card-main">
        <div className="wallet-balance-label">Current balance</div>
        <div className="wallet-balance-amount">₹ 420</div>
        <div className="wallet-balance-meta">Covers ~ 13 days of usage</div>

        <div className="wallet-add-row">
          <button className="wallet-pill">+ ₹ 500</button>
          <button className="wallet-pill">+ ₹ 1000</button>
          <button className="wallet-pill">+ ₹ 1500</button>
        </div>

        <button className="wallet-btn-primary">Add money</button>
      </div>

      <div className="wallet-info-card">
        <h3>Auto‑debit</h3>
        <p>
          Enable auto‑debit from wallet so your RO never stops due to missed
          payments.
        </p>
        <button className="wallet-btn-secondary">Enable auto‑debit</button>
      </div>
    </div>
  );
};

export default WalletPage;
