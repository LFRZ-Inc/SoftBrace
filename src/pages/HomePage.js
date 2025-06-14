import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SoftLaunchBanner from '../components/SoftLaunchBanner';
import Product from '../components/Product';
import Usage from '../components/Usage';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import LegalNotice from '../components/LegalNotice';
import { getPageContent } from '../lib/adminContent';

// Component mapping for Visual Editor elements
const ComponentMap = {
  'website-hero': Hero,
  'website-product': Product,
  'website-usage': Usage,
  'website-faq': FAQ,
  'website-contact': Contact,
  'image': ({ content }) => (
    <div className="dynamic-image-section" style={{ textAlign: content.alignment || 'center', padding: '2rem 0' }}>
      <img 
        src={content.image} 
        alt={content.alt || ''} 
        style={{ 
          width: content.width || '100%', 
          maxWidth: '800px',
          height: 'auto',
          borderRadius: '8px'
        }} 
      />
      {content.caption && (
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          {content.caption}
        </p>
      )}
    </div>
  )
};

function HomePage() {
  const [pageStructure, setPageStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageStructure = async () => {
      try {
        const savedContent = await getPageContent('visual-editor', 'page-structure');
        if (savedContent && savedContent.content) {
          const structure = JSON.parse(savedContent.content);
          setPageStructure(structure);
        }
      } catch (error) {
        console.error('Error loading page structure:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPageStructure();
  }, []);

  // Show loading state briefly
  if (loading) {
    return (
      <div className="home-page">
        <SoftLaunchBanner />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If we have saved page structure from Visual Editor, use it
  if (pageStructure && Array.isArray(pageStructure)) {
    return (
      <div className="home-page">
        <SoftLaunchBanner />
        {pageStructure
          .sort((a, b) => a.position - b.position) // Sort by position
          .map((element) => {
            const Component = ComponentMap[element.type];
            
            if (Component) {
              return (
                <div key={element.id}>
                  <Component {...element.content} />
                </div>
              );
            } else if (element.type === 'image') {
              const ImageComponent = ComponentMap.image;
              return (
                <div key={element.id}>
                  <ImageComponent content={element.content} />
                </div>
              );
            }
            
            return null;
          })}
        <LegalNotice />
      </div>
    );
  }

  // Fallback to original hardcoded layout if no saved structure
  return (
    <div className="home-page">
      <SoftLaunchBanner />
      <Hero />
      <Product />
      <Usage />
      <FAQ />
      <Contact />
      <LegalNotice />
    </div>
  );
}

export default HomePage; 