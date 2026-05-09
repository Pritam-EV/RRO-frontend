// src/components/ui/Button.jsx
const Button = ({ children, onClick, type = "button", variant = "primary", disabled, loading }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`btn btn--${variant} ${loading ? "btn--loading" : ""}`}
  >
    {loading ? <span className="btn-spinner" /> : children}
  </button>
);
export default Button;