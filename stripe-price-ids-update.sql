-- Stripe Price IDs Update Script
-- Run this after creating products in Stripe Dashboard
-- Replace 'price_xxx' with actual Stripe price IDs from your dashboard

-- Update 5-Pair SoftBrace Strips ($4.99)
UPDATE products 
SET stripe_price_id = 'price_xxx_5_pair_softbrace' 
WHERE id = 1 AND name = '5-Pair SoftBrace Strips';

-- Update 15-Pair SoftBrace Strips ($10.99)
UPDATE products 
SET stripe_price_id = 'price_xxx_15_pair_softbrace' 
WHERE id = 2 AND name = '15-Pair SoftBrace Strips';

-- Update 31-Pair SoftBrace Strips ($16.99)
UPDATE products 
SET stripe_price_id = 'price_xxx_31_pair_softbrace' 
WHERE id = 3 AND name = '31-Pair SoftBrace Strips';

-- Update SoftWax ($3.99)
UPDATE products 
SET stripe_price_id = 'price_xxx_softwax' 
WHERE id = 4 AND name = 'SoftWax';

-- Update SoftWax + 5-Pair Bundle ($8.99)
UPDATE products 
SET stripe_price_id = 'price_xxx_bundle_softwax_5pair' 
WHERE id = 6 AND name = 'SoftWax + 5-Pair SoftBrace Strips Bundle';

-- Verify the updates
SELECT id, name, price, stripe_price_id 
FROM products 
ORDER BY id;

-- INSTRUCTIONS:
-- 1. Create products in Stripe Dashboard with these exact names and prices:
--    - "5-Pair SoftBrace Strips" - $4.99
--    - "15-Pair SoftBrace Strips" - $10.99  
--    - "31-Pair SoftBrace Strips" - $16.99
--    - "SoftWax" - $3.99
--    - "SoftWax + 5-Pair SoftBrace Strips Bundle" - $8.99
--
-- 2. Copy the price IDs from Stripe Dashboard (they start with 'price_')
--
-- 3. Replace the 'price_xxx_...' placeholders above with actual price IDs
--
-- 4. Run this script in Supabase SQL Editor
--
-- 5. Verify all products have stripe_price_id values set 