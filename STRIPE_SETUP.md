# Stripe Integration Setup

This document outlines how to set up the Stripe integration for SoftBraceStrips.com.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Replace `your_stripe_publishable_key` and `your_stripe_secret_key` with your actual Stripe API keys.

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel dashboard under your project settings.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

## API Functions

The Stripe checkout process uses Vercel Serverless Functions to create checkout sessions. These are located in the `/api` directory.

For local development and testing of API functions, you can use Vercel CLI:

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Run locally:
   ```
   vercel dev
   ```

## Checkout Flow

1. User adds items to cart
2. On checkout, the app calls our API to create a Stripe checkout session
3. User is redirected to Stripe's hosted checkout page
4. After payment, user is redirected to success or cancel page
5. Success page clears the cart

## Testing

Use Stripe's test cards to test the checkout flow:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Use any future date for expiration, any 3 digits for CVC, and any 5 digits for ZIP code.

## Additional Resources

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Testing Stripe](https://stripe.com/docs/testing) 