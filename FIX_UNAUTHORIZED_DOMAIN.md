# 🔧 Fix: Firebase Unauthorized Domain Error

## The Error
```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

This means your current domain is not authorized in Firebase Authentication settings.

---

## Quick Fix (2 minutes)

### Step 1: Go to Firebase Console
https://console.firebase.google.com/

### Step 2: Select Your Project
Click on **lyfind-72845**

### Step 3: Go to Authentication Settings
1. Click **Authentication** in the left sidebar
2. Click **Settings** tab at the top
3. Click **Authorized domains** section

### Step 4: Add Your Domains

You should see a list of authorized domains. Add these:

#### For Local Development:
```
localhost
```
(Should already be there by default)

#### For Vercel Deployment:
```
your-app-name.vercel.app
```
Replace `your-app-name` with your actual Vercel domain

#### For Custom Domain (if you have one):
```
yourdomain.com
www.yourdomain.com
```

### Step 5: Click "Add Domain"
1. Type the domain in the input field
2. Click **Add**
3. Repeat for each domain

---

## Common Domains to Add

### Development:
- `localhost` ✅ (usually pre-authorized)
- `127.0.0.1` (if needed)

### Production:
- `your-project.vercel.app`
- `your-project.web.app` (Firebase Hosting)
- `your-custom-domain.com`

### Testing:
- Any preview URLs from Vercel
- Staging domains

---

## What's Happening

Firebase Authentication only allows sign-in from authorized domains for security. When you try to sign in from an unauthorized domain, Firebase blocks it.

**Why localhost might not work:**
- You might be using a different port
- Browser might be using `127.0.0.1` instead of `localhost`
- Chrome extension interference

---

## Step-by-Step with Screenshots

### 1. Firebase Console
```
https://console.firebase.google.com/
↓
Select "lyfind-72845"
↓
Click "Authentication" (left sidebar)
↓
Click "Settings" tab
↓
Scroll to "Authorized domains"
```

### 2. Current Authorized Domains
You should see:
```
✓ lyfind-72845.firebaseapp.com
✓ lyfind-72845.web.app
✓ localhost (maybe)
```

### 3. Add New Domain
```
Click "Add domain" button
↓
Enter: localhost (if not there)
↓
Click "Add"
```

---

## Testing After Adding Domain

### 1. Clear Browser Cache
```
Chrome: Ctrl+Shift+Delete
Edge: Ctrl+Shift+Delete
Safari: Cmd+Option+E
```

### 2. Reload Your App
```
Hard refresh: Ctrl+Shift+R (Windows)
Hard refresh: Cmd+Shift+R (Mac)
```

### 3. Try Google Sign-In Again
Should work now! ✅

---

## Troubleshooting

### Still Getting Error After Adding Domain?

**1. Check the exact domain:**
- Open browser console (F12)
- Look at the error message
- It might show the exact domain being used
- Add that exact domain to Firebase

**2. Wait a few minutes:**
- Firebase changes can take 1-2 minutes to propagate
- Try again after waiting

**3. Check for typos:**
- Domain must match exactly
- No `http://` or `https://` prefix
- No trailing slashes
- Just the domain: `localhost` or `example.com`

**4. Disable browser extensions:**
- Some extensions can interfere
- Try in incognito/private mode

### Chrome Extension Error

The error you're seeing:
```
chrome-extension://...content_reporter.js:1 
Uncaught SyntaxError: Unexpected token 'export'
```

This is from a Chrome extension and is unrelated to Firebase. You can ignore it.

---

## For Different Environments

### Local Development (npm run dev)
```
Domain to add: localhost
Port: Usually 5173 or 3000
Full URL: http://localhost:5173
Add to Firebase: localhost (no port needed)
```

### Vercel Preview
```
Domain: your-app-git-branch-username.vercel.app
Add to Firebase: your-app-git-branch-username.vercel.app
```

### Vercel Production
```
Domain: your-app.vercel.app
Add to Firebase: your-app.vercel.app
```

### Custom Domain
```
Domain: yourdomain.com
Add to Firebase: yourdomain.com
Also add: www.yourdomain.com (if using www)
```

---

## Security Note

**Why Firebase requires this:**
- Prevents unauthorized sites from using your Firebase project
- Protects your users from phishing attacks
- Ensures only your domains can authenticate users

**Best Practice:**
- Only add domains you own and control
- Remove old/unused domains
- Use different Firebase projects for dev/staging/prod if needed

---

## Quick Checklist

- [ ] Go to Firebase Console
- [ ] Select lyfind-72845 project
- [ ] Click Authentication → Settings
- [ ] Scroll to Authorized domains
- [ ] Add `localhost` (if not there)
- [ ] Add your Vercel domain (when deployed)
- [ ] Click "Add" for each domain
- [ ] Wait 1-2 minutes
- [ ] Clear browser cache
- [ ] Try Google Sign-In again

---

## After Adding Domains

Your authorized domains should look like:
```
✓ lyfind-72845.firebaseapp.com
✓ lyfind-72845.web.app
✓ localhost
✓ your-app.vercel.app (when deployed)
```

---

## Need Help?

If you're still having issues:

1. **Check the exact error:**
   - Open browser console (F12)
   - Copy the full error message
   - Look for the domain mentioned in the error

2. **Verify domain format:**
   - Correct: `localhost`
   - Correct: `example.com`
   - Wrong: `http://localhost`
   - Wrong: `https://example.com`
   - Wrong: `localhost:5173`

3. **Try incognito mode:**
   - Rules out extension interference
   - Fresh session without cache

---

**Time to fix: 2 minutes**
**Difficulty: Easy**

Just add `localhost` to Firebase authorized domains and you're good to go! 🚀
