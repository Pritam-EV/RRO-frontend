import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductCheckoutPage.css";
import waterImg from "../../assets/images/water1.jpg";
import userImg from "../../assets/images/user.png";
import Footer from "../../components/common/Footer";

const ProductCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const plan = location.state?.plan || {
    name: "Bolt Copper Water Purifier",
    price: 549,
    deposit: 1499,
  };

  const total = plan.price + plan.deposit;
  const userName = localStorage.getItem("rro_user_name") || "Amit";

  return (
    <div className="app-wrapper">
      <div className="premium-container">

        {/* Header INSIDE BOX */}
        <div className="header-box">
          <span className="back" onClick={() => navigate(-1)}>←</span>
          <h2>Order Summary</h2>

          {/* User Icon */}
          <div className="profile">
                   <img src={userImg} alt="profile" onClick={() => navigate('/profile-page')} />
                 </div>
        </div>

        {/* Steps */}
        <div className="steps">
          {["Cart", "Address", "Payment", "KYC", "Delivery"].map((s, i) => {
            const stepNumber = i + 1;
            return (
              <div className="step-wrapper" key={i}>
                <div
                  className={`step ${step === stepNumber ? "active" : ""} ${step > stepNumber ? "done" : ""}`}
                >
                  <div className="circle">{step > stepNumber ? "✓" : stepNumber}</div>
                  <span>{s}</span>
                </div>

                {i < 4 && <div className={`step-line ${step > stepNumber ? "line-done" : ""}`} />}
              </div>
            );
          })}
        </div>

        {/* Product Card */}
        <div className="card">
          <div className="product-row">
            <img src={waterImg} alt="product" className="product-img" />
            <div>
              <h4>{plan.name}</h4>
              <p>9999 ltrs/month</p>
            </div>
          </div>

          <div className="divider" />

          <div className="price-row">
            <span>Subscription</span>
            <span>₹{plan.price}/month</span>
          </div>
          <div className="price-row">
            <span>Deposit</span>
            <span>₹{plan.deposit}</span>
          </div>
        </div>

        {/* Order Summary INSIDE CARD */}
        <div className="card">
          <h4>Order Summary</h4>

          <div className="price-row">
            <span>Total Deposit</span>
            <span>₹{plan.deposit}</span>
          </div>
          <div className="price-row">
            <span>Subscription</span>
            <span>₹{plan.price}</span>
          </div>
          <div className="price-row">
            <span>Delivery</span>
            <span>₹0</span>
          </div>

          <div className="divider" />

          <div className="price-row total">
            <span>To Pay</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* STEP FLOW */}
        {step === 1 && (
          <button className="checkout-btn" onClick={() => setStep(2)}>
            Add Address ₹ {total}
          </button>
        )}
        {step === 2 && (
          <div className="card">
            <h4>Address Details</h4>
            <input placeholder="Full Name" />
            <input placeholder="Mobile Number" />
            <textarea placeholder="Full Address" />
            <input placeholder="Pincode" />
            <input placeholder="City" />
            <button className="checkout-btn" onClick={() => setStep(3)}>
              Continue to Payment
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="card">
            <h4>Payment</h4>
            <div className="payment-option">💳 Card</div>
            <div className="payment-option">📱 UPI</div>
            <div className="payment-option">💵 COD</div>
            <button className="checkout-btn" onClick={() => setStep(4)}>
              Continue to KYC
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="card">
            <h4>KYC</h4>
            <input placeholder="Aadhar Number" />
            <input placeholder="PAN Number" />
            <label className="upload-box">
              <input type="file" hidden />
              <div className="upload-content">
                Upload ID Proof
                <span>Tap to upload</span>
              </div>
            </label>
            <button className="checkout-btn" onClick={() => setStep(5)}>
              Continue
            </button>
          </div>
        )}
        {step === 5 && (
          <div className="card">
            <h4>Delivery</h4>
            <select>
              <option>Tomorrow 9am - 1pm</option>
              <option>Tomorrow 2pm - 6pm</option>
            </select>
            <button className="checkout-btn">Confirm Order 🚀</button>
          </div>
        )}

        <Footer />

      </div>
    </div>
  );
};

export default ProductCheckoutPage;