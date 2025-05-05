# SoftBraceStrips.com

Official website for SoftBrace, the next-gen comfort solution for braces wearers.

## Features

- Responsive design with dark mode support
- Multilingual support (English and Spanish)
- Product showcase with detailed descriptions
- E-commerce functionality with Stripe integration
- Secure checkout process
- GitHub Pages and Vercel deployment support

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/LFRZ-Inc/SoftBrace.git
cd SoftBrace
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Stripe publishable key:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

4. Start the development server
```bash
npm start
```

## Deployment Instructions

### Vercel Deployment (Recommended for E-commerce)

1. Connect your GitHub repository to Vercel
2. Add the following environment variables in Vercel project settings:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
3. Ensure the project uses the Vercel configuration in `vercel.json`
4. Deploy the project

### GitHub Pages Deployment

For GitHub Pages deployment (note: API functionality will not work with GitHub Pages):

```bash
npm run deploy
```

This will build the project and deploy it to GitHub Pages.

## Stripe Integration

The e-commerce functionality uses Stripe for payment processing. To set up Stripe:

1. Create a Stripe account and get your API keys
2. Add your Stripe publishable key to `.env` file
3. When deploying to Vercel, add your Stripe secret key as an environment variable
4. The API route at `/api/create-checkout-session` handles creating Stripe checkout sessions

## Project Structure

- `/src` - React application source code
  - `/components` - Reusable React components
  - `/contexts` - React contexts for state management
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
  - `/assets` - Images and other static assets
- `/api` - Serverless API functions for Vercel
- `/public` - Static files
- `/build` - Production build output

## API Endpoints

- `/api/create-checkout-session` - Creates a Stripe checkout session
- `/api/index` - Health check endpoint

## Technologies Used

- React
- Tailwind CSS
- Stripe Checkout
- Vercel Serverless Functions

## Troubleshooting

### Common Deployment Issues

1. **Stripe API Key Issues**
   - Ensure your Stripe keys are correctly added to environment variables
   - Check that you're using the correct mode (test/live) keys

2. **API Routes Not Working**
   - When using GitHub Pages, API routes aren't supported
   - Vercel deployment requires proper configuration in `vercel.json`

3. **Missing Environment Variables**
   - Make sure all required environment variables are set in Vercel

4. **Image Loading Issues**
   - Ensure images are properly referenced with correct paths
   - The build script includes a copy-images.js that copies images to the build folder

## License

All rights reserved. SoftBrace LLC – Patent Pending.

## Contact

For questions or support, please contact info@softbracestrips.com 