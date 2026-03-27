import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashPage.css";
import logo from "../../assets/images/logo.png";


const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate("/login", { replace: true });
  };

  return (
    <section className="splash-screen">

      <div className="splash-container">
        <div className="splash-drop-ring">
          <div className="splash-drop" />
          <div className="splash-ring" />
        </div>

        <div className="splash-logo-block">
          <div className="splash-logo">
            <img src={logo} alt="AquaRental Logo" />
          </div>
          <h1 className="splash-title">AquaRental</h1>
          <p className="splash-subtitle">Smart rental RO purifier</p>
        </div>

        <button className="splash-skip-btn" onClick={handleSkip}>
          Skip
        </button>
      </div>
    </section>
  );
};

export default SplashPage;
