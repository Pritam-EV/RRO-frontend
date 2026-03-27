import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductCheckoutPage.css";

const ProductCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan || {
    name: "Family Smart RO",
    price: 749,
    deposit: 1499,
    id: "family",
  };

  const handleBack = () => {
    navigate("/product");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // TODO: integrate real payment gateway here
    alert("Demo: order placed. Next step is payment gateway integration.");
    navigate("/dashboard");
  };

  const total = plan.price + plan.deposit;

  return (
    <section className="checkout-page">
      <header className="checkout-header">
        <button className="checkout-back-btn" onClick={handleBack}>
          ←
        </button>
        <div>
          <h1>Checkout</h1>
          <p>Confirm your plan and enter installation details.</p>
        </div>
      </header>

      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2>Plan summary</h2>
          <div className="checkout-summary-card">
            <div className="checkout-plan-name">{plan.name}</div>
            <div className="checkout-plan-row">
              <span>Monthly rent</span>
              <span>₹ {plan.price}</span>
            </div>
            <div className="checkout-plan-row">
              <span>Refundable deposit</span>
              <span>₹ {plan.deposit}</span>
            </div>
            <div className="checkout-plan-divider" />
            <div className="checkout-plan-row checkout-plan-total">
              <span>Amount to pay now</span>
              <span>₹ {total}</span>
            </div>
            <p className="checkout-note">
              Deposit is refundable when you return the purifier in good
              condition.
            </p>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Installation details</h2>

          <div className="checkout-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Name as per ID"
              required
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="mobile">Mobile number</label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10‑digit mobile"
              required
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows={3}
              placeholder="Flat / house no., street, area"
              required
            />
          </div>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="e.g. 411001"
                required
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                placeholder="e.g. Pune"
                required
              />
            </div>
          </div>

          <div className="checkout-field">
            <label htmlFor="slot">Preferred installation slot</label>
            <select id="slot" defaultValue="morning" required>
              <option value="morning">Tomorrow 9am‑1pm</option>
              <option value="evening">Tomorrow 2pm‑6pm</option>
              <option value="weekend">Coming weekend</option>
            </select>
          </div>

          <button type="submit" className="checkout-pay-btn">
            Pay securely ₹ {total}
          </button>

          <p className="checkout-safe-text">
            You&apos;ll be redirected to a secure payment gateway. We never store
            your card details.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ProductCheckoutPage;
