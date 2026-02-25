# Create Your Admin Account - Step by Step Guide

## 🎯 Quick Method (Recommended)

### Step 1: Create a User Account First

1. Go to your LyFind app: `http://localhost:5173`
2. Click **Register** or go to `/register`
3. Create an account with:
   - Email: `admin@lsb.edu.ph` (or your preferred admin email)
   - Password: Your secure password
   - Complete the registration

### Step 2: Get Your Firebase Auth UID

**Option A: From Firebase Console (Easiest)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `lyfind-72845`
3. Click **Authentication** in the left menu
4. Click **Users** tab
5. Find your email (`admin@lsb.edu.ph`)
6. Copy the **User UID** (long string like: `abc123xyz456...`)

**Option B: From Browser Console**
1. Login to LyFind with your account
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Type: `localStorage.getItem('firebase:authUser:AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw:[DEFAULT]')`
5. Look for `"uid":"YOUR_UID_HERE"` in the output
6. Copy your UID

### Step 3: Add Admin Document in Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `lyfind-72845`
3. Click **Firestore Database** in the left menu
4. Click **Start collection** (if first time) or find `admins` collection
5. Collection ID: `admins`
6. Click **Next**

### Step 4: Create Admin Document

**Document ID:** Paste your UID from Step 2

**Add these fields:**

| Field | Type | Value |
|-------|------|-------|
| `email` | string | `admin@lsb.edu.ph` |
| `displayName` | string | `Admin User` |
| `role` | string | `super_admin` |
| `adminLevel` | string | `super` |
| `permissions` | array | (see below) |
| `createdAt` | timestamp | Click "Set to current time" |
| `lastLogin` | timestamp | Click "Set to current time" |
| `twoFactorEnabled` | boolean | `false` |
| `assignedBy` | string | `system` |
| `active` | boolean | `true` |

### Step 5: Add Permissions Array

For the `permissions` field (array), add these 31 values:

```
0: users.view
1: users.edit
2: users.delete
3: users.suspend
4: users.ban
5: items.view
6: items.edit
7: items.delete
8: items.feature
9: items.approve
10: items.reject
11: items.request_info
12: reports.view
13: reports.handle
14: reports.delete
15: messages.view
16: messages.delete
17: ai.configure
18: ai.monitor
19: analytics.view
20: analytics.export
21: settings.view
22: settings.edit
23: admins.create
24: admins.edit
25: admins.delete
26: logs.view
27: logs.export
28: system.backup
29: system.restore
30: system.shutdown
```

### Step 6: Save and Test

1. Click **Save** in Firestore
2. Go to: `http://localhost:5173/admin/login`
3. Login with your email and password
4. You should be redirected to `/admin/dashboard`

---

## 🚀 Alternative Method: Using the Script

### Prerequisites
```bash
npm install firebase
```

### Steps

1. **Edit the script:**
   ```bash
   # Open scripts/createAdmin.js
   # Update the ADMIN_CONFIG section with your details
   ```

2. **Get your UID** (see Step 2 above)

3. **Update the script:**
   ```javascript
   const ADMIN_CONFIG = {
     USER_UID: 'YOUR_UID_HERE', // Paste your UID
     email: 'admin@lsb.edu.ph',
     displayName: 'Admin User',
     role: 'super_admin',
     adminLevel: 'super',
   };
   ```

4. **Run the script:**
   ```bash
   node scripts/createAdmin.js
   ```

5. **Login:**
   - Go to: `http://localhost:5173/admin/login`
   - Use your email and password

---

## 📋 Visual Guide for Firestore

### Creating the Document

```
Firestore Database
└── admins (collection)
    └── [YOUR_UID] (document)
        ├── email: "admin@lsb.edu.ph"
        ├── displayName: "Admin User"
        ├── role: "super_admin"
        ├── adminLevel: "super"
        ├── permissions: [array of 31 strings]
        ├── createdAt: [timestamp]
        ├── lastLogin: [timestamp]
        ├── twoFactorEnabled: false
        ├── assignedBy: "system"
        └── active: true
```

### Screenshot Guide

1. **Firestore Console:**
   ```
   [+ Start collection]
   Collection ID: admins
   [Next]
   ```

2. **Add Document:**
   ```
   Document ID: [Paste your UID]
   
   [+ Add field]
   Field: email
   Type: string
   Value: admin@lsb.edu.ph
   
   [+ Add field]
   Field: displayName
   Type: string
   Value: Admin User
   
   ... (continue for all fields)
   ```

3. **Add Array Field (permissions):**
   ```
   [+ Add field]
   Field: permissions
   Type: array
   
   [+ Add item]
   Type: string
   Value: users.view
   
   [+ Add item]
   Type: string
   Value: users.edit
   
   ... (continue for all 31 permissions)
   ```

---

## 🔍 Verification Checklist

After creating your admin account, verify:

- [ ] Document exists in `admins` collection
- [ ] Document ID matches your Firebase Auth UID
- [ ] `active` field is set to `true`
- [ ] `role` is set to `super_admin`
- [ ] `permissions` array has 31 items
- [ ] All fields are spelled correctly
- [ ] Can login at `/admin/login`
- [ ] Redirected to `/admin/dashboard` after login
- [ ] Can see dashboard statistics
- [ ] Can access `/admin/approvals`

---

## 🐛 Troubleshooting

### "Access denied" error when logging in

**Cause:** Your UID is not in the `admins` collection or `active` is false

**Solution:**
1. Check if document exists in Firestore
2. Verify Document ID matches your Auth UID exactly
3. Check `active` field is `true`
4. Check `role` field is set

### Can't find my UID

**Solution:**
1. Go to Firebase Console > Authentication
2. Look for your email in the Users list
3. The UID is in the first column
4. Click to copy it

### Permissions not working

**Solution:**
1. Check `permissions` field is an array
2. Verify all 31 permissions are added
3. Check spelling of each permission
4. Make sure they're strings, not objects

### Can't access admin pages

**Solution:**
1. Clear browser cache
2. Logout and login again
3. Check browser console for errors
4. Verify you're using the correct email/password

---

## 📞 Need Help?

If you're stuck:

1. **Check the browser console** (F12) for error messages
2. **Check Firestore** to verify the document structure
3. **Verify your UID** matches between Auth and Firestore
4. **Try logging out and back in**

---

## 🎉 Success!

Once you see the admin dashboard, you're all set! You can now:

- ✅ Approve/reject posts at `/admin/approvals`
- ✅ View dashboard statistics
- ✅ Manage users (coming soon)
- ✅ View analytics (coming soon)
- ✅ Access all admin features

---

## 📝 Quick Copy-Paste Template

For easy copy-paste into Firestore:

```json
{
  "email": "admin@lsb.edu.ph",
  "displayName": "Admin User",
  "role": "super_admin",
  "adminLevel": "super",
  "permissions": [
    "users.view", "users.edit", "users.delete", "users.suspend", "users.ban",
    "items.view", "items.edit", "items.delete", "items.feature",
    "items.approve", "items.reject", "items.request_info",
    "reports.view", "reports.handle", "reports.delete",
    "messages.view", "messages.delete",
    "ai.configure", "ai.monitor",
    "analytics.view", "analytics.export",
    "settings.view", "settings.edit",
    "admins.create", "admins.edit", "admins.delete",
    "logs.view", "logs.export",
    "system.backup", "system.restore", "system.shutdown"
  ],
  "twoFactorEnabled": false,
  "assignedBy": "system",
  "active": true
}
```

**Note:** You'll need to add `createdAt` and `lastLogin` as timestamp fields manually in Firestore (use "Set to current time" option).

---

**Last Updated:** February 25, 2026  
**Status:** Ready to Use ✅

