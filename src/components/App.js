import React, { useEffect, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import Loader from '../components/Loader';

// Wrapper component that uses the loading context
const LoaderComponent = () => {
  const { isLoading, hideLoader } = useLoading();
  const [forceHide, setForceHide] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      // Reset force hide when loading starts
      setForceHide(false);
      
      // Force hide the loader after 3 seconds no matter what
      const timer = setTimeout(() => {
        setForceHide(true);
        hideLoader(); // Also call the context's hideLoader
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hideLoader]);
  
  // Don't render if force hidden or not loading
  if (forceHide || !isLoading || !Loader) {
    return null;
  }
  
  return <Loader />;
};

export default LoaderComponent; 