// src/pages/Device/UsagePage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./UsagePage.css";

export default function UsagePage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [devId,   setDevId]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Step 1: get subscription → extract deviceId string
        const { data: subRes } = await api.get("/subscriptions/my");
        const sub = subRes?.data?.subscription;
        const rawDevice = sub?.deviceId;
        const deviceIdStr =
          typeof rawDevice === "object" && rawDevice?.deviceId
            ? rawDevice.deviceId
            : null;

        if (!deviceIdStr) {
          setError("No active device linked to your subscription.");
          return;
        }
        setDevId(deviceIdStr);

        // Step 2: fetch last 7 days history
        const { data: histRes } = await api.get(
          `/water/${deviceIdStr}/history?days=7`
        );
        const rawLogs = histRes?.data?.logs ?? [];

        // Step 3: build a full 7-day array (fill missing days with 0)
        const today = new Date();
        const filled = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          const dateStr = d.toISOString().split("T")[0];
          const found   = rawLogs.find((l) => l.date === dateStr);
          return {
            dateStr,
            label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2),
            litres: found?.totalLitresToday ?? 0,
          };
        });

        setLogs(filled);
      } catch (e) {
        console.error("UsagePage error:", e);
        setError(e?.response?.data?.message || "Failed to load usage data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalWeek = logs.reduce((s, l) => s + l.litres, 0);
  const avgDay    = logs.length ? (totalWeek / logs.length).toFixed(1) : 0;
  const max       = Math.max(...logs.map((l) => l.litres), 1);

  if (loading) return (
    <div className="usage-page">
      <p style={{ color: "#888", marginTop: 40, textAlign: "center" }}>
        Loading usage data…
      </p>
    </div>
  );

  if (error) return (
    <div className="usage-page">
      <p style={{ color: "#e74c3c", marginTop: 40, textAlign: "center" }}>
        {error}
      </p>
    </div>
  );

  return (
    <div className="usage-page">
      <h2 className="usage-title">Usage History</h2>
      <p className="usage-subtitle">
        Your last 7 days water consumption{devId ? ` · ${devId}` : ""}.
      </p>

      <div className="usage-summary-card">
        <div>
          <div className="usage-summary-label">This week</div>
          <div className="usage-summary-value">{totalWeek.toFixed(1)} L</div>
          <div className="usage-summary-meta">Daily avg ~ {avgDay} L</div>
        </div>
        <div className={`usage-summary-chip ${totalWeek > 100 ? "over" : ""}`}>
          {totalWeek > 100 ? "Over limit" : "Within limit"}
        </div>
      </div>

      <div className="usage-chart">
        {logs.map((d, idx) => (
          <div key={idx} className="usage-bar-col">
            <span className="usage-bar-val">
              {d.litres > 0 ? `${d.litres.toFixed(1)}` : ""}
            </span>
            <div
              className="usage-bar-inner"
              style={{ height: `${(d.litres / max) * 100}%` }}
            />
            <span className="usage-bar-label">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Daily breakdown list */}
      <div className="usage-log-list">
        {[...logs].reverse().map((d, idx) => (
          <div key={idx} className="usage-log-row">
            <span className="usage-log-date">{d.dateStr}</span>
            <div className="usage-log-bar-wrap">
              <div
                className="usage-log-bar"
                style={{ width: `${(d.litres / max) * 100}%` }}
              />
            </div>
            <span className="usage-log-val">{d.litres.toFixed(1)} L</span>
          </div>
        ))}
      </div>
    </div>
  );
}