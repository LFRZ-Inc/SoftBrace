import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from './AuthContext';
import { getProducts } from '../lib/supabase';

// Create a context for Stripe functions
const StripeContext = createContext(null);

// Use the actual publishable key from .env
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

// API base URL - use environment variable or default to localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export function StripeProvider({ children }) {
  const { user, profile } = useAuth();

  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items, checkoutOptions = {}) => {
    try {
      console.log('Redirecting to Stripe checkout for items:', items);
      console.log('Checkout options:', checkoutOptions);
      
      // Get products from database to get Stripe price IDs
      const products = await getProducts();
      console.log('Available products with Stripe price IDs:', products);

      // Format line items using actual Stripe price IDs instead of dynamic prices
      const line_items = items.map(item => {
        // Find the corresponding product in the database
        const product = products.find(p => p.id === item.id || p.name === item.name);
        
        if (!product || !product.stripe_price_id) {
          throw new Error(`Product "${item.name}" does not have a configured Stripe price ID. Please configure Stripe products first.`);
        }
        
        console.log(`Using Stripe price ID "${product.stripe_price_id}" for product "${product.name}"`);
        
        return {
          price: product.stripe_price_id, // Use the actual Stripe price ID
        quantity: item.quantity,
        };
      });

      // Prepare user information and checkout options
      const requestBody = {
        line_items,
        user_id: user?.id || null,
        user_email: user?.email || profile?.email || null,
        points_used: checkoutOptions.pointsUsed || 0,
        use_points_redemption: checkoutOptions.usePointsRedemption || false,
        use_account_discount: checkoutOptions.useAccountDiscount || false
      };
      
      console.log('Sending checkout request with Stripe price IDs:', requestBody);
      
      // Call our API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout API error:', errorData);
        throw new Error(errorData.error || 'Error creating checkout session');
      }
      
      const session = await response.json();
      console.log('Checkout session created successfully:', session);
      
      // Show discount/points notifications if applicable
      if (session.discount_applied) {
        console.log(`🎉 Discount applied: ${session.discount_amount}`);
      }
      
      if (session.points_used > 0) {
        console.log(`🎁 Points redeemed: ${session.points_used} points (${session.points_discount})`);
      }
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: session.id 
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message);
      }
      
      return { 
        success: true,
        discount_applied: session.discount_applied,
        discount_amount: session.discount_amount,
        points_used: session.points_used,
        points_discount: session.points_discount,
        original_total: session.original_total,
        final_total: session.final_total
      };
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
    isUserLoggedIn: !!user,
    userEmail: user?.email || profile?.email
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