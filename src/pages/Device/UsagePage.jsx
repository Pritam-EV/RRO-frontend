// src/pages/Device/UsagePage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./UsagePage.css";

export default function UsagePage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [devId,   setDevId]   = useState(null);
  const [activeBar, setActiveBar] = useState(null);

useEffect(() => {
  (async () => {
    try {
      setLoading(true);

      // Step 1: get deviceId from subscription
      const { data: subRes } = await api.get("/subscriptions/my");
      const sub = subRes?.data?.subscription;
      const rawDevice = sub?.deviceId;
      const deviceIdStr =
        typeof rawDevice === "object" && rawDevice?.deviceId
          ? rawDevice.deviceId : null;

      if (!deviceIdStr) {
        setError("No active device linked to your subscription.");
        return;
      }
      setDevId(deviceIdStr);

      // Step 2: use /overview which has today's real data
      const { data: ovRes } = await api.get(`/water/${deviceIdStr}/overview`);
      const ovData = ovRes?.data;

      // Step 3: build 7-day array — today has real data, past 6 days show 0
      // (until a DailyLog collection is added for historical data)
      const today = new Date();
      const filled = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dateStr = d.toISOString().split("T")[0];
        const isToday = i === 6;
        return {
          dateStr,
          label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3),
          litres: isToday ? (ovData?.todayLitres ?? 0) : 0,
          isToday,
        };
      });

      setLogs(filled);
      setActiveBar(6);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load usage data.");
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const totalWeek  = logs.reduce((s, l) => s + l.litres, 0);
  const avgDay     = logs.length ? (totalWeek / logs.length).toFixed(1) : "0.0";
  const max        = Math.max(...logs.map((l) => l.litres), 1);
  const todayLitres = logs[6]?.litres ?? 0;
  const isOver     = totalWeek > 100;

  const activeLog  = activeBar !== null ? logs[activeBar] : null;

  /* ── Skeleton ── */
  if (loading) return (
    <div className="up-page">
      <div className="up-header">
        <div className="sk sk-title" />
        <div className="sk sk-sub" />
      </div>
      <div className="sk sk-card" />
      <div className="sk sk-chart" />
      <div className="sk sk-list" />
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="up-page">
      <div className="up-error-state">
        <span className="up-error-icon">⚠️</span>
        <p className="up-error-msg">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="up-page">

      {/* ── Header ── */}
      <div className="up-header">
        <div>
          <h2 className="up-title">Water Usage</h2>
          <p className="up-subtitle">Last 7 days{devId ? <> · <span className="up-devid">{devId}</span></> : ""}</p>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="up-kpi-row">
        <div className="up-kpi-card up-kpi-primary">
          <span className="up-kpi-icon">💧</span>
          <span className="up-kpi-val">{todayLitres.toFixed(1)}<span className="up-kpi-unit">L</span></span>
          <span className="up-kpi-label">Today</span>
        </div>
        <div className="up-kpi-card">
          <span className="up-kpi-icon">📊</span>
          <span className="up-kpi-val">{totalWeek.toFixed(1)}<span className="up-kpi-unit">L</span></span>
          <span className="up-kpi-label">This Week</span>
        </div>
        <div className="up-kpi-card">
          <span className="up-kpi-icon">⌀</span>
          <span className="up-kpi-val">{avgDay}<span className="up-kpi-unit">L</span></span>
          <span className="up-kpi-label">Daily Avg</span>
        </div>
      </div>

      {/* ── Chart card ── */}
      <div className="up-chart-card">
        <div className="up-chart-header">
          <span className="up-chart-title">7-Day Consumption</span>
          <span className={`up-badge ${isOver ? "up-badge-over" : "up-badge-ok"}`}>
            {isOver ? "Above avg" : "Normal range"}
          </span>
        </div>

        {/* Tooltip */}
        {activeLog && (
          <div className="up-tooltip">
            <span className="up-tooltip-date">{activeLog.dateStr}</span>
            <span className="up-tooltip-val">{activeLog.litres.toFixed(2)} L</span>
          </div>
        )}

        {/* Bar chart */}
        <div className="up-bars">
          {logs.map((d, idx) => {
            const heightPct = max > 0 ? (d.litres / max) * 100 : 0;
            const isActive  = activeBar === idx;
            return (
              <div
                key={idx}
                className="up-bar-col"
                onClick={() => setActiveBar(idx)}
              >
                <div className="up-bar-track">
                  <div
                    className={`up-bar-fill ${isActive ? "up-bar-active" : ""} ${d.isToday ? "up-bar-today" : ""}`}
                    style={{ height: `${Math.max(heightPct, d.litres > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className={`up-bar-label ${isActive ? "up-bar-label-active" : ""}`}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Y-axis hint */}
        <div className="up-chart-ymax">{max.toFixed(0)} L max</div>
      </div>

      {/* ── Daily log list ── */}
      <div className="up-log-card">
        <p className="up-log-heading">Daily Breakdown</p>
        {[...logs].reverse().map((d, idx) => {
          const pct = max > 0 ? (d.litres / max) * 100 : 0;
          return (
            <div key={idx} className={`up-log-row ${d.isToday ? "up-log-today" : ""}`}>
              <div className="up-log-left">
                <span className="up-log-day">{d.label}</span>
                <span className="up-log-date">{d.dateStr}</span>
              </div>
              <div className="up-log-bar-wrap">
                <div
                  className={`up-log-bar ${d.litres === 0 ? "up-log-bar-empty" : ""}`}
                  style={{ width: `${Math.max(pct, d.litres > 0 ? 3 : 0)}%` }}
                />
              </div>
              <span className={`up-log-val ${d.litres === 0 ? "up-log-val-zero" : ""}`}>
                {d.litres > 0 ? `${d.litres.toFixed(1)} L` : "—"}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}