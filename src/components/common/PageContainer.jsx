import React from "react";
import "./PageContainer.css";

const PageContainer = ({ children, className = "", background = "dark", hasBottomNav = true, centered = false }) => {
  const containerClass = `page-container ${background} ${hasBottomNav ? 'with-bottom-nav' : ''} ${centered ? 'centered' : ''} ${className}`;

  return (
    <div className={containerClass}>
      {children}
    </div>
  );
};

export default PageContainer;