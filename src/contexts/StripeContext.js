import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Create a context for Stripe functions
const StripeContext = createContext(null);

// Use the actual publishable key from .env
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

// API base URL - use environment variable or default to localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export function StripeProvider({ children }) {
  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items) => {
    try {
      console.log('Redirecting to Stripe checkout for items:', items);
      
      // Format line items for Stripe API
      const line_items = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            // Add images if available
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));
      
      // Call our API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ line_items }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }
      
      const session = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: session.id 
      });
      
      if (error) {
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