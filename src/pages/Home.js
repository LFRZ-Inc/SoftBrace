import React from 'react';
import { Link } from 'react-router-dom';
import DynamicContent from '../components/DynamicContent';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <DynamicContent
              page="home"
              section="hero"
              fallbackContent={
                <>
                  <h1>Comfortable Joint Support</h1>
                  <p>
                    SoftBrace Strips provide flexible and comfortable support for joints,
                    helping you stay active and pain-free.
                  </p>
                </>
              }
            />
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
              src="/images/softbrace-usage-example.png" 
              alt="SoftBrace strips in use - comfortable protection for braces"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="how-it-works" style={{backgroundColor: '#f8fafc', padding: '60px 0'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign: 'center', marginBottom: '40px', color: '#1e293b'}}>
            See How SoftBrace Works
          </h2>
          <div style={{display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap'}}>
            <div style={{flex: '1', minWidth: '300px', textAlign: 'center'}}>
              <img 
                src="/images/softbrace-usage-example.png" 
                alt="SoftBrace strips properly applied on braces showing blue silicone protection"
                style={{
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <p style={{
                fontSize: '14px', 
                color: '#64748b', 
                marginTop: '12px', 
                fontStyle: 'italic'
              }}>
                Real example: Blue SoftBrace strips protecting gums and covering brackets
              </p>
            </div>
            <div style={{flex: '1', minWidth: '300px'}}>
              <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px'}}>
                Simple & Effective Protection
              </h3>
              <div style={{space: '16px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                  <p style={{color: '#475569', lineHeight: '1.6'}}>
                    <strong>Covers brackets:</strong> Blue strips rest gently over brace brackets for instant comfort
                  </p>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                  <p style={{color: '#475569', lineHeight: '1.6'}}>
                    <strong>Protects gums:</strong> Soft silicone barrier prevents irritation and cuts
                  </p>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                  <p style={{color: '#475569', lineHeight: '1.6'}}>
                    <strong>Same technique:</strong> Works exactly the same way for both upper and lower braces
                  </p>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                  <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                  <p style={{color: '#475569', lineHeight: '1.6'}}>
                    <strong>Easy removal:</strong> Stays in place but removes easily when needed
                  </p>
                </div>
              </div>
            </div>
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