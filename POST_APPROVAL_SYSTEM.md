# Post Approval System - Implementation Guide

## 🎯 Overview
This document outlines the post approval system for LyFind, a critical security feature that prevents fraudulent claims by requiring admin approval before posts go live.

---

## ⚠️ Why This Is Critical

### The Problem
Without approval, users could:
1. Post detailed information about lost items they don't own
2. Wait for someone to find the item
3. Claim ownership using the detailed information from the post
4. Fraudulently obtain items that aren't theirs

### Example Fraud Scenario
```
❌ BAD POST (No Approval):
"Lost iPhone 13 Pro, blue color, serial ABC123, 
IMEI 123456789, has crack on bottom left, 
wallpaper is beach photo, passcode 1234"

→ Anyone who finds this phone can claim it using these details
→ Real owner loses their phone to a fraudster
```

### The Solution
Admin approval ensures:
- Posts don't contain too much identifying information
- Lost items require verification from finders
- Found items don't reveal all details
- Suspicious patterns are caught early
- Platform maintains trust and security

---

## 🔄 Post Approval Workflow

### User Flow
```
1. User creates post (lost or found item)
   ↓
2. Post status: "pending_approval"
   ↓
3. User sees: "Your post is pending admin approval"
   ↓
4. Admin reviews post
   ↓
5a. APPROVED → Post goes live, user notified
5b. REJECTED → User notified with reason, can resubmit
5c. MORE INFO → User answers questions, back to review
```

### Admin Flow
```
1. Receive notification of new pending post
   ↓
2. Review post in approval queue
   ↓
3. Check for red flags:
   - Too much detail?
   - Stock photos?
   - Suspicious user history?
   - Policy violations?
   ↓
4. Make decision:
   - Approve (post goes live)
   - Reject (with reason)
   - Request more info
   ↓
5. Document decision
   ↓
6. Monitor user for future posts
```

---

## 🔍 What Admins Check

### For LOST Items
✅ **Good Example:**
```
Title: Lost Black Wallet
Description: Lost my black leather wallet near the cafeteria 
on Feb 20. Contains important cards. If found, please message 
me to verify contents.
Photos: [Photo of similar wallet, not showing contents]
Risk: LOW ✓
```

❌ **Bad Example:**
```
Title: Lost iPhone 13 Pro Max 256GB
Description: Lost my iPhone 13 Pro Max 256GB, blue color, 
serial number ABC123XYZ, IMEI 123456789012345, has a crack 
on bottom left corner, wallpaper is a beach photo, passcode 
is 1234, has Instagram and TikTok apps on home screen.
Photos: [Detailed photos showing everything]
Risk: HIGH ✗ - REJECT
Reason: "Too much specific information. Anyone could claim this."
```

### For FOUND Items
✅ **Good Example:**
```
Title: Found Keys
Description: Found a set of keys near the library. Has a 
distinctive keychain. Message me to describe the keychain 
and I'll verify.
Photos: [Photo of keys without showing keychain clearly]
Risk: LOW ✓
```

❌ **Bad Example:**
```
Title: Found Wallet with ID
Description: Found wallet belonging to Juan Dela Cruz, 
student ID 2024-12345, contains credit cards ending in 4567.
Photos: [Photo showing ID and all contents]
Risk: HIGH ✗ - REJECT
Reason: "Too much personal information exposed. Privacy violation."
```

---

## 🚩 Red Flags to Watch For

### Lost Items
- Serial numbers, IMEI, passwords
- Exact contents of wallet/bag
- Specific scratches or unique marks
- Personal information in photos
- Stock photos from internet
- New account posting expensive items
- Multiple lost items in short time

### Found Items
- Showing all contents clearly
- Displaying personal information
- Photos of IDs or cards
- Revealing serial numbers
- Asking for reward upfront

### User Behavior
- New account (< 1 week old)
- Multiple posts in short time
- History of rejected posts
- Reports against user
- Suspicious patterns

---

## 📊 Implementation Details

### Database Structure

#### Items Collection
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: GeoPoint;
  photos: string[];
  userId: string;
  
  // NEW: Approval fields
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'resolved';
  approval: {
    submittedAt: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string; // Admin UID
    approvalNote?: string;
    rejectionReason?: string;
    riskLevel: 'low' | 'medium' | 'high';
    autoApproved: boolean;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
}
```

#### Approval Queue Collection
```typescript
interface ApprovalQueueItem {
  itemId: string;
  userId: string;
  userName: string;
  userEmail: string;
  submittedAt: Timestamp;
  priority: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
  type: 'lost' | 'found';
  waitingTime: number; // minutes
  userHistory: {
    accountAge: number;
    previousPosts: number;
    resolvedItems: number;
    reportsAgainst: number;
    trustScore: number;
  };
}
```

### API Endpoints

#### Submit Post (User)
```typescript
POST /api/items
Body: {
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: { lat: number, lng: number };
  photos: File[];
}
Response: {
  itemId: string;
  status: 'pending_approval';
  message: 'Your post is pending admin approval';
}
```

#### Get Pending Approvals (Admin)
```typescript
GET /api/admin/approvals?status=pending&sortBy=date
Response: {
  items: ApprovalQueueItem[];
  total: number;
  oldestWaitTime: number;
}
```

#### Approve Post (Admin)
```typescript
POST /api/admin/approvals/:itemId/approve
Body: {
  note?: string;
}
Response: {
  success: true;
  message: 'Post approved and published';
}
```

#### Reject Post (Admin)
```typescript
POST /api/admin/approvals/:itemId/reject
Body: {
  reason: string; // Required
}
Response: {
  success: true;
  message: 'Post rejected and user notified';
}
```

#### Request More Info (Admin)
```typescript
POST /api/admin/approvals/:itemId/request-info
Body: {
  questions: string[];
}
Response: {
  success: true;
  message: 'User notified to provide more information';
}
```

---

## 🔔 Notifications

### User Notifications

#### Post Submitted
```
Subject: Your post is pending approval
Body: 
Hi [Name],

Your post "[Title]" has been submitted and is pending admin approval.
We'll review it within 24 hours and notify you once it's approved.

Thank you for using LyFind!
```

#### Post Approved
```
Subject: Your post has been approved!
Body:
Hi [Name],

Great news! Your post "[Title]" has been approved and is now live.
You can view it here: [Link]

Thank you for using LyFind!
```

#### Post Rejected
```
Subject: Your post needs revision
Body:
Hi [Name],

Your post "[Title]" could not be approved for the following reason:
[Rejection Reason]

You can resubmit your post with the necessary changes.

If you have questions, please contact support.
```

#### More Info Requested
```
Subject: More information needed for your post
Body:
Hi [Name],

We need more information about your post "[Title]":
- [Question 1]
- [Question 2]

Please reply to this email or update your post.
```

### Admin Notifications

#### New Pending Post
```
Subject: New post pending approval
Body:
A new post is waiting for your review:

Title: [Title]
Type: [Lost/Found]
Category: [Category]
Posted by: [User Name]
Risk Level: [Low/Medium/High]

Review now: [Link to Admin Dashboard]
```

#### Post Waiting >24 Hours
```
Subject: ⚠️ Post pending approval for 24+ hours
Body:
The following post has been waiting for approval for over 24 hours:

Title: [Title]
Posted by: [User Name]
Waiting time: [Hours]

Please review as soon as possible: [Link]
```

---

## 📈 Metrics to Track

### Approval Metrics
- Total pending posts
- Average approval time
- Approval rate (approved vs rejected)
- Posts by risk level
- Posts by category
- Oldest pending post

### Admin Performance
- Posts reviewed per admin
- Average review time per admin
- Approval accuracy (appeals overturned)
- Response time to user questions

### User Metrics
- Posts per user
- Approval rate per user
- Trust score trends
- Resubmission rate

---

## ⚙️ Configuration Options

### Auto-Approval Rules
```typescript
interface AutoApprovalConfig {
  enabled: boolean;
  criteria: {
    minTrustScore: number; // e.g., 80
    minApprovedPosts: number; // e.g., 5
    maxReportsAgainst: number; // e.g., 0
    verifiedAccountOnly: boolean;
    accountAgeMinDays: number; // e.g., 30
  };
  reviewLater: boolean; // Review auto-approved posts later
}
```

### Priority Rules
```typescript
interface PriorityConfig {
  high: {
    categories: string[]; // e.g., ['Electronics', 'IDs', 'Wallets']
    keywords: string[]; // e.g., ['urgent', 'important']
    minValue: number; // e.g., 1000 PHP
  };
  medium: {
    categories: string[];
  };
  low: {
    categories: string[];
  };
}
```

### SLA Configuration
```typescript
interface SLAConfig {
  highPriority: number; // hours, e.g., 2
  mediumPriority: number; // hours, e.g., 6
  lowPriority: number; // hours, e.g., 24
  escalationThreshold: number; // hours, e.g., 48
  autoApproveThreshold: number; // hours, e.g., 72
}
```

---

## 🎨 UI Components

### User View - Pending Post
```
┌─────────────────────────────────────────┐
│ 📝 Your Post                            │
│ ─────────────────────────────────────── │
│ Status: ⏳ Pending Approval             │
│                                         │
│ Your post is being reviewed by our     │
│ admin team. We'll notify you once it's │
│ approved (usually within 24 hours).    │
│                                         │
│ Title: Lost Black Wallet                │
│ Type: Lost                              │
│ Submitted: 2 hours ago                  │
│                                         │
│ [View Details] [Edit] [Cancel]         │
└─────────────────────────────────────────┘
```

### Admin View - Approval Queue
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Pending Approvals (12)                           │
│ ───────────────────────────────────────────────────│
│ Sort by: [Date ▼] Filter: [All ▼]                  │
│ ───────────────────────────────────────────────────│
│                                                     │
│ 🔴 HIGH PRIORITY                                    │
│ ┌─────────────────────────────────────────────┐   │
│ │ Lost iPhone 13 Pro                          │   │
│ │ Posted by: Juan Dela Cruz (2024-12345)      │   │
│ │ 5 minutes ago • Electronics • Library       │   │
│ │ Risk: MEDIUM ⚠️                             │   │
│ │                                             │   │
│ │ [View Details] [✓ Approve] [✗ Reject]      │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ 🟡 MEDIUM PRIORITY                                  │
│ ┌─────────────────────────────────────────────┐   │
│ │ Found Keys                                  │   │
│ │ Posted by: Maria Santos                     │   │
│ │ 1 hour ago • Keys • Cafeteria              │   │
│ │ Risk: LOW ✓                                │   │
│ │                                             │   │
│ │ [View Details] [✓ Approve] [✗ Reject]      │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Admin View - Review Details
```
┌─────────────────────────────────────────────────────┐
│ 📋 Review Post                                      │
│ ───────────────────────────────────────────────────│
│                                                     │
│ Title: Lost Black Wallet                           │
│ Type: Lost • Category: Wallets                     │
│ Location: Cafeteria - 1st Floor                    │
│ Posted: 5 minutes ago                              │
│                                                     │
│ Description:                                        │
│ Lost my black leather wallet near the cafeteria    │
│ on Feb 20. Contains important cards. If found,     │
│ please message me to verify contents.              │
│                                                     │
│ Photos: [2 images]                                 │
│ [📷 View Photos]                                   │
│                                                     │
│ ───────────────────────────────────────────────────│
│ User Information:                                   │
│ Name: Juan Dela Cruz                               │
│ Email: juan.delacruz@lsb.edu.ph                   │
│ Student ID: 2024-12345                             │
│ Account Age: 3 months                              │
│ Previous Posts: 1 (approved)                       │
│ Resolved Items: 1                                  │
│ Reports Against: 0                                 │
│ Trust Score: 85/100 ✓                             │
│                                                     │
│ ───────────────────────────────────────────────────│
│ Risk Assessment:                                    │
│ Risk Level: 🟢 LOW                                 │
│ • Vague enough to require verification             │
│ • No personal info exposed                         │
│ • Good user history                                │
│ • Original photos                                  │
│                                                     │
│ ───────────────────────────────────────────────────│
│ Admin Actions:                                      │
│                                                     │
│ [✓ Approve Post]                                   │
│ [✗ Reject Post]                                    │
│ [? Request More Info]                              │
│ [📝 Add Note]                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Steps

### Phase 1: Database Setup
1. Add `status` field to items collection
2. Add `approval` object to items
3. Create `approvalQueue` collection
4. Update Firestore security rules

### Phase 2: Backend API
1. Modify POST /api/items to set status as pending
2. Create admin approval endpoints
3. Add notification triggers
4. Implement auto-approval logic

### Phase 3: Admin Dashboard
1. Create approval queue page
2. Build review interface
3. Add bulk actions
4. Implement filters and sorting

### Phase 4: User Interface
1. Update post submission flow
2. Add pending status display
3. Show rejection reasons
4. Allow resubmission

### Phase 5: Notifications
1. Email templates
2. Push notifications
3. In-app notifications
4. SMS alerts (optional)

### Phase 6: Analytics
1. Approval metrics dashboard
2. Admin performance tracking
3. User trust score system
4. Fraud detection reports

---

## 📝 Testing Checklist

### User Flow Testing
- [ ] User can submit post
- [ ] Post shows pending status
- [ ] User receives submission confirmation
- [ ] User can view pending post
- [ ] User can edit pending post
- [ ] User receives approval notification
- [ ] User receives rejection notification
- [ ] User can resubmit rejected post

### Admin Flow Testing
- [ ] Admin sees pending posts
- [ ] Admin can filter/sort queue
- [ ] Admin can view post details
- [ ] Admin can approve post
- [ ] Admin can reject post
- [ ] Admin can request more info
- [ ] Admin receives notifications
- [ ] Approval is logged

### Security Testing
- [ ] Pending posts not visible to public
- [ ] Only admins can approve/reject
- [ ] Approval actions are logged
- [ ] User cannot bypass approval
- [ ] Auto-approval works correctly
- [ ] Risk assessment is accurate

---

**Implementation Priority:** 🔴 HIGH - Critical Security Feature  
**Estimated Time:** 2-3 weeks  
**Dependencies:** Admin dashboard, notification system  
**Status:** Ready for implementation

