// src/pages/Device/OverviewPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./OverviewPage.css";

/* ── helpers ── */
function daysLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── Pending status display map ── */
const PENDING_META = {
  payment_pending: {
    label:   "Payment Pending",
    msg:     "A technician has been assigned and will visit your location shortly.",
    accent:  "#f59e0b",
    bgStrip: "linear-gradient(90deg,#f59e0b,#fbbf24)",
  },
  paid_pending_installation: {
    label:   "Installation Pending",
    msg:     "Payment received. A technician will contact you to schedule installation.",
    accent:  "#3b82f6",
    bgStrip: "linear-gradient(90deg,#3b82f6,#60a5fa)",
  },
  installation_assigned: {
    label:   "Technician Assigned",
    msg:     "A technician has been assigned and will visit you shortly.",
    accent:  "#8b5cf6",
    bgStrip: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
  },
  installed: {
    label:   "Installed — Activation Pending",
    msg:     "Device installed. Activation is in progress.",
    accent:  "#10b981",
    bgStrip: "linear-gradient(90deg,#10b981,#34d399)",
  },
};

/* ════════════════════════════════════════════════════════
   CARD TYPE A — Pending / non-active subscription
════════════════════════════════════════════════════════ */
function PendingCard({ sub }) {
  const meta     = PENDING_META[sub.status] || {
    label:   sub.status?.replace(/_/g, " ") || "Pending",
    msg:     "Your subscription is being processed.",
    accent:  "#6b7280",
    bgStrip: "linear-gradient(90deg,#6b7280,#9ca3af)",
  };
  const planName = sub.planId?.brandName || "RRO Plan";
  const planModel= sub.planId?.modelName || "";

  return (
    <div className="ov-pending-card">
      {/* Colour strip */}
      <div className="ov-pending-strip" style={{ background: meta.bgStrip }} />

      {/* Header */}
      <div className="ov-pending-header">
        <div>
          <p className="ov-pending-plan">{planName}{planModel ? ` · ${planModel}` : ""}</p>
          <p className="ov-pending-code">#{sub.subscriptionCode}</p>
        </div>
        <span className="ov-pending-badge" style={{ color: meta.accent,
          background: `${meta.accent}18`, border: `1px solid ${meta.accent}30` }}>
          {meta.label}
        </span>
      </div>

      {/* Message */}
      <p className="ov-pending-msg">{meta.msg}</p>

      {/* Footer — ordered on date */}
      <div className="ov-pending-footer">
        <span className="ov-pending-footer-label">Ordered on</span>
        <span className="ov-pending-footer-val">{fmtDate(sub.createdAt)}</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   CARD TYPE B — Active subscription with device
════════════════════════════════════════════════════════ */
function ActiveCard({ sub, navigate }) {
  const [litres,      setLitres]      = useState(null);
  const [todayLitres, setTodayLitres] = useState(null);
  const [deviceInfo,  setDevice]      = useState(
    typeof sub.deviceId === "object" ? sub.deviceId : null
  );

  useEffect(() => {
    const rawDevice   = sub.deviceId;
    const devIdString = typeof rawDevice === "object" && rawDevice?.deviceId
      ? rawDevice.deviceId : null;
    if (!devIdString) return;

    api.get(`/water/${devIdString}/overview`)
      .then(({ data: ovRes }) => {
        setLitres(ovRes?.data?.totalLitres ?? 0);
        setTodayLitres(ovRes?.data?.todayLitres ?? 0);
        if (ovRes?.data?.device) setDevice(ovRes.data.device);
      })
      .catch(() => {
        setLitres(0);
        setTodayLitres(0);
      });
  }, [sub._id]);

  const devIdStr  = deviceInfo?.deviceId || "—";
  const isOnline  = deviceInfo?.isOnline ?? false;
  const days      = daysLeft(sub.endDate);
  const daysClass = days === null ? "" : days <= 5 ? "ov-urgent" : days <= 15 ? "ov-warn" : "ov-safe";
  const planName  = sub.planId?.brandName || "RRO";
  const loading   = litres === null;

  return (
    <div className="ov-main-card" onClick={() => navigate("/dashboard/usage")}>

      {/* Top accent strip */}
      <div className="ov-card-strip" />

      {/* Device row */}
      <div className="ov-card-device-row">
        <div className="ov-card-device-left">
          <span className={`ov-dot ${isOnline ? "online" : "offline"}`} />
          <span className="ov-card-devid">{devIdStr}</span>
        </div>
        <span className={`ov-chip ${isOnline ? "chip-on" : "chip-off"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="ov-card-divider" />

      {/* Usage numbers */}
      {loading ? (
        <div className="ov-card-usage-row">
          <div className="ov-sk ov-sk-inline" />
        </div>
      ) : (
        <>
          <div className="ov-card-usage-row">
            <div className="ov-card-metric">
              <p className="ov-card-metric-label">Today's Usage</p>
              <p className="ov-card-metric-val">
                {Number(todayLitres).toFixed(2)}
                <span className="ov-card-metric-unit"> L</span>
              </p>
            </div>
            <div className="ov-card-metric-divider" />
            <div className="ov-card-metric" style={{ textAlign: "right" }}>
              <p className="ov-card-metric-label">Total Used</p>
              <p className="ov-card-metric-val">
                {Number(litres).toFixed(1)}
                <span className="ov-card-metric-unit"> L</span>
              </p>
            </div>
          </div>

          <div className="ov-progress-wrap">
            <div
              className="ov-progress-fill"
              style={{ width: `${Math.min((todayLitres / 14) * 100, 100)}%` }}
            />
          </div>
          <p className="ov-progress-hint">
            {todayLitres < 14
              ? `${(14 - todayLitres).toFixed(1)} L below daily avg`
              : "Above daily average · 14 L avg"}
          </p>
        </>
      )}

      <div className="ov-card-divider" />

      {/* Subscription meta row */}
      <div className="ov-card-meta-row">
        <div className="ov-card-meta-item">
          <p className="ov-card-meta-label">Days Left</p>
          <p className={`ov-card-meta-val ${daysClass}`}>
            {days !== null ? days : "—"}
          </p>
        </div>
        <div className="ov-card-meta-sep" />
        <div className="ov-card-meta-item">
          <p className="ov-card-meta-label">Renews On</p>
          <p className="ov-card-meta-val">{fmtDate(sub.endDate)}</p>
        </div>
        <div className="ov-card-meta-sep" />
        <div className="ov-card-meta-item">
          <p className="ov-card-meta-label">Plan</p>
          <p className="ov-card-meta-val">{planName}</p>
        </div>
      </div>

      {/* Tap hint */}
      <div className="ov-card-tap-row">
        <span className="ov-card-tap-text">View full usage</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>

      {/* Renewal alert inside card */}
      {days !== null && days <= 7 && (
        <div className="ov-renewal-inline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            Expires in <strong>{days} day{days !== 1 ? "s" : ""}</strong> — renew now.
          </span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OverviewPage
════════════════════════════════════════════════════════ */
const ACTIVE_STATUSES = ["active"];
const PENDING_STATUSES = [
  "payment_pending",
  "paid_pending_installation",
  "installation_assigned",
  "installed",
];

export default function OverviewPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [subs,    setSubs]    = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/subscriptions/my");
        const arr = data?.data?.subscriptions;
        if (Array.isArray(arr) && arr.length > 0) {
          setSubs(arr);
        } else if (data?.data?.subscription) {
          setSubs([data.data.subscription]);
        } else {
          setSubs([]);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Separate into active and pending, preserving createdAt desc order within each
  const activeSubs  = subs.filter(s => ACTIVE_STATUSES.includes(s.status));
  const pendingSubs = subs.filter(s => PENDING_STATUSES.includes(s.status));
  const hasSubs     = subs.length > 0;

  return (
    <div className="ov-page">

      {/* ── Greeting ── */}
      <div className="ov-greet">
        <p className="ov-greet-time">{greeting()},</p>
        <h1 className="ov-greet-name">{firstName}</h1>
      </div>

      {/* ── Loading skeleton ── */}
      {loading ? (
        <div className="ov-skeleton-wrap">
          <div className="ov-sk ov-sk-hero" />
          <div className="ov-sk ov-sk-pending" />
        </div>

      ) : !hasSubs ? (
        /* ── No subscription at all ── */
        <div className="ov-empty">
          <div className="ov-empty-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
          </div>
          <h2 className="ov-empty-title">No active subscription</h2>
          <p className="ov-empty-sub">
            Get started by purchasing a plan or connecting your RO device.
          </p>
          <div className="ov-empty-actions">
            <button className="ov-btn-primary" onClick={() => navigate("/product")}>
              View Plans
            </button>
            <button className="ov-btn-ghost" onClick={() => navigate("/device/connect")}>
              Connect Device
            </button>
          </div>
        </div>

      ) : (
        <div className="ov-cards-list">

          {/* Active cards first */}
          {activeSubs.map(sub => (
            <ActiveCard key={sub._id} sub={sub} navigate={navigate} />
          ))}

          {/* Pending cards below */}
          {pendingSubs.map(sub => (
            <PendingCard key={sub._id} sub={sub} />
          ))}

        </div>
      )}
    </div>
  );
}