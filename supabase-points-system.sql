-- SoftBrace Points System Database Setup
-- Run this script in your Supabase SQL Editor AFTER the main supabase-setup.sql

-- Create user_profiles table (if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  points_balance INTEGER DEFAULT 0,
  points_earned_total INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'shipping', -- 'shipping' or 'billing'
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- matches your product IDs
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create points_transactions table for tracking points history
CREATE TABLE IF NOT EXISTS points_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired', 'adjusted'
  points INTEGER NOT NULL, -- positive for earned, negative for redeemed/expired
  description TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE, -- when these points expire (for earned points)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for addresses
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert orders" ON orders
  FOR INSERT WITH CHECK (true); -- Allow system to create orders

CREATE POLICY "System can update orders" ON orders
  FOR UPDATE USING (true); -- Allow system to update order status

-- Create RLS policies for order_items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage order items" ON order_items
  FOR ALL USING (true); -- Allow system to manage order items

-- Create RLS policies for points_transactions
CREATE POLICY "Users can view own points transactions" ON points_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage points transactions" ON points_transactions
  FOR ALL USING (true); -- Allow system to manage points

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_expires_at ON points_transactions(expires_at);

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at 
BEFORE UPDATE ON addresses 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'SB' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('orders_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate points earned (1 point per $1 spent)
CREATE OR REPLACE FUNCTION calculate_points_earned(amount DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(amount)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to handle points expiration (2 years from earning)
CREATE OR REPLACE FUNCTION get_points_expiry_date()
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  RETURN NOW() + INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Function to get available points (excluding expired)
CREATE OR REPLACE FUNCTION get_available_points(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  available_points INTEGER;
BEGIN
  SELECT COALESCE(SUM(points), 0) INTO available_points
  FROM points_transactions
  WHERE user_id = user_uuid
    AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN available_points;
END;
$$ LANGUAGE plpgsql;

-- Function to expire old points and reduce inactive points
CREATE OR REPLACE FUNCTION process_points_expiration()
RETURNS VOID AS $$
BEGIN
  -- Expire points older than 2 years
  INSERT INTO points_transactions (user_id, type, points, description, created_at)
  SELECT 
    user_id,
    'expired',
    -points,
    'Points expired after 2 years',
    NOW()
  FROM points_transactions
  WHERE type = 'earned'
    AND expires_at < NOW()
    AND points > 0;

  -- Reduce points by 50% for users inactive for 1+ years
  INSERT INTO points_transactions (user_id, type, points, description, created_at)
  SELECT 
    up.id,
    'adjusted',
    -FLOOR(get_available_points(up.id) * 0.5),
    'Points reduced by 50% due to 1+ year inactivity',
    NOW()
  FROM user_profiles up
  WHERE up.last_activity < NOW() - INTERVAL '1 year'
    AND get_available_points(up.id) > 0;

  -- Update points_balance in user_profiles
  UPDATE user_profiles 
  SET points_balance = get_available_points(id);
END;
$$ LANGUAGE plpgsql;

-- Create a function to update user activity
CREATE OR REPLACE FUNCTION update_user_activity(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET last_activity = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- This will be replaced with real data from your app
INSERT INTO user_profiles (id, email, full_name, points_balance) VALUES 
('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User', 25)
ON CONFLICT (id) DO NOTHING;

-- Create a scheduled job to run points expiration daily (requires pg_cron extension)
-- SELECT cron.schedule('points-expiration', '0 2 * * *', 'SELECT process_points_expiration();'); 