// Script to find Jennifer's order using customer ID
// Run this with: node find-jennifer-by-customer-id.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function findJenniferByCustomerId() {
  try {
    const customerId = 'gcus_1S7EECFsjDil30gTGq96Q8un';
    
    console.log(`🔍 Searching for orders by customer ID: ${customerId}\n`);
    
    // First, get the customer details
    try {
      const customer = await stripe.customers.retrieve(customerId);
      console.log('👤 Customer Details:');
      console.log(`   ID: ${customer.id}`);
      console.log(`   Email: ${customer.email || 'No email'}`);
      console.log(`   Name: ${customer.name || 'No name'}`);
      console.log(`   Created: ${new Date(customer.created * 1000).toLocaleString()}`);
      console.log('');
    } catch (customerError) {
      console.log('⚠️ Could not retrieve customer details:', customerError.message);
      console.log('');
    }
    
    // Search for checkout sessions by customer
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price.product']
    });
    
    console.log(`Found ${sessions.data.length} total sessions. Filtering for customer ${customerId}...\n`);
    
    const jenniferSessions = sessions.data.filter(session => 
      session.customer === customerId
    );
    
    if (jenniferSessions.length > 0) {
      console.log(`🎉 Found ${jenniferSessions.length} session(s) for customer ${customerId}:\n`);
      
      jenniferSessions.forEach((session, index) => {
        console.log(`📋 Session ${index + 1}:`);
        console.log(`   ID: ${session.id}`);
        console.log(`   Status: ${session.payment_status}`);
        console.log(`   Amount: $${(session.amount_total / 100).toFixed(2)}`);
        console.log(`   Customer Email: ${session.customer_email || 'Not provided'}`);
        console.log(`   Created: ${new Date(session.created * 1000).toLocaleString()}`);
        
        // Check if this is from 9/14/25
        const sessionDate = new Date(session.created * 1000);
        const isTargetDate = sessionDate.toISOString().startsWith('2025-09-14');
        if (isTargetDate) {
          console.log(`   🎯 MATCHES 9/14/25 DATE!`);
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
        
        // Show metadata
        if (session.metadata && Object.keys(session.metadata).length > 0) {
          console.log(`   📝 Metadata:`);
          Object.entries(session.metadata).forEach(([key, value]) => {
            console.log(`      ${key}: ${value}`);
          });
        }
        
        console.log(''); // Empty line for readability
      });
      
      // Find the session from 9/14/25
      const targetSession = jenniferSessions.find(session => {
        const sessionDate = new Date(session.created * 1000);
        return sessionDate.toISOString().startsWith('2025-09-14');
      });
      
      if (targetSession) {
        console.log(`\n🎯 FOUND JENNIFER'S ORDER FROM 9/14/25!`);
        console.log(`\n📋 Order Details:`);
        console.log(`   Session ID: ${targetSession.id}`);
        console.log(`   Payment Status: ${targetSession.payment_status}`);
        console.log(`   Amount: $${(targetSession.amount_total / 100).toFixed(2)}`);
        console.log(`   Email: ${targetSession.customer_email}`);
        
        if (targetSession.shipping_details) {
          console.log(`   📍 Full Shipping Address:`);
          console.log(`      ${targetSession.shipping_details.name}`);
          console.log(`      ${targetSession.shipping_details.address.line1}`);
          if (targetSession.shipping_details.address.line2) {
            console.log(`      ${targetSession.shipping_details.address.line2}`);
          }
          console.log(`      ${targetSession.shipping_details.address.city}, ${targetSession.shipping_details.address.state} ${targetSession.shipping_details.address.postal_code}`);
          console.log(`      ${targetSession.shipping_details.address.country}`);
        }
        
        console.log(`\n🔧 To recover this order, run:`);
        console.log(`   node -e "const {recoverMissingOrder} = require('./find-and-recover-order.js'); recoverMissingOrder('${targetSession.id}').then(order => console.log('Order recovered:', order)).catch(err => console.error('Error:', err));"`);
        
        return targetSession;
      } else {
        console.log(`\n❌ No sessions found from 9/14/25 for this customer`);
        console.log(`\nAvailable dates:`);
        jenniferSessions.forEach(session => {
          const sessionDate = new Date(session.created * 1000);
          console.log(`   - ${sessionDate.toISOString().split('T')[0]}: ${session.id} - $${(session.amount_total / 100).toFixed(2)}`);
        });
      }
    } else {
      console.log(`❌ No sessions found for customer ${customerId}`);
      console.log(`\nThis could mean:`);
      console.log(`1. The customer ID is incorrect`);
      console.log(`2. The customer hasn't made any purchases`);
      console.log(`3. The sessions are in a different Stripe account`);
    }
    
  } catch (error) {
    console.error('❌ Error searching for Jennifer order:', error.message);
    
    if (error.message.includes('No such customer')) {
      console.log('\n💡 The customer ID might be incorrect or from a different Stripe account.');
    } else if (error.message.includes('Invalid API key')) {
      console.log('\n💡 You need to set up your Stripe environment variables:');
      console.log('1. Create a .env file in your project root');
      console.log('2. Add: STRIPE_SECRET_KEY=sk_test_your_secret_key_here');
    }
  }
}

// Run the search
findJenniferByCustomerId();
