-- Add image_urls column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN listings.image_urls IS 'Array of image URLs stored in Supabase Storage';
