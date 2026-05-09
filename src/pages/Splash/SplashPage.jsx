import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashPage.css";
import logo from "../../assets/images/logo.png";

const SplashPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

useEffect(() => {
  setIsLoaded(true);

  const progressInterval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 100) { clearInterval(progressInterval); return 100; }
      return prev + 2;
    });
  }, 100);

  const timer = setTimeout(() => {
    const token = localStorage.getItem("rro_token");
    navigate(token ? "/dashboard" : "/login", { replace: true });
  }, 5000);

  return () => {
    clearTimeout(timer);
    clearInterval(progressInterval);
  };
}, [navigate]);

const handleSkip = () => {
  const token = localStorage.getItem("rro_token");
  navigate(token ? "/dashboard" : "/login", { replace: true });
};

  return (
    <div className="splash-screen">
      {/* Background with gradient animation */}
      <div className="splash-bg">
        <div className="bg-gradient"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Main content */}
      <div className={`splash-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Logo container */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <div className="logo-ring">
              <div className="logo-inner">
                <img src={logo} alt="AquaRental" className="app-logo" />
              </div>
            </div>
            <div className="logo-pulse"></div>
          </div>
        </div>

        {/* App info */}
        <div className="app-info">
          <h1 className="app-name">AquaRental</h1>
          <p className="app-tagline">Smart Water Solutions</p>
          <p className="app-subtitle">Experience the future of water purification</p>
        </div>

        {/* Loading indicator */}
        <div className="loading-section">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring spinner-ring-secondary"></div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      </div>

      {/* Skip button */}
      <button className="skip-button" onClick={handleSkip}>
        Skip
      </button>
    </div>
  );
};

export default SplashPage;
