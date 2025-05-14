import React from 'react';
import './SoftLaunchBanner.css';
import useTranslation from '../hooks/useTranslation';

function SoftLaunchBanner() {
  const { t } = useTranslation();
  
  return (
    <div className="banner">
      <div className="badge badge-soft-launch">{t('banner.softLaunch')}</div>
      <div className="banner-text">{t('banner.message')}</div>
      <div className="badge badge-shipping">{t('banner.freeShipping')}</div>
      <div className="badge badge-product">
        <span className="new-tag">NEW</span>{t('banner.waxAvailable')}
      </div>
    </div>
  );
}

export default SoftLaunchBanner; 