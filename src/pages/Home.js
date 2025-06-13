import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Comfortable Joint Support</h1>
            <p>
              SoftBrace Strips provide flexible and comfortable support for joints,
              helping you stay active and pain-free.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn">
                View Products
              </Link>
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/images/softbrace-usage-example.jpg" 
              alt="SoftBrace strips in use - comfortable protection for braces"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose SoftBrace Strips?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3>Strong Support</h3>
              <p>Provides firm joint support while maintaining flexibility</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Flexible Design</h3>
              <p>Adapts to your body's movements for maximum comfort</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Breathable Material</h3>
              <p>Allows skin to breathe for extended wear</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💧</div>
              <h3>Water Resistant</h3>
              <p>Can be worn during water activities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to experience relief?</h2>
          <p>Explore our range of products designed for various joints and needs.</p>
          <Link to="/products" className="btn">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 