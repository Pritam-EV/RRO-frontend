import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./ChoicePage.css";

import purifierImg from "../../assets/images/water1.jpg";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const ChoicePage = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("rro_user_name") || "Amit";
  const [hasRO, setHasRO] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("Your RO purifier");

  useEffect(() => {
    const linked = localStorage.getItem("rro_device_linked") === "true";
    setHasRO(linked);
    setDeviceId(localStorage.getItem("rro_device_id") || "");
    setDeviceName(localStorage.getItem("rro_device_name") || "Your RO purifier");
  }, []);

  return (
    <PageContainer background="dark" hasBottomNav={true}>
      <div className="choice-page">

        {/* 🔝 HEADER */}
        <Header />

        {/* 👋 HERO */}
        <div className="hero premium-hero">
          <div className="hero-text">
            <h1>{getGreeting()},</h1>
            <h2>{userName}</h2>
           
          </div>

          <div className="hero-image">
            <img src={purifierImg} alt="RO" />
          </div>
        </div>

        {/* ✨ QUICK ACTIONS */}
        <div className="quick-actions premium-scroll">

          <div
            className="action-card action-card-refer glow"
            onClick={() => navigate("/refer")}
          >
            <div className="action-icon">🤝</div>
            <p className="action-label">Refer & Earn</p>
            <span className="action-chip">₹150</span>
          </div>

          <div
            className="action-card action-card-daily glow"
            onClick={() => navigate("/subscription")}
          >
            <div className="action-icon">📅</div>
            <p className="action-label">Daily Plan</p>
            <span className="action-chip">68%</span>
          </div>

        </div>

        {/* 🔥 CONDITIONAL UI */}
        {hasRO ? (
          <>
            <div className="glass-card premium-card linked-device-card">
              <p className="card-title">🔗 Device Linked</p>
              <h2>{deviceName}</h2>
              {deviceId && <p className="sub">Device ID: {deviceId}</p>}
              <button
                className="add-ro-btn premium-btn"
                onClick={() => navigate("/device/connect")}
              >
                Manage device
              </button>
            </div>

            <div className="cards">
              <div className="glass-card premium-card">
                <p className="card-title">💧 Litre Utilized</p>
                <h2>1320L</h2>
                <p className="sub">of 2000L subscribed</p>

                <div className="progress">
                  <div className="fill gradient-fill" style={{ width: "66%" }}></div>
                </div>
              </div>

              <div className="glass-card premium-card">
                <p className="card-title">📅 Subscription Active</p>
                <h2>45 Days</h2>
                <p className="sub">of 90 Days total</p>

                <div className="progress">
                  <div className="fill gradient-fill" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-ro-box premium-empty">
            <div className="no-ro-icon">🚫</div>
            <h3>No RO Device Linked</h3>
            <p>Connect your purifier to track usage & subscription</p>

            <button
              className="add-ro-btn premium-btn"
              onClick={() => navigate("/device/connect")}
            >
              + Add RO Device
            </button>
          </div>
        )}

        {/* 🔻 FOOTER */}
        <Footer />

      </div>
    </PageContainer>
  );
};

export default ChoicePage;