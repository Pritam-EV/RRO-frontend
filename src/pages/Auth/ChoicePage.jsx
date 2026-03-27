import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChoicePage.css";
import waterImg from "../../assets/images/water1.jpg";

const ChoicePage = () => {
  const navigate = useNavigate();

  const handleChoice = (type) => {
    if (type === "scan") navigate("/device/connect");
    if (type === "start") navigate("/product");
    if (type === "refer") navigate("/refer");
  };

  return (
    <section className="choice-page">
      <h1 className="choice-title">How would you like to use AquaRental?</h1>

      <div className="choice-card">
        <div className="choice-text">
          <h2>I already have a purifier</h2>
          <p>Connect your existing RO and start tracking usage.</p>
          <button
            className="choice-btn-primary"
            onClick={() => handleChoice("scan")}
          >
            Connect my RO
          </button>
        </div>
        <img src={waterImg} alt="Existing purifier" />
      </div>

      <div className="choice-card">
        <div className="choice-text">
          <h2>I want a new purifier</h2>
          <p>Explore subscription plans and get free installation.</p>
          <button
            className="choice-btn-outline"
            onClick={() => handleChoice("start")}
          >
            View plans
          </button>
        </div>
        <img src={waterImg} alt="New purifier" />
      </div>

      <div className="choice-card choice-card-light">
        <div className="choice-text">
          <h2>Refer &amp; earn rewards</h2>
          <p>Invite friends and earn wallet cashback on every install.</p>
          <button
            className="choice-btn-ghost"
            onClick={() => handleChoice("refer")}
          >
            Refer now
          </button>
        </div>
        <img src={waterImg} alt="Refer and earn" />
      </div>
    </section>
  );
};

export default ChoicePage;
