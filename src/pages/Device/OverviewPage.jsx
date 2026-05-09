// src/pages/Device/OverviewPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./OverviewPage.css";

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

export default function OverviewPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [sub,         setSub]         = useState(null);
  const [deviceInfo,  setDevice]      = useState(null);
  const [litres,      setLitres]      = useState(0);
  const [todayLitres, setTodayLitres] = useState(0);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: subRes } = await api.get("/subscriptions/my");
        const subscription = subRes?.data?.subscription;
        setSub(subscription);

        if (subscription?.status === "active" && subscription?.deviceId) {
          const rawDevice   = subscription.deviceId;
          const devIdString =
            typeof rawDevice === "object" && rawDevice?.deviceId
              ? rawDevice.deviceId : null;

          if (devIdString) {
            setDevice(rawDevice);
            try {
              const { data: ovRes } = await api.get(`/water/${devIdString}/overview`);
              setLitres(ovRes?.data?.totalLitres ?? 0);
              setTodayLitres(ovRes?.data?.todayLitres ?? 0);
              if (ovRes?.data?.device) setDevice(ovRes.data.device);
            } catch (_) {}
          }
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isActive  = sub?.status === "active" && sub?.deviceId;
  const isPending = sub && !isActive;
  const days      = daysLeft(sub?.endDate);
  const devIdStr  = deviceInfo?.deviceId || "—";
  const isOnline  = deviceInfo?.isOnline ?? false;
  const firstName = user?.name?.split(" ")[0] || "there";

  const daysClass =
    days === null ? "" : days <= 5 ? "ov-urgent" : days <= 15 ? "ov-warn" : "ov-safe";

  const renewLabel = sub?.endDate
    ? new Date(sub.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

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
          <div className="ov-sk ov-sk-alert" />
        </div>

      ) : isActive ? (
        <>
          {/* ── Main card ── */}
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

            {/* Divider */}
            <div className="ov-card-divider" />

            {/* Usage numbers */}
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

            {/* Progress bar */}
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

            {/* Divider */}
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
                <p className="ov-card-meta-val">{renewLabel}</p>
              </div>
              <div className="ov-card-meta-sep" />
              <div className="ov-card-meta-item">
                <p className="ov-card-meta-label">Plan</p>
                <p className="ov-card-meta-val">{sub?.planId?.brandName || "RRO"}</p>
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
          </div>

          {/* ── Renewal alert ── */}
          {days !== null && days <= 7 && (
            <div className="ov-renewal-alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>
                Subscription expires in{" "}
                <strong>{days} day{days !== 1 ? "s" : ""}</strong>.
                Renew to avoid interruption.
              </span>
            </div>
          )}
        </>

      ) : isPending ? (
        <div className="ov-empty">
          <div className="ov-empty-icon-wrap pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <h2 className="ov-empty-title">Installation Pending</h2>
          <p className="ov-empty-sub">
            Your subscription <strong>{sub.subscriptionCode}</strong> is confirmed.
            A technician will install your RO unit shortly.
          </p>
          <span className="ov-status-pill">{sub.status.replace(/_/g, " ")}</span>
        </div>

      ) : (
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
            Get started by connecting your RO device or purchasing a new plan.
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
      )}
    </div>
  );
}