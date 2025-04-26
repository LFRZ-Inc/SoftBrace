import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="landing-container">
        <div className="logo-image-container">
          <img 
            src="images/softbrace-logos.jpg.png" 
            alt="SoftBrace Logos in different colors" 
            className="logo-image"
          />
        </div>
        <div className="coming-soon">
          <h2>SoftBraceStrips.com</h2>
          <p>Coming Late May</p>
        </div>
        <div className="disclaimer">
          <h3>Disclaimer:</h3>
          <p>
            SoftBrace strips are intended for temporary use as a soft barrier between orthodontic braces and the inside of the mouth to help reduce gum and cheek irritation. This product is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or oral condition. Do not use SoftBrace if you have open wounds, active infections, or known silicone allergies. Discontinue use immediately if irritation occurs and consult your orthodontist or dentist. SoftBrace is designed for single-use only. Reuse may pose hygiene risks. Do not sleep with SoftBrace strips in your mouth.
          </p>
          <p>
            This is the first version of the SoftBrace product, and we welcome your feedback to improve comfort and design.
          </p>
          <p>
            Patent Pending.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 