import React from 'react';
import './SoftLaunchBanner.css';
import useTranslation from '../hooks/useTranslation';

function SoftLaunchBanner() {
  const { t } = useTranslation();
  
  return (
    <div className="soft-launch-banner">
      <div className="banner-content">
        <span className="launch-badge">{t('banner.softLaunch')}</span>
        <p>{t('banner.message')}</p>
        <span className="shipping-badge">Free shipping on orders over $5.99!</span>
        <span className="product-badge">SoftWax now available!</span>
      </div>
    </div>
  );
}

export default SoftLaunchBanner; 