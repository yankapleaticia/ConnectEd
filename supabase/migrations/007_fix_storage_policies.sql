-- Drop existing storage policies for avatars bucket (if they exist)
-- This ensures we can recreate them with the correct folder index [1]

DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Recreate policies with correct folder index [1]
-- Note: storage.foldername(name)[1] is the first folder segment (index 1, not 0)
-- For a path like "userId/filename.ext", storage.foldername returns ['userId'], so [1] = 'userId'

-- Policy 1: Public read access - anyone can view avatars
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 3: Users can update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy 4: Users can delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
