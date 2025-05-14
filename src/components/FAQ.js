import React from 'react';
import './FAQ.css';

// Simplified FAQ component with hardcoded content only
function FAQ() {
  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        <div className="faq-items">
          {/* Hardcoded FAQ items */}
          <div className="faq-item">
            <div className="faq-question">
              <h3>What materials are used in SoftBrace Strips?</h3>
            </div>
            <div className="faq-answer">
              <p>SoftBrace Strips are made from FDA-compliant, platinum-cured silicone that is soft, flexible, and designed to protect your mouth from bracket irritation. While they're durable, they are intended for short-term relief and single use.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>Are SoftBrace Strips compatible with all types of braces?</h3>
            </div>
            <div className="faq-answer">
              <p>Yes! SoftBrace Strips are compatible with most types of orthodontic appliances, including traditional metal braces, ceramic braces, and some clear aligners. The soft, flexible material molds to different shapes for a better fit.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>How do I apply SoftBrace Strips correctly?</h3>
            </div>
            <div className="faq-answer">
              <p>Gently press the strip onto the gum area directly above or below the brackets, wherever you're experiencing irritation—not on the brackets themselves. The strip should cover the sensitive tissue where braces tend to rub. Trim if needed, and press gently until secure.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 