import React from 'react';
import useTranslation from '../hooks/useTranslation';

function LegalNotice() {
  const { t } = useTranslation();

  return (
    <div className="legal-notice">
      <h3>{t('legal.title')}</h3>
      <div className="legal-section">
        <h4>{t('legal.disclaimer.title')}</h4>
        <p>
          {t('legal.disclaimer.content').map((line, index) => (
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))}
        </p>
        <p>
          {t('legal.disclaimer.feedback').map((line, index) => (
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))}
        </p>
      </div>
      <div className="legal-section">
        <h4>{t('legal.warning.title')}</h4>
        <p>
          {t('legal.warning.content').map((line, index) => (
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

export default LegalNotice; 