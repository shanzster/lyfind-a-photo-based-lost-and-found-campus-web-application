# Google Sign-In Fix - POPUP ONLY

## What I Changed

### Simplified to POPUP ONLY
- ❌ Removed all redirect flow logic (was causing issues)
- ✅ Now uses `signInWithPopup` for ALL devices (desktop + mobile)
- ✅ Popup works on mobile Chrome and mobile browsers
- ✅ Single code path = no race conditions

### How It Works Now

1. User clicks "Sign in with Google"
2. Popup opens with Google sign-in
3. User selects @lsb.edu.ph account
4. Popup closes
5. Creates/updates user profile in Firestore
6. Shows success toast
7. Navigates to `/browse`

### Error Handling

Added specific error messages for:
- `auth/popup-closed-by-user` - User closed popup
- `auth/popup-blocked` - Browser blocked popup
- `auth/unauthorized-domain` - Domain not in Firebase
- Non-LSB email - Only @lsb.edu.ph allowed

## CRITICAL: Check Firebase Console

**You MUST have your domain authorized in Firebase:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `lyfind-72845`
3. Click **Authentication** in left menu
4. Click **Settings** tab
5. Scroll to **Authorized domains**
6. Make sure these domains are listed:
   - `lyfind-campus-item-finder.vercel.app`
   - `localhost` (for testing)
   - Any other domains you use

**If your domain is NOT in the list:**
- Click **Add domain**
- Enter: `lyfind-campus-item-finder.vercel.app`
- Click **Add**

## Testing Steps

### On Desktop:
1. Go to `/login`
2. Click "Sign in with Google"
3. Popup should open
4. Select @lsb.edu.ph account
5. Should redirect to `/browse`

### On Mobile (Chrome):
1. Go to `/login` on your phone
2. Click "Sign in with Google"
3. Popup/new tab should open
4. Select @lsb.edu.ph account
5. Should return to app and redirect to `/browse`

### On PWA (Installed):
1. Open PWA from home screen
2. Go to `/login`
3. Click "Sign in with Google"
4. Should open popup/tab
5. Select @lsb.edu.ph account
6. Should return to PWA and redirect to `/browse`

## If Popup is Blocked

**On Mobile:**
- Browser might block popups by default
- User needs to allow popups for your site
- Settings → Site Settings → Popups → Allow

**On Desktop:**
- Check browser popup blocker
- Allow popups for your domain

## Console Logs to Check

When you click "Sign in with Google", you should see:
```
[Auth] Starting Google Sign-In with POPUP...
[Auth] User Agent: Mozilla/5.0...
[Auth] ✅ Popup sign-in successful: user@lsb.edu.ph
[Auth] Creating/updating user profile...
[Auth] ✅ Profile created/updated, navigating to /browse
```

If you see errors:
```
[Auth] ❌ Google sign-in error: ...
[Auth] Error code: auth/unauthorized-domain
```
→ Add your domain to Firebase Console

```
[Auth] Error code: auth/popup-blocked
```
→ Allow popups in browser settings

## Deploy and Test

```bash
# Build
npm run build

# Deploy
git add .
git commit -m "Fix Google Sign-In - use popup only"
git push
```

## Why This Works

**Popup vs Redirect:**
- Popup: Opens new window, returns to same page ✅
- Redirect: Leaves page, comes back (complex state management) ❌

**Mobile Support:**
- Modern mobile browsers support popups
- Chrome on Android handles popups well
- Safari on iOS handles popups well
- PWA can open popups/new tabs

**Simpler Code:**
- One code path for all devices
- No redirect result handling
- No race conditions
- Easier to debug

## Troubleshooting

### "Failed to sign in with Google"
1. Check console for specific error code
2. Verify domain is authorized in Firebase
3. Check if popup was blocked
4. Try different browser

### "Only @lsb.edu.ph accounts are allowed"
- You're using a non-LSB email
- Use an @lsb.edu.ph account

### Popup doesn't open
- Check browser popup blocker
- Allow popups for your site
- Try incognito/private mode

### Popup opens but nothing happens
- Check console for errors
- Verify Firebase config is correct
- Check network tab for failed requests

### Redirects back to login
- This should NOT happen anymore
- If it does, check console logs
- Verify user profile is being created

---

**Status:** Ready to test
**Last Updated:** March 6, 2026
