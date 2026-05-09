import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PublicLayout.css";

const PublicLayout = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const allowedPublicPaths = [
    "/login",
    "/signup",
    "/register",
    "/otp",
    "/forgot-password",
    "/profile",
    "/profile-page",
  ];

  if (token && allowedPublicPaths.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="public-layout">
      <div className="public-layout-inner">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;