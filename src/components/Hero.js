import React from 'react';
import './Hero.css';
import useTranslation from '../hooks/useTranslation';

function Hero() {
  const { t } = useTranslation();

  const scrollToProduct = () => {
    document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="logo-image-container">
          <img 
            src="images/softbrace-logos.jpg.png" 
            alt="SoftBrace Logos in different colors" 
            className="logo-image"
          />
        </div>
        <h1>{t('hero.title')}</h1>
        <p className="coming-soon">{t('hero.comingSoon')}</p>
        <p className="tagline">{t('hero.tagline')}</p>
        <button onClick={scrollToProduct} className="cta-button">
          {t('hero.learnMore')}
        </button>
      </div>
      <div className="hero-background"></div>
    </section>
  );
}

export default Hero; 