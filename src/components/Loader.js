import React, { useEffect, useState, useRef } from 'react';
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

// Define public URLs as fallbacks
const fallbackLogos = [
  '/images/SoftBrace small Logo.png',
  '/images/SoftBrace Logo Lilac.png',
  '/images/SoftBrace Logo Purple.png',
  '/images/SoftBrace Logo Green.png'
];

// Determine which logos are available and use them, or fall back to public URLs
function Loader() {
  const [mode, setMode] = useState('spin'); // 'spin' or 'pulse'
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);
  
  // Create array of imported logo paths, falling back to public URLs when imports fail
  const logoPaths = [
    logoBlue || fallbackLogos[0],
    logoLilac || fallbackLogos[1],
    logoPurple || fallbackLogos[2],
    logoGreen || fallbackLogos[3]
  ];

  // Function to clean up all animations and intervals
  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setVisible(false);
  };

  // Extra safety - force hide after 5 seconds no matter what
  useEffect(() => {
    const forceHideTimer = setTimeout(() => {
      console.log('Force hiding loader from within component after 5s');
      stopAnimation();
    }, 5000);

    return () => clearTimeout(forceHideTimer);
  }, []);

  useEffect(() => {
    // Start animation
    intervalRef.current = setInterval(() => {
      setMode((prev) => (prev === 'spin' ? 'pulse' : 'spin'));
    }, 2000);
    
    // Cleanup animation on unmount
    return () => {
      stopAnimation();
    };
  }, []);

  if (!visible) {
    return null;
  }

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
              // But prevent infinite loop if fallback also fails
              const currentSrc = e.target.src;
              const fallbackSrc = fallbackLogos[idx];
              
              if (currentSrc !== fallbackSrc) {
                console.log(`Falling back to public URL for logo ${idx + 1}`);
                e.target.src = fallbackSrc;
              } else {
                console.error(`Both original and fallback logo ${idx + 1} failed to load`);
                // Remove the broken image by setting a transparent 1px GIF
                e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Loader; 