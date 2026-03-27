// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SplashPage from "../pages/Splash/SplashPage.jsx";
import LoginPage from "../pages/Auth/LoginPage.jsx";
import OtpPage from "../pages/Auth/OtpPage.jsx";
import ProfileFormPage from "../pages/Auth/ProfileFormPage.jsx";
import ChoicePage from "../pages/Auth/ChoicePage.jsx";

import ConnectDevicePage from "../pages/Device/ConnectDevicePage.jsx";
import DashboardHomePage from "../pages/Device/DashboardHomePage.jsx";
import TopupPage from "../pages/Device/TopupPage.jsx";
import UsagePage from "../pages/Device/UsagePage.jsx";
import PaymentsPage from "../pages/Device/PaymentsPage.jsx";
import WalletPage from "../pages/Device/WalletPage.jsx";

import ProductListPage from "../pages/Product/ProductListPage.jsx";
import ProductCheckoutPage from "../pages/Product/ProductCheckoutPage.jsx";

import ReferPage from "../pages/Refer/ReferPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Splash is always first entry */}
      <Route path="/" element={<SplashPage />} />

      {/* Public / auth routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/profile" element={<ProfileFormPage />} />
        <Route path="/choice" element={<ChoicePage />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/product" element={<ProductListPage />} />
        <Route path="/product/checkout" element={<ProductCheckoutPage />} />

      </Route>

      {/* Protected, logged‑in user routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/device/connect" element={<ConnectDevicePage />} />
          <Route path="/dashboard" element={<DashboardHomePage />} />
          <Route path="/dashboard/topup" element={<TopupPage />} />
          <Route path="/dashboard/usage" element={<UsagePage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          <Route path="/dashboard/wallet" element={<WalletPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
