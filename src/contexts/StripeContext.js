import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Create a context for Stripe functions
const StripeContext = createContext(null);

// Use the actual publishable key from .env
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

export function StripeProvider({ children }) {
  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items) => {
    try {
      console.log('Redirecting to Stripe checkout for items:', items);
      
      // Call our API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      return {
        success: false,
        message: 'There was an error processing your checkout. Please try again.'
      };
    }
  };

  const value = {
    redirectToCheckout
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}

export default StripeContext; 