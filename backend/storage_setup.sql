-- ============================================================
-- Run this in Supabase SQL Editor to create the storage bucket
-- for avatar and resume uploads
-- ============================================================

-- Create the storage bucket (public = files are publicly readable)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg','image/png','image/gif','image/webp','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read portfolio-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Allow service role to upload
CREATE POLICY "Service role upload portfolio-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow service role to delete
CREATE POLICY "Service role delete portfolio-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets');
