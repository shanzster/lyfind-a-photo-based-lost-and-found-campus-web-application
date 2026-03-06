# Vercel Deployment Options for LyFind

## TL;DR: Best Approach

**Deploy frontend to Vercel, backend to Render (both free)**

This gives you:
- ✅ Fast frontend (Vercel CDN)
- ✅ Reliable backend (Render always-on)
- ✅ Both free
- ✅ Simple setup

## Option 1: Split Deployment (Recommended) ⭐

### Frontend → Vercel
```bash
# In your project root
vercel
```

### Backend → Render
```bash
# Follow QUICK_START_NOTIFICATIONS.md
# Deploy notification-server/ to Render
```

### Configuration:
```env
# .env (for frontend)
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com
```

**Pros:**
- ✅ Best performance (Vercel CDN for frontend)
- ✅ Reliable notifications (Render always-on)
- ✅ Both free
- ✅ Easy to scale

**Cons:**
- ❌ Two deployments to manage

**Cost:** $0/month

---

## Option 2: All-in-One on Render

Deploy everything to Render as a single service.

### Setup:

1. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: lyfind
    env: node
    buildCommand: |
      npm install
      cd notification-server && npm install
      cd .. && npm run build
    startCommand: |
      node notification-server/server.js &
      npx serve -s dist -l 3000
    envVars:
      - key: NODE_ENV
        value: production
      - key: FIREBASE_PROJECT_ID
        sync: false
      - key: FIREBASE_CLIENT_EMAIL
        sync: false
      - key: FIREBASE_PRIVATE_KEY
        sync: false
      - key: API_SECRET
        sync: false
```

2. Deploy to Render
3. Add environment variables in Render dashboard

**Pros:**
- ✅ Single deployment
- ✅ One URL
- ✅ Free tier
- ✅ Simple

**Cons:**
- ❌ Slower frontend (no CDN)
- ❌ Both services share resources

**Cost:** $0/month

---

## Option 3: Vercel Serverless Functions (Not Recommended)

You CAN use Vercel for the backend, but it requires restructuring.

### How It Would Work:

Create `api/send-notification.js`:

```javascript
// api/send-notification.js
import admin from 'firebase-admin';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify API secret
  if (req.headers['x-api-secret'] !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId, title, message, actionUrl } = req.body;

  try {
    // Get user's FCM tokens
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    const tokens = userDoc.data()?.fcmTokens || [];

    if (tokens.length === 0) {
      return res.json({ success: false, error: 'No FCM tokens' });
    }

    // Send notifications
    const results = await Promise.allSettled(
      tokens.map(token =>
        admin.messaging().send({
          token,
          notification: { title, body: message },
          data: { actionUrl: actionUrl || '/notifications' },
        })
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;

    return res.json({
      success: successful > 0,
      sent: successful,
      failed: results.length - successful,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Update notification service:

```typescript
// src/services/notificationService.ts
const NOTIFICATION_SERVER_URL = '/api'; // Use Vercel API routes
```

**Pros:**
- ✅ Single deployment
- ✅ Same domain
- ✅ Free tier

**Cons:**
- ❌ Cold starts (2-3 second delay)
- ❌ 10-second timeout limit
- ❌ More complex
- ❌ Less reliable for background jobs
- ❌ Firebase Admin SDK initialization overhead

**Cost:** $0/month (within free tier limits)

---

## Option 4: Firebase Cloud Functions (Easiest Long-term)

Upgrade to Blaze plan and use Cloud Functions.

### Setup:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  const { userId, title, message, actionUrl } = data;

  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();

  const tokens = userDoc.data()?.fcmTokens || [];

  const results = await Promise.all(
    tokens.map(token =>
      admin.messaging().send({
        token,
        notification: { title, body: message },
        data: { actionUrl },
      })
    )
  );

  return { success: true, sent: results.length };
});
```

**Pros:**
- ✅ Easiest setup
- ✅ Most reliable
- ✅ Auto-scaling
- ✅ Integrated with Firebase
- ✅ Can trigger on Firestore changes

**Cons:**
- ❌ Requires Blaze plan
- ❌ Costs ~$0-5/month

**Cost:** ~$0-5/month (pay-as-you-go)

---

## Comparison Table

| Feature | Split (Vercel+Render) | All-in-One (Render) | Vercel Functions | Cloud Functions |
|---------|----------------------|---------------------|------------------|-----------------|
| **Cost** | $0 | $0 | $0 | ~$0-5/mo |
| **Setup Complexity** | Medium | Easy | Hard | Easy |
| **Frontend Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Backend Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Notification Speed** | Fast | Fast | Slow (cold start) | Fast |
| **Scalability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintenance** | Low | Low | Medium | Very Low |

---

## My Recommendation

### For Now (Development/Launch):
**Option 1: Split Deployment (Vercel + Render)**

Why:
- ✅ Best performance
- ✅ Free
- ✅ Reliable
- ✅ Easy to setup

### Later (When Scaling):
**Option 4: Cloud Functions**

Why:
- ✅ Easiest to maintain
- ✅ Most reliable
- ✅ Auto-scaling
- ✅ Worth the $2-5/month

---

## Quick Setup Guide

### Split Deployment (Recommended):

```bash
# 1. Deploy frontend to Vercel
vercel

# 2. Deploy backend to Render
# Follow QUICK_START_NOTIFICATIONS.md

# 3. Update frontend .env
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com

# 4. Redeploy frontend
vercel --prod
```

**Total time:** 15 minutes
**Total cost:** $0/month

---

## FAQ

**Q: Can I deploy everything to Vercel?**
A: Yes, but not recommended. Serverless functions have cold starts and timeouts.

**Q: Why not use Vercel for backend too?**
A: Vercel functions are serverless (start/stop on each request). Notification server needs to run continuously.

**Q: Is Render reliable?**
A: Yes! Free tier sleeps after 15 min inactivity but wakes in <1 second. Perfect for notifications.

**Q: What if I outgrow free tier?**
A: Upgrade to Render paid ($7/mo) or Firebase Blaze (~$2-5/mo). Both handle millions of notifications.

**Q: Can I switch later?**
A: Yes! Start with free split deployment, upgrade to Cloud Functions when ready. No code changes needed.

---

## Conclusion

**Start with Option 1 (Vercel + Render)** - It's free, fast, and reliable. When your app grows and you want easier management, upgrade to Cloud Functions. But for now, the split deployment gives you the best of both worlds at zero cost.
