# Vercel Redeploy Guide

## How to Redeploy on Vercel

You have 2 options:

### Option 1: Redeploy from Dashboard (Recommended)
1. Go to: https://vercel.com/seanthetechyyy-6539s-projects/lyfind-campus-item-finder/deployments
2. Click on the **latest deployment** (the one at the top)
3. Click the **three dots (•••)** button in the top right
4. Select **"Redeploy"**
5. Confirm the redeploy

### Option 2: Push Empty Commit
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

---

## Critical Issue: OTP Won't Work on Vercel

### The Problem
Your OTP system uses an **in-memory Map** to store OTPs:
```typescript
const otpStore = new Map<string, { otp: string; expiresAt: number }>();
```

This works locally but **FAILS on Vercel** because:
- Vercel uses **serverless functions**
- Each request may hit a **different function instance**
- Memory is **NOT shared** between instances
- OTP stored in one instance is **NOT available** in another

### The Solution
You need to store OTPs in a **persistent database** instead of memory. Here are your options:

#### Option 1: Use Firebase Firestore (Recommended - Already Set Up)
Store OTPs in Firestore with automatic expiration:

```typescript
// In emailService.ts
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// Replace otpStore Map with Firestore
async sendOTP(email: string) {
  const otp = this.generateOTP();
  
  // Store in Firestore instead of Map
  await setDoc(doc(db, 'otps', email.toLowerCase()), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  
  // Send email...
}

async verifyOTP(email: string, otp: string) {
  const docRef = doc(db, 'otps', email.toLowerCase());
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return { success: false, message: 'No OTP found' };
  }
  
  const stored = docSnap.data();
  
  if (Date.now() > stored.expiresAt) {
    await deleteDoc(docRef);
    return { success: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== otp.trim()) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  await deleteDoc(docRef);
  return { success: true, message: 'Verified!' };
}
```

#### Option 2: Use Vercel KV (Redis)
- Requires Vercel Pro plan ($20/month)
- Fast and reliable
- Built for serverless

#### Option 3: Use Upstash Redis (Free Tier Available)
- Free tier: 10,000 commands/day
- Works with Vercel
- Easy setup

---

## What You Need to Do NOW

### Step 1: Fix OTP Storage (Choose One)

**Recommended: Use Firestore**
1. I can update `src/services/emailService.ts` to use Firestore
2. This will work immediately with your existing Firebase setup
3. No additional cost or setup required

**Alternative: Use Upstash Redis**
1. Sign up at https://upstash.com
2. Create a Redis database
3. Add environment variables to Vercel
4. Update emailService.ts to use Redis

### Step 2: Redeploy Vercel
After fixing OTP storage, redeploy using Option 1 above.

### Step 3: Test Everything
- Google Sign-In on mobile
- OTP verification
- Push notifications (after VAPID setup)

---

## Current Status

✅ All environment variables added to Vercel
✅ Google Sign-In code fixed for mobile
❌ OTP system needs database storage
❌ Need to redeploy after fixing OTP

---

## Do You Want Me To:
1. **Fix OTP to use Firestore** (recommended, quick, free)
2. **Set up Upstash Redis** (requires signup)
3. **Just redeploy as-is** (Google Sign-In will work, OTP won't)
