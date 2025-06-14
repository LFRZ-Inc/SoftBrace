# Stripe Integration Testing Guide

## 🎯 **Pre-Testing Setup**

### 1. **Stripe Dashboard Configuration**
- [ ] Create products in Stripe Dashboard with exact names and prices
- [ ] Update `stripe-price-ids-update.sql` with actual price IDs
- [ ] Run the SQL script in Supabase to update products table
- [ ] Verify all products have `stripe_price_id` values

### 2. **Environment Variables**
Ensure these are set in your deployment environment:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...
```

### 3. **Webhook Endpoint**
- [ ] Configure webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/webhook`
- [ ] Enable `checkout.session.completed` event
- [ ] Test webhook endpoint responds to Stripe

---

## 🧪 **Test Scenarios**

### **Scenario 1: Guest User Purchase**
**Expected Behavior**: Order not recorded in database (no user_id)

1. **Setup**: Log out of any user account
2. **Action**: Add items to cart and checkout
3. **Verify**: 
   - [ ] Payment processes successfully
   - [ ] No order created in `orders` table
   - [ ] No points awarded
   - [ ] Webhook logs "Skipping order creation for guest user"

### **Scenario 2: Registered User - Regular Purchase**
**Expected Behavior**: Order recorded, points awarded, 5% discount applied

1. **Setup**: Login as registered user
2. **Action**: Add 5-Pair Pack ($4.99) to cart, checkout with account discount
3. **Verify**:
   - [ ] 5% discount applied ($0.25 off)
   - [ ] Order created in `orders` table with correct details
   - [ ] 4 points awarded (FLOOR($4.99) = 4)
   - [ ] `points_transactions` record created
   - [ ] User's `points_balance` updated
   - [ ] `order_items` created correctly

### **Scenario 3: Points Redemption**
**Expected Behavior**: Points deducted, free product, remaining amount charged

1. **Setup**: User with 50+ points
2. **Action**: Add 5-Pair Pack to cart, redeem 50 points
3. **Verify**:
   - [ ] 50 points deducted from balance
   - [ ] $4.99 discount applied (free 5-pack)
   - [ ] Order total = $0.00 (plus shipping/tax if applicable)
   - [ ] Order created with `points_used = 50`
   - [ ] Points redemption transaction recorded
   - [ ] No account discount applied (mutually exclusive)

### **Scenario 4: Partial Points Redemption**
**Expected Behavior**: Points used for discount, remaining amount charged

1. **Setup**: User with 50+ points
2. **Action**: Add 15-Pair Pack ($10.99) + 5-Pair Pack ($4.99), redeem 50 points
3. **Verify**:
   - [ ] 50 points deducted
   - [ ] $4.99 discount applied
   - [ ] Final total = $10.99 (15-pack only)
   - [ ] Points earned = 15 (based on original $15.98 total)

### **Scenario 5: Multiple Items Purchase**
**Expected Behavior**: All items recorded separately, correct points calculation

1. **Setup**: Registered user
2. **Action**: Add multiple different products, checkout
3. **Verify**:
   - [ ] All products appear in `order_items` table
   - [ ] Correct quantities and prices recorded
   - [ ] Points earned = FLOOR(total_amount)
   - [ ] Product IDs correctly resolved from Stripe price IDs

### **Scenario 6: Failed Payment**
**Expected Behavior**: No order created, no points awarded

1. **Setup**: Use Stripe test card that fails (4000000000000002)
2. **Action**: Attempt checkout
3. **Verify**:
   - [ ] Payment fails at Stripe
   - [ ] No order created in database
   - [ ] No points awarded
   - [ ] User returned to cart with error message

---

## 🔍 **Debugging & Monitoring**

### **Webhook Logs**
Monitor these logs during testing:
```bash
# Check webhook processing
console.log('Processing completed checkout session:', session.id);
console.log('Order details:', { orderNumber, userId, totalAmount, ... });
console.log('Order created successfully:', orderData);
console.log('Points awarded successfully');
```

### **Database Verification Queries**
```sql
-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check order items for specific order
SELECT oi.*, p.name 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
WHERE oi.order_id = [ORDER_ID];

-- Check points transactions
SELECT * FROM points_transactions 
WHERE user_id = '[USER_ID]' 
ORDER BY created_at DESC;

-- Check user points balance
SELECT points_balance, total_points_earned 
FROM user_profiles 
WHERE id = '[USER_ID]';
```

### **Common Issues & Solutions**

**Issue**: Products not found by price ID
- **Solution**: Verify `stripe_price_id` values in products table match Stripe Dashboard

**Issue**: Points not awarded
- **Solution**: Check webhook logs, verify `award_points_for_order` function works

**Issue**: Order items not created
- **Solution**: Verify Stripe line items expansion, check product ID resolution

**Issue**: Webhook signature verification fails
- **Solution**: Verify `STRIPE_WEBHOOK_SECRET` environment variable

---

## ✅ **Launch Readiness Checklist**

- [ ] All 6 test scenarios pass
- [ ] Webhook processes orders correctly
- [ ] Points system works end-to-end
- [ ] Database records are accurate
- [ ] Error handling works properly
- [ ] User dashboard shows correct data
- [ ] Admin activity logging captures orders
- [ ] Email confirmations sent (if implemented)

---

## 🚀 **Production Deployment**

1. **Switch to Production Keys**
   - Replace test Stripe keys with production keys
   - Update webhook endpoint to production URL

2. **Final Verification**
   - Test with small real purchase
   - Verify all systems work in production
   - Monitor logs for any issues

3. **Go Live**
   - Enable production mode
   - Monitor first few orders closely
   - Have rollback plan ready if needed 