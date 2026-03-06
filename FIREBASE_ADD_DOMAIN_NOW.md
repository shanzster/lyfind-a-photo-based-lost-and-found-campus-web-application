# ⚡ Add Domain to Firebase NOW (30 seconds)

## The Problem
```
Error: auth/unauthorized-domain
```

Your domain isn't authorized in Firebase.

---

## The Fix (3 Steps)

### Step 1: Open Firebase Console
Click this link: https://console.firebase.google.com/project/lyfind-72845/authentication/settings

Or manually:
1. Go to https://console.firebase.google.com/
2. Click **lyfind-72845**
3. Click **Authentication** (left sidebar)
4. Click **Settings** tab
5. Scroll down to **Authorized domains**

---

### Step 2: Add localhost
1. Click **Add domain** button
2. Type: `localhost`
3. Click **Add**

---

### Step 3: Test
1. Go back to your app
2. Refresh the page (Ctrl+Shift+R)
3. Click "Sign in with Google"
4. Should work now! ✅

---

## What You'll See in Firebase

**Before:**
```
Authorized domains:
✓ lyfind-72845.firebaseapp.com
✓ lyfind-72845.web.app
```

**After:**
```
Authorized domains:
✓ lyfind-72845.firebaseapp.com
✓ lyfind-72845.web.app
✓ localhost  ← Added this!
```

---

## Important Notes

### Domain Format
- ✅ Correct: `localhost`
- ❌ Wrong: `http://localhost`
- ❌ Wrong: `localhost:5173`
- ❌ Wrong: `https://localhost`

Just the domain name, nothing else!

### For Vercel Deployment
When you deploy to Vercel, also add:
```
your-app-name.vercel.app
```

### Wait Time
- Changes take effect immediately
- If not working, wait 1 minute and try again
- Clear browser cache if needed

---

## Quick Test

After adding the domain:

1. **Clear cache:** Ctrl+Shift+Delete → Clear browsing data
2. **Reload app:** Ctrl+Shift+R
3. **Try sign-in:** Click "Sign in with Google"
4. **Should work!** ✅

---

## Still Not Working?

### Check Your Current Domain
1. Open browser console (F12)
2. Look at the error message
3. It will show the domain being used
4. Add that exact domain to Firebase

### Example Error:
```
Error: auth/unauthorized-domain
Domain: 127.0.0.1
```

**Solution:** Add `127.0.0.1` to Firebase (in addition to `localhost`)

---

## Common Domains to Add

For development:
- `localhost` ← Most important!
- `127.0.0.1` (if needed)

For production:
- Your Vercel domain
- Your custom domain (if any)

---

**That's it!** Just add `localhost` to Firebase and Google Sign-In will work. 🎉

**Time:** 30 seconds
**Difficulty:** Super easy
**Cost:** Free

Do it now! →
