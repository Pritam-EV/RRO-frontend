import React, { useState } from "react";
import "./SubscriptionPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

import purifierImg from "../../assets/images/water1.jpg";

const SubscriptionPage = () => {
  const [planType, setPlanType] = useState("monthly");

  const userName = localStorage.getItem("rro_user_name") || "Amit";
  const navigate = useNavigate();

  const transactions = [
    { id: 1, date: "01 Apr 2026", amount: "₹499", status: "Success" },
    { id: 2, date: "01 Mar 2026", amount: "₹499", status: "Success" },
    { id: 3, date: "01 Feb 2026", amount: "₹499", status: "Failed" },
  ];

  return (
    <div className="premium-container">

      {/* 🔝 TOP BAR */}
      <Header />

      {/* 🔥 TITLE (UPDATED) */}
      <div className="hero">
        <div className="hero-text">
          <h1>My Subscription</h1>
           <div className="plan-toggle">
        <button
          className={planType === "monthly" ? "active" : ""}
          onClick={() => setPlanType("monthly")}
        >
          Monthly
        </button>

        <button
          className={planType === "yearly" ? "active" : ""}
          onClick={() => setPlanType("yearly")}
        >
          Yearly
        </button>
      </div> 
        </div>

        <div className="hero-image">
          <img src={purifierImg} alt="RO" />
        </div>
      </div>

     
      {/* 📦 CURRENT PLAN */}
      <div className="plan-card">
        <p className="plan-title">Current Plan</p>
        <h2>{planType === "monthly" ? "Premium Monthly" : "Premium Yearly"}</h2>

        <p className="price">
          {planType === "monthly" ? "₹499 / month" : "₹4999 / year"}
        </p>

        <p className="sub">Valid for {planType === "monthly" ? "30" : "365"} days</p>

        <div className="progress">
          <div className="fill" style={{ width: "60%" }}></div>
        </div>

        <span className="remaining">18 Days Left</span>
      </div>

      {/* 🔽 TRANSACTIONS */}
      <div className="transaction-section">
        
        {/* HEADER LINE */}
        <div className="txn-header">
          <h3>Transaction History</h3>
          <span className="txn-type">{planType}</span>
        </div>

        {transactions.map((txn) => (
          <div className="txn-card" key={txn.id}>
            <div>
              <p className="txn-date">{txn.date}</p>
              <p className={`txn-status ${txn.status.toLowerCase()}`}>
                {txn.status}
              </p>
            </div>

            <div className="txn-amount">{txn.amount}</div>
          </div>
        ))}
      </div>

      {/*  NAVBAR */}
      <Footer />

    </div>
  );
};

export default SubscriptionPage;