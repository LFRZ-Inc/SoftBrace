-- Admin Content Management System Database Setup
-- Run this script in your Supabase SQL Editor

-- Create storage bucket for images (if not already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

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

-- Enable Row Level Security (RLS)
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (your website needs to read this data)
CREATE POLICY "Allow public read access on uploaded_images" 
ON uploaded_images FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public read access on page_content" 
ON page_content FOR SELECT 
TO public 
USING (true);

-- For now, allow all operations (you can restrict this later if needed)
CREATE POLICY "Allow all operations on uploaded_images" 
ON uploaded_images FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on page_content" 
ON page_content FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Create storage policy for image uploads
CREATE POLICY "Allow public uploads to images bucket" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public access to images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'images');

CREATE POLICY "Allow public delete on images" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_folder ON uploaded_images(folder);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_created_at ON uploaded_images(created_at DESC);

-- Insert some example content (optional)
INSERT INTO page_content (page, section, content) VALUES 
('home', 'hero', '<h1>Welcome to SoftBrace</h1><p>Your comfortable braces solution</p>'),
('home', 'features', '<h2>Why Choose SoftBrace?</h2><p>Premium comfort and protection</p>')
ON CONFLICT (page, section) DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_content_updated_at 
BEFORE UPDATE ON page_content 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploaded_images_updated_at 
BEFORE UPDATE ON uploaded_images 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 