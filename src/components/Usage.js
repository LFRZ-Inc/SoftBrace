import React from 'react';
import './Usage.css';
import useTranslation from '../hooks/useTranslation';

function Usage() {
  const { t } = useTranslation();

  return (
    <section id="usage" className="usage">
      <div className="usage-container">
        <h2>{t('usage.title')}</h2>
        <div className="usage-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>{t('usage.steps.step1.title')}</h3>
            <p>{t('usage.steps.step1.description')}</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>{t('usage.steps.step2.title')}</h3>
            <p>{t('usage.steps.step2.description')}</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>{t('usage.steps.step3.title')}</h3>
            <p>{t('usage.steps.step3.description')}</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>{t('usage.steps.step4.title')}</h3>
            <p>{t('usage.steps.step4.description')}</p>
          </div>
        </div>
        
        {/* Important Usage Tips Section */}
        <div className="important-tips">
          <h3 className="tips-title">Important Usage Tips:</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">✅</span>
              <p>SoftBrace is designed to rest on your gum and braces — not on the wire itself.</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✅</span>
              <p>Remove before eating or sleeping.</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✅</span>
              <p>Use a fresh strip each day for optimal hygiene and comfort.</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✅</span>
              <p>Always discard strips at the end of the day.</p>
            </div>
          </div>
        </div>
        
        <p className="usage-note">{t('usage.note')}</p>
      </div>
    </section>
  );
}

export default Usage; 