-- Add parent_comment_id to comments table for nested replies
ALTER TABLE comments ADD COLUMN parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Add index for query performance
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Create comment_reactions table
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Indexes for query performance
CREATE INDEX idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_comment_reactions_user_id ON comment_reactions(user_id);
CREATE INDEX idx_comment_reactions_reaction_type ON comment_reactions(reaction_type);

-- Enable Row Level Security
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view reactions
CREATE POLICY "Anyone can view comment reactions" ON comment_reactions
  FOR SELECT USING (true);

-- Policy: Authenticated users can add reactions
CREATE POLICY "Authenticated users can add reactions" ON comment_reactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policy: Users can update their own reactions
CREATE POLICY "Users can update own reactions" ON comment_reactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own reactions
CREATE POLICY "Users can delete own reactions" ON comment_reactions
  FOR DELETE USING (auth.uid() = user_id);
