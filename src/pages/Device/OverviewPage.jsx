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

export default function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sub, setSub]           = useState(null);
  const [deviceInfo, setDevice] = useState(null);
  const [litres, setLitres]     = useState(0);
  const [loading, setLoading]   = useState(true);
  const [todayLitres, setTodayLitres] = useState(0);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Step 1: Get subscription (deviceId is now populated from BE)
        const { data: subRes } = await api.get("/subscriptions/my");
        const subscription = subRes?.data?.subscription;
        setSub(subscription);

        // Step 2: If active + device is populated, extract deviceId string
        if (subscription?.status === "active" && subscription?.deviceId) {
          // After populate, deviceId is an object: { deviceId: "RRO001", ... }
          // Before populate (or if populate missed), it's just an ObjectId string
          const rawDevice = subscription.deviceId;
          const devIdString =
            typeof rawDevice === "object" && rawDevice?.deviceId
              ? rawDevice.deviceId          // populated ✅
              : null;                        // not populated — skip overview call

          if (devIdString) {
            // Set device info from the populated object directly
            setDevice(rawDevice);

            // Step 3: Fetch overview for totalLitres
            try {
              const { data: ovRes } = await api.get(`/water/${devIdString}/overview`);
              setLitres(ovRes?.data?.totalLitres ?? 0);
              setTodayLitres(ovRes?.data?.todayLitres ?? 0);
              // Also update device with fresh isOnline status
              if (ovRes?.data?.device) setDevice(ovRes.data.device);
            } catch (ovErr) {
  console.warn("Overview fetch failed:", {
    status:  ovErr?.response?.status,
    message: ovErr?.response?.data?.message,
    url:     `/water/${devIdString}/overview`,
  });
}
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

  return (
    <div className="ov-page">

      {/* Greeting */}
      <div className="ov-greet">
        <p className="ov-greet-sub">{greeting()},</p>
        <h1 className="ov-greet-name">{user?.name?.split(" ")[0] || "User"} 👋</h1>
      </div>

      {loading ? (
        <div className="ov-empty">
          <p style={{ color: "#888", marginTop: 32 }}>Loading your dashboard…</p>
        </div>

      ) : isActive ? (
        <>
          {/* ── Device Summary Card ── */}
          <div className="ov-device-card" onClick={() => navigate("/dashboard/usage")}>
            <div className="ov-device-card-header">
              <span className="ov-device-icon">💧</span>
              <div>
                <p className="ov-device-id">{devIdStr}</p>
                <p className={`ov-device-status ${deviceInfo?.isOnline ? "online" : "offline"}`}>
                  ● {deviceInfo?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <svg className="ov-ro-arrow" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>

            <div className="ov-device-stats">
              <div className="ov-dstat">
                <span className="ov-dstat-val">{days !== null ? days : "—"}</span>
                <span className="ov-dstat-label">Days Left</span>
              </div>
              <div className="ov-dstat-divider" />
<div className="ov-dstat">
  <span className="ov-dstat-val">{Number(todayLitres).toFixed(1)} L</span>
  <span className="ov-dstat-label">Today</span>
</div>
<div className="ov-dstat-divider" />
<div className="ov-dstat">
  <span className="ov-dstat-val">{Number(litres).toFixed(1)} L</span>
  <span className="ov-dstat-label">Total Used</span>
</div>
              <div className="ov-dstat-divider" />
              <div className="ov-dstat">
                <span className="ov-dstat-val">
                  {sub?.endDate
                    ? new Date(sub.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                    : "—"}
                </span>
                <span className="ov-dstat-label">Renews On</span>
              </div>
            </div>
          </div>


        </>

      ) : isPending ? (
        <div className="ov-empty">
          <div className="ov-empty-icon">🔧</div>
          <h2 className="ov-empty-title">Installation Pending</h2>
          <p className="ov-empty-sub">
            Your subscription <strong>{sub.subscriptionCode}</strong> is confirmed.
            A technician will install your RO soon.
          </p>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: 8 }}>
            Status: {sub.status.replace(/_/g, " ")}
          </p>
        </div>

      ) : (
        <div className="ov-empty">
          <div className="ov-empty-icon">💧</div>
          <h2 className="ov-empty-title">No RO linked yet</h2>
          <p className="ov-empty-sub">
            Connect your smart RO system or purchase a new one to get started.
          </p>
          <div className="ov-empty-actions">
            <button className="ov-btn-primary" onClick={() => navigate("/device/connect")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add RO Device
            </button>
            <button className="ov-btn-ghost" onClick={() => navigate("/product")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.97-1.67l1.38-7.33H6"/>
              </svg>
              Purchase RO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}