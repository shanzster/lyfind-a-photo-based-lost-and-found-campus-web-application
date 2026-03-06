# URGENT: Fix Google OAuth Configuration

## The Problem
Your logs show Firebase is NOT receiving the authentication after Google redirect:
- `getRedirectResult()` returns null
- `auth.currentUser` stays null
- User never gets signed in

This means **Google OAuth redirect is failing** - likely because the redirect URI is not in your allowed list.

---

## STEP-BY-STEP FIX (Do This Now!)

### Step 1: Open Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Make sure you're in project: **lyfind-72845**
3. If you don't see the project, click the project dropdown at the top

### Step 2: Go to Credentials
1. Click the hamburger menu (☰) in top-left
2. Click **APIs & Services**
3. Click **Credentials**

### Step 3: Find Your OAuth Client
1. Look for "Web client (auto created by Google Service)" in the OAuth 2.0 Client IDs section
2. Click on it to edit

### Step 4: Add Authorized JavaScript Origins
In the **Authorized JavaScript origins** section, make sure you have:
```
https://lyfind-72845.web.app
https://lyfind-72845.firebaseapp.com
http://localhost:5173
```

Click **+ ADD URI** if you need to add any.

### Step 5: Add Authorized Redirect URIs (CRITICAL!)
In the **Authorized redirect URIs** section, make sure you have:
```
https://lyfind-72845.web.app/__/auth/handler
https://lyfind-72845.firebaseapp.com/__/auth/handler
http://localhost:5173/__/auth/handler
```

**This is the most important step!** Without these, Google can't redirect back to your app.

### Step 6: Save
1. Scroll down and click **SAVE**
2. Wait for the "OAuth client updated" message

### Step 7: Check OAuth Consent Screen
1. Go back to **APIs & Services**
2. Click **OAuth consent screen**
3. Check the status:
   - If it says **"Testing"**, click **PUBLISH APP** button
   - If it says **"In production"**, you're good
4. Under "Test users", add your email: **your-email@lsb.edu.ph**

### Step 8: Wait 5-10 Minutes
Google OAuth changes take time to propagate. Wait at least 5 minutes.

---

## After Waiting, Test Again

### Test in Desktop Browser First
1. Go to: https://lyfind-72845.web.app/login
2. Open browser console (F12)
3. Click "Sign in with Google"
4. Should open popup (not redirect on desktop)
5. Sign in with @lsb.edu.ph account
6. Should work immediately

### Then Test in PWA
1. Open https://lyfind-72845.web.app in Chrome on your phone
2. Install as PWA if not already
3. Open the PWA
4. Click 🐛 button to see debug logs
5. Click "Sign in with Google"
6. You'll be redirected to Google
7. Sign in
8. You'll be redirected back
9. Click 🐛 button again
10. You should see logs like:
```
✅ Redirect result found!
Email: your-email@lsb.edu.ph
```

---

## What to Look For

### If It Works
You'll see in the debug logs:
```
[timestamp] ✅ Redirect result found!
[timestamp] Email: your-email@lsb.edu.ph
[timestamp] Handling Google sign-in for: your-email@lsb.edu.ph
[timestamp] ✅ Email valid
[timestamp] ✅ Profile created
```

### If It Still Doesn't Work
You'll see:
```
[timestamp] ❌ No redirect result
[timestamp] ❌ Timeout waiting for user
```

If you still see this, check browser console for errors like:
- `redirect_uri_mismatch` → The redirect URI is still not in the list
- `unauthorized_client` → OAuth client not properly configured
- `access_denied` → User denied access or consent screen issue

---

## Common Mistakes

1. **Forgot the `/__/auth/handler` part** - The redirect URI must include this exact path
2. **Wrong domain** - Make sure it's `lyfind-72845.web.app` not `lyfind-72845.firebaseapp.com` (add both to be safe)
3. **Didn't wait** - Changes take 5-10 minutes to propagate
4. **OAuth Consent Screen still in Testing** - Must be Published
5. **Didn't add test user** - If in Testing mode, you must add your email as a test user

---

## Screenshot Guide

If you need help, take screenshots of:
1. Google Cloud Console → Credentials → Your OAuth Client (showing both sections)
2. OAuth Consent Screen (showing status)
3. The debug logs after trying to sign in (click 🐛 button)
4. Browser console (F12) showing any errors

---

## Alternative: Use Vercel

If Firebase hosting continues to have issues, you can deploy to Vercel instead:

1. Deploy to Vercel: https://vercel.com/
2. Add Vercel domain to OAuth:
   - JavaScript origin: `https://lyfind-campus-item-finder.vercel.app`
   - Redirect URI: `https://lyfind-campus-item-finder.vercel.app/__/auth/handler`
3. Add to Firebase Auth authorized domains

---

## Need More Help?

Send me:
1. Screenshot of Google Cloud Console → Credentials → OAuth Client
2. Screenshot of OAuth Consent Screen
3. Screenshot of debug logs (🐛 button)
4. Any error messages from browser console

The issue is 99% likely to be the OAuth configuration. Once that's fixed, everything will work!
