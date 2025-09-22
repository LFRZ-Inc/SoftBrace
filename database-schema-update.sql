-- Database Schema Update for Missing Order Fields
-- Run this in your Supabase SQL Editor to add missing fields

-- Add missing fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified',
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS requires_manual_review BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS review_reason TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Add missing fields to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- Add missing fields to points_transactions table
ALTER TABLE points_transactions 
ADD COLUMN IF NOT EXISTS order_reference TEXT,
ADD COLUMN IF NOT EXISTS transaction_type TEXT DEFAULT 'earned';

-- Create products table if it doesn't exist (referenced in webhook)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for products (public read access)
CREATE POLICY IF NOT EXISTS "Allow public read access on products" 
ON products FOR SELECT 
TO public 
USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_verification_status ON orders(verification_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_products_stripe_price_id ON products(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_order_reference ON points_transactions(order_reference);

-- Update the points_transactions table to use the correct column names
-- (The webhook uses 'transaction_type' but some schemas use 'type')
DO $$
BEGIN
    -- Check if 'type' column exists and rename it to 'transaction_type' if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'points_transactions' 
               AND column_name = 'type' 
               AND table_schema = 'public') THEN
        ALTER TABLE points_transactions RENAME COLUMN type TO transaction_type;
    END IF;
    
    -- Check if 'points' column exists and rename it to 'points_amount' if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'points_transactions' 
               AND column_name = 'points' 
               AND table_schema = 'public') THEN
        ALTER TABLE points_transactions RENAME COLUMN points TO points_amount;
    END IF;
END $$;

-- Success message
SELECT 'Database schema updated successfully! Missing fields added to orders, order_items, and points_transactions tables.' as status;
