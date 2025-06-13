// Vercel Serverless Function for Stripe checkout
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

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { line_items, user_id, user_email } = req.body;
    
    // Calculate total amount in cents
    const totalAmount = line_items.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * item.quantity);
    }, 0);

    // Apply 5% discount for registered users
    let discounts = [];
    let isRegisteredUser = user_id && user_email;
    
    if (isRegisteredUser) {
      // Create a coupon for 5% off for registered users
      const coupon = await stripe.coupons.create({
        percent_off: 5,
        duration: 'once',
        name: 'Registered User Discount',
        metadata: {
          user_id: user_id,
          discount_type: 'registered_user'
        }
      });
      
      discounts = [{
        coupon: coupon.id
      }];
    }

    // Enhanced shipping logic with proper Laredo, TX support
    let shipping_options = [];

    // ALWAYS add Laredo, TX local delivery option (free for all orders)
    shipping_options.push({
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 0,
          currency: 'usd',
        },
        display_name: 'Laredo, TX Local Delivery (FREE)',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 1 },
          maximum: { unit: 'business_day', value: 2 },
        },
      },
    });

    // Add standard shipping options based on order total
    if (totalAmount < 599) {
      // $2 shipping for orders under $5.99
      shipping_options.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 200, // $2 in cents
            currency: 'usd',
          },
          display_name: 'Standard Shipping ($2.00)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      });
    } else {
      // Free shipping for $5.99 or more
      shipping_options.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      });
    }

    // Create checkout session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      // Enable automatic tax calculation
      automatic_tax: { enabled: true },
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options,
      // Add metadata
      metadata: {
        has_laredo_option: 'true',
        user_type: isRegisteredUser ? 'registered' : 'guest',
        user_id: user_id || 'guest',
        discount_applied: isRegisteredUser ? '5_percent' : 'none',
        order_total_cents: totalAmount.toString()
      }
    };

    // Add discounts if user is registered
    if (discounts.length > 0) {
      sessionConfig.discounts = discounts;
    }

    // Pre-fill customer email if available
    if (user_email) {
      sessionConfig.customer_email = user_email;
    }

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ 
      id: session.id,
      discount_applied: isRegisteredUser,
      discount_amount: isRegisteredUser ? '5%' : '0%',
      laredo_shipping_available: true,
      order_total: (totalAmount / 100).toFixed(2)
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
} 