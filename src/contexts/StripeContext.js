import React, { createContext, useContext, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Redirecting to Stripe checkout for items:', items);
      
      // Format line items for Stripe API
      const line_items = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            // Add images if available
            images: item.image ? [window.location.origin + item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));
      
      console.log('Sending API request with line_items:', line_items);
      
      // Call our API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ line_items }),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Checkout session created:', data);
      
      if (!data.id) {
        throw new Error('Invalid response from server: missing session ID');
      }
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      console.log('Redirecting to Stripe checkout with session ID:', data.id);
      
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: data.id 
      });
      
      if (error) {
        console.error('Stripe redirectToCheckout error:', error);
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      setError(error.message || 'There was an error processing your checkout. Please try again.');
      return {
        success: false,
        message: error.message || 'There was an error processing your checkout. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    redirectToCheckout,
    isLoading,
    error
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