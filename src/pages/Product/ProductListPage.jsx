import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ProductListPage.css";

export default function ProductListPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/plans");
        setPlans(data?.data?.plans || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleChoosePlan = (plan) => {
    navigate(`/subscription/checkout/${plan.planId}`, { state: { plan } });
  };

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="shop-hero__badge">RRO Subscription Store</div>
        <h1>Choose a water plan that fits your home</h1>
        <p>
          Browse monthly RO plans with deposit, installation charges, and litre limits.
        </p>
      </div>

      {loading && (
        <div className="shop-state">
          <div className="shop-loader"></div>
          <p>Loading plans...</p>
        </div>
      )}

      {error && !loading && (
        <div className="shop-state shop-state--error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="shop-state">
          <p>No plans available right now.</p>
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className="plan-card" key={plan._id}>
              <div className="plan-card__image-wrap">
                <img
                  src={plan.image}
                  alt={`${plan.brandName} ${plan.modelName}`}
                  className="plan-card__image"
                />
                <span className="plan-card__tag">{plan.planId}</span>
              </div>

              <div className="plan-card__body">
                <div className="plan-card__title-wrap">
                  <p className="plan-card__brand">{plan.brandName}</p>
                  <h3 className="plan-card__title">{plan.modelName}</h3>
                </div>

                <p className="plan-card__comment">{plan.comment || "Advanced water purification plan"}</p>

                <div className="plan-card__price-row">
                  <div>
                    <span className="plan-card__price">₹{plan.perMonthAmount}</span>
                    <span className="plan-card__per">/month</span>
                  </div>
                </div>

                <div className="plan-card__meta">
                  <div className="plan-meta-box">
                    <span className="label">Deposit</span>
                    <strong>₹{plan.deposit}</strong>
                  </div>
                  <div className="plan-meta-box">
                    <span className="label">Installation</span>
                    <strong>₹{plan.installationCharges}</strong>
                  </div>
                  <div className="plan-meta-box">
                    <span className="label">Monthly Limit</span>
                    <strong>{plan.monthlyLitreLimit} L</strong>
                  </div>
                </div>

                <button
                  className="plan-card__btn"
                  onClick={() => handleChoosePlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}