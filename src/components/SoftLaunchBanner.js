import React from 'react';
import './SoftLaunchBanner.css';

function SoftLaunchBanner() {
  return (
    <div className="soft-launch-banner">
      <div className="banner-content">
        <span className="launch-badge">Soft Launch</span>
        <p>Now Open for Early Orders—Thank You for Supporting Our Launch!</p>
        <span className="shipping-badge">Free shipping on orders over $5.99!</span>
      </div>
    </div>
  );
}

export default SoftLaunchBanner; 