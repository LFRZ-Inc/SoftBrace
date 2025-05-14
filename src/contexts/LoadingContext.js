import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

// Create loading context
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  showLoader: () => {},
  hideLoader: () => {}
});

// Default timeout for loader (10 seconds)
const DEFAULT_LOADER_TIMEOUT = 10000;

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loaderTimeoutRef = useRef(null);
  
  // Clear any existing timeout
  const clearLoaderTimeout = useCallback(() => {
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }
  }, []);
  
  // Set a safety timeout to hide the loader after a certain period
  const setLoaderTimeout = useCallback(() => {
    clearLoaderTimeout();
    loaderTimeoutRef.current = setTimeout(() => {
      console.warn('Loader timeout triggered - forcing loader to hide after timeout');
      setIsLoading(false);
    }, DEFAULT_LOADER_TIMEOUT);
  }, [clearLoaderTimeout]);
  
  // Show loader with timeout
  const showLoader = useCallback(() => {
    setIsLoading(true);
    setLoaderTimeout();
  }, [setLoaderTimeout]);
  
  // Hide loader and clear timeout
  const hideLoader = useCallback(() => {
    setIsLoading(false);
    clearLoaderTimeout();
  }, [clearLoaderTimeout]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLoaderTimeout();
    };
  }, [clearLoaderTimeout]);

  // Expose loading state and methods
  const value = {
    isLoading,
    setIsLoading,
    showLoader,
    hideLoader
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for accessing loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext; 