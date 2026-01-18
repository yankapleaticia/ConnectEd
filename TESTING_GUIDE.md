# Testing Guide: Comment Reactions & Nested Replies

## Prerequisites

1. **Apply Migration**: Run `011_add_comment_replies_and_reactions.sql`
2. **Restart Server**: `npm run dev` or `yarn dev`
3. **Have Test Accounts**: At least 2 user accounts for testing interactions
4. **Have Test Listing**: A listing with existing comments (or create one)

## Test Scenarios

### 🧪 Test 1: Basic Reactions

**Steps:**
1. Navigate to a listing with comments
2. Hover over the reaction button (👍) on any comment
3. Observe the emoji picker appearing with 6 options

**Expected:**
- ✅ Picker shows: 👍 ❤️ 😂 😮 😢 😠
- ✅ Smooth animation when picker appears
- ✅ Tooltips show emoji names on hover

**Test:**
4. Click the "Like" emoji (👍)

**Expected:**
- ✅ Reaction button changes color (primary color)
- ✅ Shows "1" next to the emoji
- ✅ Your reaction is highlighted
- ✅ Picker closes

---

### 🧪 Test 2: Change Reaction

**Steps:**
1. On a comment you already reacted to, hover over the reaction button
2. Click a different emoji (e.g., Love ❤️)

**Expected:**
- ✅ Your previous reaction is removed
- ✅ New reaction is added
- ✅ Count updates correctly
- ✅ New emoji is highlighted

---

### 🧪 Test 3: Remove Reaction

**Steps:**
1. On a comment you reacted to, hover and click the SAME emoji you used

**Expected:**
- ✅ Reaction is removed
- ✅ Count decreases by 1
- ✅ Button returns to default state (gray)
- ✅ If count reaches 0, shows "React" text

---

### 🧪 Test 4: Multiple Users Reactions

**Setup:** Use 2 different accounts

**Steps:**
1. User A: React with Like 👍
2. User B: React with Love ❤️
3. User A: View the comment

**Expected:**
- ✅ Total count shows "2"
- ✅ Breakdown shows: 👍 1 ❤️ 1
- ✅ User A sees their Like highlighted
- ✅ User B would see their Love highlighted

---

### 🧪 Test 5: Create Reply (Level 1)

**Steps:**
1. Find a top-level comment (no indent)
2. Click the "Reply" button
3. Type a reply (min 5 characters): "Great comment!"
4. Click "Reply" submit button

**Expected:**
- ✅ Reply form appears below comment
- ✅ Textarea auto-focuses
- ✅ Form has Reply and Cancel buttons
- ✅ After submit:
  - Reply appears indented below parent
  - Has blue left border
  - Shows your avatar and name
  - Displays timestamp
- ✅ Form closes automatically

---

### 🧪 Test 6: Nested Reply (Level 2+)

**Steps:**
1. Click "Reply" on a reply (from Test 5)
2. Type: "I agree with your reply!"
3. Submit

**Expected:**
- ✅ New reply indents further (2x indent)
- ✅ Left border continues
- ✅ Parent-child relationship is clear
- ✅ Original comment shows correct reply count

---

### 🧪 Test 7: Deep Nesting (Max Depth)

**Steps:**
1. Create replies nested 5 levels deep:
   - Comment → Reply → Reply to reply → etc.
2. At the 5th level, check for Reply button

**Expected:**
- ✅ Levels 1-5 show Reply button
- ✅ Level 5 (max depth) still shows Reply button
- ✅ Visual indentation increases with each level
- ✅ Comments remain readable (not too narrow)

---

### 🧪 Test 8: Collapse/Expand Replies

**Setup:** Have a comment with at least 2 replies

**Steps:**
1. Find the collapse button (shows reply count)
2. Click to collapse replies
3. Click again to expand

**Expected:**
- ✅ Button shows reply count (e.g., "2 replies")
- ✅ Shows chevron icon (down when collapsed, up when expanded)
- ✅ Clicking collapses: replies disappear
- ✅ Clicking expands: replies reappear
- ✅ State persists while on page (lost on refresh - expected)

---

### 🧪 Test 9: Reactions on Replies

**Steps:**
1. Add a reaction to a nested reply (not top-level comment)
2. Verify reaction picker and functionality work identically

**Expected:**
- ✅ All reaction features work on replies
- ✅ Each reply has its own reaction state
- ✅ Reactions don't affect parent comment

---

### 🧪 Test 10: Edit Comment with Replies

**Setup:** Comment with existing replies

**Steps:**
1. Click "Edit" on a comment that has replies
2. Change the content
3. Save

**Expected:**
- ✅ Comment content updates
- ✅ Replies remain intact
- ✅ Reply count doesn't change
- ✅ Nested structure preserved

---

### 🧪 Test 11: Delete Comment with Replies

**Steps:**
1. Click "Delete" on a comment with replies
2. Confirm deletion

**Expected:**
- ✅ Delete confirmation shows
- ✅ After confirmation:
  - Parent comment deleted
  - ALL child replies deleted (cascade)
  - UI updates immediately
- ✅ No orphaned replies remain

---

### 🧪 Test 12: Cancel Reply Form

**Steps:**
1. Click "Reply" on a comment
2. Start typing something
3. Click "Cancel"

**Expected:**
- ✅ Form closes
- ✅ Typed content is discarded
- ✅ No comment is created
- ✅ Can reopen form and start fresh

---

### 🧪 Test 13: Validation

**Steps:**
1. Click "Reply"
2. Try to submit with:
   - Empty content
   - Less than 5 characters (e.g., "Hi")
   - Exactly 5 characters (e.g., "Hello")

**Expected:**
- ✅ Empty: Error "Comment content is required"
- ✅ < 5 chars: Error "Comment must be at least 5 characters"
- ✅ = 5 chars: Submits successfully

---

### 🧪 Test 14: Unauthenticated User

**Steps:**
1. Log out
2. View a listing with comments

**Expected:**
- ✅ Can see comments and replies
- ✅ Can see reaction counts
- ✅ Cannot react (button disabled or hidden)
- ✅ No "Reply" button visible
- ✅ Cannot edit or delete any comments

---

### 🧪 Test 15: Permissions

**Setup:** 2 user accounts

**Steps:**
1. User A creates a comment
2. User B tries to:
   - Edit User A's comment
   - Delete User A's comment

**Expected:**
- ✅ User B does NOT see Edit/Delete buttons on User A's comment
- ✅ User B CAN react to User A's comment
- ✅ User B CAN reply to User A's comment

---

### 🧪 Test 16: Real-time Updates

**Setup:** 2 browser tabs/windows, both logged in

**Steps:**
1. Tab A: View a listing with comments
2. Tab B: View the same listing
3. Tab B: Add a reaction to a comment
4. Tab A: Check if reaction appears

**Expected:**
- ✅ If you refresh Tab A, reaction appears
- ⚠️ Without refresh, might not appear (depends on React Query refetch settings)
- ✅ This is expected behavior - not true real-time without websockets

---

### 🧪 Test 17: Mobile Responsiveness

**Steps:**
1. Open dev tools and switch to mobile view (e.g., iPhone)
2. Test all features on mobile viewport

**Expected:**
- ✅ Reaction picker positions correctly (not off-screen)
- ✅ Reply form is usable on small screens
- ✅ Nested comments readable with indentation
- ✅ Touch interactions work (tap to react, tap to reply)
- ✅ Collapse/expand works on mobile

---

### 🧪 Test 18: French Translation

**Steps:**
1. Switch language to French (if language switcher exists)
2. View comments section

**Expected:**
- ✅ "Reply" → "Répondre"
- ✅ "React" → "Réagir"
- ✅ "reply" (singular) → "réponse"
- ✅ "replies" (plural) → "réponses"
- ✅ All validation messages in French

---

### 🧪 Test 19: Performance

**Setup:** Create a comment with 10+ nested replies

**Steps:**
1. Collapse all replies
2. Expand all replies
3. Add reactions to multiple comments
4. Measure loading time

**Expected:**
- ✅ Collapse/expand is instant (< 100ms)
- ✅ Reaction updates quickly (< 500ms)
- ✅ No UI freezing with many nested comments
- ✅ Smooth scrolling

---

### 🧪 Test 20: Edge Cases

**Test A: Very Long Comment**
- Create a comment with 1000+ characters
- Add replies
- ✅ Comment wraps properly
- ✅ Replies still indent correctly

**Test B: Special Characters**
- Comment with emojis: "Great! 🎉🎊✨"
- Comment with code: `const x = 5;`
- ✅ All characters display correctly
- ✅ No rendering issues

**Test C: Rapid Clicking**
- Click reaction button rapidly 10 times
- ✅ No duplicate reactions created
- ✅ UI remains stable
- ✅ Final state is correct

---

## Automated Testing (Optional)

If you have a testing framework set up, here are suggested test cases:

### Unit Tests
```typescript
describe('buildCommentTree', () => {
  it('should build nested structure correctly', () => {
    // Test tree building algorithm
  });
  
  it('should handle orphaned comments', () => {
    // Test when parent_id references non-existent comment
  });
});

describe('ReactionPicker', () => {
  it('should show picker on hover', () => {
    // Test hover behavior
  });
  
  it('should add reaction on click', () => {
    // Test reaction addition
  });
});
```

### Integration Tests
```typescript
describe('Comment Replies E2E', () => {
  it('should create nested reply', async () => {
    // Full flow: click reply, type, submit, verify
  });
  
  it('should cascade delete replies', async () => {
    // Delete parent, verify children deleted
  });
});
```

---

## Bug Reporting Template

If you find issues, report using this template:

**Bug Title:** [Feature] - [Brief description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Browser:** Chrome 120 / Firefox 121 / Safari 17
**Device:** Desktop / Mobile / Tablet
**User Role:** Authenticated / Unauthenticated

**Screenshots:**
[Attach if applicable]

**Console Errors:**
```
[Paste any console errors]
```

---

## Success Criteria

All tests pass if:
- ✅ All 20 test scenarios pass
- ✅ No console errors
- ✅ No TypeScript errors
- ✅ No layout breaking
- ✅ Works in Chrome, Firefox, Safari
- ✅ Works on mobile devices
- ✅ Translations work correctly
- ✅ Performance is acceptable

Congratulations! 🎉 Your comment system now has reactions and nested replies!
