import React from 'react';
import './FAQ.css';
import useTranslation from '../hooks/useTranslation';

function FAQ() {
  const { t } = useTranslation();

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">{t('faq.title')}</h2>
        
        <div className="faq-items">
          <div className="faq-item">
            <div className="faq-question">
              <h3>{t('faq.materials.question')}</h3>
            </div>
            <div className="faq-answer">
              <p>{t('faq.materials.answer')}</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>{t('faq.duration.question')}</h3>
            </div>
            <div className="faq-answer">
              <p>{t('faq.duration.answer')}</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>{t('faq.compatibility.question')}</h3>
            </div>
            <div className="faq-answer">
              <p>{t('faq.compatibility.answer')}</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>{t('faq.shipping.question')}</h3>
            </div>
            <div className="faq-answer">
              <p>{t('faq.shipping.answer')}</p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h3>{t('faq.wax.question')}</h3>
            </div>
            <div className="faq-answer">
              <p>{t('faq.wax.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 