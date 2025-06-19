// Vercel Serverless Function for Stripe webhooks
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper function to generate unique order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `ORD-${year}${month}${day}-${timestamp}`;
}

// Helper function to resolve product ID from Stripe price ID
async function getProductIdFromPriceId(stripePriceId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('stripe_price_id', stripePriceId)
      .single();
    
    if (error) {
      console.error('Error finding product by price ID:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error in getProductIdFromPriceId:', error);
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing stripe signature or webhook secret' });
  }

  let event;

  try {
    // Use raw body from Vercel
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Processing completed checkout session:', session.id);
        
        // Extract metadata
        const {
          user_id,
          user_email,
          points_used,
          points_earned,
          order_type,
          discount_type,
          original_total_cents,
          final_total_cents
        } = session.metadata;

        // Skip processing for guest users (no user_id)
        if (!user_id || user_id === 'guest') {
          console.log('Skipping order creation for guest user');
          break;
        }

        // Generate unique order number
        const orderNumber = generateOrderNumber();
        
        // Calculate amounts
        const totalAmount = parseFloat(session.amount_total) / 100; // Convert from cents
        const pointsUsedInt = parseInt(points_used) || 0;
        const pointsEarnedInt = parseInt(points_earned) || 0;

        console.log('Order details:', {
          orderNumber,
          userId: user_id,
          totalAmount,
          pointsUsed: pointsUsedInt,
          pointsEarned: pointsEarnedInt,
          orderType: order_type
        });

        // 1. Create order record
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user_id,
            order_number: orderNumber,
            total_amount: totalAmount,
            subtotal: parseFloat(original_total_cents) / 100,
            discount_amount: discount_type === '5_percent' ? totalAmount * 0.05 : 0,
            points_used: pointsUsedInt,
            points_earned: pointsEarnedInt,
            order_status: 'completed',
            stripe_session_id: session.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
          throw new Error(`Failed to create order: ${orderError.message}`);
        }

        console.log('Order created successfully:', orderData);

        // 2. Get line items from Stripe session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        });

        console.log('Processing line items:', lineItems.data.length);

        // 3. Create order_items records and check for 100-pack bonus
        let has100Pack = false;
        let total100PackQuantity = 0;
        let hasFivePack = false;
        let fivePackQuantity = 0;
        let orderNeedsReview = false;
        let reviewReasons = [];
        
        for (const item of lineItems.data) {
          const priceId = item.price.id;
          const productId = await getProductIdFromPriceId(priceId);
          
          if (!productId) {
            console.warn(`Could not find product for price ID: ${priceId}`);
            continue;
          }

          // Check if this is the 100-pack (price ID: price_1RMj9ZFsjDil30gT1wiMK8Td)
          if (priceId === 'price_1RMj9ZFsjDil30gT1wiMK8Td') {
            has100Pack = true;
            total100PackQuantity += item.quantity;
            console.log(`100-Pack detected! Quantity: ${item.quantity}`);
          }

          // Check if this is a 5-pack (price ID: price_1RLy6LFsjDil30gTU9kEFoTt)
          if (priceId === 'price_1RLy6LFsjDil30gTU9kEFoTt') {
            hasFivePack = true;
            fivePackQuantity += item.quantity;
            console.log(`5-Pack detected! Quantity: ${item.quantity}`);
          }

          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: orderData.id,
              product_id: productId,
              quantity: item.quantity,
              unit_price: item.price.unit_amount / 100, // Convert from cents
              total_price: (item.price.unit_amount * item.quantity) / 100
            });

          if (itemError) {
            console.error('Error creating order item:', itemError);
            // Continue processing other items even if one fails
          } else {
            console.log(`Order item created for product ${productId}`);
          }
        }

        // Determine verification status and review requirements
        let verificationStatus = 'verified'; // Default to verified
        
        // Check conditions that require manual review
        if (hasFivePack && totalAmount < 5.99) {
          // 5-pack under free shipping threshold - needs tracking verification
          orderNeedsReview = true;
          reviewReasons.push('5-pack order under $5.99 - verify non-trackable shipping');
          verificationStatus = 'needs_review';
        }
        
        if (totalAmount > 100) {
          // Large orders - verify for bulk discounts or wholesale
          orderNeedsReview = true;
          reviewReasons.push('Large order value - verify customer intent');
          verificationStatus = 'needs_review';
        }
        
        if (pointsUsedInt > 100) {
          // High points usage - verify account legitimacy
          orderNeedsReview = true;
          reviewReasons.push('High points usage - verify account legitimacy');
          verificationStatus = 'needs_review';
        }
        
        // Update order with verification information
        const { error: verificationError } = await supabase
          .from('orders')
          .update({
            verification_status: verificationStatus,
            fulfillment_status: orderNeedsReview ? 'pending' : 'processing',
            requires_manual_review: orderNeedsReview,
            review_reason: reviewReasons.join('; ') || null
          })
          .eq('id', orderData.id);

        if (verificationError) {
          console.error('Error updating order verification:', verificationError);
        } else {
          console.log(`Order verification updated: ${verificationStatus}, Review needed: ${orderNeedsReview}`);
        }

        // 4. Award points using Supabase function (only if points were earned)
        if (pointsEarnedInt > 0) {
          console.log(`Awarding ${pointsEarnedInt} points to user ${user_id}`);
          
          const { error: pointsError } = await supabase.rpc('award_points_for_order', {
            user_uuid: user_id,
            order_amount: parseFloat(original_total_cents) / 100, // Use original total for points calculation
            order_ref: orderNumber
          });

          if (pointsError) {
            console.error('Error awarding points:', pointsError);
            // Don't throw error - order is still valid even if points fail
          } else {
            console.log('Points awarded successfully');
          }
        }

        // 5. Award bonus points for 100-pack purchases (50 points per 100-pack)
        if (has100Pack && total100PackQuantity > 0) {
          const bonusPoints = total100PackQuantity * 50; // 50 points per 100-pack
          console.log(`Awarding ${bonusPoints} bonus points for ${total100PackQuantity} x 100-pack(s)`);
          
          const { error: bonusPointsError } = await supabase
            .from('points_transactions')
            .insert({
              user_id: user_id,
              transaction_type: 'earned',
              points_amount: bonusPoints,
              description: `Bonus points for ${total100PackQuantity} x 100-Pack purchase (Order: ${orderNumber})`,
              order_reference: orderNumber,
              expires_at: new Date(Date.now() + (2 * 365 * 24 * 60 * 60 * 1000)).toISOString() // 2 years from now
            });

          if (bonusPointsError) {
            console.error('Error awarding bonus points:', bonusPointsError);
          } else {
            console.log(`Bonus points awarded successfully: ${bonusPoints} points`);
            
            // Update the order record to reflect total points earned (including bonus)
            const totalPointsEarned = pointsEarnedInt + bonusPoints;
            await supabase
              .from('orders')
              .update({ points_earned: totalPointsEarned })
              .eq('id', orderData.id);
          }
        }

        // 6. Update user's total points earned
        const { error: balanceError } = await supabase.rpc('update_user_points_balance', {
          user_uuid: user_id
        });

        if (balanceError) {
          console.error('Error updating user points balance:', balanceError);
        } else {
          console.log('User points balance updated');
        }

        // 7. TODO: Send confirmation email (future enhancement)
        console.log('Order processing completed successfully for:', orderNumber);
        
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    console.error('Full error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
};

// Helper to read the request body
async function buffer(req) {
  const chunks = [];
  
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  
  return Buffer.concat(chunks);
} 