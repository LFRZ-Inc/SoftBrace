import React, { useEffect, useState } from 'react';
import './Loader.css';
import logoBlue from '../assets/SoftBrace small Logo.png';
import logoLilac from '../assets/SoftBrace Logo Lilac.png';
import logoPurple from '../assets/SoftBrace Logo Purple.png';
import logoGreen from '../assets/SoftBrace Logo Green.png';

const logos = [logoBlue, logoLilac, logoPurple, logoGreen];

function Loader() {
  const [mode, setMode] = useState('spin'); // 'spin' or 'pulse'

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === 'spin' ? 'pulse' : 'spin'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loader-container ${mode}`}>
      {logos.map((logo, idx) => (
        <img
          key={idx}
          src={logo}
          alt={`SoftBrace Logo ${idx + 1}`}
          className={`loader-logo logo-${idx + 1}`}
        />
      ))}
    </div>
  );
}

export default Loader; 