import { useContext } from 'react';
import { LanguageContext } from '../components/LanguageContext';
import translations from '../translations';

export const useTranslation = () => {
  const { currentLanguage } = useContext(LanguageContext);
  
  // Get translations for the current language
  const t = (key) => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    // Navigate through the nested properties
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // If translation not found, return the key as fallback
        console.warn(`Translation for ${key} not found in ${currentLanguage}`);
        return key;
      }
    }
    
    return value;
  };
  
  return { t, language: currentLanguage };
};

export default useTranslation; 