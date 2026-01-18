-- Verification queries for storage bucket setup
-- Run these to verify the avatars bucket and policies were created correctly

-- 1. Check if the bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'avatars';

-- 2. Check if RLS policies exist for the avatars bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname IN (
    'Public read access',
    'Users can upload to own folder',
    'Users can update own files',
    'Users can delete own files'
  )
ORDER BY policyname;

-- Expected results:
-- 1. Should return 1 row with bucket 'avatars', public=true, file_size_limit=2097152
-- 2. Should return 4 rows (one for each policy)
