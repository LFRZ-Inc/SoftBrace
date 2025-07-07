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

// Validate Stripe configuration
if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing REACT_APP_STRIPE_PUBLISHABLE_KEY environment variable');
}

// API base URL - use environment variable or default to localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export function StripeProvider({ children }) {
  const { user, profile } = useAuth();

  // Test function to check if API is reachable
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'OPTIONS'
      });
      console.log('API test response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  };

  // Function to redirect to Stripe hosted checkout
  const redirectToCheckout = async (items, checkoutOptions = {}) => {
    try {
      // Validate Stripe configuration
      if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe is not properly configured. Missing publishable key.');
      }
      
      console.log('Redirecting to Stripe checkout for items:', items);
      console.log('Checkout options:', checkoutOptions);
      
      // Test API connection first
      const apiReachable = await testApiConnection();
      if (!apiReachable) {
        throw new Error('Unable to connect to checkout API. Please check your internet connection and try again.');
      }
      console.log('API connection test passed');
      
      // Get products from database to get Stripe price IDs
      const products = await getProducts();
      console.log('Available products with Stripe price IDs:', products);
      
      // Fallback product mapping if database is not configured
      const fallbackProducts = [
            { id: 1, name: 'SoftBrace 5-Pair Pack', stripe_price_id: 'price_1QcYULBumkBEKdUYPt7EtE3Z' },
    { id: 2, name: 'SoftBrace 15-Pair Pack', stripe_price_id: 'price_1QcYUmBumkBEKdUYd6N7Fmvf' },
    { id: 3, name: 'SoftBrace 31-Pair Pack', stripe_price_id: 'price_1QcYVKBumkBEKdUYzZGrWpEo' },
    { id: 4, name: 'SoftWax', stripe_price_id: 'price_1QcYVjBumkBEKdUYQqLkGJRZ' },
    { id: 5, name: 'SoftBrace 100-Pair Bulk Pack', stripe_price_id: 'price_1QcYWCBumkBEKdUYnxXZyxGV' },
    { id: 6, name: 'SoftWax + 5-Pair SoftBrace Strips Bundle', stripe_price_id: 'price_1QcYWjBumkBEKdUYFhqTSPYt' },
    { id: 7, name: 'SoftBrace Trial Pack', stripe_price_id: 'price_1Ri4HPFsjDil30gTjUj4N4tW' }
      ];
      
      // Use database products if available, otherwise fallback
      const productData = products && products.length > 0 ? products : fallbackProducts;
      console.log('Using product data:', productData);

      // Format line items using actual Stripe price IDs instead of dynamic prices
      const line_items = items.map(item => {
        // Find the corresponding product in the database
        const product = productData.find(p => p.id === item.id || p.name === item.name);
        
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
      
      // Call our API endpoint to create a checkout session with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout API error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed error data:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: ${errorText}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
        }
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
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timed out. Please check your internet connection and try again.'
        };
      }
      
      if (error.message && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection and try again.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'There was an error processing your checkout. Please try again.'
      };
    }
  };

  const value = {
    redirectToCheckout,
    testApiConnection,
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