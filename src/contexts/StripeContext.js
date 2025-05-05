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
      
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe.js failed to load');
        throw new Error('Failed to load Stripe.js');
      }
      
      // Create a Stripe checkout session via our server API
      console.log('Sending checkout request to API...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            name: item.name,
            description: `SoftBrace ${item.id}`,
            amount: Math.round(item.price * 100), // Convert to cents
            quantity: item.quantity
          }))
        }),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('API error response:', errorData);
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const sessionData = await response.json();
      console.log('Session created:', sessionData);
      
      if (!sessionData.sessionId) {
        console.error('Missing sessionId in response:', sessionData);
        throw new Error('Invalid response from payment server');
      }
      
      // Redirect to Stripe checkout with the session ID
      console.log('Redirecting to Stripe checkout...');
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId
      });
      
      if (error) {
        console.error('Stripe checkout error:', error);
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      return {
        success: false,
        message: error.message || 'There was an error processing your checkout. Please try again.'
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