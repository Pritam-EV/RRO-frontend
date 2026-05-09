import React, { useState, useEffect } from "react";
import "./SubscriptionPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import api from "../../services/api";

/* ── helpers ── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_META = {
  payment_pending:           { label: "Payment Pending",      color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" },
  paid_pending_installation: { label: "Pending Installation", color: "#375dfb", bg: "#eff3ff", dot: "#375dfb" },
  installation_assigned:     { label: "Technician Assigned",  color: "#8b5cf6", bg: "#f5f3ff", dot: "#8b5cf6" },
  installed:                 { label: "Installed",            color: "#10b981", bg: "#ecfdf5", dot: "#10b981" },
  active:                    { label: "Active",               color: "#10b981", bg: "#ecfdf5", dot: "#10b981" },
  paused:                    { label: "Paused",               color: "#6b7280", bg: "#f3f4f6", dot: "#6b7280" },
  expired:                   { label: "Expired",              color: "#ef4444", bg: "#fef2f2", dot: "#ef4444" },
  cancelled:                 { label: "Cancelled",            color: "#ef4444", bg: "#fef2f2", dot: "#ef4444" },
  payment_failed:            { label: "Payment Failed",       color: "#ef4444", bg: "#fef2f2", dot: "#ef4444" },
  initiated:                 { label: "Initiated",            color: "#6b7280", bg: "#f3f4f6", dot: "#6b7280" },
};

const ACTIVE_STATUSES = ["payment_pending","paid_pending_installation","installation_assigned","installed","active","paused"];

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || { label: status, color: "#6b7280", bg: "#f3f4f6", dot: "#6b7280" };
  return (
    <span className="sp-badge" style={{ color: m.color, background: m.bg }}>
      <span className="sp-badge__dot" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
};

/* ── Expandable subscription card ── */
const SubCard = ({ sub, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const plan = sub.planId || {};
  const isActive = ACTIVE_STATUSES.includes(sub.status);

  // parse notes safely
  let notes = {};
  try { notes = sub.notes ? JSON.parse(sub.notes) : {}; } catch (_) {}

  const addr  = notes.deliveryAddress || {};
  const addrStr = [addr.address, addr.city, addr.pincode].filter(Boolean).join(", ");

  return (
    <div className={`sp-card ${isActive ? "sp-card--active" : "sp-card--past"} ${open ? "sp-card--open" : ""}`}>

      {/* ── Header row (always visible) ── */}
      <button className="sp-card__header" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="sp-card__left">
          <div className="sp-card__title-row">
            <span className="sp-card__brand">{plan.brandName || "—"}</span>
            {isActive && <span className="sp-card__live" />}
          </div>
          <span className="sp-card__model">{plan.modelName || "—"}</span>
          <span className="sp-card__code">{sub.subscriptionCode || sub._id?.slice(-8).toUpperCase()}</span>
        </div>
        <div className="sp-card__right">
          <StatusBadge status={sub.status} />
          <svg
            className={`sp-card__chevron ${open ? "sp-card__chevron--up" : ""}`}
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* ── Expanded details ── */}
      {open && (
        <div className="sp-card__body">

          {/* Plan pricing row */}
          <div className="sp-detail-section">
            <p className="sp-detail-label">Plan Details</p>
            <div className="sp-rows">
              <div className="sp-row">
                <span>Monthly charge</span>
                <strong>₹{plan.perMonthAmount ?? sub.amount ?? "—"}/mo</strong>
              </div>
              <div className="sp-row">
                <span>Refundable deposit</span>
                <strong>₹{plan.deposit ?? sub.depositAmount ?? 0}</strong>
              </div>
              {(plan.installationCharges > 0 || notes.installationAmount > 0) && (
                <div className="sp-row">
                  <span>Installation (one-time)</span>
                  <strong>₹{plan.installationCharges ?? notes.installationAmount ?? 0}</strong>
                </div>
              )}
              {notes.firstPayment != null && (
                <div className="sp-row sp-row--total">
                  <span>First payment due</span>
                  <strong className="sp-blue">₹{notes.firstPayment}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="sp-detail-section">
            <p className="sp-detail-label">Timeline</p>
            <div className="sp-rows">
              <div className="sp-row">
                <span>Order placed</span>
                <strong>{fmt(sub.createdAt)}</strong>
              </div>
              {sub.startDate && (
                <div className="sp-row">
                  <span>Start date</span>
                  <strong>{fmt(sub.startDate)}</strong>
                </div>
              )}
              {sub.endDate && (
                <div className="sp-row">
                  <span>End date</span>
                  <strong>{fmt(sub.endDate)}</strong>
                </div>
              )}
              {sub.installedAt && (
                <div className="sp-row">
                  <span>Installed on</span>
                  <strong>{fmt(sub.installedAt)}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Delivery address */}
          {addr.fullName && (
            <div className="sp-detail-section">
              <p className="sp-detail-label">Delivery Address</p>
              <div className="sp-address-block">
                <span className="sp-address__name">{addr.fullName}</span>
                <span className="sp-address__mobile">{addr.mobile}</span>
                {addrStr && <span className="sp-address__line">{addrStr}</span>}
              </div>
            </div>
          )}

          {/* Payment & delivery info */}
          <div className="sp-detail-section">
            <p className="sp-detail-label">Payment & Delivery</p>
            <div className="sp-rows">
              {notes.paymentMethod && (
                <div className="sp-row">
                  <span>Payment method</span>
                  <strong className="sp-capitalize">{notes.paymentMethod}</strong>
                </div>
              )}
              <div className="sp-row">
                <span>Payment status</span>
                <strong className="sp-capitalize">{sub.paymentStatus || "—"}</strong>
              </div>
              {notes.deliverySlot && (
                <div className="sp-row">
                  <span>Delivery slot</span>
                  <strong>{notes.deliverySlot}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Plan ID pill */}
          {plan.planId && (
            <div className="sp-pill-row">
              <span className="sp-pill">Plan: {plan.planId}</span>
              {sub.billingCycleMonths && (
                <span className="sp-pill">{sub.billingCycleMonths}-month billing</span>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  Main Page                                                      */
/* ══════════════════════════════════════════════════════════════ */
const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [current, setCurrent]   = useState(null);
  const [history, setHistory]   = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [myRes, histRes] = await Promise.all([
          api.get("/subscriptions/my"),
          api.get("/subscriptions/history"),
        ]);
        setCurrent(myRes.data?.data?.subscription || null);
        setHistory(histRes.data?.data?.subscriptions || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // past = everything not in the active card
  const pastSubs = current
    ? history.filter((s) => s._id !== current._id)
    : history;

  return (
    <div className="sp-page">
      <Header />

      {/* ── Top bar ── */}
      <div className="sp-topbar">
        <button className="sp-back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="sp-topbar__title">My Plans</span>
        <div style={{ width: 32 }} />
      </div>

      <div className="sp-body">

        {loading && (
          <div className="sp-loader">
            <div className="sp-skeleton sp-skeleton--card" />
            <div className="sp-skeleton sp-skeleton--card" />
          </div>
        )}

        {!loading && error && (
          <div className="sp-error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Active / current subscription ── */}
            <div className="sp-section">
              <p className="sp-section__label">Current Subscription</p>

              {current ? (
                <SubCard sub={current} defaultOpen={true} />
              ) : (
                <div className="sp-empty">
                  <div className="sp-empty__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <p className="sp-empty__text">No active subscription</p>
                  <p className="sp-empty__sub">Browse our plans and get started today.</p>
                  <button className="sp-cta" onClick={() => navigate("/product")}>
                    Browse Plans
                  </button>
                </div>
              )}
            </div>

            {/* ── Past subscriptions ── */}
            {pastSubs.length > 0 && (
              <div className="sp-section">
                <p className="sp-section__label">Past & Other Orders</p>
                <div className="sp-list">
                  {pastSubs.map((s) => (
                    <SubCard key={s._id} sub={s} defaultOpen={false} />
                  ))}
                </div>
              </div>
            )}

            {/* No history at all */}
            {!current && pastSubs.length === 0 && (
              <div className="sp-hint">
                <p>Once you place an order, all your subscriptions will appear here.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SubscriptionPage;