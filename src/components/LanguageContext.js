import React, { createContext, useState, useEffect } from 'react';

// Define available languages
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
  },
};

// Create the context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Detect browser language
  const detectBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return languages[browserLang] ? browserLang : 'en'; // Default to English if not supported
  };

  // Initialize with system preference or saved preference
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language in localStorage
    const savedLanguage = localStorage.getItem('language');
    
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      const browserLang = detectBrowserLanguage();
      setCurrentLanguage(browserLang);
    }
  }, []);

  // Function to change language
  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('language', langCode);
      document.documentElement.setAttribute('lang', langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 