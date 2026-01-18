-- Combined migration for listing images support
-- Run this in your Supabase SQL Editor

-- Step 1: Add image_urls column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN listings.image_urls IS 'Array of image URLs stored in Supabase Storage';

-- Step 2: Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create RLS policies for listing images

-- Policy 1: Public read access - anyone can view listing images
CREATE POLICY IF NOT EXISTS "Public read access for listing images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-images');

-- Policy 2: Authenticated users can upload to their own folder
-- Path structure: userId/listingId/filename
CREATE POLICY IF NOT EXISTS "Users can upload listing images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 3: Users can update their own listing images
CREATE POLICY IF NOT EXISTS "Users can update listing images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'listing-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 4: Users can delete their own listing images
CREATE POLICY IF NOT EXISTS "Users can delete listing images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'listing-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
