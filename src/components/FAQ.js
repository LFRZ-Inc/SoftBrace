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
  const renderFaqItem = (key) => (
    <div className="faq-item" key={key}>
      <div className="faq-question">
        <h3>{t(`faq.${key}.question`)}</h3>
      </div>
      <div className="faq-answer">
        <p>{t(`faq.${key}.answer`)}</p>
      </div>
    </div>
  );

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">{t('faq.title')}</h2>
        
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
              {showAll ? t('faq.viewLess') : t('faq.viewMore')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 