// Complete script to find and recover missing orders
// Run this with: node find-and-recover-order.js

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
  const timestamp = Date.now().toString().slice(-6);
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

async function findMissingOrders() {
  try {
    console.log('🔍 Searching for recent orders in Stripe...\n');
    
    // Get recent checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 20,
      expand: ['data.line_items', 'data.line_items.data.price.product']
    });
    
    console.log(`Found ${sessions.data.length} recent checkout sessions:\n`);
    
    const paidSessions = [];
    
    sessions.data.forEach((session, index) => {
      console.log(`📋 Session ${index + 1}:`);
      console.log(`   ID: ${session.id}`);
      console.log(`   Status: ${session.payment_status}`);
      console.log(`   Amount: $${(session.amount_total / 100).toFixed(2)}`);
      console.log(`   Customer Email: ${session.customer_email || 'Not provided'}`);
      console.log(`   Created: ${new Date(session.created * 1000).toLocaleString()}`);
      
      // Check if this looks like a guest order
      const isGuestOrder = !session.metadata?.user_id || session.metadata.user_id === 'guest';
      if (isGuestOrder) {
        console.log(`   🎯 GUEST ORDER DETECTED!`);
      }
      
      // Show shipping address if available
      if (session.shipping_details) {
        console.log(`   📍 Shipping Address:`);
        console.log(`      Name: ${session.shipping_details.name}`);
        console.log(`      Address: ${session.shipping_details.address.line1}`);
        if (session.shipping_details.address.line2) {
          console.log(`      Line 2: ${session.shipping_details.address.line2}`);
        }
        console.log(`      City: ${session.shipping_details.address.city}`);
        console.log(`      State: ${session.shipping_details.address.state}`);
        console.log(`      ZIP: ${session.shipping_details.address.postal_code}`);
        console.log(`      Country: ${session.shipping_details.address.country}`);
      } else {
        console.log(`   📍 No shipping address found`);
      }
      
      // Show line items
      if (session.line_items && session.line_items.data.length > 0) {
        console.log(`   🛒 Items:`);
        session.line_items.data.forEach(item => {
          console.log(`      - ${item.description} (Qty: ${item.quantity}) - $${(item.amount_total / 100).toFixed(2)}`);
        });
      }
      
      // Check if this session is in our database
      if (session.payment_status === 'paid') {
        paidSessions.push(session);
      }
      
      console.log(''); // Empty line for readability
    });
    
    console.log(`\n✅ Found ${paidSessions.length} paid sessions that should be in your database.`);
    
    // Check which paid sessions are missing from database
    const missingSessions = [];
    
    for (const session of paidSessions) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();
      
      if (!existingOrder) {
        missingSessions.push(session);
        console.log(`❌ MISSING: Session ${session.id} ($${(session.amount_total / 100).toFixed(2)})`);
      } else {
        console.log(`✅ FOUND: Session ${session.id} already in database`);
      }
    }
    
    if (missingSessions.length > 0) {
      console.log(`\n🚨 Found ${missingSessions.length} missing orders!`);
      console.log('\n🔧 To recover a missing order, use:');
      console.log('   recoverMissingOrder("SESSION_ID_HERE")');
      console.log('\nExample:');
      console.log(`   recoverMissingOrder("${missingSessions[0].id}")`);
      
      return missingSessions;
    } else {
      console.log('\n✅ All paid sessions are already in your database!');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error searching for orders:', error.message);
    return [];
  }
}

async function recoverMissingOrder(sessionId) {
  try {
    console.log(`🔄 Recovering order for session: ${sessionId}`);
    
    // 1. Get the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product']
    });
    
    console.log('Session details:', {
      id: session.id,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      metadata: session.metadata
    });
    
    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }
    
    // 2. Extract metadata
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
    
    // 3. Determine if this is a guest order
    const isGuestUser = !user_id || user_id === 'guest';
    
    // 4. Generate order number
    const orderNumber = generateOrderNumber();
    
    // 5. Calculate amounts
    const totalAmount = parseFloat(session.amount_total) / 100;
    const pointsUsedInt = parseInt(points_used) || 0;
    const pointsEarnedInt = parseInt(points_earned) || 0;
    
    console.log('Order details:', {
      orderNumber,
      userId: user_id,
      isGuestUser,
      totalAmount,
      pointsUsed: pointsUsedInt,
      pointsEarned: pointsEarnedInt,
      orderType: order_type
    });
    
    // 6. Create order record
    const orderInsertData = {
      user_id: isGuestUser ? null : user_id,
      order_number: orderNumber,
      total_amount: totalAmount,
      subtotal: parseFloat(original_total_cents) / 100,
      discount_amount: discount_type === '5_percent' ? totalAmount * 0.05 : 0,
      points_used: pointsUsedInt,
      points_earned: pointsEarnedInt,
      order_status: 'completed',
      stripe_session_id: session.id,
      payment_status: 'paid',
      created_at: new Date().toISOString()
    };
    
    // Add customer email for guest users
    if (isGuestUser && session.customer_email) {
      orderInsertData.customer_email = session.customer_email;
    }

    // Add shipping address (available for both guest and registered users)
    if (session.shipping_details) {
      orderInsertData.shipping_address = {
        name: session.shipping_details.name,
        address: {
          line1: session.shipping_details.address.line1,
          line2: session.shipping_details.address.line2,
          city: session.shipping_details.address.city,
          state: session.shipping_details.address.state,
          postal_code: session.shipping_details.address.postal_code,
          country: session.shipping_details.address.country
        }
      };
    }

    // Add customer details if available
    if (session.customer_details) {
      orderInsertData.billing_address = {
        name: session.customer_details.name,
        email: session.customer_details.email,
        address: session.customer_details.address ? {
          line1: session.customer_details.address.line1,
          line2: session.customer_details.address.line2,
          city: session.customer_details.address.city,
          state: session.customer_details.address.state,
          postal_code: session.customer_details.address.postal_code,
          country: session.customer_details.address.country
        } : null
      };
    }
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsertData)
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    
    console.log('✅ Order created successfully:', orderData);
    
    // 7. Get line items and create order_items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });
    
    console.log('Processing line items:', lineItems.data.length);
    
    for (const item of lineItems.data) {
      const priceId = item.price.id;
      const productId = await getProductIdFromPriceId(priceId);
      
      if (!productId) {
        console.warn(`Could not find product for price ID: ${priceId}`);
        continue;
      }
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: productId,
          quantity: item.quantity,
          unit_price: item.price.unit_amount / 100,
          total_price: (item.price.unit_amount * item.quantity) / 100
        });
      
      if (itemError) {
        console.error('Error creating order item:', itemError);
      } else {
        console.log(`✅ Order item created for product ${productId}`);
      }
    }
    
    // 8. Award points for registered users only
    if (!isGuestUser && pointsEarnedInt > 0) {
      console.log(`🎁 Awarding ${pointsEarnedInt} points to user ${user_id}`);
      
      const { error: pointsError } = await supabase.rpc('award_points_for_order', {
        user_uuid: user_id,
        order_amount: parseFloat(original_total_cents) / 100,
        order_ref: orderNumber
      });
      
      if (pointsError) {
        console.error('Error awarding points:', pointsError);
      } else {
        console.log('✅ Points awarded successfully');
      }
    }
    
    console.log('🎉 Order recovery completed successfully!');
    console.log('📍 Shipping address:', orderInsertData.shipping_address);
    return orderData;
    
  } catch (error) {
    console.error('❌ Error recovering order:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting order recovery process...\n');
  
  try {
    // First, find missing orders
    const missingSessions = await findMissingOrders();
    
    if (missingSessions.length > 0) {
      console.log(`\n🔄 Found ${missingSessions.length} missing orders. Recovering...\n`);
      
      for (const session of missingSessions) {
        try {
          await recoverMissingOrder(session.id);
          console.log(`\n✅ Successfully recovered order: ${session.id}\n`);
        } catch (error) {
          console.error(`❌ Failed to recover order ${session.id}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Order recovery process completed!');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Export functions for individual use
module.exports = { findMissingOrders, recoverMissingOrder };

// Run if called directly
if (require.main === module) {
  main();
}
