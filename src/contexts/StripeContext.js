import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Create a context for Stripe functions
const StripeContext = createContext(null);

// Use the actual publishable key from .env
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

// Mapping of our product IDs to Stripe Price IDs
// You'll need to create these products in your Stripe dashboard
const PRODUCT_PRICE_MAP = {
  '5-pack': 'price_1RKrtTFsjDil30gTJ53hoxIs', // 5-pack price ID from Stripe
  '15-pack': 'price_1RKrtTFsjDil30gTgCIJVVHP', // 15-pack price ID from Stripe
  '31-pack': 'price_1RKrtTFsjDil30gTB9EgX0iD'  // 31-pack price ID from Stripe
};

export function StripeProvider({ children }) {
  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items) => {
    try {
      console.log('Redirecting to Stripe checkout for items:', items);
      
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      
      // Format line items for Stripe - using the predefined price IDs
      const lineItems = items.map(item => {
        // Get the stripe price ID based on product ID
        const priceId = PRODUCT_PRICE_MAP[item.id];
        
        if (!priceId) {
          console.error(`No Stripe price ID found for product ${item.id}`);
          throw new Error(`Product ${item.name} is not available for purchase at this time.`);
        }
        
        return {
          price: priceId,
          quantity: item.quantity
        };
      });
      
      // Create a checkout session
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: lineItems,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });
      
      if (error) {
        console.error('Checkout error:', error);
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