# Setup Guide: Comment Enhancements

## Quick Start

### Step 1: Apply Database Migration

You need to run the new migration file to add the database schema for replies and reactions.

**Option A: Using Supabase CLI** (Recommended)
```bash
cd c:\Users\jospe\Documents\github\leati\connect-ed
supabase db push
```

**Option B: Manual via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open `supabase/migrations/011_add_comment_replies_and_reactions.sql`
4. Copy and paste the SQL into the editor
5. Click "Run"

### Step 2: Verify Migration

Check that the following were created:

**In `comments` table:**
- New column: `parent_comment_id` (UUID, nullable)

**New table: `comment_reactions`**
- Columns: `id`, `comment_id`, `user_id`, `reaction_type`, `created_at`
- Constraint: Unique (comment_id, user_id)

### Step 3: Restart Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 4: Test the Features

1. **Navigate to any listing with comments**
   - Go to `/feed` and click on a listing

2. **Test Reactions:**
   - Hover over the reaction button (👍)
   - Click an emoji to react
   - Click again to change reaction
   - Click same emoji to remove reaction

3. **Test Replies:**
   - Click "Reply" button on any comment
   - Type a reply (min 5 characters)
   - Submit
   - Should appear nested below parent comment

4. **Test Nested Replies:**
   - Reply to a reply
   - Should indent further with blue left border
   - Can nest up to 5 levels deep

5. **Test Collapse/Expand:**
   - If a comment has replies, a button shows reply count
   - Click to collapse/expand replies

## Features Overview

### 🎭 Facebook-Style Reactions
- **6 Reaction Types**: Like 👍, Love ❤️, Haha 😂, Wow 😮, Sad 😢, Angry 😠
- **One Reaction Per User**: Change by clicking different emoji
- **Remove Reaction**: Click same emoji again
- **Reaction Counts**: Shows total and breakdown by type
- **Hover to Select**: Picker appears on hover for quick access

### 💬 Nested Comment Replies
- **Unlimited Depth**: Database supports infinite nesting
- **UI Depth Limit**: Max 5 levels to prevent narrow columns
- **Visual Nesting**: Left border and indentation show reply depth
- **Collapsible**: Hide/show replies with toggle button
- **Reply Count**: Shows number of replies on each comment

### 🎨 UX Highlights
- **Auto-focus**: Reply form focuses automatically when opened
- **Quick Like**: First click on reaction button = instant like
- **Smooth Animations**: Hover effects and transitions
- **Responsive**: Works on mobile and desktop
- **Bilingual**: Full English and French support

## Common Issues & Solutions

### Issue: Migration fails with "relation already exists"
**Solution**: The migration may have already been partially applied. Check the database:
```sql
-- Check if parent_comment_id exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'comments' AND column_name = 'parent_comment_id';

-- Check if comment_reactions table exists
SELECT * FROM information_schema.tables WHERE table_name = 'comment_reactions';
```

### Issue: Reactions not showing
**Solution**: 
1. Ensure you're logged in (reactions require authentication)
2. Check browser console for errors
3. Verify RLS policies were created:
```sql
SELECT * FROM pg_policies WHERE tablename = 'comment_reactions';
```

### Issue: Comments not nesting properly
**Solution**:
1. Check that `buildCommentTree()` function is working
2. Verify `parent_comment_id` is being saved correctly
3. Open browser DevTools > Network tab and check the comment data structure

### Issue: TypeScript errors
**Solution**:
```bash
# Clear TypeScript cache and rebuild
rm -rf .next
npm run build
```

## File Changes Summary

### New Files Created (4)
1. `supabase/migrations/011_add_comment_replies_and_reactions.sql`
2. `client/components/features/comments/reaction-picker.tsx`
3. `client/components/features/comments/reply-form.tsx`
4. `COMMENT_ENHANCEMENTS_SUMMARY.md`

### Files Modified (8)
1. `types/domain/comment.ts` - Added reaction and reply types
2. `services/features/comments/comments.types.ts` - Added reaction types
3. `services/features/comments/comments.service.ts` - Added reaction methods and tree building
4. `services/queries/comments.queries.ts` - Added reaction hooks
5. `client/components/features/comments/comment-item.tsx` - Added reactions and nested rendering
6. `client/components/features/comments/comments-list.tsx` - Pass userId
7. `translations/en.json` - Added reaction/reply keys
8. `translations/fr.json` - Added reaction/reply keys

## Need Help?

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify all files were saved correctly
4. Ensure your dev server was restarted after changes

## Next Steps (Optional)

Consider these enhancements:
- Add notification system for replies
- Implement reaction analytics
- Add "Load more" pagination for large reply threads
- Show avatars of users who reacted (tooltip)
- Add keyboard shortcuts for reactions
