import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Auth from './Auth';

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const isHomePage = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    console.log('Header: Sign out button clicked')
    try {
      const result = await signOut();
      if (result.error) {
        console.error('Header: Sign out failed:', result.error)
        alert('Sign out failed. Please try again.')
      } else {
        console.log('Header: Sign out successful')
      }
    } catch (error) {
      console.error('Header: Sign out exception:', error)
      alert('Sign out failed. Please try again.')
    }
    setMenuOpen(false);
  };

  // Close menu when route changes
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <img src="/images/softbrace-logos.jpg.png" alt="SoftBrace Logo" />
              <span className="logo-text">{t('hero.title')}</span>
            </Link>
          </div>
          
          <button 
            className={`mobile-menu-button ${menuOpen ? 'menu-open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="mobile-menu-icon"></span>
          </button>
          
          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
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
                <>
                  <li><Link to="/">{t('nav.home')}</Link></li>
                  <li><Link to="/contact">{t('nav.contact')}</Link></li>
                </>
              )}
              <li><Link to="/shop">{t('nav.shop')}</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
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
              
              {/* Authentication Section */}
              {!loading ? (
                <>
                  {user ? (
                    <li className="auth-section">
                      <div className="user-menu">
                        <span className="user-greeting">
                          {isAdmin && <span className="admin-badge">👑 </span>}
                          Hi, {profile?.full_name || user.email?.split('@')[0] || 'User'}!
                          {isAdmin && <span className="admin-text"> (Admin)</span>}
                        </span>
                        <div className="user-menu-actions">
                          <Link 
                            to="/account" 
                            className="account-link"
                            onClick={() => setMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <button 
                            className="sign-out-btn"
                            onClick={handleSignOut}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li className="auth-section">
                      <button 
                        className="sign-in-btn"
                        onClick={() => setShowAuth(true)}
                      >
                        Sign In
                      </button>
                    </li>
                  )}
                </>
              ) : (
                <li className="auth-section">
                  <div className="auth-loading">Loading...</div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      <Auth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
}

export default Header;