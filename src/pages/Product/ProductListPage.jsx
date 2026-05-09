import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ProductListPage.css";

export default function ProductListPage() {
  const [plans, setPlans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState(null); // _id of open card
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

  const toggleCard = (id) =>
    setExpanded((prev) => (prev === id ? null : id));

  const handleChoosePlan = (e, plan) => {
    e.stopPropagation(); // don't collapse card when tapping button
    navigate("/product/checkout", { state: { plan } });
  };

  /* ── states ── */
  if (loading)
    return (
      <div className="sp-page">
        <div className="sp-feedback">
          <span className="sp-spinner" />
          <p>Loading plans…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="sp-page">
        <div className="sp-feedback sp-feedback--error"><p>{error}</p></div>
      </div>
    );

  if (plans.length === 0)
    return (
      <div className="sp-page">
        <div className="sp-feedback"><p>No plans available right now.</p></div>
      </div>
    );

  return (
    <div className="sp-page">

      <div className="sp-header">
        <h2>Subscription Plans</h2>
        <span className="sp-count">{plans.length} plans</span>
      </div>

      <div className="sp-list">
        {plans.map((plan) => {
          const open = expanded === plan._id;
          return (
            <article
              key={plan._id}
              className={`sp-card${open ? " sp-card--open" : ""}`}
              onClick={() => toggleCard(plan._id)}
            >
              {/* ── Always visible row ── */}
              <div className="sp-card__row">

                <div className="sp-card__img-wrap">
                  <img
                    src={plan.image}
                    alt={`${plan.brandName} ${plan.modelName}`}
                    className="sp-card__img"
                    loading="lazy"
                  />
                </div>

                <div className="sp-card__info">
                  <span className="sp-card__brand">{plan.brandName}</span>
                  <h3 className="sp-card__model">{plan.modelName}</h3>
                  {plan.comment && (
                    <p className="sp-card__comment">{plan.comment}</p>
                  )}
                  <div className="sp-card__rate">
                    <strong>₹{plan.perMonthAmount}</strong>
                    <span>/month</span>
                  </div>
                </div>

                <div className={`sp-card__chevron${open ? " sp-card__chevron--open" : ""}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

              </div>

              {/* ── Expanded details ── */}
              <div className={`sp-card__details${open ? " sp-card__details--open" : ""}`}>
                <div className="sp-card__details-inner">

                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Plan ID</span>
                    <span className="sp-detail-value sp-detail-value--mono">{plan.planId}</span>
                  </div>

                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Deposit</span>
                    <span className="sp-detail-value">₹{plan.deposit}</span>
                  </div>

                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Monthly Limit</span>
                    <span className="sp-detail-value">{plan.monthlyLitreLimit} litres</span>
                  </div>

                  {plan.installationCharges > 0 && (
                    <div className="sp-detail-row">
                      <span className="sp-detail-label">Installation</span>
                      <span className="sp-detail-value">₹{plan.installationCharges}</span>
                    </div>
                  )}

                  <button
                    className="sp-card__btn"
                    onClick={(e) => handleChoosePlan(e, plan)}
                  >
                    Choose this Plan
                  </button>

                </div>
              </div>

            </article>
          );
        })}
      </div>

    </div>
  );
}