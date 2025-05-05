import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from './LanguageContext';
import './LanguageSelector.css';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-button" 
        onClick={toggleDropdown}
        aria-label="Select language" 
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>{languages[currentLanguage].nativeName}</span>
      </button>
      
      {isOpen && (
        <ul className="language-dropdown">
          {Object.values(languages).map((lang) => (
            <li key={lang.code}>
              <button 
                className={lang.code === currentLanguage ? 'active' : ''} 
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.nativeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector; 