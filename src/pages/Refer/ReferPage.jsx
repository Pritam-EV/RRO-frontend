import React from "react";
import "./ReferPage.css";

const ReferPage = () => {
  return (
    <div className="refer-page">
      <h2 className="refer-title">Refer &amp; earn</h2>
      <p className="refer-subtitle">
        Share your referral link and earn wallet cashback on every successful
        installation.
      </p>

      <div className="refer-card">
        <div className="refer-link-label">Your referral code</div>
        <div className="refer-link-row">
          <span className="refer-code">AQUA‑PRITAM42</span>
          <button className="refer-copy-btn">Copy</button>
        </div>
        <p className="refer-small">
          Use this code during signup to track rewards.
        </p>
      </div>

      <div className="refer-steps">
        <h3>How it works</h3>
        <ol>
          <li>Share your code or link with friends and family.</li>
          <li>They install AquaRental RO using your referral.</li>
          <li>You get instant wallet cashback after activation.</li>
        </ol>
      </div>
    </div>
  );
};

export default ReferPage;
