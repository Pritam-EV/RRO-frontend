// src/pages/Product/ProductCheckoutPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ProductCheckoutPage.css";

const STEPS = ["Plan", "Address", "Payment", "Delivery"];
const initialAddress = { fullName: "", mobile: "", address: "", pincode: "", city: "" };

export default function ProductCheckoutPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const plan      = location.state?.plan;

  const [step, setStep]           = useState(0);
  const [addr, setAddr]           = useState(initialAddress);
  const [addrErrors, setAddrErrors] = useState({});
  const [payment, setPayment]     = useState("");
  const [slot, setSlot]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState("");
  const [confirmed, setConfirmed] = useState(null);

  // Zoho widget state
  const [zohoSessionId, setZohoSessionId] = useState(null);
  const [zohoApiKey, setZohoApiKey]       = useState(null);
  const [referenceNumber, setReferenceNumber] = useState(null);
  const [showZohoWidget, setShowZohoWidget]   = useState(false);
  const zohoContainerRef = useRef(null);

  if (!plan) {
    return (
      <div className="co-page">
        <div className="co-empty">
          <p>No plan selected.</p>
          <button className="co-btn" onClick={() => navigate("/product")}>Browse Plans</button>
        </div>
      </div>
    );
  }

  const firstAmount = (plan.perMonthAmount || 0) + (plan.deposit || 0) + (plan.installationCharges || 0);

  const validateAddr = () => {
    const e = {};
    if (!addr.fullName.trim())               e.fullName = "Required";
    if (!/^[6-9]\d{9}$/.test(addr.mobile))  e.mobile   = "Enter valid 10-digit mobile";
    if (!addr.address.trim())                e.address  = "Required";
    if (!/^\d{6}$/.test(addr.pincode))       e.pincode  = "Enter valid 6-digit pincode";
    if (!addr.city.trim())                   e.city     = "Required";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── COD flow: place order directly ──────────────────────
  const handleCODOrder = async () => {
    setLoading(true);
    setApiError("");
    try {
      const { data } = await api.post("/subscriptions/order", {
        planId:          plan._id,
        deliveryAddress: addr,
        paymentMethod:   "cod",
        deliverySlot:    slot,
      });
      setConfirmed(data.data);
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── UPI/Card flow: initiate Zoho session ────────────────
  const handleOnlinePayment = async () => {
    setLoading(true);
    setApiError("");
    try {
      const { data } = await api.post("/payments/initiate", {
        amount:               firstAmount,
        purpose:              "subscription",
        subscriptionPlanName: `${plan.brandName} ${plan.modelName}`,
      });
      setZohoApiKey(data.data.zohoApiKey);
      setZohoSessionId(data.data.zohoSessionId);
      setReferenceNumber(data.data.referenceNumber);
      setShowZohoWidget(true);
    } catch (err) {
      setApiError(err.response?.data?.message || "Could not initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Load Zoho widget once we have session ────────────────
  useEffect(() => {
    if (!showZohoWidget || !zohoApiKey || !zohoSessionId) return;

    // Load Zoho script dynamically
    const existing = document.getElementById("zoho-payments-sdk");
    const mountWidget = () => {
      if (!window.ZohoPayments) {
        setApiError("Payment gateway failed to load. Please refresh.");
        return;
      }
      const widget = window.ZohoPayments.initiate({
        apiKey:    zohoApiKey,
        sessionId: zohoSessionId,
        container: "#zoho-widget-container",
        onSuccess: async (response) => {
          setShowZohoWidget(false);
          setLoading(true);
          try {
            // Verify with backend
            const { data } = await api.get(`/payments/verify/${referenceNumber}`);
            if (data.data?.status === "succeeded") {
              // Now place the subscription order as paid
              const orderRes = await api.post("/subscriptions/order", {
                planId:          plan._id,
                deliveryAddress: addr,
                paymentMethod:   payment,
                deliverySlot:    slot,
                referenceNumber, // backend can link payment
              });
              setConfirmed(orderRes.data.data);
            } else {
              setApiError("Payment not confirmed yet. Please check your payment history.");
            }
          } catch (err) {
            setApiError("Payment done but order failed. Contact support with ref: " + referenceNumber);
          } finally {
            setLoading(false);
          }
        },
        onFailure: (response) => {
          setShowZohoWidget(false);
          setApiError("Payment failed or cancelled. Please try again.");
        },
        onClose: () => {
          setShowZohoWidget(false);
        },
      });
    };

    if (existing) {
      mountWidget();
    } else {
      const script = document.createElement("script");
      script.id    = "zoho-payments-sdk";
      script.src   = "https://js.zoho.com/payments/v1/checkout.js";
      script.async = true;
      script.onload = mountWidget;
      script.onerror = () => setApiError("Failed to load payment gateway.");
      document.body.appendChild(script);
    }
  }, [showZohoWidget, zohoApiKey, zohoSessionId]);

  // ── Main confirm handler (step 3) ────────────────────────
  const handleConfirm = () => {
    if (payment === "cod") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  const next = () => {
    setApiError("");
    if (step === 1 && !validateAddr()) return;
    if (step === 2 && !payment)        return;
    if (step === 3) { handleConfirm(); return; }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setApiError("");
    if (step === 0) navigate(-1);
    else setStep((s) => s - 1);
  };

  /* ── Zoho Widget Overlay ── */
  if (showZohoWidget) {
    return (
      <div className="co-page">
        <div className="co-topbar">
          <button className="co-back" onClick={() => setShowZohoWidget(false)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="co-topbar__title">Complete Payment</span>
          <div style={{ width: 32 }} />
        </div>
        <div className="co-section" style={{ paddingTop: 16 }}>
          <p style={{ marginBottom: 12, color: "var(--color-text-muted, #666)", fontSize: 14 }}>
            Amount: <strong>₹{firstAmount}</strong> · Ref: <code style={{ fontSize: 12 }}>{referenceNumber}</code>
          </p>
          {apiError && <p className="co-error">{apiError}</p>}
          <div id="zoho-widget-container" ref={zohoContainerRef}
            style={{ minHeight: 400, border: "1px solid #eee", borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (confirmed) {
    return (
      <div className="co-page">
        <div className="co-success">
          <div className="co-success__icon">✓</div>
          <h2>Order Placed!</h2>
          <p>
            Your <strong>{confirmed.plan?.brandName} {confirmed.plan?.modelName}</strong> subscription
            is confirmed.
          </p>
          <div className="co-success__meta">
            <div className="co-row">
              <span>Order ID</span>
              <span className="co-mono">{confirmed.subscriptionCode}</span>
            </div>
            <div className="co-row">
              <span>Delivery slot</span>
              <span>{confirmed.deliverySlot}</span>
            </div>
            <div className="co-row co-row--total">
              <span>{payment === "cod" ? "Due on delivery" : "Paid"}</span>
              <strong>₹{confirmed.firstPayment || firstAmount}</strong>
            </div>
          </div>
          <p className="co-success__note">
            {payment === "cod"
              ? "Our team will contact you. Payment collected at delivery."
              : "Payment received. Our team will contact you for installation."}
          </p>
          <button className="co-btn" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">

      {/* ── Top bar ── */}
      <div className="co-topbar">
        <button className="co-back" onClick={goBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="co-topbar__title">Checkout</span>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Stepper ── */}
      <div className="co-stepper" role="list">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div
              className={`co-step ${i === step ? "co-step--active" : ""} ${i < step ? "co-step--done" : ""}`}
              role="listitem"
            >
              <div className="co-step__dot">
                {i < step
                  ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  : <span>{i + 1}</span>
                }
              </div>
              <span className="co-step__label">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`co-step__line ${i < step ? "co-step__line--done" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="co-body">

        {/* ── STEP 0: Plan summary ── */}
        {step === 0 && (
          <>
            <div className="co-plan-card">
              <div className="co-plan-card__img-wrap">
                <img src={plan.image} alt={`${plan.brandName} ${plan.modelName}`} className="co-plan-card__img" />
              </div>
              <div className="co-plan-card__info">
                <span className="co-plan-card__brand">{plan.brandName}</span>
                <h3 className="co-plan-card__model">{plan.modelName}</h3>
                {plan.comment && <p className="co-plan-card__comment">{plan.comment}</p>}
                <span className="co-plan-card__id">{plan.planId}</span>
              </div>
            </div>

            <div className="co-section">
              <h4 className="co-section__title">Price Breakdown</h4>
              <div className="co-rows">
                <div className="co-row">
                  <span>Monthly subscription</span>
                  <span>₹{plan.perMonthAmount}<em>/mo</em></span>
                </div>
                <div className="co-row">
                  <span>Refundable deposit</span>
                  <span>₹{plan.deposit}</span>
                </div>
                {plan.installationCharges > 0 && (
                  <div className="co-row">
                    <span>Installation (one-time)</span>
                    <span>₹{plan.installationCharges}</span>
                  </div>
                )}
                <div className="co-row co-row--free">
                  <span>Delivery</span>
                  <span className="co-free">FREE</span>
                </div>
              </div>
              <div className="co-total">
                <span>Due on delivery</span>
                <strong>₹{firstAmount}</strong>
              </div>
              <p className="co-note">From month 2 onwards, only ₹{plan.perMonthAmount}/month is charged.</p>
            </div>
          </>
        )}

        {/* ── STEP 1: Address ── */}
        {step === 1 && (
          <div className="co-section">
            <h4 className="co-section__title">Delivery Address</h4>
            <div className="co-form">
              <div className="co-field">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. Roshan Patil"
                  value={addr.fullName}
                  onChange={(e) => setAddr({ ...addr, fullName: e.target.value })}
                  className={addrErrors.fullName ? "co-input--error" : ""}/>
                {addrErrors.fullName && <span className="co-error">{addrErrors.fullName}</span>}
              </div>
              <div className="co-field">
                <label>Mobile Number</label>
                <input type="tel" placeholder="10-digit number" maxLength={10}
                  value={addr.mobile}
                  onChange={(e) => setAddr({ ...addr, mobile: e.target.value.replace(/\D/g, "") })}
                  className={addrErrors.mobile ? "co-input--error" : ""}/>
                {addrErrors.mobile && <span className="co-error">{addrErrors.mobile}</span>}
              </div>
              <div className="co-field">
                <label>Full Address</label>
                <textarea placeholder="House no., street, locality…" rows={3}
                  value={addr.address}
                  onChange={(e) => setAddr({ ...addr, address: e.target.value })}
                  className={addrErrors.address ? "co-input--error" : ""}/>
                {addrErrors.address && <span className="co-error">{addrErrors.address}</span>}
              </div>
              <div className="co-field-row">
                <div className="co-field">
                  <label>Pincode</label>
                  <input type="text" placeholder="6 digits" maxLength={6}
                    value={addr.pincode}
                    onChange={(e) => setAddr({ ...addr, pincode: e.target.value.replace(/\D/g, "") })}
                    className={addrErrors.pincode ? "co-input--error" : ""}/>
                  {addrErrors.pincode && <span className="co-error">{addrErrors.pincode}</span>}
                </div>
                <div className="co-field">
                  <label>City</label>
                  <input type="text" placeholder="e.g. Pune"
                    value={addr.city}
                    onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                    className={addrErrors.city ? "co-input--error" : ""}/>
                  {addrErrors.city && <span className="co-error">{addrErrors.city}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Payment ── */}
        {step === 2 && (
          <div className="co-section">
            <h4 className="co-section__title">Payment Method</h4>
            <p className="co-section__sub">
              {payment === "cod" || !payment
                ? "Pay when your device arrives — nothing charged now."
                : "You'll complete payment on the next screen via Zoho Pay."}
            </p>
            <div className="co-payment-opts">
              {[
                { id: "upi",  icon: "📱", label: "UPI",  sub: "PhonePe, GPay, Paytm — pay now" },
                { id: "card", icon: "💳", label: "Card", sub: "Debit or Credit card — pay now" },
                { id: "cod",  icon: "💵", label: "Cash on Delivery", sub: "Pay when device arrives" },
              ].map((opt) => (
                <div key={opt.id}
                  className={`co-payment-opt ${payment === opt.id ? "co-payment-opt--active" : ""}`}
                  onClick={() => setPayment(opt.id)}
                  role="radio" aria-checked={payment === opt.id} tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setPayment(opt.id)}>
                  <span className="co-payment-opt__icon">{opt.icon}</span>
                  <div className="co-payment-opt__text">
                    <strong>{opt.label}</strong>
                    <span>{opt.sub}</span>
                  </div>
                  <div className={`co-radio ${payment === opt.id ? "co-radio--on" : ""}`} />
                </div>
              ))}
            </div>
            {!payment && <p className="co-error" style={{ marginTop: 8 }}>Please select a payment method</p>}
          </div>
        )}

        {/* ── STEP 3: Delivery + final summary ── */}
        {step === 3 && (
          <div className="co-section">
            <h4 className="co-section__title">Choose Delivery Slot</h4>
            <p className="co-section__sub">Pick a time that works for you.</p>
            <div className="co-slots">
              {[
                { id: "tmrw-am", label: "Tomorrow",           time: "9:00 AM – 1:00 PM" },
                { id: "tmrw-pm", label: "Tomorrow",           time: "2:00 PM – 6:00 PM" },
                { id: "day2-am", label: "Day after tomorrow", time: "9:00 AM – 1:00 PM" },
                { id: "day2-pm", label: "Day after tomorrow", time: "2:00 PM – 6:00 PM" },
              ].map((s) => (
                <div key={s.id}
                  className={`co-slot ${slot === s.id ? "co-slot--active" : ""}`}
                  onClick={() => setSlot(s.id)}
                  role="radio" aria-checked={slot === s.id} tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSlot(s.id)}>
                  <div>
                    <strong>{s.label}</strong>
                    <span>{s.time}</span>
                  </div>
                  <div className={`co-radio ${slot === s.id ? "co-radio--on" : ""}`} />
                </div>
              ))}
            </div>

            <div className="co-confirm-summary">
              <div className="co-row"><span>Plan</span><span>{plan.brandName} {plan.modelName}</span></div>
              <div className="co-row"><span>Payment</span>
                <span style={{ textTransform: "capitalize" }}>
                  {payment === "cod" ? "Cash on Delivery" : payment.toUpperCase()}
                </span>
              </div>
              <div className="co-row"><span>Address</span><span>{addr.city}, {addr.pincode}</span></div>
              <div className="co-row co-row--total">
                <span>{payment === "cod" ? "Due on delivery" : "To pay now"}</span>
                <strong>₹{firstAmount}</strong>
              </div>
            </div>

            {apiError && <p className="co-error" style={{ marginTop: 10 }}>{apiError}</p>}
          </div>
        )}

      </div>

      {/* ── Sticky CTA ── */}
      <div className="co-footer">
        <button className="co-btn" onClick={next}
          disabled={(step === 3 && !slot) || loading}>
          {loading ? (payment === "cod" ? "Placing order…" : "Opening payment…") : (
            <>
              {step === 0 && "Continue to Address"}
              {step === 1 && "Save Address"}
              {step === 2 && "Continue to Delivery"}
              {step === 3 && (payment === "cod"
                ? `Confirm Order · ₹${firstAmount}`
                : `Pay ₹${firstAmount} · ${payment?.toUpperCase()}`
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
}