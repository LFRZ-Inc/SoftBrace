import React from 'react';
import './FAQ.css';

// Super simple FAQ component with no dynamic content
const FAQ = () => {
  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        <div className="faq-items">
          <div className="faq-item">
            <div className="faq-question">
              <h3>What materials are used in SoftBrace Strips?</h3>
            </div>
            <div className="faq-answer">
              <p>SoftBrace Strips are made from FDA-compliant silicone.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>How long does each strip last?</h3>
            </div>
            <div className="faq-answer">
              <p>Each SoftBrace Strip is designed for single-use comfort and hygiene.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 