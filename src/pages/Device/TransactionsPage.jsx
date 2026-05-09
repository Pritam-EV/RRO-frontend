import React, { useState, useEffect } from "react";
import "./TransactionsPage.css";
import api from "../../services/api";

/* ── helpers ── */
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const STATUS_META = {
  success:    { label: "Success",  color: "#059669", bg: "#ecfdf5" },
  paid:       { label: "Paid",     color: "#059669", bg: "#ecfdf5" },
  failed:     { label: "Failed",   color: "#dc2626", bg: "#fef2f2" },
  pending:    { label: "Pending",  color: "#d97706", bg: "#fffbeb" },
  refunded:   { label: "Refunded", color: "#7c3aed", bg: "#f5f3ff" },
  initiated:  { label: "Initiated",color: "#6b7280", bg: "#f3f4f6" },
};

const TYPE_LABEL = {
  subscription:  "Subscription",
  monthly_rent:  "Monthly Rent",
  topup:         "Top-up",
  deposit:       "Deposit",
  installation:  "Installation",
  refund:        "Refund",
};

const normalize = (status = "") =>
  STATUS_META[status.toLowerCase()] ||
  { label: status, color: "#6b7280", bg: "#f3f4f6" };

/* ── Single transaction row ── */
const TxnCard = ({ txn }) => {
  const [open, setOpen] = useState(false);
  const meta   = normalize(txn.status || txn.paymentStatus);
  const label  = TYPE_LABEL[txn.type] || txn.type || "Payment";
  const amount = txn.amount ?? txn.paidAmount ?? 0;

  return (
    <article className={`txn-card${open ? " txn-card--open" : ""}`}>

      {/* Always-visible row */}
      <button
        className="txn-card__row"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {/* Icon */}
        <div className="txn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>

        {/* Info */}
        <div className="txn-info">
          <span className="txn-label">{label}</span>
          <span className="txn-date">{fmt(txn.createdAt || txn.date)}</span>
        </div>

        {/* Amount + status */}
        <div className="txn-right">
          <span className="txn-amount">₹{amount}</span>
          <span className="txn-badge"
            style={{ color: meta.color, background: meta.bg }}>
            {meta.label}
          </span>
        </div>

        <svg
          className={`txn-chevron${open ? " txn-chevron--open" : ""}`}
          width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded details */}
      <div className={`txn-details${open ? " txn-details--open" : ""}`}>
        <div className="txn-details-inner">

          {txn.orderId && (
            <div className="txn-row">
              <span className="txn-row__label">Order ID</span>
              <span className="txn-row__value txn-mono">{txn.orderId}</span>
            </div>
          )}
          {txn.paymentId && (
            <div className="txn-row">
              <span className="txn-row__label">Payment ID</span>
              <span className="txn-row__value txn-mono">{txn.paymentId}</span>
            </div>
          )}
          {txn.subscriptionCode && (
            <div className="txn-row">
              <span className="txn-row__label">Subscription</span>
              <span className="txn-row__value txn-mono">#{txn.subscriptionCode}</span>
            </div>
          )}
          <div className="txn-row">
            <span className="txn-row__label">Amount</span>
            <span className="txn-row__value">₹{amount}</span>
          </div>
          <div className="txn-row">
            <span className="txn-row__label">Status</span>
            <span className="txn-row__value" style={{ color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <div className="txn-row">
            <span className="txn-row__label">Date</span>
            <span className="txn-row__value">{fmt(txn.createdAt || txn.date)}</span>
          </div>
          {txn.method && (
            <div className="txn-row">
              <span className="txn-row__label">Method</span>
              <span className="txn-row__value txn-capitalize">{txn.method}</span>
            </div>
          )}
          {txn.description && (
            <div className="txn-row txn-row--last">
              <span className="txn-row__label">Note</span>
              <span className="txn-row__value">{txn.description}</span>
            </div>
          )}

        </div>
      </div>

    </article>
  );
};

/* ════════════════════════════════════════════════════════════ */
export default function TransactionsPage() {
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [txns,     setTxns]     = useState([]);
  const [filter,   setFilter]   = useState("all"); // all | success | failed | pending

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/payments/history");
        setTxns(data?.data?.payments || []); 
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === "all"
    ? txns
    : txns.filter((t) =>
        (t.status || t.paymentStatus || "").toLowerCase() === filter
      );

  const total = filtered.reduce((s, t) => {
    const st = (t.status || t.paymentStatus || "").toLowerCase();
    return st === "success" || st === "paid" ? s + (t.amount ?? 0) : s;
  }, 0);

  /* ── Loading ── */
  if (loading)
    return (
      <div className="sp-page">
        <div className="sp-feedback">
          <span className="sp-spinner" />
          <p>Loading transactions…</p>
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

      {/* ── Page header ── */}
      <div className="sp-header">
        <h2>Transactions</h2>
        {txns.length > 0 && (
          <span className="sp-count">{txns.length} records</span>
        )}
      </div>

      {/* ── Summary pill ── */}
      {txns.length > 0 && (
        <div className="txn-summary">
          <div className="txn-summary__item">
            <span className="txn-summary__label">Total paid</span>
            <span className="txn-summary__value">₹{total}</span>
          </div>
          <div className="txn-summary__divider" />
          <div className="txn-summary__item">
            <span className="txn-summary__label">Records</span>
            <span className="txn-summary__value">{txns.length}</span>
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      {txns.length > 0 && (
        <div className="txn-filters">
          {["all", "success", "pending", "failed"].map((f) => (
            <button
              key={f}
              className={`txn-filter-btn${filter === f ? " txn-filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div className="sp-empty">
          <p className="sp-empty__title">No transactions found</p>
          <p className="sp-empty__sub">
            {txns.length === 0
              ? "Your payment history will appear here once you place an order."
              : "No transactions match this filter."}
          </p>
        </div>
      ) : (
        <div className="sp-list">
          {filtered.map((t, i) => (
            <TxnCard key={t._id || t.orderId || i} txn={t} />
          ))}
        </div>
      )}

    </div>
  );
}