/**
 * authService.js
 *
 * All auth-related API calls + Firebase OTP helpers.
 *
 * Firebase OTP Flow:
 *   1. setupRecaptcha(containerId)  — call once on component mount
 *   2. sendFirebaseOtp(mobile)      — triggers Firebase SMS
 *   3. confirmFirebaseOtp(code)     — verifies code, returns idToken
 *
 * Then pass idToken to the appropriate backend endpoint:
 *   • Signup  → firebaseVerify(idToken) → register(payload)
 *   • Login   → firebaseLogin(idToken)
 *   • Reset   → forgotPassword(idToken) → resetPassword(payload)
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../config/firebase";
import api from "./api";

// ─── Firebase OTP Helpers ───────────────────────────────────────────────────────

/**
 * Setup invisible reCAPTCHA on a div.
 * Safe to call multiple times — clears old verifier first.
 * @param {string} containerId  — id of a <div> in the DOM, e.g. "recaptcha-container"
 */
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  // Clear stale verifier to avoid "reCAPTCHA already rendered" error
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (_) {
      // ignore
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},          // reCAPTCHA solved
    "expired-callback": () => { // reCAPTCHA expired — clear so it can reinit
      window.recaptchaVerifier = null;
    },
  });

  return window.recaptchaVerifier;
};

/**
 * Send Firebase OTP to a mobile number.
 * Must call setupRecaptcha() before this.
 * @param {string} mobile  — 10-digit Indian number, no country code
 */
export const sendFirebaseOtp = async (mobile) => {
  const phoneNumber = `+91${mobile}`;
  const verifier = window.recaptchaVerifier;
  if (!verifier) throw new Error("reCAPTCHA not initialised. Call setupRecaptcha() first.");

  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  window.confirmationResult = confirmationResult;
};

/**
 * Confirm the 6-digit OTP the user entered.
 * Returns { idToken, firebaseUser }
 * @param {string} code  — 6-digit OTP
 */
export const confirmFirebaseOtp = async (code) => {
  if (!window.confirmationResult) {
    throw new Error("No OTP session found. Please request OTP again.");
  }
  const result = await window.confirmationResult.confirm(code);
  const idToken = await result.user.getIdToken();
  return { idToken, firebaseUser: result.user };
};

// ─── Signup Flow ──────────────────────────────────────────────────────────────────

/**
 * Step 1 of signup: verify Firebase idToken on backend.
 * Backend checks if mobile is new or already registered.
 * Returns { isNewUser: true, mobile }
 * @param {string} idToken
 */
export const firebaseVerify = async (idToken) => {
  const { data } = await api.post("/auth/firebase-verify", { idToken });
  return data; // { success, message, data: { isNewUser, mobile } }
};

/**
 * Step 2 of signup: complete registration.
 * @param {{ mobile, name, city, password, confirmPassword, email?, referralCode? }} payload
 */
export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // { success, data: { token, user } }
};

// ─── Login Flow ──────────────────────────────────────────────────────────────────

/**
 * Option A: Sign in with mobile + password.
 * @param {string} mobile
 * @param {string} password
 */
export const signin = async (mobile, password) => {
  const { data } = await api.post("/auth/signin", { mobile, password });
  return data; // { success, data: { token, user } }
};

/**
 * Option B: Sign in via Firebase OTP (existing users).
 * Call confirmFirebaseOtp() first to get idToken.
 * @param {string} idToken
 */
export const firebaseLogin = async (idToken) => {
  const response = await api.post("/auth/firebase-login", { idToken });
  return response.data;
};

// ─── Forgot / Reset Password Flow ──────────────────────────────────────────────

/**
 * Step 1: Verify Firebase OTP → get a resetToken from backend.
 * Call confirmFirebaseOtp() first to get idToken.
 * @param {string} idToken
 */
export const forgotPassword = async (idToken) => {
  const { data } = await api.post("/auth/forgot-password", { idToken });
  return data; // { success, data: { resetToken } }
};

/**
 * Step 2: Set new password using resetToken.
 * @param {{ resetToken, password, confirmPassword }} payload
 */
export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data; // { success, message }
};

// ─── Profile ────────────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user’s profile.
 * Token is auto-attached by the api interceptor.
 */
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data; // { success, data: { user } }
};

/**
 * Update profile fields.
 * @param {{ name?, email?, city?, address? }} payload
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/profile", payload);
  return data;
};

/**
 * Logout — calls backend ACK, then caller should clear token.
 */
export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};
