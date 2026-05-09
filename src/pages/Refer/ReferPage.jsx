import React, { useState } from "react";
import "./ReferPage.css";

const ReferPage = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText("AQUA-PRITAM42");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="refer-page">
      {/* Hero Section */}
      <div className="refer-hero">
        <div className="refer-hero-content">
          <div className="refer-icon">🎁</div>
          <h2 className="refer-title">Refer &amp; Earn</h2>
          <p className="refer-subtitle">
            Share your referral link and earn wallet cashback on every successful installation.
          </p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="refer-card-premium">
        <div className="refer-link-label">Your Referral Code</div>
        <div className="refer-link-row">
          <span className="refer-code">AQUA-PRITAM42</span>
          <button 
            className="refer-copy-btn" 
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="refer-small">
          Use this code during signup to track rewards
        </p>
      </div>

      {/* How It Works Steps */}
      <div className="refer-steps-section">
        <h3 className="refer-steps-title">How it Works</h3>
        <div className="refer-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Share Your Code</h4>
              <p>Send your code or link to friends and family</p>
            </div>
          </div>
          <div className="step-connector"></div>
          
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>They Install</h4>
              <p>They install using your referral code</p>
            </div>
          </div>
          <div className="step-connector"></div>
          
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Earn Cashback</h4>
              <p>Get instant wallet cashback after activation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="refer-benefits">
        <h3 className="refer-benefits-title">Why Refer?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">💰</div>
            <p>Earn instant cashback</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🚀</div>
            <p>Unlimited referrals</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⭐</div>
            <p>Special rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferPage;
