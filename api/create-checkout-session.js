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
      use_account_discount = false,
      shipping_preference = null 
    } = req.body;
    
    console.log('Creating checkout session with line items:', line_items);
    console.log('User info:', { user_id, user_email, points_used, use_points_redemption, use_account_discount });
    
    // Validate that line_items are using Stripe price IDs
    for (const item of line_items) {
      if (!item.price || !item.price.startsWith('price_')) {
        throw new Error(`Invalid Stripe price ID: ${item.price}. All items must use configured Stripe price IDs.`);
      }
    }
    
    // Calculate total amount by fetching prices from Stripe
    let totalAmount = 0;
    let totalQuantity = 0;
    const productSummary = [];

    for (const item of line_items) {
      try {
        const price = await stripe.prices.retrieve(item.price);
        const itemTotal = price.unit_amount * item.quantity;
        totalAmount += itemTotal;
        totalQuantity += item.quantity;
        
        productSummary.push({
          name: price.nickname || price.product.name || 'Product',
          price_id: item.price,
          unit_amount: price.unit_amount,
          quantity: item.quantity,
          total: itemTotal
        });
        
        console.log(`Product: ${price.nickname || 'Unknown'}, Price: $${price.unit_amount/100}, Qty: ${item.quantity}`);
      } catch (priceError) {
        console.error(`Error fetching price ${item.price}:`, priceError);
        throw new Error(`Invalid or inactive Stripe price ID: ${item.price}`);
      }
    }

    console.log(`Total amount: $${totalAmount/100}, Total quantity: ${totalQuantity}`);

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
      console.log(`Points redemption: ${pointsUsed} points = $${pointsValue/100} discount`);
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
      console.log('Applied 5% registered user discount');
    }

    // Enhanced shipping logic with proper Laredo, TX support and metadata
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
        metadata: {
          shipping_type: 'local_delivery',
          service_area: 'laredo_tx',
          delivery_method: 'local_courier',
          cost_type: 'free'
        }
      },
    });

    // Add standard shipping options based on order total
    if (totalAmount < 599) { // Less than $5.99
      shipping_options.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 200, // $2.00 in cents
            currency: 'usd',
          },
          display_name: 'Standard Shipping ($2.00)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 5 },
          },
          metadata: {
            shipping_type: 'standard',
            cost_type: 'paid'
          }
        },
      });
    } else { // $5.99 or more
      shipping_options.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 7 },
          },
          metadata: {
            shipping_type: 'standard',
            cost_type: 'free'
          }
        },
      });
    }

    console.log(`Shipping options configured: ${shipping_options.length} options`);

    // Create checkout session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: line_items, // Use the line_items directly with Stripe price IDs
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
      // Add comprehensive metadata for webhook processing and order management
      metadata: {
        // Order identification
        order_timestamp: new Date().toISOString(),
        session_created_at: Math.floor(Date.now() / 1000).toString(),
        
        // User information
        user_type: isRegisteredUser ? 'registered' : 'guest',
        user_id: user_id || 'guest',
        user_email: user_email || '',
        
        // Product information
        total_items: totalQuantity.toString(),
        product_summary: JSON.stringify(productSummary),
        
        // Pricing information
        original_total_cents: totalAmount.toString(),
        final_total_cents: finalAmount.toString(),
        
        // Points and discounts
        points_used: pointsUsed.toString(),
        points_earned: Math.floor(totalAmount / 100).toString(), // 1 point per $1 of original total
        order_type: use_points_redemption ? 'points_redeemed' : 'regular',
        discount_type: discountType,
        discount_applied: (discountType !== 'none').toString(),
        
        // Shipping information
        has_laredo_option: 'true',
        shipping_preference: shipping_preference || 'not_specified',
        free_shipping_eligible: (totalAmount >= 599).toString(),
        shipping_threshold_amount: '599',
        
        // Order fulfillment flags
        requires_processing: 'true',
        fulfillment_status: 'pending',
        notification_required: 'true',
        
        // Business logic flags
        is_soft_launch: 'true',
        platform: 'web',
        checkout_version: '2024.2'
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

    console.log('Creating Stripe checkout session...');

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log(`Checkout session created successfully: ${session.id}`);

    res.status(200).json({ 
      id: session.id,
      discount_applied: discountType !== 'none',
      discount_amount: discountType === '5_percent' ? '5%' : '0%',
      points_used: pointsUsed,
      points_discount: pointsUsed > 0 ? `$${((totalAmount - finalAmount) / 100).toFixed(2)}` : '$0.00',
      laredo_shipping_available: true,
      free_shipping_eligible: totalAmount >= 599,
      shipping_options_count: shipping_options.length,
      original_total: (totalAmount / 100).toFixed(2),
      final_total: (finalAmount / 100).toFixed(2),
      metadata: {
        total_items: totalQuantity,
        session_timestamp: new Date().toISOString(),
        price_ids_used: line_items.map(item => item.price)
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to create checkout session. Please check your product configuration and try again.'
    });
  }
};