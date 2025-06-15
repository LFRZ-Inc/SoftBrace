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

-- Success message
SELECT 'Database setup completed successfully! All tables, policies, and indexes have been created.' as status; 