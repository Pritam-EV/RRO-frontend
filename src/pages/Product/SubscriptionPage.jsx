import React, { useState, useEffect } from "react";
import "./SubscriptionPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import api from "../../services/api";

/* ── Helpers ── */
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

const STATUS_META = {
  initiated:                 { label: "Initiated",            color: "#6b7280", bg: "#f3f4f6" },
  payment_pending:           { label: "Payment Pending",      color: "#d97706", bg: "#fffbeb" },
  payment_failed:            { label: "Payment Failed",       color: "#dc2626", bg: "#fef2f2" },
  paid_pending_installation: { label: "Pending Installation", color: "#375dfb", bg: "#eff3ff" },
  installation_assigned:     { label: "Technician Assigned",  color: "#7c3aed", bg: "#f5f3ff" },
  installed:                 { label: "Installed",            color: "#059669", bg: "#ecfdf5" },
  active:                    { label: "Active",               color: "#059669", bg: "#ecfdf5" },
  paused:                    { label: "Paused",               color: "#6b7280", bg: "#f3f4f6" },
  expired:                   { label: "Expired",              color: "#dc2626", bg: "#fef2f2" },
  cancelled:                 { label: "Cancelled",            color: "#dc2626", bg: "#fef2f2" },
};

const ACTIVE_STATUSES = [
  "payment_pending", "paid_pending_installation",
  "installation_assigned", "installed", "active", "paused",
];

/* ── Single expandable card ── */
const SubCard = ({ sub, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);

  const plan   = sub.planId || {};
  const isLive = ACTIVE_STATUSES.includes(sub.status);
  const meta   = STATUS_META[sub.status] || { label: sub.status, color: "#6b7280", bg: "#f3f4f6" };

  let notes = {};
  try { notes = sub.notes ? JSON.parse(sub.notes) : {}; } catch (_) {}

  const addr     = notes.deliveryAddress || {};
  const addrLine = [addr.address, addr.city, addr.pincode].filter(Boolean).join(", ");
  const monthly  = plan.perMonthAmount ?? sub.amount ?? 0;
  const deposit  = plan.deposit ?? sub.depositAmount ?? 0;
  const install  = plan.installationCharges ?? notes.installationAmount ?? 0;
  const firstPay = notes.firstPayment ?? (monthly + deposit + install);

  return (
    <article
      className={`myplan-card${open ? " myplan-card--open" : ""}${isLive ? " myplan-card--live" : ""}`}
    >
      {/* ── Collapsed row — always visible ── */}
      <button
        className="myplan-card__row"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="myplan-card__info">
          <div className="myplan-card__top">
            <span className="myplan-card__brand">{plan.brandName || "—"}</span>
            {isLive && <span className="myplan-card__pulse" />}
          </div>
          <span className="myplan-card__model">{plan.modelName || "—"}</span>
          <span className="myplan-card__code">
            {sub.subscriptionCode || sub._id?.slice(-8).toUpperCase()}
          </span>
        </div>

        <div className="myplan-card__right">
          <span
            className="myplan-badge"
            style={{ color: meta.color, background: meta.bg }}
          >
            {meta.label}
          </span>
          <svg
            className={`myplan-chevron${open ? " myplan-chevron--open" : ""}`}
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Expanded details ── */}
      <div className={`myplan-card__details${open ? " myplan-card__details--open" : ""}`}>
        <div className="myplan-card__inner">

          {/* Pricing */}
          <div className="myplan-detail-row">
            <span className="myplan-detail-label">Monthly charge</span>
            <span className="myplan-detail-value">₹{monthly}<em>/mo</em></span>
          </div>
          <div className="myplan-detail-row">
            <span className="myplan-detail-label">Refundable deposit</span>
            <span className="myplan-detail-value">₹{deposit}</span>
          </div>
          {install > 0 && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">Installation</span>
              <span className="myplan-detail-value">₹{install}</span>
            </div>
          )}
          <div className="myplan-detail-row myplan-detail-row--total">
            <span className="myplan-detail-label">Due on delivery</span>
            <span className="myplan-detail-value myplan-detail-value--blue">₹{firstPay}</span>
          </div>

          {/* Dates */}
          <div className="myplan-detail-row">
            <span className="myplan-detail-label">Order placed</span>
            <span className="myplan-detail-value">{fmt(sub.createdAt) || "—"}</span>
          </div>
          {sub.startDate && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">Start date</span>
              <span className="myplan-detail-value">{fmt(sub.startDate)}</span>
            </div>
          )}
          {sub.endDate && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">End date</span>
              <span className="myplan-detail-value">{fmt(sub.endDate)}</span>
            </div>
          )}
          {sub.installedAt && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">Installed on</span>
              <span className="myplan-detail-value">{fmt(sub.installedAt)}</span>
            </div>
          )}

          {/* Address */}
          {addr.fullName && (
            <div className="myplan-detail-row myplan-detail-row--addr">
              <span className="myplan-detail-label">Delivery address</span>
              <span className="myplan-detail-value myplan-detail-value--addr">
                {addr.fullName} · {addr.mobile}
                {addrLine ? <><br />{addrLine}</> : null}
              </span>
            </div>
          )}

          {/* Payment & slot */}
          {notes.paymentMethod && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">Payment method</span>
              <span className="myplan-detail-value myplan-capitalize">{notes.paymentMethod}</span>
            </div>
          )}
          <div className="myplan-detail-row">
            <span className="myplan-detail-label">Payment status</span>
            <span className="myplan-detail-value myplan-capitalize">{sub.paymentStatus || "—"}</span>
          </div>
          {notes.deliverySlot && (
            <div className="myplan-detail-row">
              <span className="myplan-detail-label">Delivery slot</span>
              <span className="myplan-detail-value">{notes.deliverySlot}</span>
            </div>
          )}

          {/* Plan ID */}
          {plan.planId && (
            <div className="myplan-detail-row myplan-detail-row--last">
              <span className="myplan-detail-label">Plan ID</span>
              <span className="myplan-detail-value myplan-detail-value--mono">{plan.planId}</span>
            </div>
          )}

        </div>
      </div>
    </article>
  );
};

/* ══════════════════════════════════════════ */
const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

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

  const pastSubs = current
    ? history.filter((s) => s._id !== current._id)
    : history;

  return (
    <div className="myplan-page">
      <Header />

      <div className="myplan-body">

        {/* ── Loading ── */}
        {loading && (
          <div className="myplan-loader">
            <div className="myplan-skeleton" />
            <div className="myplan-skeleton" />
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="myplan-error">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* ── Section: Current ── */}
            <div className="myplan-section">
              <div className="myplan-section__header">
                <span className="myplan-section__label">Current Subscription</span>
              </div>

              {current ? (
                <SubCard sub={current} defaultOpen={true} />
              ) : (
                <div className="myplan-empty">
                  <p className="myplan-empty__text">No active subscription</p>
                  <p className="myplan-empty__sub">
                    Browse our plans and get purified water delivered to your door.
                  </p>
                  <button
                    className="myplan-empty__btn"
                    onClick={() => navigate("/product")}
                  >
                    Browse Plans
                  </button>
                </div>
              )}
            </div>

            {/* ── Section: Past orders ── */}
            {pastSubs.length > 0 && (
              <div className="myplan-section">
                <div className="myplan-section__header">
                  <span className="myplan-section__label">Past Orders</span>
                  <span className="myplan-section__count">{pastSubs.length}</span>
                </div>
                <div className="myplan-list">
                  {pastSubs.map((s) => (
                    <SubCard key={s._id} sub={s} defaultOpen={false} />
                  ))}
                </div>
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