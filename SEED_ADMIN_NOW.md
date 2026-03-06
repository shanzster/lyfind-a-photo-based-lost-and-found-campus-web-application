# Seed Admin Account - Quick Guide

## Option 1: Run the Script (Easiest)

### Step 1: Install firebase-admin
```bash
npm install firebase-admin
```

### Step 2: Run the seed script
```bash
npm run seed-admin
```

### Step 3: Login
- Go to: `/admin/login`
- Email: `admin@lsb.edu.ph`
- Password: `Admin123!@#`

**⚠️ IMPORTANT: Change the password after first login!**

---

## Option 2: Manual Creation (If script fails)

### Step 1: Register a regular account
1. Go to `/register`
2. Email: `admin@lsb.edu.ph`
3. Password: Your choice (remember it!)
4. Complete registration with OTP

### Step 2: Get your UID
1. Login to your account
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Type: `firebase.auth().currentUser.uid`
5. Copy the UID

### Step 3: Add admin document in Firestore
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `lyfind-72845`
3. Go to Firestore Database
4. Create collection: `admins`
5. Document ID: **Paste your UID**
6. Add these fields:

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
  "createdAt": [Set to current time - Timestamp],
  "lastLogin": [Set to current time - Timestamp],
  "twoFactorEnabled": false,
  "assignedBy": "system",
  "active": true
}
```

### Step 4: Login
- Go to: `/admin/login`
- Use your email and password

---

## Default Admin Credentials (from script)

```
Email:    admin@lsb.edu.ph
Password: Admin123!@#
```

**Change this password immediately after first login!**

---

## Troubleshooting

### Script fails with "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### Script fails with "Service account not found"
- Make sure `lyfind-72845-firebase-adminsdk-fbsvc-5da2bb902c.json` exists in root directory
- Check the path in the script

### "User already exists"
- The script will update the existing user
- It will add/update the admin document
- Your existing password remains unchanged

### Can't login to admin panel
1. Check if `admins` collection exists in Firestore
2. Check if your UID document exists in `admins` collection
3. Verify `active` field is `true`
4. Check console for errors

---

## What the Script Does

1. ✅ Creates user in Firebase Auth (if doesn't exist)
2. ✅ Creates user profile in `users` collection
3. ✅ Creates admin document in `admins` collection
4. ✅ Sets all super admin permissions
5. ✅ Auto-verifies email
6. ✅ Sets active status to true

---

## After First Login

1. Go to admin profile settings
2. Change your password
3. Update your display name if needed
4. Enable 2FA (optional)

---

**Quick Start:**
```bash
npm install firebase-admin
npm run seed-admin
```

Then login at `/admin/login` with:
- Email: `admin@lsb.edu.ph`
- Password: `Admin123!@#`
