// Script to find the missing order in Stripe
// Run this to locate the order that wasn't recorded in your database

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function findMissingOrder() {
  try {
    console.log('🔍 Searching for recent orders in Stripe...\n');
    
    // Get recent checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ['data.line_items', 'data.line_items.data.price.product']
    });
    
    console.log(`Found ${sessions.data.length} recent checkout sessions:\n`);
    
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
      
      console.log(''); // Empty line for readability
    });
    
    // Look for paid sessions that might be missing from database
    const paidSessions = sessions.data.filter(session => session.payment_status === 'paid');
    console.log(`\n✅ Found ${paidSessions.length} paid sessions that should be in your database.`);
    
    if (paidSessions.length > 0) {
      console.log('\n🔧 To recover a missing order, use:');
      console.log('   recoverMissingOrder("SESSION_ID_HERE")');
      console.log('\nExample:');
      console.log(`   recoverMissingOrder("${paidSessions[0].id}")`);
    }
    
  } catch (error) {
    console.error('❌ Error searching for orders:', error.message);
  }
}

// Usage
findMissingOrder();

module.exports = { findMissingOrder };
