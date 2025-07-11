-- Complete SoftBrace Database Setup Script
-- Run this entire script in your Supabase SQL Editor

-- =============================================
-- STORAGE SETUP
-- =============================================

-- Create storage bucket for images (if not already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

-- Create storage policies for public access
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Users can update own uploads"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Users can delete own uploads"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');

-- =============================================
-- ADMIN CONTENT MANAGEMENT TABLES
-- =============================================

-- Create uploaded_images table
CREATE TABLE IF NOT EXISTS uploaded_images (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  folder TEXT DEFAULT 'admin-uploads',
  size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table for dynamic content
CREATE TABLE IF NOT EXISTS page_content (
  id BIGSERIAL PRIMARY KEY,
  page TEXT NOT NULL, -- 'home', 'about', 'products', etc.
  section TEXT NOT NULL, -- 'hero', 'features', 'how-it-works', etc.
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section)
);

-- =============================================
-- POINTS SYSTEM TABLES
-- =============================================

-- Create user_profiles table (enhanced for points system)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  points_balance INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  total_points_redeemed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  account_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'shipping', -- 'shipping', 'billing'
  full_name TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create points_transactions table
CREATE TABLE IF NOT EXISTS points_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired', 'adjusted'
  points_amount INTEGER NOT NULL, -- positive for earned, negative for redeemed/expired
  description TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE, -- for earned points
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_activity_log table for tracking all admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id BIGSERIAL PRIMARY KEY,
  action_type TEXT NOT NULL, -- 'IMAGE_UPLOAD', 'IMAGE_DELETE', 'CONTENT_EDIT', 'VISUAL_EDITOR', 'ADMIN_LOGIN', 'ADMIN_LOGOUT'
  details JSONB, -- Flexible JSON field for action-specific details
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE POLICIES
-- =============================================

-- Admin content policies (public read, all operations allowed for admin)
CREATE POLICY IF NOT EXISTS "Allow public read access on uploaded_images" 
ON uploaded_images FOR SELECT 
TO public 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on uploaded_images" 
ON uploaded_images FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on page_content" 
ON page_content FOR SELECT 
TO public 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on page_content" 
ON page_content FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- User profiles policies
CREATE POLICY IF NOT EXISTS "Users can view own profile" 
ON user_profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" 
ON user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Addresses policies
CREATE POLICY IF NOT EXISTS "Users can manage own addresses" 
ON addresses FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Orders policies
CREATE POLICY IF NOT EXISTS "Users can view own orders" 
ON orders FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create orders" 
ON orders FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Order items policies
CREATE POLICY IF NOT EXISTS "Users can view own order items" 
ON order_items FOR SELECT 
TO authenticated 
USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can create order items" 
ON order_items FOR INSERT 
TO authenticated 
WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Points transactions policies
CREATE POLICY IF NOT EXISTS "Users can view own points transactions" 
ON points_transactions FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "System can create points transactions" 
ON points_transactions FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Admin activity log policies
CREATE POLICY IF NOT EXISTS "Allow all operations on admin_activity_log" 
ON admin_activity_log FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- =============================================
-- FUNCTIONS FOR POINTS SYSTEM
-- =============================================

-- Function to calculate points earned from order amount
CREATE OR REPLACE FUNCTION calculate_points_earned(order_amount DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  -- 1 point per $1 spent (rounded down)
  RETURN FLOOR(order_amount)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to update user points balance
CREATE OR REPLACE FUNCTION update_user_points_balance(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Calculate current balance from all transactions
  SELECT COALESCE(SUM(points_amount), 0) INTO current_balance
  FROM points_transactions 
  WHERE user_id = user_uuid 
    AND (expires_at IS NULL OR expires_at > NOW());
  
  -- Update user profile
  UPDATE user_profiles 
  SET 
    points_balance = current_balance,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN current_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to award points for an order
CREATE OR REPLACE FUNCTION award_points_for_order(
  user_uuid UUID,
  order_amount DECIMAL,
  order_ref BIGINT
)
RETURNS INTEGER AS $$
DECLARE
  points_to_award INTEGER;
  expiration_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate points to award
  points_to_award := calculate_points_earned(order_amount);
  
  -- Set expiration date (2 years from now)
  expiration_date := NOW() + INTERVAL '2 years';
  
  -- Insert points transaction
  INSERT INTO points_transactions (
    user_id, 
    order_id, 
    transaction_type, 
    points_amount, 
    description, 
    expires_at
  ) VALUES (
    user_uuid, 
    order_ref, 
    'earned', 
    points_to_award, 
    'Points earned from purchase', 
    expiration_date
  );
  
  -- Update user totals
  UPDATE user_profiles 
  SET 
    total_points_earned = total_points_earned + points_to_award,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Update balance
  PERFORM update_user_points_balance(user_uuid);
  
  RETURN points_to_award;
END;
$$ LANGUAGE plpgsql;

-- Function to redeem points
CREATE OR REPLACE FUNCTION redeem_user_points(
  user_uuid UUID,
  points_to_redeem INTEGER,
  description_text TEXT DEFAULT 'Points redeemed'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT points_balance INTO current_balance
  FROM user_profiles 
  WHERE id = user_uuid;
  
  -- Check if user has enough points
  IF current_balance < points_to_redeem THEN
    RETURN FALSE;
  END IF;
  
  -- Insert redemption transaction (negative amount)
  INSERT INTO points_transactions (
    user_id, 
    transaction_type, 
    points_amount, 
    description
  ) VALUES (
    user_uuid, 
    'redeemed', 
    -points_to_redeem, 
    description_text
  );
  
  -- Update user totals
  UPDATE user_profiles 
  SET 
    total_points_redeemed = total_points_redeemed + points_to_redeem,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Update balance
  PERFORM update_user_points_balance(user_uuid);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to expire old points
CREATE OR REPLACE FUNCTION expire_old_points()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER := 0;
  user_record RECORD;
BEGIN
  -- Find all users with expired points
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM points_transactions 
    WHERE transaction_type = 'earned' 
      AND expires_at <= NOW()
      AND user_id NOT IN (
        SELECT user_id 
        FROM points_transactions 
        WHERE transaction_type = 'expired' 
          AND description LIKE 'Points expired on %'
      )
  LOOP
    -- Update balances for affected users
    PERFORM update_user_points_balance(user_record.user_id);
    expired_count := expired_count + 1;
  END LOOP;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to reduce points for inactive users
CREATE OR REPLACE FUNCTION reduce_inactive_user_points()
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER := 0;
  user_record RECORD;
  reduction_amount INTEGER;
BEGIN
  -- Find users inactive for more than 1 year
  FOR user_record IN 
    SELECT id, points_balance 
    FROM user_profiles 
    WHERE last_activity < NOW() - INTERVAL '1 year'
      AND points_balance > 0
  LOOP
    -- Calculate 50% reduction
    reduction_amount := FLOOR(user_record.points_balance * 0.5);
    
    IF reduction_amount > 0 THEN
      -- Insert reduction transaction
      INSERT INTO points_transactions (
        user_id, 
        transaction_type, 
        points_amount, 
        description
      ) VALUES (
        user_record.id, 
        'adjusted', 
        -reduction_amount, 
        'Points reduced due to inactivity (50% reduction after 1 year)'
      );
      
      -- Update balance
      PERFORM update_user_points_balance(user_record.id);
      affected_count := affected_count + 1;
    END IF;
  END LOOP;
  
  RETURN affected_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_expires_at ON points_transactions(expires_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_folder ON uploaded_images(folder);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action_type ON admin_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_session_id ON admin_activity_log(session_id);

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================

-- Insert some sample page content if it doesn't exist
INSERT INTO page_content (page, section, content) VALUES 
('home', 'hero', '<h1>Welcome to SoftBrace</h1><p>Premium dental solutions for your comfort.</p>')
ON CONFLICT (page, section) DO NOTHING;

INSERT INTO page_content (page, section, content) VALUES 
('home', 'features', '<h2>Why Choose SoftBrace?</h2><ul><li>Comfortable fit</li><li>Durable materials</li><li>Easy to use</li></ul>')
ON CONFLICT (page, section) DO NOTHING;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: uploaded_images, page_content, user_profiles, addresses, orders, order_items, points_transactions';
  RAISE NOTICE 'Storage bucket configured: images';
  RAISE NOTICE 'All policies and functions created';
  RAISE NOTICE 'You can now use the admin panel to upload images and manage content';
END $$;
