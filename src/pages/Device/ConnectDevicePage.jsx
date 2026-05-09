import React, { useState } from "react";
import api from "../../services/api";
import "./ConnectDevicePage.css";

export default function ConnectDevicePage() {
  const [form, setForm] = useState({
    deviceId: "",
    serialNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "deviceId" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.deviceId.trim() || !form.serialNumber.trim()) {
      setError("Please enter both Device ID and Serial Number.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/devices/connect", {
        deviceId: form.deviceId.trim(),
        serialNumber: form.serialNumber.trim(),
      });

      setSuccess(data.message || "Device linked successfully.");
      setForm({ deviceId: "", serialNumber: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to link device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cd-page">
      <div className="cd-card">
        <div className="cd-brand">
          <div className="cd-brand-mark"><span>RRO</span></div>
        </div>

        <h1 className="cd-title">Link your device</h1>
        <p className="cd-subtitle">
          Enter your Device ID and Serial Number to connect your RO.
        </p>

        {error && <div className="cd-error">{error}</div>}
        {success && <div className="cd-success">{success}</div>}

        <form className="cd-form" onSubmit={handleSubmit}>
          <div className="cd-field">
            <label htmlFor="deviceId">Device ID</label>
            <div className="cd-input-wrap">
              <input
                id="deviceId"
                name="deviceId"
                type="text"
                placeholder="RRO001"
                value={form.deviceId}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="cd-field">
            <label htmlFor="serialNumber">Serial Number</label>
            <div className="cd-input-wrap">
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                placeholder="123456789"
                value={form.serialNumber}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <button className="cd-btn" type="submit" disabled={loading}>
            {loading ? "Linking..." : "Link Device"}
          </button>
        </form>
      </div>
    </div>
  );
}