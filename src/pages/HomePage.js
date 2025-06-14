import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SoftLaunchBanner from '../components/SoftLaunchBanner';
import Product from '../components/Product';
import Usage from '../components/Usage';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import LegalNotice from '../components/LegalNotice';
import { getPageContent } from '../lib/adminContent';

// Safe component wrapper to handle errors
const SafeComponent = ({ Component, props, fallback }) => {
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('Error rendering component:', error);
    return fallback || null;
  }
};

// Component mapping for Visual Editor elements
const ComponentMap = {
  'website-hero': Hero,
  'website-product': Product,
  'website-usage': Usage,
  'website-faq': FAQ,
  'website-contact': Contact
};

function HomePage() {
  const [pageStructure, setPageStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPageStructure = async () => {
      try {
        console.log('Loading page structure...');
        const savedContent = await getPageContent('visual-editor', 'page-structure');
        console.log('Saved content:', savedContent);
        
        if (savedContent && savedContent.content) {
          try {
            const structure = JSON.parse(savedContent.content);
            console.log('Parsed structure:', structure);
            setPageStructure(structure);
          } catch (parseError) {
            console.error('Error parsing page structure JSON:', parseError);
            setError('Invalid page structure data');
          }
        } else {
          console.log('No saved content found, using fallback');
        }
      } catch (error) {
        console.error('Error loading page structure:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPageStructure();
  }, []);

  // If there's an error or no saved structure, use original layout
  if (error || !pageStructure) {
    console.log('Using fallback layout. Error:', error, 'PageStructure:', pageStructure);
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

  // Render dynamic content if we have valid page structure
  try {
    return (
      <div className="home-page">
        <SoftLaunchBanner />
        {Array.isArray(pageStructure) && pageStructure
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((element) => {
            if (!element || !element.type) {
              console.warn('Invalid element:', element);
              return null;
            }

            const Component = ComponentMap[element.type];
            
            if (Component) {
              return (
                <SafeComponent
                  key={element.id || Math.random()}
                  Component={Component}
                  props={element.content || {}}
                  fallback={<div key={element.id}>Error loading section</div>}
                />
              );
            } else if (element.type === 'image' && element.content && element.content.image) {
              return (
                <div key={element.id || Math.random()} className="dynamic-image-section" style={{ 
                  textAlign: element.content.alignment || 'center', 
                  padding: '2rem 0' 
                }}>
                  <img 
                    src={element.content.image} 
                    alt={element.content.alt || ''} 
                    style={{ 
                      width: element.content.width || '100%', 
                      maxWidth: '800px',
                      height: 'auto',
                      borderRadius: '8px'
                    }} 
                    onError={(e) => {
                      console.error('Image failed to load:', element.content.image);
                      e.target.style.display = 'none';
                    }}
                  />
                  {element.content.caption && (
                    <p style={{ 
                      marginTop: '1rem', 
                      fontSize: '0.9rem', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {element.content.caption}
                    </p>
                  )}
                </div>
              );
            } else {
              console.warn('Unknown element type:', element.type);
              return null;
            }
          })}
        <LegalNotice />
      </div>
    );
  } catch (renderError) {
    console.error('Error rendering dynamic content:', renderError);
    // Fallback to original layout if rendering fails
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
}

export default HomePage; 