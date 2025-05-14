import React, { useState } from 'react';
import './FAQ.css';
import useTranslation from '../hooks/useTranslation';

function FAQ() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  
  // Define FAQ keys in the order we want them displayed
  const initialFaqs = ['materials', 'compatibility', 'application'];
  const additionalFaqs = ['duration', 'wax', 'sleep', 'swallow', 'kids', 'shipping'];
  
  // Function to render a single FAQ item
  const renderFaqItem = (key) => {
    try {
      const question = t(`faq.${key}.question`);
      const answer = t(`faq.${key}.answer`);
      
      if (!question || !answer) {
        console.warn(`Missing translation for FAQ item: ${key}`);
        return null;
      }
      
      return (
        <div className="faq-item" key={key}>
          <div className="faq-question">
            <h3>{question}</h3>
          </div>
          <div className="faq-answer">
            <p>{answer}</p>
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Error rendering FAQ item ${key}:`, error);
      return null;
    }
  };

  // Fallback content in case of translation issues
  const fallbackFAQs = () => (
    <div className="faq-item">
      <div className="faq-question">
        <h3>What materials are used in SoftBrace Strips?</h3>
      </div>
      <div className="faq-answer">
        <p>SoftBrace Strips are made from FDA-compliant, platinum-cured silicone that is soft, flexible, and designed to protect your mouth from bracket irritation.</p>
      </div>
    </div>
  );

  try {
    return (
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">{t('faq.title', 'Frequently Asked Questions')}</h2>
          
          <div className="faq-items">
            {/* Always show initial FAQs */}
            {initialFaqs.map(key => renderFaqItem(key))}
            
            {/* Conditionally show additional FAQs */}
            {showAll && additionalFaqs.map(key => renderFaqItem(key))}
            
            {/* View More / View Less button */}
            <div className="faq-view-more">
              <button 
                className="view-more-btn" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 
                  t('faq.viewLess', 'View Less') : 
                  t('faq.viewMore', 'View More')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error rendering FAQ component:', error);
    return (
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-items">
            {fallbackFAQs()}
            <div className="faq-view-more">
              <button 
                className="view-more-btn" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'View Less' : 'View More'}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default FAQ; 