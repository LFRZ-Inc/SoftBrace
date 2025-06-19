-- SoftBrace Database Setup Script
-- Run this in your Supabase SQL editor to set up all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create page_content table for storing editable content
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section)
);

-- Create uploaded_images table for image management
CREATE TABLE IF NOT EXISTS uploaded_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size INTEGER,
  folder VARCHAR(100) DEFAULT 'general',
  public_url TEXT,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_activity_log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_uploaded_images_updated_at ON uploaded_images;
CREATE TRIGGER update_uploaded_images_updated_at
    BEFORE UPDATE ON uploaded_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is admin-only content)
DROP POLICY IF EXISTS "Allow public read access" ON page_content;
CREATE POLICY "Allow public read access" ON page_content
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON page_content;
CREATE POLICY "Allow public write access" ON page_content
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON uploaded_images;
CREATE POLICY "Allow public read access" ON uploaded_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON uploaded_images;
CREATE POLICY "Allow public write access" ON uploaded_images
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON admin_activity_log;
CREATE POLICY "Allow public read access" ON admin_activity_log
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON admin_activity_log;
CREATE POLICY "Allow public write access" ON admin_activity_log
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_folder ON uploaded_images(folder);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_created_at ON uploaded_images(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action_type ON admin_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_session_id ON admin_activity_log(session_id);

-- Create storage bucket for images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for images bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'images');

-- Insert sample data for testing
INSERT INTO page_content (page, section, content) VALUES 
('home', 'hero', 'Welcome to SoftBrace - Your Comfortable Orthodontic Solution')
ON CONFLICT (page, section) DO NOTHING;

INSERT INTO page_content (page, section, content) VALUES 
('home', 'features', 'Our innovative SoftBrace strips provide comfortable, invisible teeth alignment.')
ON CONFLICT (page, section) DO NOTHING;

-- Database setup for Reviews and Contact system
-- Run this in Supabase SQL Editor

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);

-- Support Messages Table
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    inquiry_type VARCHAR(50) DEFAULT 'general',
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_status ON support_messages(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Product Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON product_reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews" ON product_reviews
    FOR INSERT WITH CHECK (true);

-- Support Messages policies
CREATE POLICY "Users can view their own support messages" ON support_messages
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can submit support messages" ON support_messages
    FOR INSERT WITH CHECK (true);

-- Admin access (assuming admin role exists)
CREATE POLICY "Admins can manage all reviews" ON product_reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

CREATE POLICY "Admins can manage all support messages" ON support_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_reviews_updated_at 
    BEFORE UPDATE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_messages_updated_at 
    BEFORE UPDATE ON support_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== EMAIL NOTIFICATION SETUP =====

-- Function to trigger email notification
CREATE OR REPLACE FUNCTION trigger_support_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send email notification
  PERFORM
    net.http_post(
      url := 'https://ebodynepuqrocggtevdw.supabase.co/functions/v1/send-support-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2R5bmVwdXFyb2NnZ3RldmR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc4OTk5MywiZXhwIjoyMDY1MzY1OTkzfQ.your_service_role_key_here"}'::jsonb,
      body := json_build_object('record', NEW)::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically send email notifications for new support messages
CREATE TRIGGER support_message_notification_trigger
  AFTER INSERT ON support_messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_support_notification();

-- Success message
SELECT 'Database setup completed successfully! All tables, policies, and indexes have been created.' as status; 