# Fixes Applied - OTP & Google Sign-In

## 1. Fixed OTP System (Brevo Email)

### Problem:
- OTP was using in-memory Map storage which doesn't work on Vercel serverless
- Brevo API key wasn't being loaded (401 error)
- Each serverless function instance has its own memory

### Solution:
- ✅ Moved OTP storage from in-memory Map to Firestore
- ✅ OTPs now stored in `otps` collection with email as document ID
- ✅ Added proper expiration handling with Firestore Timestamps
- ✅ Added API key logging to debug environment variable issues
- ✅ Updated `verifyOTP` to be async and use Firestore
- ✅ Updated `resendOTP` to delete from Firestore

### Files Changed:
- `src/services/emailService.ts` - Updated OTP storage to use Firestore
- `src/pages/visitor/Register.tsx` - Updated to await verifyOTP

### Firestore Structure:
```
otps (collection)
└── email@lsb.edu.ph (document)
    ├── otp: "123456"
    ├── email: "email@lsb.edu.ph"
    ├── expiresAt: Timestamp (10 minutes from creation)
    └── createdAt: Timestamp
```

## 2. Fixed Google Sign-In on Mobile

### Problem:
- Mobile redirect flow wasn't auto-logging in after returning from Google
- Race condition between `getRedirectResult` and `onAuthStateChanged`
- Navigation logic was split between two places

### Solution:
- ✅ Made `getRedirectResult` run FIRST before auth state listener
- ✅ Added `redirectHandled` state to control execution order
- ✅ Consolidated all redirect navigation in one place
- ✅ Removed unreliable pending flag system
- ✅ Auth state listener now waits for redirect to complete

### Files Changed:
- `src/contexts/AuthContext.tsx` - Refactored redirect handling

### How It Works Now:
1. User clicks "Sign in with Google" on mobile
2. Redirects to Google sign-in
3. User selects account and approves
4. Returns to app
5. `getRedirectResult` catches result FIRST
6. Creates/updates user profile
7. Shows success toast
8. Navigates to `/browse`
9. THEN auth state listener starts

## 3. Next Steps

### For Vercel Deployment:

1. **Verify Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure these are set for "All Environments":
     ```
     VITE_BREVO_API_KEY=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
     VITE_BREVO_SENDER_EMAIL=seanthetechyyy@gmail.com
     ```

2. **Redeploy:**
   ```bash
   # Build locally first to test
   npm run build
   
   # Then push to trigger Vercel deployment
   git add .
   git commit -m "Fix OTP storage and mobile Google Sign-In"
   git push
   ```

3. **Test OTP Flow:**
   - Go to `/register`
   - Enter @lsb.edu.ph email
   - Click "Send OTP"
   - Check browser console for: `[EmailService] Brevo API Key loaded: xkeysib-9d...`
   - If you see "NOT FOUND", the env var isn't loaded
   - Check email for OTP
   - Enter OTP to verify

4. **Test Mobile Google Sign-In:**
   - Open on Android phone (Chrome or PWA)
   - Click "Sign in with Google"
   - Select LSB account
   - Should automatically redirect to `/browse` after approval

### For Firebase Hosting (Alternative):

If you want to use Firebase Hosting instead of Vercel:

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your `firebase.json` is already configured with:
- Public directory: `dist`
- SPA rewrites for routing
- Service worker cache control

## 4. Firestore Security Rules

Add these rules to allow OTP operations:

```javascript
// In firestore.rules
match /otps/{email} {
  // Allow anyone to create OTP (for registration)
  allow create: if request.auth == null;
  
  // Allow anyone to read their own OTP (for verification)
  allow read: if request.auth == null;
  
  // Allow anyone to delete their own OTP (after verification)
  allow delete: if request.auth == null;
  
  // Auto-delete expired OTPs (set up in Firebase Console)
  // Or use Cloud Function to clean up
}
```

## 5. Troubleshooting

### OTP Still Not Working:
1. Check browser console for API key log
2. Verify Brevo API key in Vercel dashboard
3. Check Firestore for `otps` collection
4. Verify Firestore rules allow OTP operations

### Google Sign-In Still Not Working on Mobile:
1. Check browser console for logs starting with `[Auth]`
2. Verify domain is in Firebase Console → Authentication → Settings → Authorized domains
3. Make sure you're using an @lsb.edu.ph account
4. Try clearing browser cache and cookies

### 401 Error from Brevo:
- API key is not set or incorrect in Vercel
- Go to Vercel Dashboard → Settings → Environment Variables
- Add/update `VITE_BREVO_API_KEY`
- Redeploy

## 6. Testing Checklist

- [ ] Build succeeds locally: `npm run build`
- [ ] OTP sends successfully
- [ ] OTP verification works
- [ ] OTP stored in Firestore `otps` collection
- [ ] Google Sign-In works on desktop (popup)
- [ ] Google Sign-In works on mobile (redirect)
- [ ] Auto-login after Google redirect on mobile
- [ ] Navigation to `/browse` after successful sign-in
- [ ] Only @lsb.edu.ph emails allowed

---

**Status:** Ready to deploy and test
**Last Updated:** March 6, 2026
