import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/RRO__1_-removebg-preview.png";
import userImg from "../../assets/images/user.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="logo-row">
        <img src={logoImg} className="logo-img" alt="RRO logo" />
        <span className="logo-text">Smart Ro</span>
      </div>

      <div className="profile" onClick={() => navigate("/profile-page")}>
        <img src={userImg} alt="profile" />
      </div>
    </div>
  );
};

export default Header;
