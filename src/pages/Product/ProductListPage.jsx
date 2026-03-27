import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductListPage.css";
import waterImg from "../../assets/images/water1.jpg";

const plans = [
  {
    id: "basic",
    name: "Starter Home RO",
    tag: "Best for 2–3 people",
    price: 599,
    deposit: 999,
    dailyLimit: "15 L / day",
    features: [
      "RO + UV purification",
      "Free installation",
      "Standard filters included",
      "Service every 6 months",
    ],
  },
  {
    id: "family",
    name: "Family Smart RO",
    tag: "Most popular",
    price: 749,
    deposit: 1499,
    dailyLimit: "25 L / day",
    features: [
      "RO + UV + Copper",
      "Free installation",
      "Smart usage tracking",
      "Priority service visits",
    ],
    highlighted: true,
  },
  {
    id: "plus",
    name: "Large Family Plus",
    tag: "Best for 6+ people",
    price: 899,
    deposit: 1999,
    dailyLimit: "35 L / day",
    features: [
      "RO + UV + Alkaline",
      "Free installation",
      "Filter change alerts",
      "24×7 support line",
    ],
  },
];

const ProductListPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate("/product/checkout", { state: { plan } });
  };

  return (
    <section className="product-page">
      <header className="product-hero">
        <h1>Choose your AquaRental plan</h1>
        <p>All plans include free installation, maintenance and filter changes.</p>
      </header>

      <div className="product-list">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={
              "product-card" + (plan.highlighted ? " product-card-highlighted" : "")
            }
          >
            <div className="product-card-main">
              <div className="product-card-text">
                <h2>{plan.name}</h2>
                <p className="product-tag">{plan.tag}</p>
                <p className="product-limit">{plan.dailyLimit}</p>
                <div className="product-price-row">
                  <span className="product-price">₹ {plan.price}</span>
                  <span className="product-price-meta">/ month rent</span>
                </div>
                <p className="product-deposit">Security deposit ₹ {plan.deposit}</p>
              </div>
              <img src={waterImg} alt={plan.name} className="product-img" />
            </div>

            <ul className="product-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button
              className={
                "product-cta-btn" +
                (plan.highlighted ? " product-cta-btn-primary" : "")
              }
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.highlighted ? "Get this plan" : "Select plan"}
            </button>
          </article>
        ))}
      </div>

      <footer className="product-faq">
        <h3>What&apos;s included?</h3>
        <ul>
          <li>No hidden charges, installation is free.</li>
          <li>Filters and service are included in rent.</li>
          <li>Cancel or upgrade anytime with simple pickup.</li>
        </ul>
      </footer>
    </section>
  );
};

export default ProductListPage;
