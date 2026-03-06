# 🔍 Test Mobile Sign-In Issue

## Quick Test

On your Android Chrome, open the browser console to see what's happening:

### Step 1: Enable USB Debugging
1. On your Android: Settings → About Phone → Tap "Build Number" 7 times
2. Settings → Developer Options → Enable "USB Debugging"

### Step 2: Connect to Desktop
1. Connect phone to computer via USB
2. On desktop Chrome, go to: `chrome://inspect`
3. Find your device and click "Inspect"
4. You'll see the mobile browser console

### Step 3: Try Sign-In and Check Logs
1. On phone, go to login page
2. Click "Sign in with Google"
3. Watch the desktop console for errors

Look for:
- `[Auth] Mobile detected, using redirect flow`
- Any error messages
- What happens after redirect

---

## Common Mobile Issues

### Issue 1: Third-Party Cookies Blocked
Chrome on Android blocks third-party cookies by default, which can break Firebase Auth.

**Fix:**
1. Chrome → Settings → Site Settings → Cookies
2. Make sure "Allow third-party cookies" is enabled
3. Or add exception for `firebaseapp.com`

### Issue 2: Redirect URI Mismatch
The redirect might be going to a different URL than expected.

**Check:**
- Firebase Console → Authentication → Settings → Authorized domains
- Must include: `lyfind-campus-item-finder.vercel.app`

### Issue 3: Mobile Browser Cache
Old cached code might be causing issues.

**Fix:**
1. Chrome → Settings → Privacy → Clear browsing data
2. Select "All time"
3. Check all boxes
4. Clear data
5. Try again

---

## What Error Are You Seeing?

Please tell me:
1. Does it redirect to Google?
2. Can you sign in on Google's page?
3. Does it redirect back to your app?
4. What happens after redirect back?
5. Any error messages?

This will help me identify the exact issue!
