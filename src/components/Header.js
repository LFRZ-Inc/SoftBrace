import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { itemCount } = useCart();
  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/images/softbrace-logos.jpg.png" alt="SoftBrace Logo" />
            <span className="logo-text">{t('hero.title')}</span>
          </Link>
        </div>
        <nav className="nav-menu">
          <ul>
            {isHomePage ? (
              // Home page uses anchor links
              <>
                <li><a href="#home">{t('nav.home')}</a></li>
                <li><a href="#product">{t('nav.product')}</a></li>
                <li><a href="#usage">{t('nav.usage')}</a></li>
                <li><a href="#contact">{t('nav.contact')}</a></li>
              </>
            ) : (
              // Other pages use router links
              <li><Link to="/">{t('nav.home')}</Link></li>
            )}
            <li><Link to="/shop">{t('nav.shop')}</Link></li>
            <li><Link to="/blog">{t('nav.blog')}</Link></li>
            <li>
              <Link to="/cart" className="cart-link">
                {t('nav.cart')}
                {itemCount > 0 && (
                  <span className="cart-count bg-primary text-white rounded-full h-5 w-5 inline-flex items-center justify-center text-xs ml-1">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 