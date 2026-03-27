import React, { useEffect } from "react";
import "./ProductRedirectPage.css";

const ProductRedirectPage = () => {
  useEffect(() => {
    // TODO: replace with real product URL
    const timer = setTimeout(() => {
      window.location.href = "https://your-ecommerce-site.com/products";
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="product-redirect">
      <div className="product-loader" />
      <h2>Taking you to plans</h2>
      <p>Please wait while we open our product catalogue.</p>
    </div>
  );
};

export default ProductRedirectPage;
