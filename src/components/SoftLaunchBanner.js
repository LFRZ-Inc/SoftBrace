import React, { useState, useEffect } from 'react';
import './SoftLaunchBanner.css';
import useTranslation from '../hooks/useTranslation';
import { shouldShowAllProducts, getDaysUntilRelease, getReleaseDate } from '../utils/releaseSchedule';

function SoftLaunchBanner() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  function calculateTimeLeft() {
    const releaseDate = new Date('2025-07-13T00:00:00');
    const now = new Date();
    const difference = releaseDate - now;
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return null; // Past launch date
  }
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // If products are fully released (past July 13th, 2025)
  if (shouldShowAllProducts()) {
    return (
      <div className="banner banner-full-launch">
        <div className="badge badge-soft-launch badge-full-launch">🎉 FULL LAUNCH</div>
        <div className="banner-text">All SoftBrace Products Now Available! Complete Inventory Ready to Ship</div>
        <div className="badge badge-shipping">Free Shipping $5.99+</div>
        <div className="badge badge-product">
          <span className="new-tag">NEW</span>31-Pack & 100-Pack Available!
        </div>
      </div>
    );
  }
  
  // Show countdown if still before launch date
  if (timeLeft) {
    return (
      <div className="banner banner-countdown">
        <div className="badge badge-soft-launch badge-countdown">🚀 COUNTDOWN</div>
        <div className="banner-text">
          Full Product Launch in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s 
          - Complete Inventory Available {getReleaseDate()}!
        </div>
        <div className="badge badge-shipping">Free Shipping $5.99+</div>
        <div className="badge badge-product">
          <span className="new-tag">NEW</span>SoftWax Available Now!
        </div>
      </div>
    );
  }
  
  // Fallback for edge cases
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