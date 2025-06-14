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
    const { 
      line_items, 
      user_id, 
      user_email, 
      points_used = 0, 
      use_points_redemption = false,
      use_account_discount = false 
    } = req.body;
    
    // Calculate total amount in cents
    const totalAmount = line_items.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * item.quantity);
    }, 0);

    // Determine if user is registered
    let isRegisteredUser = user_id && user_email;
    
    // Calculate final amount after points redemption
    let finalAmount = totalAmount;
    let pointsUsed = 0;
    
    // Handle points redemption (50 points = free 5-pack = $4.99)
    if (use_points_redemption && points_used > 0) {
      const pointsValue = Math.floor(points_used / 50) * 499; // 50 points = $4.99 in cents
      pointsUsed = Math.floor(points_used / 50) * 50; // Only use complete 50-point increments
      finalAmount = Math.max(0, totalAmount - pointsValue);
    }

    // Apply 5% discount for registered users (only if not using points)
    let discounts = [];
    let discountType = 'none';
    
    if (isRegisteredUser && use_account_discount && !use_points_redemption) {
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
      discountType = '5_percent';
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

    // Add standard shipping options based on order total (use original total for shipping calculation)
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

    // Update line items if points were used (reduce the amount)
    let updatedLineItems = line_items;
    if (use_points_redemption && pointsUsed > 0) {
      // If using points, we need to adjust the line items
      // For simplicity, we'll apply the points discount to the first item
      updatedLineItems = line_items.map((item, index) => {
        if (index === 0 && finalAmount < totalAmount) {
          // Apply points discount to first item
          const discountAmount = totalAmount - finalAmount;
          const newUnitAmount = Math.max(0, item.price_data.unit_amount - Math.floor(discountAmount / item.quantity));
          return {
            ...item,
            price_data: {
              ...item.price_data,
              unit_amount: newUnitAmount
            }
          };
        }
        return item;
      });
    }

    // Create checkout session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: updatedLineItems,
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
      // Add comprehensive metadata for webhook processing
      metadata: {
        has_laredo_option: 'true',
        user_type: isRegisteredUser ? 'registered' : 'guest',
        user_id: user_id || 'guest',
        user_email: user_email || '',
        points_used: pointsUsed.toString(),
        points_earned: Math.floor(totalAmount / 100).toString(), // 1 point per $1 of original total
        order_type: use_points_redemption ? 'points_redeemed' : 'regular',
        discount_type: discountType,
        original_total_cents: totalAmount.toString(),
        final_total_cents: finalAmount.toString()
      }
    };

    // Add discounts if user is registered and using account discount
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
      discount_applied: discountType !== 'none',
      discount_amount: discountType === '5_percent' ? '5%' : '0%',
      points_used: pointsUsed,
      points_discount: pointsUsed > 0 ? `$${((totalAmount - finalAmount) / 100).toFixed(2)}` : '$0.00',
      laredo_shipping_available: true,
      original_total: (totalAmount / 100).toFixed(2),
      final_total: (finalAmount / 100).toFixed(2)
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
} 