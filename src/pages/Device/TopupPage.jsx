import React from "react";
import "./TopupPage.css";

const TopupPage = () => {
  return (
    <div className="topup-page">
      <h2 className="topup-title">Top‑up usage</h2>
      <p className="topup-subtitle">
        Add extra litres when you expect high usage, like parties or guests.
      </p>

      <div className="topup-grid">
        <button className="topup-pack">
          <span className="topup-litres">+20 L</span>
          <span className="topup-price">₹ 79</span>
        </button>
        <button className="topup-pack">
          <span className="topup-litres">+50 L</span>
          <span className="topup-price">₹ 169</span>
        </button>
        <button className="topup-pack">
          <span className="topup-litres">+100 L</span>
          <span className="topup-price">₹ 299</span>
        </button>
      </div>

      <div className="topup-custom">
        <label htmlFor="customLitres">Custom top‑up</label>
        <div className="topup-custom-row">
          <input
            id="customLitres"
            type="number"
            min="1"
            placeholder="Litres"
          />
          <button className="topup-custom-btn">Calculate</button>
        </div>
        <p className="topup-note">
          Amount and final bill will be shown before confirming payment.
        </p>
      </div>
    </div>
  );
};

export default TopupPage;
