import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Create a context for Stripe functions
const StripeContext = createContext(null);

// Fallback to test key if env variable is not available
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RKrnuFsjDil30gTmx1WEBqehbhO7vqaQMtRnZLaEJwI6jJBM6qtXfWpldALT50mxQqZkWmbNsUUdgOjVpnSsWTv00S33fMrpf';

// Initialize Stripe with error handling
const getStripePromise = () => {
  try {
    return loadStripe(STRIPE_PUBLISHABLE_KEY);
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
};

const stripePromise = getStripePromise();

export function StripeProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Verify Stripe is loaded on mount
  useEffect(() => {
    const checkStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (stripe) {
          setIsReady(true);
        } else {
          setError('Stripe failed to initialize');
        }
      } catch (e) {
        console.error('Stripe init error:', e);
        setError(e.message);
      }
    };

    checkStripe();
  }, []);

  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items) => {
    try {
      if (!isReady) {
        console.warn('Stripe is not ready yet');
      }
      
      console.log('Redirecting to Stripe checkout for items:', items);
      
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe.js failed to load');
        throw new Error('Failed to load Stripe.js');
      }
      
      try {
        // First attempt: create checkout session via API
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
      } catch (apiError) {
        console.warn('API checkout failed, falling back to client-only checkout:', apiError);
        
        // Fallback: Use client-only checkout
        const { error } = await stripe.redirectToCheckout({
          mode: 'payment',
          lineItems: items.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: item.image ? [window.location.origin + item.image] : [],
              },
              unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
          })),
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        });
        
        if (error) {
          console.error('Client-only checkout error:', error);
          throw error;
        }
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
    redirectToCheckout,
    isReady,
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