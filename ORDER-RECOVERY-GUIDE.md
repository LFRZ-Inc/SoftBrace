# Order Recovery Guide - Fix Missing Orders

## 🚨 **Issue Identified**

Your webhook was **skipping guest orders entirely**. When someone places an order without being logged in, the payment processes in Stripe but no order is created in your database.

## 🔧 **Immediate Fix Steps**

### 1. **Update Database Schema**
Run this SQL script in your Supabase SQL Editor:

```sql
-- Run the contents of database-schema-update.sql
```

This adds missing fields that your webhook needs:
- `order_status`, `stripe_session_id`, `verification_status`
- `fulfillment_status`, `requires_manual_review`, `review_reason`
- `customer_email` (for guest orders)
- `unit_price`, `total_price` in order_items
- `products` table with `stripe_price_id` mapping

### 2. **Deploy Updated Webhook**
The webhook code has been fixed to:
- ✅ Process both guest and registered user orders
- ✅ Store guest orders with `user_id = null` and `customer_email`
- ✅ Skip points awarding for guest users (appropriate behavior)
- ✅ Handle all order types properly

### 3. **Find and Recover Missing Order**

#### Step 1: Find the Missing Order
Run this script to locate the missing order:

```javascript
// Find the missing order in Stripe
const { findMissingOrder } = require('./find-missing-order.js');
findMissingOrder();
```

This will show you:
- All recent checkout sessions
- Which ones are paid (should be in your database)
- **Shipping addresses** for each order
- Customer email addresses
- Order details and line items

#### Step 2: Recover the Order with Address
Once you find the missing order, recover it with full address data:

```javascript
// Recover the missing order with shipping address
const { recoverMissingOrder } = require('./recover-missing-order.js');

// Replace with actual session ID from the find script
recoverMissingOrder('cs_test_...')
  .then(order => {
    console.log('Order recovered with address:', order);
    console.log('Shipping address:', order.shipping_address);
  })
  .catch(error => console.error('Recovery failed:', error));
```

#### Alternative: Manual Recovery via Stripe Dashboard
1. Go to Stripe Dashboard → Payments
2. Find the missing order (look for recent paid orders)
3. Click on the payment to see details
4. Copy the session ID (starts with `cs_`)
5. Use the recovery script above

### 4. **Verify Fix**
After deploying the updated webhook:
1. Test with a guest checkout
2. Verify order appears in your database
3. Check that payment status is recorded correctly

## 📧 **Email Access Issue**

For your Google Workspace payment issue:

### Immediate Solutions:
1. **Contact Google Support** - They can help restore access even with payment issues
2. **Use Alternative Email** - Update Stripe webhook notifications to a working email
3. **Check Stripe Dashboard** - All order notifications should be visible there

### Long-term Fix:
1. Resolve Google Workspace payment
2. Update all business email configurations
3. Set up backup notification systems

## 🔍 **Prevention Measures**

### 1. **Monitor Webhook Health**
- Check Stripe Dashboard → Webhooks for failed deliveries
- Set up alerts for webhook failures
- Monitor your application logs

### 2. **Test Regularly**
- Test both guest and registered user checkouts
- Verify orders appear in database
- Check that all order data is captured correctly

### 3. **Backup Systems**
- Regular database backups
- Stripe webhook retry mechanisms
- Manual order recovery procedures

## 📊 **Database Verification**

After running the schema update, verify these tables exist with correct fields:

```sql
-- Check orders table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check for recent orders
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check products table
SELECT * FROM products;
```

## 🚀 **Next Steps**

1. **Immediate**: Run database schema update
2. **Deploy**: Updated webhook code
3. **Recover**: Missing order using recovery script
4. **Test**: Guest checkout to verify fix
5. **Monitor**: Webhook health going forward

## 📞 **Support**

If you need help with any of these steps:
1. Check the recovery script logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure Supabase service key has proper permissions
4. Test webhook endpoint manually if needed

---

**Note**: This fix ensures all future orders (both guest and registered) will be properly recorded in your database. The webhook now handles both user types appropriately.
