import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              <h2>SoftBrace<span>Strips</span></h2>
            </Link>
            <p>Comfortable support for your joints</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info@softbracestrips.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} SoftBrace Strips. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 