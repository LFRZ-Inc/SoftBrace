-- Quick Database Setup for Visual Editor
-- Run this in your Supabase SQL Editor if you're getting "table does not exist" errors

-- Create page_content table for Visual Editor
CREATE TABLE IF NOT EXISTS page_content (
  id BIGSERIAL PRIMARY KEY,
  page TEXT NOT NULL, -- 'home', 'about', 'products', 'visual-editor', etc.
  section TEXT NOT NULL, -- 'hero', 'features', 'page-structure', etc.
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section)
);

-- Create uploaded_images table for image management
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

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for the website to work)
CREATE POLICY IF NOT EXISTS "Allow public read access on page_content" 
ON page_content FOR SELECT 
TO public 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on page_content" 
ON page_content FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on uploaded_images" 
ON uploaded_images FOR SELECT 
TO public 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on uploaded_images" 
ON uploaded_images FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- Create storage bucket for images (if not already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY IF NOT EXISTS "Allow public uploads to images bucket" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Allow public access to images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Allow public delete on images" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'images');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER IF NOT EXISTS update_page_content_updated_at 
BEFORE UPDATE ON page_content 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_uploaded_images_updated_at 
BEFORE UPDATE ON uploaded_images 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_folder ON uploaded_images(folder);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Quick database setup completed successfully!';
  RAISE NOTICE 'Tables created: page_content, uploaded_images';
  RAISE NOTICE 'Storage bucket configured: images';
  RAISE NOTICE 'Your Visual Editor should now work properly';
END $$; 