import React, { useState, useEffect } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function Hero() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images to cycle through
  const heroImages = [
    {
      src: "images/softbrace-logos.jpg.png",
      alt: "SoftBrace Logos in different colors"
    },
    {
      src: "images/SoftBrace Products.png", // Using the existing product image
      alt: "SoftBrace Product Lineup - Physical Packages"
    }
  ];

  // Cycle through images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToProduct = () => {
    document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="logo-image-container">
          <img 
            src={heroImages[currentImageIndex].src}
            alt={heroImages[currentImageIndex].alt}
            className="logo-image"
            key={currentImageIndex} // Force re-render for smooth transition
          />
          
          {/* Image indicators */}
          <div className="image-indicators">
            {heroImages.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <h1>{t('hero.title')}</h1>
        <p className="now-available">{t('hero.comingSoon')}</p>
        <p className="tagline">{t('hero.tagline')}</p>
        <div className="hero-buttons">
          <button onClick={scrollToProduct} className="cta-button outline-button">
            Learn More
          </button>
          <Link to="/shop" className="cta-button">
            Shop Now
          </Link>
        </div>
      </div>
      <div className="hero-background"></div>
    </section>
  );
}

export default Hero; 