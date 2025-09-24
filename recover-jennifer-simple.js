// Simple script to recover Jennifer's order
// Usage: node recover-jennifer-simple.js SESSION_ID

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://ebodynepuqrocggtevdw.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2R5bmVwdXFyb2NnZ3RldmR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc4OTk5MywiZXhwIjoyMDY1MzY1OTkzfQ.your_service_role_key_here'
);

async function recoverJenniferOrder(sessionId) {
  try {
    console.log(`🔄 Recovering Jennifer's order for session: ${sessionId}`);
    
    // For now, we'll create a placeholder order record
    // You'll need to get the actual session data from Stripe Dashboard
    
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-6)}`;
    
    console.log('📋 Creating order record...');
    console.log('⚠️ Note: You need to get the actual order details from Stripe Dashboard');
    console.log('   - Go to Stripe Dashboard → Payments');
    console.log('   - Find the payment from 9/14/25');
    console.log('   - Copy the shipping address and order details');
    
    // Create a basic order record (you'll need to fill in the details)
    const orderData = {
      user_id: null, // Guest order
      order_number: orderNumber,
      total_amount: 0, // You need to get this from Stripe
      subtotal: 0, // You need to get this from Stripe
      discount_amount: 0,
      points_used: 0,
      points_earned: 0,
      order_status: 'completed',
      stripe_session_id: sessionId,
      payment_status: 'paid',
      customer_email: 'jennifer@example.com', // You need to get this from Stripe
      shipping_address: {
        name: 'Jennifer [Last Name]', // You need to get this from Stripe
        address: {
          line1: '[Street Address]', // You need to get this from Stripe
          line2: '',
          city: '[City]', // You need to get this from Stripe
          state: '[State]', // You need to get this from Stripe
          postal_code: '[ZIP]', // You need to get this from Stripe
          country: 'US'
        }
      },
      created_at: new Date('2025-09-14T00:00:00Z').toISOString()
    };
    
    console.log('\n📝 Order data template:');
    console.log(JSON.stringify(orderData, null, 2));
    
    console.log('\n🔧 To complete the recovery:');
    console.log('1. Go to Stripe Dashboard → Payments');
    console.log('2. Find the payment from 9/14/25 for customer gcus_1S7EECFsjDil30gTGq96Q8un');
    console.log('3. Copy the shipping address and order details');
    console.log('4. Update the orderData object above with the real data');
    console.log('5. Run the insert command manually');
    
    // Uncomment and modify this when you have the real data:
    /*
    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating order:', error);
    } else {
      console.log('✅ Order created successfully:', order);
    }
    */
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get session ID from command line argument
const sessionId = process.argv[2];

if (!sessionId) {
  console.log('❌ Please provide a session ID');
  console.log('Usage: node recover-jennifer-simple.js SESSION_ID');
  console.log('');
  console.log('To get the session ID:');
  console.log('1. Go to Stripe Dashboard → Payments');
  console.log('2. Find the payment from 9/14/25');
  console.log('3. Copy the session ID (starts with cs_)');
  process.exit(1);
}

recoverJenniferOrder(sessionId);
