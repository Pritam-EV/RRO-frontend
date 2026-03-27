// src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import "./PublicLayout.css";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <div className="public-layout-inner">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
