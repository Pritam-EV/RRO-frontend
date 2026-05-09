import React, { useState, useEffect } from "react";
import "./SubscriptionPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ── Helpers ── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) : null;

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
  const monthly  = plan.perMonthAmount  ?? sub.amount          ?? 0;
  const deposit  = plan.deposit         ?? sub.depositAmount   ?? 0;
  const install  = plan.installationCharges ?? notes.installationAmount ?? 0;
  const firstPay = notes.firstPayment   ?? (monthly + deposit + install);

  return (
    <article className={`sp-card${open ? " sp-card--open" : ""}${isLive ? " sp-card--live" : ""}`}>

      {/* ── Collapsed row — always visible ── */}
      <button
        className="sp-card__row sp-card__row--sub"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="sp-card__info">
          <div className="sp-card__top-row">
            <span className="sp-card__brand">{plan.brandName || "—"}</span>
            {isLive && <span className="sp-pulse" />}
          </div>
          <span className="sp-card__model">{plan.modelName || "—"}</span>
          <span className="sp-card__code">
            #{sub.subscriptionCode || sub._id?.slice(-8).toUpperCase()}
          </span>
        </div>

        <div className="sp-card__meta-col">
          <span className="sp-badge" style={{ color: meta.color, background: meta.bg }}>
            {meta.label}
          </span>
          <svg
            className={`sp-card__chevron${open ? " sp-card__chevron--open" : ""}`}
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Expanded details ── */}
      <div className={`sp-card__details${open ? " sp-card__details--open" : ""}`}>
        <div className="sp-card__details-inner">

          <div className="sp-detail-row">
            <span className="sp-detail-label">Monthly charge</span>
            <span className="sp-detail-value">₹{monthly} <em>/mo</em></span>
          </div>
          <div className="sp-detail-row">
            <span className="sp-detail-label">Refundable deposit</span>
            <span className="sp-detail-value">₹{deposit}</span>
          </div>
          {install > 0 && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Installation</span>
              <span className="sp-detail-value">₹{install}</span>
            </div>
          )}
          <div className="sp-detail-row sp-detail-row--total">
            <span className="sp-detail-label">Due on delivery</span>
            <span className="sp-detail-value sp-detail-value--blue">₹{firstPay}</span>
          </div>

          <div className="sp-detail-row">
            <span className="sp-detail-label">Order placed</span>
            <span className="sp-detail-value">{fmt(sub.createdAt) || "—"}</span>
          </div>
          {sub.startDate && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Start date</span>
              <span className="sp-detail-value">{fmt(sub.startDate)}</span>
            </div>
          )}
          {sub.endDate && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">End date</span>
              <span className="sp-detail-value">{fmt(sub.endDate)}</span>
            </div>
          )}
          {sub.installedAt && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Installed on</span>
              <span className="sp-detail-value">{fmt(sub.installedAt)}</span>
            </div>
          )}

          {addr.fullName && (
            <div className="sp-detail-row sp-detail-row--addr">
              <span className="sp-detail-label">Delivery address</span>
              <span className="sp-detail-value sp-detail-value--addr">
                {addr.fullName} · {addr.mobile}
                {addrLine ? <><br />{addrLine}</> : null}
              </span>
            </div>
          )}

          {notes.paymentMethod && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Payment method</span>
              <span className="sp-detail-value sp-capitalize">{notes.paymentMethod}</span>
            </div>
          )}
          <div className="sp-detail-row">
            <span className="sp-detail-label">Payment status</span>
            <span className="sp-detail-value sp-capitalize">{sub.paymentStatus || "—"}</span>
          </div>
          {notes.deliverySlot && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Delivery slot</span>
              <span className="sp-detail-value">{notes.deliverySlot}</span>
            </div>
          )}
          {plan.planId && (
            <div className="sp-detail-row">
              <span className="sp-detail-label">Plan ID</span>
              <span className="sp-detail-value sp-detail-value--mono">{plan.planId}</span>
            </div>
          )}

        </div>
      </div>

    </article>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function SubscriptionPage() {
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

  /* ── Loading ── */
  if (loading)
    return (
      <div className="sp-page">
        <div className="sp-feedback">
          <span className="sp-spinner" />
          <p>Loading your plans…</p>
        </div>
      </div>
    );

  /* ── Error ── */
  if (error)
    return (
      <div className="sp-page">
        <div className="sp-feedback sp-feedback--error"><p>{error}</p></div>
      </div>
    );

  return (
    <div className="sp-page">

      {/* ── Current Subscription ── */}
      <div className="sp-section-header">
        <span className="sp-section-label">Current Subscription</span>
      </div>

      {current ? (
        <SubCard sub={current} defaultOpen={true} />
      ) : (
        <div className="sp-empty">
          <p className="sp-empty__title">No active subscription</p>
          <p className="sp-empty__sub">Browse plans and get purified water delivered to your door.</p>
          <button className="sp-card__btn" onClick={() => navigate("/product")}>
            Browse Plans
          </button>
        </div>
      )}

      {/* ── Past Orders ── */}
      {pastSubs.length > 0 && (
        <>
          <div className="sp-section-header" style={{ marginTop: "20px" }}>
            <span className="sp-section-label">Past Orders</span>
            <span className="sp-count">{pastSubs.length}</span>
          </div>
          <div className="sp-list">
            {pastSubs.map((s) => (
              <SubCard key={s._id} sub={s} defaultOpen={false} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}