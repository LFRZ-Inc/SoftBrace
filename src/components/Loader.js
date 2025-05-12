import React, { useEffect, useState } from 'react';
import './Loader.css';

// Direct imports with try/catch for each image
let logoBlue, logoLilac, logoPurple, logoGreen;

try {
  logoBlue = require('../assets/SoftBrace small Logo.png');
} catch (error) {
  console.warn('Failed to load blue logo', error);
}

try {
  logoLilac = require('../assets/SoftBrace Logo Lilac.png');
} catch (error) {
  console.warn('Failed to load lilac logo', error);
}

try {
  logoPurple = require('../assets/SoftBrace Logo Purple.png');
} catch (error) {
  console.warn('Failed to load purple logo', error);
}

try {
  logoGreen = require('../assets/SoftBrace Logo Green.png');
} catch (error) {
  console.warn('Failed to load green logo', error);
}

// Determine which logos are available and use them, or fall back to public URLs
function Loader() {
  const [mode, setMode] = useState('spin'); // 'spin' or 'pulse'
  
  // Define public URLs as fallbacks
  const fallbackLogos = [
    '/images/SoftBrace small Logo.png',
    '/images/SoftBrace Logo Lilac.png',
    '/images/SoftBrace Logo Purple.png',
    '/images/SoftBrace Logo Green.png'
  ];
  
  // Create array of imported logo paths, falling back to public URLs when imports fail
  const logoPaths = [
    logoBlue || fallbackLogos[0],
    logoLilac || fallbackLogos[1],
    logoPurple || fallbackLogos[2],
    logoGreen || fallbackLogos[3]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === 'spin' ? 'pulse' : 'spin'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loader-container ${mode}`}>
      {logoPaths.map((src, idx) => (
        <div key={idx} className={`logo-wrapper logo-${idx + 1}`}>
          <img
            src={src}
            alt={`SoftBrace Logo ${idx + 1}`}
            className="loader-logo"
            onError={(e) => {
              // If the image fails to load, try the fallback URL
              if (e.target.src !== fallbackLogos[idx]) {
                console.log(`Falling back to public URL for logo ${idx + 1}`);
                e.target.src = fallbackLogos[idx];
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Loader; 