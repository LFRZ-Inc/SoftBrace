import React from 'react';
import Hero from '../components/Hero';
import Product from '../components/Product';
import Usage from '../components/Usage';
import Contact from '../components/Contact';
import LegalNotice from '../components/LegalNotice';

function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Product />
      <Usage />
      <LegalNotice />
      <Contact />
    </div>
  );
}

export default HomePage; 