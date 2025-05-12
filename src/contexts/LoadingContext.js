import React, { createContext, useState, useContext } from 'react';

// Create loading context
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {}
});

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Expose loading state and setter
  const value = {
    isLoading,
    setIsLoading,
    showLoader: () => setIsLoading(true),
    hideLoader: () => setIsLoading(false)
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