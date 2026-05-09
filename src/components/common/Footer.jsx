import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiShoppingCart } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("shop");

  // Set active nav based on current route
  useEffect(() => {
    if (location.pathname === "/choice") {
      setActiveNav("home");
    } else if (location.pathname === "/subscription") {
      setActiveNav("subscription");
    } else if (location.pathname.includes("/product")) {
      setActiveNav("shop");
    }
  }, [location.pathname]);

  const handleNavigation = (route, navName) => {
    setActiveNav(navName);
    navigate(route);
  };

  return (
    <div className="bottom-nav-box">
      <div
        className={`nav-item ${activeNav === "home" ? "active" : ""}`}
        onClick={() => handleNavigation("/choice", "home")}
      >
        <div className="icon">
          <FiHome />
        </div>
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${activeNav === "subscription" ? "active" : ""}`}
        onClick={() => handleNavigation("/subscription", "subscription")}
      >
        <div className="icon">
          <FiBox />
        </div>
        <span>Subscription</span>
      </div>

      <div
        className={`nav-item shop ${activeNav === "shop" ? "active" : ""}`}
        onClick={() => handleNavigation("/product", "shop")}
      >
        <div className="icon">
          <FiShoppingCart />
        </div>
        <span>Shop</span>
      </div>
    </div>
  );
};

export default Footer;