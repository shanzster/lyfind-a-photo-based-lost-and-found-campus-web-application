# Admin Setup Guide for LyFind

## 🚀 Quick Start

The admin system has been successfully implemented! Follow these steps to set up your first admin account.

---

## 📋 What Was Implemented

### 1. **Admin Authentication System**
- Separate login portal at `/admin/login`
- Admin-specific authentication context
- Permission-based access control
- Role-based authorization (Super Admin, Moderator, Support)

### 2. **Admin Dashboard**
- Real-time statistics
- Quick action buttons
- System health monitoring
- Item breakdown (Lost vs Found)

### 3. **Post Approval System**
- Pending approvals queue
- Approve/Reject functionality
- Risk assessment
- User history tracking
- Trust score calculation

### 4. **Admin Components**
- AdminSidebar with navigation
- Protected routes
- Permission checks
- Activity logging

---

## 🔧 Setup Instructions

### Step 1: Create Admin Collection in Firestore

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `lyfind-72845`
3. Navigate to **Firestore Database**
4. Click **Start collection**
5. Collection ID: `admins`

### Step 2: Add Your First Admin Account

1. In the `admins` collection, click **Add document**
2. Use your Firebase Auth UID as the Document ID
3. Add the following fields:

```
Document ID: [YOUR_FIREBASE_AUTH_UID]

Fields:
├─ email: "your.email@lsb.edu.ph" (string)
├─ displayName: "Your Name" (string)
├─ role: "super_admin" (string)
├─ adminLevel: "super" (string)
├─ permissions: (array)
│  ├─ 0: "users.view"
│  ├─ 1: "users.edit"
│  ├─ 2: "users.delete"
│  ├─ 3: "users.suspend"
│  ├─ 4: "users.ban"
│  ├─ 5: "items.view"
│  ├─ 6: "items.edit"
│  ├─ 7: "items.delete"
│  ├─ 8: "items.feature"
│  ├─ 9: "items.approve"
│  ├─ 10: "items.reject"
│  ├─ 11: "items.request_info"
│  ├─ 12: "reports.view"
│  ├─ 13: "reports.handle"
│  ├─ 14: "reports.delete"
│  ├─ 15: "messages.view"
│  ├─ 16: "messages.delete"
│  ├─ 17: "ai.configure"
│  ├─ 18: "ai.monitor"
│  ├─ 19: "analytics.view"
│  ├─ 20: "analytics.export"
│  ├─ 21: "settings.view"
│  ├─ 22: "settings.edit"
│  ├─ 23: "admins.create"
│  ├─ 24: "admins.edit"
│  ├─ 25: "admins.delete"
│  ├─ 26: "logs.view"
│  ├─ 27: "logs.export"
│  ├─ 28: "system.backup"
│  ├─ 29: "system.restore"
│  └─ 30: "system.shutdown"
├─ createdAt: [Current Timestamp]
├─ lastLogin: [Current Timestamp]
├─ twoFactorEnabled: false (boolean)
├─ assignedBy: "system" (string)
└─ active: true (boolean)
```

### Step 3: Get Your Firebase Auth UID

**Option A: From Firebase Console**
1. Go to **Authentication** in Firebase Console
2. Find your user account
3. Copy the UID

**Option B: From Browser Console**
1. Login to LyFind as a regular user
2. Open browser console (F12)
3. Type: `firebase.auth().currentUser.uid`
4. Copy the UID

### Step 4: Update Items Collection

For the approval system to work, existing items need a status field. Run this in Firestore:

1. Go to each item in the `items` collection
2. Add field: `status: "active"` (string)
3. Add field: `approval` (map) with:
   ```
   approval:
   ├─ submittedAt: [item's createdAt]
   ├─ submittedBy: [item's userId]
   ├─ reviewedAt: [item's createdAt]
   ├─ reviewedBy: "system"
   ├─ approvalNote: "Legacy item - auto-approved"
   ├─ riskLevel: "low"
   └─ autoApproved: true
   ```

---

## 🔐 Admin Login

### Access the Admin Portal

1. Navigate to: `http://localhost:5173/admin/login`
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

### Admin Portal URLs

- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Pending Approvals**: `/admin/approvals`
- **Users**: `/admin/users` (coming soon)
- **Items**: `/admin/items` (coming soon)
- **Reports**: `/admin/reports` (coming soon)
- **Analytics**: `/admin/analytics` (coming soon)
- **Logs**: `/admin/logs` (coming soon)
- **Settings**: `/admin/settings` (coming soon)

---

## 👥 Admin Roles & Permissions

### Super Admin
- Full system access
- Can manage other admins
- Can modify system settings
- All permissions granted

### Moderator
- Can approve/reject posts
- Can suspend/ban users
- Can handle reports
- Cannot manage other admins
- Cannot modify system settings

### Support Staff
- Can view users and items
- Can approve posts (but not reject)
- Can view reports
- Cannot ban users
- Cannot delete content

---

## 📊 Features Implemented

### ✅ Completed

1. **Admin Authentication**
   - Separate login system
   - Role-based access control
   - Permission checking
   - Protected routes

2. **Admin Dashboard**
   - Real-time statistics
   - Quick actions
   - System health monitoring

3. **Post Approval System**
   - Pending approvals queue
   - Approve/Reject with reasons
   - Risk assessment
   - User history tracking
   - Trust score calculation

4. **Admin Service**
   - User management functions
   - Item management functions
   - Approval functions
   - Activity logging

### 🚧 To Be Implemented

1. **User Management Page**
   - View all users
   - Suspend/ban users
   - Edit user profiles
   - View user activity

2. **Items Management Page**
   - View all items
   - Edit items
   - Delete items
   - Feature items

3. **Reports Management**
   - View reports queue
   - Handle reports
   - Take actions

4. **Analytics Dashboard**
   - User analytics
   - Item analytics
   - Engagement metrics

5. **Activity Logs**
   - Admin action logs
   - System event logs
   - Export functionality

6. **Settings Page**
   - Platform configuration
   - Email templates
   - Security settings

---

## 🔒 Security Features

### Implemented

- ✅ Separate admin authentication
- ✅ Role-based access control
- ✅ Permission-based authorization
- ✅ Protected admin routes
- ✅ Admin action logging
- ✅ Secure admin check on login

### Recommended

- [ ] Two-factor authentication
- [ ] IP whitelisting
- [ ] Session timeout
- [ ] Failed login attempt tracking
- [ ] Admin activity monitoring

---

## 🧪 Testing the Admin System

### Test Scenario 1: Admin Login

1. Go to `/admin/login`
2. Try logging in with a non-admin account
3. Should see: "Access denied. Admin privileges required."
4. Login with admin account
5. Should redirect to `/admin/dashboard`

### Test Scenario 2: Post Approval

1. As a regular user, create a new post
2. Post should have status: "pending_approval"
3. Post should NOT appear in browse page
4. Login as admin
5. Go to `/admin/approvals`
6. See the pending post
7. Click "Approve"
8. Post should now appear in browse page with status: "active"

### Test Scenario 3: Post Rejection

1. As a regular user, create a post with too much detail
2. Login as admin
3. Go to `/admin/approvals`
4. Click "Reject"
5. Enter rejection reason
6. User should receive notification
7. Post status should be "rejected"

---

## 📝 Database Structure

### Collections Created

#### `admins` Collection
```typescript
admins/{adminUid}
  - email: string
  - displayName: string
  - role: 'super_admin' | 'moderator' | 'support'
  - adminLevel: 'super' | 'standard'
  - permissions: string[]
  - createdAt: Timestamp
  - lastLogin: Timestamp
  - twoFactorEnabled: boolean
  - assignedBy: string
  - active: boolean
```

#### `adminLogs` Collection
```typescript
adminLogs/{logId}
  - adminUid: string
  - action: string
  - targetId: string
  - metadata: object
  - timestamp: Timestamp
```

#### Updated `items` Collection
```typescript
items/{itemId}
  - ... (existing fields)
  - status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'resolved'
  - approval: {
      submittedAt: Timestamp
      submittedBy: string
      reviewedAt?: Timestamp
      reviewedBy?: string
      approvalNote?: string
      rejectionReason?: string
      riskLevel: 'low' | 'medium' | 'high'
      autoApproved: boolean
    }
  - approvedAt?: Timestamp
```

---

## 🐛 Troubleshooting

### Issue: "Access denied" when logging in as admin

**Solution:**
1. Check if your UID is in the `admins` collection
2. Verify `active: true` in your admin document
3. Check if `role` field is set correctly

### Issue: Can't see pending approvals

**Solution:**
1. Make sure items have `status: "pending_approval"`
2. Check Firestore security rules allow admin read access
3. Verify admin has `items.approve` permission

### Issue: Approve/Reject not working

**Solution:**
1. Check browser console for errors
2. Verify admin has correct permissions
3. Check Firestore security rules allow admin write access

---

## 📚 Next Steps

1. **Create your first admin account** (follow Step 2 above)
2. **Test the admin login** at `/admin/login`
3. **Create a test post** as a regular user
4. **Approve the post** from admin dashboard
5. **Implement remaining admin pages** (users, items, reports, etc.)

---

## 🎯 Quick Reference

### Admin Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard
- `/admin/approvals` - Pending post approvals

### Admin Roles
- `super_admin` - Full access
- `moderator` - Content moderation
- `support` - User support

### Item Status Flow
```
pending_approval → approved → active → resolved
pending_approval → rejected (can resubmit)
```

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Firestore security rules
3. Verify admin document structure
4. Check Firebase Authentication

---

**Last Updated:** February 25, 2026  
**Version:** 1.0  
**Status:** Admin System Implemented ✅

