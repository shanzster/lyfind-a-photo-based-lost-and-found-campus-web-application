# Seed Admin Account - UI Method

## Quick Access

Go to: **`/seed-admin`**

Example:
- Local: `http://localhost:5173/seed-admin`
- Deployed: `https://lyfind-campus-item-finder.vercel.app/seed-admin`

## What It Does

1. Click the "Create Admin Account" button
2. Creates admin account with:
   - **Email:** `admin@lsb.edu.ph`
   - **Password:** `Admin123!@#`
   - **Role:** Super Admin
   - **All permissions enabled**

3. Shows success message with UID
4. Redirects you to login

## After Creation

1. Go to `/admin/login`
2. Login with:
   - Email: `admin@lsb.edu.ph`
   - Password: `Admin123!@#`
3. **Change password immediately!**

## If Account Already Exists

If you see "Admin account already exists", it means:
- The email `admin@lsb.edu.ph` is already registered
- Try logging in with your existing password
- Or use a different email in the UI code

## Troubleshooting

### "Email already in use"
- Account already exists
- Try logging in at `/admin/login`
- Check Firebase Console → Authentication for existing users

### "Weak password"
- Change the password in `src/pages/SeedAdmin.tsx`
- Line 9: `password: 'YourNewPassword123!@#'`

### Button doesn't work
- Check browser console for errors
- Make sure Firebase is configured correctly
- Check `.env` file has all Firebase credentials

---

**Quick Start:**
1. Go to `/seed-admin`
2. Click "Create Admin Account"
3. Login at `/admin/login`
4. Change password!
