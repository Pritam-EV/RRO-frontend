// src/components/ui/Loader.jsx
const Loader = ({ size = "md", text }) => (
  <div className={`loader loader--${size}`}>
    <div className="loader-spinner" />
    {text && <p className="loader-text">{text}</p>}
  </div>
);
export default Loader;