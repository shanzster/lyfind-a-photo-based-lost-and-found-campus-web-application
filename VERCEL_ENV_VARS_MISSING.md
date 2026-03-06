# ❌ Missing Vercel Environment Variables

## The Problem

OTP and other features aren't working because you're missing the CORE Firebase environment variables in Vercel.

## What You Have ✅
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
- VITE_BREVO_API_KEY
- VITE_BREVO_SENDER_EMAIL
- VITE_CLOUDINARY_CLOUD_NAME
- VITE_CLOUDINARY_UPLOAD_PRESET
- VITE_CLOUDINARY_API_SECRET
- VITE_API_URL
- VITE_NOTIFICATION_SERVER_URL
- VITE_NOTIFICATION_API_SECRET

## What You're MISSING ❌
- **VITE_FIREBASE_API_KEY** ← CRITICAL!
- **VITE_FIREBASE_AUTH_DOMAIN** ← CRITICAL!
- **VITE_FIREBASE_PROJECT_ID** ← CRITICAL!
- **VITE_FIREBASE_STORAGE_BUCKET** ← CRITICAL!

Without these, Firebase can't initialize, so OTP, authentication, and everything else fails!

---

## Quick Fix (2 minutes)

### Go to Vercel Dashboard
https://vercel.com/your-project/settings/environment-variables

### Add These Variables:

**1. VITE_FIREBASE_API_KEY**
```
AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw
```

**2. VITE_FIREBASE_AUTH_DOMAIN**
```
lyfind-72845.firebaseapp.com
```

**3. VITE_FIREBASE_PROJECT_ID**
```
lyfind-72845
```

**4. VITE_FIREBASE_STORAGE_BUCKET**
```
lyfind-72845.firebasestorage.app
```

### For Each Variable:
1. Click "Add New"
2. Enter the name (e.g., `VITE_FIREBASE_API_KEY`)
3. Enter the value
4. Select "All Environments" (Production, Preview, Development)
5. Click "Save"

---

## After Adding Variables

### Redeploy Your App:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click "..." menu → "Redeploy"
4. Wait 1-2 minutes

OR just push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

---

## How to Verify

### Check if Variables Are Set:
1. After deployment, go to your app
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_FIREBASE_API_KEY`
4. Should show the API key (not undefined)

### Test OTP:
1. Go to register page
2. Enter @lsb.edu.ph email
3. Click "Send OTP"
4. Should work now! ✅

---

## Complete List of Required Variables

Copy this checklist and make sure ALL are in Vercel:

### Firebase (REQUIRED):
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_FIREBASE_MEASUREMENT_ID

### Brevo Email (REQUIRED for OTP):
- [ ] VITE_BREVO_API_KEY
- [ ] VITE_BREVO_SENDER_EMAIL

### Cloudinary (REQUIRED for images):
- [ ] VITE_CLOUDINARY_CLOUD_NAME
- [ ] VITE_CLOUDINARY_UPLOAD_PRESET
- [ ] VITE_CLOUDINARY_API_SECRET

### Notification Server (OPTIONAL):
- [ ] VITE_NOTIFICATION_SERVER_URL
- [ ] VITE_NOTIFICATION_API_SECRET

### API (OPTIONAL):
- [ ] VITE_API_URL

---

## Why This Happens

Vercel doesn't automatically read your `.env` file. You must manually add each variable in the Vercel Dashboard.

**Local (.env file):** Works ✅
**Vercel (without manual setup):** Doesn't work ❌

---

## Quick Copy-Paste

Here are all the values you need to add:

```
VITE_FIREBASE_API_KEY=AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw
VITE_FIREBASE_AUTH_DOMAIN=lyfind-72845.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lyfind-72845
VITE_FIREBASE_STORAGE_BUCKET=lyfind-72845.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=153935340746
VITE_FIREBASE_APP_ID=1:153935340746:web:87ea7489649e48b3894033
VITE_FIREBASE_MEASUREMENT_ID=G-JPED770NSS
VITE_BREVO_API_KEY=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
VITE_BREVO_SENDER_EMAIL=seanthetechyyy@gmail.com
VITE_CLOUDINARY_CLOUD_NAME=do8pgc1ja
VITE_CLOUDINARY_UPLOAD_PRESET=minima
VITE_CLOUDINARY_API_SECRET=NSQGTXKuTSD69-mXY8evVwRo3CU
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com
VITE_NOTIFICATION_API_SECRET=lyfind-secret-key-change-this-in-production
```

---

## Summary

**Problem:** Missing core Firebase environment variables
**Solution:** Add them in Vercel Dashboard
**Time:** 2 minutes
**After:** Redeploy and test

Add those 4 missing Firebase variables and everything will work! 🚀
