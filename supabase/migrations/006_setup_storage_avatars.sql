-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Public read access - anyone can view avatars
CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload to their own folder
-- Note: storage.foldername(name)[1] is the first folder segment (index 1, not 0)
CREATE POLICY IF NOT EXISTS "Users can upload to own folder" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 3: Users can update their own files
CREATE POLICY IF NOT EXISTS "Users can update own files" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 4: Users can delete their own files
CREATE POLICY IF NOT EXISTS "Users can delete own files" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );