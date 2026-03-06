# ⚡ Quick Fix: Mobile Sign-In Not Working

## Most Common Cause: Third-Party Cookies

Chrome on Android blocks third-party cookies by default, which breaks Firebase Auth redirect.

## Quick Fix (30 seconds):

### On Your Android Phone:

1. **Open Chrome Settings**
   - Tap the three dots (⋮) in Chrome
   - Tap "Settings"

2. **Go to Site Settings**
   - Tap "Site settings"
   - Tap "Cookies"

3. **Enable Third-Party Cookies**
   - Make sure "Block third-party cookies" is OFF
   - Or tap "Add site exception"
   - Add: `[*.]firebaseapp.com`
   - Add: `[*.]googleapis.com`

4. **Try Sign-In Again**
   - Go back to your app
   - Try "Sign in with Google"
   - Should work now! ✅

---

## Alternative: Use Incognito Mode

If you don't want to change cookie settings:

1. Open Chrome in Incognito mode
2. Go to your app
3. Try sign-in
4. Incognito allows third-party cookies by default

---

## Still Not Working?

### Clear Chrome Data:
```
Chrome → Settings → Privacy
→ Clear browsing data
→ Select "All time"
→ Check all boxes
→ Clear data
```

### Check Firebase Authorized Domains:
Go to: https://console.firebase.google.com/project/lyfind-72845/authentication/settings

Make sure these are listed:
- ✅ `lyfind-campus-item-finder.vercel.app`
- ✅ `lyfind-72845.firebaseapp.com`
- ✅ `localhost`

---

## Tell Me What Happens:

When you click "Sign in with Google":

**A) Does it redirect to Google?**
- YES → Go to B
- NO → There's a JavaScript error

**B) Can you sign in on Google's page?**
- YES → Go to C
- NO → Check your Google account

**C) Does it redirect back to your app?**
- YES → Go to D
- NO → Check authorized domains in Firebase

**D) What happens after redirect?**
- Shows error → Tell me the error message
- Nothing happens → Likely cookie/storage issue
- Logs in successfully → Great! ✅

---

## Most Likely Solution:

**Enable third-party cookies in Chrome settings!**

This is the #1 cause of mobile sign-in issues with Firebase Auth.

Try it now and let me know if it works! 🚀
