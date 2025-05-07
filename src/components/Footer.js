import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import useTranslation from '../hooks/useTranslation';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/terms-of-service">{t('footer.links.terms')}</Link>
          <Link to="/privacy-policy">{t('footer.links.privacy')}</Link>
          <Link to="/contact">{t('footer.links.contact')}</Link>
        </div>
        <div className="footer-legal">
          <p>{t('footer.legal')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 