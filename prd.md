
# CONNECTED MVP — TASK PRD EXECUTION LIST

**(Architecture-Driven, Ready for Assignment)**

Each item below can be:

* a Jira ticket
* a GitHub issue
* a Linear task

---

# 🔹 LAYER 0 — FOUNDATIONAL SYSTEM CONCERNS

> Must be completed before any feature work.

---

### **T0.1 — Define User Domain Model**

**Description:**
Create the core user entity used across the system.

**Acceptance Criteria:**

* User has unique identifier
* Stores email and password hash
* Tracks creation date
* Can be referenced by other entities (listings, comments, messages)

---

### **T0.2 — Define Authentication State Handling**

**Description:**
Establish how the system knows whether a user is authenticated.

**Acceptance Criteria:**

* System can identify authenticated vs unauthenticated users
* Auth state persists across requests/sessions
* Unauthenticated users are restricted from protected actions

---

### **T0.3 — Define Authorization Rules**

**Description:**
Specify basic permission rules.

**Rules:**

* Only authenticated users can create/edit content
* Users can only edit/delete their own listings/comments
* Anyone can view public content

---

# 🔹 LAYER 1 — AUTHENTICATION (ENTRY POINT)

---

### **T1.1 — User Signup (Email & Password)**

**Description:**
Allow new users to create an account.

**Acceptance Criteria:**

* User can register with email and password
* Duplicate emails are rejected
* Password is securely stored
* User is logged in after signup (optional but recommended)

---

### **T1.2 — User Login**

**Description:**
Allow existing users to log in.

**Acceptance Criteria:**

* Valid credentials authenticate the user
* Invalid credentials return clear error
* Auth session/token is created

---

### **T1.3 — User Logout**

**Description:**
Allow users to end their session.

**Acceptance Criteria:**

* Session/token is invalidated
* User is treated as unauthenticated afterward

---

# 🔹 LAYER 2 — CORE CONTENT MODEL (LISTINGS)

---

### **T2.1 — Define Listing Entity**

**Description:**
Create the main content unit (listing/post).

**Fields:**

* ID
* Title
* Body/content
* Category
* Author (User reference)
* Created / updated timestamps

---

### **T2.2 — Define Category Model**

**Description:**
Create predefined categories for listings.

**Acceptance Criteria:**

* Categories are fixed (seeded or constant)
* Each listing belongs to exactly one category

---

# 🔹 LAYER 3 — READ PATHS (VIEW FIRST)

---

### **T3.1 — Public Feed (Listings Overview)**

**Description:**
Display a list of listings.

**Acceptance Criteria:**

* Anyone can view the feed
* Listings show title, category, author, date
* Ordered by creation date (latest first)

---

### **T3.2 — Listing Detail View**

**Description:**
Display full details of a single listing.

**Acceptance Criteria:**

* Accessible by anyone
* Shows full content, author, category, date
* Serves as anchor for comments

---

# 🔹 LAYER 4 — FILTERING & SEARCH

---

### **T4.1 — Filter by Category**

**Description:**
Allow users to filter listings by category.

**Acceptance Criteria:**

* Feed updates based on selected category
* Works with existing feed ordering

---

### **T4.2 — Filter by Date**

**Description:**
Allow filtering listings by date range or recent first.

---

### **T4.3 — Filter by Author**

**Description:**
Allow viewing listings from a specific author.

---

### **T4.4 — Text Search**

**Description:**
Search listings by keyword.

**Acceptance Criteria:**

* Searches title and body
* Basic partial matching
* No ranking required

---

# 🔹 LAYER 5 — WRITE ACTIONS (LISTINGS)

---

### **T5.1 — Create Listing**

**Description:**
Allow authenticated users to create a listing.

**Acceptance Criteria:**

* Only authenticated users can create
* Category selection is mandatory
* Author is automatically assigned

---

### **T5.2 — Edit Listing**

**Description:**
Allow users to edit their own listings.

**Acceptance Criteria:**

* Only owner can edit
* Content updates are saved
* Unauthorized edits are blocked

---

# 🔹 LAYER 6 — COMMENTS

---

### **T6.1 — Define Comment Entity**

**Description:**
Create comment model linked to listings.

**Fields:**

* ID
* Content
* Author (User)
* Listing reference
* Timestamp

---

### **T6.2 — Add Comment**

**Description:**
Allow authenticated users to comment on listings.

---

### **T6.3 — View Comments**

**Description:**
Display comments on listing detail page.

**Acceptance Criteria:**

* Visible to everyone
* Ordered chronologically

---

### **T6.4 — Edit/Delete Own Comment**

**Description:**
Allow users to manage their own comments.

---

# 🔹 LAYER 7 — MESSAGING (ISOLATED DOMAIN)

---

### **T7.1 — Define Message Entity**

**Description:**
Create message model for private communication.

**Fields:**

* ID
* Sender
* Receiver
* Message body
* Timestamp

---

### **T7.2 — Send Message**

**Description:**
Allow authenticated users to send private messages.

---

### **T7.3 — Inbox / Message History**

**Description:**
Allow users to view message history with another user.

**Acceptance Criteria:**

* Messages are private
* Chronological order
* Text-only

