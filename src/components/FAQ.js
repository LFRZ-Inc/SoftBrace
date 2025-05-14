import React from 'react';
import './FAQ.css';

// Full FAQ component with all questions but no View More functionality
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
              <p>SoftBrace Strips are made from FDA-compliant, platinum-cured silicone that is soft, flexible, and designed to protect your mouth from bracket irritation. While they're durable, they are intended for short-term relief and single use.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>How long does each strip last?</h3>
            </div>
            <div className="faq-answer">
              <p>Each SoftBrace Strip is designed for single-use comfort and hygiene. While some users report using a strip for multiple reuses, we do not recommend reuse. Always discard daily and replace if dirty, loose, or damaged.</p>
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
              <p>Gently press the strip onto the gum area directly above or below the brackets, wherever you're experiencing irritation—not on the brackets themselves. The strip should cover the sensitive tissue where braces tend to rub. Trim if needed, and press gently until secure. Tip: For top teeth, apply along the upper gums. For bottom teeth, apply along the lower gums.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>Is it safe to sleep with SoftBrace Strips in?</h3>
            </div>
            <div className="faq-answer">
              <p>Do NOT Sleep with SoftBrace Strips. While they are soft and flexible, any oral product can pose a risk if dislodged during sleep. Always remove the strip before bed.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>What if I accidentally swallow a strip?</h3>
            </div>
            <div className="faq-answer">
              <p>SoftBrace is made of non-toxic, FDA-compliant silicone. If accidentally swallowed, it will usually pass through the digestive system without harm. However, please consult a doctor if you feel discomfort or have health concerns.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>How does SoftWax compare to SoftBrace Strips?</h3>
            </div>
            <div className="faq-answer">
              <p>SoftWax is our classic orthodontic wax for temporary relief. It's great for quick fixes but can wear off quickly. SoftBrace Strips stay in place better, are less messy, and are ideal for longer-term comfort. Some users use both—SoftWax for spot treatment and SoftBrace for full-coverage relief. Each SoftWax purchase includes a free pair of SoftBrace strips.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>How long does shipping take?</h3>
            </div>
            <div className="faq-answer">
              <p>Delivery typically takes 3–5 business days, but may vary depending on your location and carrier delays. While we strive to ship orders as quickly as possible, exact delivery times are not guaranteed. U.S. orders over $5.99 ship free; orders under $5.99 include a flat $1 shipping fee.</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>Is SoftBrace safe for kids or teens?</h3>
            </div>
            <div className="faq-answer">
              <p>Yes, but always under adult supervision. Our strips are safe for most users with braces, including teens, but we recommend adult guidance to ensure proper application and removal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 