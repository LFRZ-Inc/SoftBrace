// Vercel serverless function to create a Stripe checkout session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  console.log('Received checkout request');
  
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not defined');
      return res.status(500).json({
        error: 'Stripe API key is missing'
      });
    }

    const { items } = req.body;
    console.log('Request items:', JSON.stringify(items));
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid request items:', items);
      return res.status(400).json({
        error: 'Invalid request: missing or empty items array'
      });
    }

    // Create line items with proper schema
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: item.amount, // in cents
      },
      quantity: item.quantity,
    }));

    console.log('Creating Stripe checkout session with line items:', JSON.stringify(lineItems));
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout/success`,
      cancel_url: `${req.headers.origin}/checkout/cancel`,
    });

    console.log('Checkout session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error.message, error.stack);
    res.status(500).json({
      error: `An error occurred: ${error.message}`
    });
  }
}; 