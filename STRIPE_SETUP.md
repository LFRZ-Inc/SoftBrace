# Stripe Integration Guide for SoftBraceStrips.com

This guide explains how to set up and configure the Stripe integration with automatic tax calculation and shipping options.

## Prerequisites

1. A Stripe account (register at [stripe.com](https://stripe.com))
2. Node.js and npm installed on your development machine

## Setup Steps

### 1. Stripe Dashboard Configuration

Before integrating with the code, you need to configure your Stripe Dashboard:

1. **Tax Settings**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to **Settings** > **Tax**
   - Enable Tax calculation and set up your business location
   - Configure your tax registrations for each state/country you need to collect tax in

2. **Product Configuration**:
   - Navigate to **Products** in the Stripe Dashboard
   - Set tax codes for your products (e.g., "txcd_99999999" for general goods)
   - Note: Our implementation will still work without this, but it helps with tax classification

### 2. Server Setup

The server handles secure API calls to Stripe:

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the server directory with your Stripe keys:
   ```
   PORT=4000
   STRIPE_SECRET_KEY=sk_test_your_test_secret_key
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration

1. Create a `.env` file in the project root with your Stripe publishable key:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
   REACT_APP_API_URL=http://localhost:4000
   ```

2. Install frontend dependencies if needed:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. For production deployment, you'll need to:
   - Set up the server on a hosting provider
   - Configure environment variables on your hosting platform
   - Update `REACT_APP_API_URL` to point to your production server

## Features Configured

### Automatic Tax Calculation

The integration is set up to:
- Automatically calculate taxes based on customer location
- Apply the correct tax rates according to your Stripe tax settings
- Display tax breakdown in the checkout process

To test: Add items to your cart and proceed to checkout. The tax should be calculated automatically based on the address information.

### Shipping Options

Two shipping options are configured:
- Standard Shipping ($5.99, 5-7 business days)
- Express Shipping ($14.99, 2-3 business days)

To customize these options, edit the `shipping_options` array in `server/index.js`.

## Troubleshooting

### Common Issues

1. **API Errors**: 
   - Check that your server is running
   - Verify your Stripe API keys are correct
   - Make sure your Stripe account is properly set up

2. **Tax Not Calculating**:
   - Ensure you've enabled tax calculation in Stripe Dashboard
   - Check that your business locations and tax registrations are set up

3. **Shipping Options Not Appearing**:
   - Verify the `shipping_options` array in the server code
   - Check for any errors in the console when creating a checkout session

### Testing the Integration

Use Stripe's test card numbers for testing:
- **Card Number**: 4242 4242 4242 4242
- **Exp Date**: Any future date
- **CVV**: Any 3 digits

## Going Live

Before moving to production:

1. Replace test keys with production keys
2. Complete your Stripe account verification
3. Test the entire payment flow thoroughly
4. Set up webhook endpoints for order fulfillment
5. Configure proper error handling and logging

## Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Tax Documentation](https://stripe.com/docs/tax)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout) 