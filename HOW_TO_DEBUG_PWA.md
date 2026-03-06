# How to Debug PWA on Android Phone

## What I Added

I've added extensive console logging throughout the Google Sign-In flow with emojis for easy identification:

- 🚀 **[AUTH]** - Auth initialization logs
- 🔵 **[LOGIN]** - Login button click logs
- 🔐 **[GOOGLE]** - Google sign-in handling logs
- ✅ Success messages
- ❌ Error messages
- 📱 Device/PWA detection
- 🔄 Redirect flow logs

## Method 1: Chrome Remote Debugging (RECOMMENDED)

This lets you see console logs from your phone PWA on your laptop in real-time!

### Setup (One-time)

1. **On your Android phone:**
   - Go to Settings → About phone
   - Tap "Build number" 7 times (enables Developer mode)
   - Go back to Settings → Developer options
   - Enable "USB debugging"

2. **On your laptop:**
   - Install Chrome browser (if not already)
   - Connect phone to laptop via USB cable
   - On phone, allow USB debugging when prompted

### How to Use

1. **Connect phone to laptop via USB**

2. **On your laptop, open Chrome and go to:**
   ```
   chrome://inspect
   ```

3. **You'll see your phone listed with all Chrome tabs**
   - Look for your PWA: `lyfind-72845.web.app`
   - Click **"Inspect"** next to it

4. **A DevTools window will open showing your phone's console!**

5. **Now on your phone:**
   - Open the PWA
   - Click "Sign in with Google"
   - Watch the console logs appear in real-time on your laptop!

### What You'll See

When you click "Sign in with Google", you'll see logs like:

```
🔵 [LOGIN] === GOOGLE SIGN-IN START ===
📱 [LOGIN] Is PWA: true
🔄 [LOGIN] Using REDIRECT flow (PWA mode)
💾 [LOGIN] Setting googleSignInPending flag in localStorage
✅ [LOGIN] Flag set, calling signInWithRedirect()...
🚀 [LOGIN] signInWithRedirect() called (should redirect now)
```

After redirecting back from Google:

```
🚀 [AUTH] === AUTH INIT START ===
🌐 [AUTH] URL: https://lyfind-72845.web.app/login
📱 [AUTH] User Agent: Mozilla/5.0...
🔍 [AUTH] Display mode: PWA
🔄 [AUTH] Was redirecting: true
📋 [AUTH] Method 1: Checking getRedirectResult()...
```

If it works:
```
✅ [AUTH] Redirect result found!
👤 [AUTH] User email: your-email@lsb.edu.ph
🔐 [GOOGLE] === HANDLING GOOGLE SIGN-IN ===
```

If it fails:
```
❌ [AUTH] No redirect result (null)
⏳ [AUTH] Method 2: Waiting for auth state...
❌ [AUTH] Timeout waiting for user after 10 attempts
```

---

## Method 2: Debug Overlay (🐛 Button)

If you can't use USB debugging, use the built-in debug overlay:

1. Open PWA on phone
2. Click "Sign in with Google"
3. After redirecting back, click the **🐛 button** (bottom-right)
4. Take a screenshot of the logs
5. Send screenshot to yourself

---

## Method 3: OAuth Diagnostic Page

1. Open PWA on phone
2. Click "Sign in with Google"
3. After redirecting back, navigate to: `/oauth-diagnostic`
4. Click "Copy to Clipboard"
5. Paste into a note app or send to yourself

---

## What to Look For

### If Google Sign-In is Working:
```
✅ [AUTH] Redirect result found!
👤 [AUTH] User email: your-email@lsb.edu.ph
🔐 [GOOGLE] === HANDLING GOOGLE SIGN-IN ===
✅ [GOOGLE] Email domain valid
✅ [GOOGLE] Profile created successfully
🚀 [GOOGLE] Navigating to /browse
```

### If OAuth Config is Wrong:
```
❌ [AUTH] No redirect result (null)
❌ [AUTH] Timeout waiting for user
```

This means the redirect URI is not in Google Cloud Console.

### If There's an Error:
```
❌ [LOGIN] Google sign-in error: [error message]
❌ [LOGIN] Error code: auth/unauthorized-domain
```

Error codes:
- `auth/unauthorized-domain` → Domain not in Firebase authorized domains
- `auth/popup-blocked` → Browser blocked popup (shouldn't happen in PWA)
- `auth/cancelled-popup-request` → User cancelled

---

## Troubleshooting Chrome Remote Debugging

### Phone not showing up in chrome://inspect?

1. Make sure USB debugging is enabled on phone
2. Try a different USB cable (some cables are charge-only)
3. On phone, change USB mode to "File Transfer" or "PTP"
4. Disconnect and reconnect USB cable
5. On laptop, try: `chrome://inspect/#devices`

### Can't see the PWA in the list?

1. Make sure the PWA is open on your phone
2. Try opening it in Chrome browser first, then install as PWA
3. Refresh the chrome://inspect page

### "Pending authentication" message?

1. On your phone, you should see a popup asking to allow USB debugging
2. Check "Always allow from this computer"
3. Click OK

---

## Quick Test

To verify remote debugging is working:

1. Connect phone via USB
2. Open chrome://inspect on laptop
3. Open ANY website on phone's Chrome
4. You should see it listed
5. Click "Inspect"
6. In the console, type: `console.log('Hello from phone!')`
7. You should see it in the DevTools console

If this works, you're all set!

---

## Deploy and Test

1. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

2. **On your phone PWA:**
   - Refresh the app (pull down to refresh)
   - Or uninstall and reinstall the PWA

3. **Connect USB and open chrome://inspect**

4. **Click "Sign in with Google"**

5. **Watch the console logs in real-time!**

---

## What to Send Me

After testing, send me:

1. **Screenshot or copy of console logs** showing the entire flow
2. **Any error messages** (especially error codes)
3. **The URL** that appears after redirecting back from Google

With these logs, I can tell you exactly what's wrong!

---

## Pro Tips

- Keep the DevTools window open while testing
- Use the "Preserve log" checkbox in DevTools to keep logs after navigation
- Use the "Filter" box to search for specific emojis like 🔵 or ❌
- Take screenshots of the logs at each step

The console logs will show EXACTLY where the flow is breaking!
