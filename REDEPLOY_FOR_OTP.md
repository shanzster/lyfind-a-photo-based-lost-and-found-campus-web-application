# 🚀 Redeploy Vercel to Enable OTP

## Problem
You added all Firebase and Brevo environment variables to Vercel 5-6 minutes ago, but **environment variables only apply to NEW deployments**. Your current live site doesn't have these variables yet, so OTP emails can't be sent.

## Solution: Trigger a New Deployment

### Option 1: Redeploy from Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Click on your project: `lyfind-campus-item-finder`
3. Go to the "Deployments" tab
4. Find the latest deployment at the top
5. Click the "..." menu button on the right
6. Select "Redeploy"
7. Click "Redeploy" again to confirm
8. Wait 1-2 minutes for deployment to complete

### Option 2: Push Empty Commit (Alternative)
```bash
git commit --allow-empty -m "Redeploy with environment variables"
git push
```

## What This Will Fix
After redeployment, these features will work:
- ✅ OTP email verification on register page
- ✅ Google Sign-In (already added domain to Firebase)
- ✅ Firebase authentication
- ✅ All Firebase services (Firestore, Storage, etc.)

## Environment Variables Added (6 minutes ago)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_BREVO_API_KEY` ← Required for OTP emails
- `VITE_BREVO_SENDER_EMAIL` ← Required for OTP emails
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_CLOUDINARY_API_SECRET`
- `VITE_API_URL`
- `VITE_NOTIFICATION_SERVER_URL`
- `VITE_NOTIFICATION_API_SECRET`

## After Redeployment
1. Test OTP on register page with @lsb.edu.ph email
2. Check browser console: `console.log(import.meta.env.VITE_BREVO_API_KEY)` should show your key (not undefined)
3. Test Google Sign-In on mobile Chrome and PWA

## Why This Happens
Vercel builds your app once and serves that build to all visitors. When you add environment variables, they're only included in the NEXT build, not the current one. That's why you need to trigger a new deployment.
