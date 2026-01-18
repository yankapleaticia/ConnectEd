-- Policy: Only listing owner can update their listings
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = author_id);
