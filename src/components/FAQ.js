import React from 'react';
import './FAQ.css';
import useTranslation from '../hooks/useTranslation';

function FAQ() {
  const { t } = useTranslation();

  return (
    <section className="faq">
      <div className="container">
        <h2>{t('faq.title')}</h2>
        <div className="faq-content">
          <div className="faq-item">
            <h3>{t('faq.items.item1.question')}</h3>
            <p>{t('faq.items.item1.answer')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('faq.items.item2.question')}</h3>
            <p>{t('faq.items.item2.answer')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('faq.items.item3.question')}</h3>
            <p>{t('faq.items.item3.answer')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('faq.items.item4.question')}</h3>
            <p>{t('faq.items.item4.answer')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 