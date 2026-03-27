import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileFormPage.css";
import { useAuth } from "../../context/AuthContext.jsx";
import waterImg from "../../assets/images/water1.jpg";

const ProfileFormPage = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !city) return;
    login({ ...(user || {}), name, city });
    navigate("/choice", { replace: true });
  };

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-image">
          <img src={waterImg} alt="Purifier" />
        </div>

        <div className="profile-content">
          <h2>Set up your profile</h2>
          <p className="profile-subtitle">
            Tell us a bit about you so we can suggest the right RO.
          </p>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-input-group">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="city">City</label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select city
                </option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <button type="submit" className="auth-btn-primary profile-btn">
              Continue
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileFormPage;
