import React from 'react';
import './Footer.css';
import useTranslation from '../hooks/useTranslation';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#terms">{t('footer.links.terms')}</a>
          <a href="#privacy">{t('footer.links.privacy')}</a>
          <a href="#contact">{t('footer.links.contact')}</a>
        </div>
        <div className="footer-legal">
          <p>{t('footer.legal')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 