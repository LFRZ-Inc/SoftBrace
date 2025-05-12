import React, { useEffect, useState } from 'react';
import './Loader.css';

// Import with error handling
const importWithFallback = (path) => {
  try {
    // Try to load the image
    return require(`../${path}`);
  } catch (error) {
    console.warn(`Failed to load image: ${path}`, error);
    // Return a placeholder or null
    return null;
  }
};

// Try to get logo images with fallbacks
const logoBlue = importWithFallback('assets/SoftBrace small Logo.png');
const logoLilac = importWithFallback('assets/SoftBrace Logo Lilac.png');
const logoPurple = importWithFallback('assets/SoftBrace Logo Purple.png');
const logoGreen = importWithFallback('assets/SoftBrace Logo Green.png');

// Filter out any null logos
const logos = [logoBlue, logoLilac, logoPurple, logoGreen].filter(Boolean);

// Use public URLs as fallbacks if imports fail
const fallbackLogos = [
  '/images/SoftBrace small Logo.png',
  '/images/SoftBrace Logo Lilac.png',
  '/images/SoftBrace Logo Purple.png',
  '/images/SoftBrace Logo Green.png'
];

function Loader() {
  const [mode, setMode] = useState('spin'); // 'spin' or 'pulse'
  const [error, setError] = useState(false);
  const logosToUse = logos.length > 0 ? logos : fallbackLogos;

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === 'spin' ? 'pulse' : 'spin'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // If both import methods failed
  if (logosToUse.length === 0) {
    return <div className="loader-container">Loading...</div>;
  }

  return (
    <div className={`loader-container ${mode}`}>
      {logosToUse.map((logo, idx) => (
        <img
          key={idx}
          src={logo}
          alt={`SoftBrace Logo ${idx + 1}`}
          className={`loader-logo logo-${idx + 1}`}
          onError={() => setError(true)}
        />
      ))}
    </div>
  );
}

export default Loader; 