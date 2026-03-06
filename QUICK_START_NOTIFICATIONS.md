# Quick Start: Push Notifications in 10 Minutes

## What You'll Get

✅ Background push notifications (works when app is closed)
✅ Multi-device support
✅ Automatic token management
✅ Free hosting
✅ Works on Spark Plan

## Step-by-Step Setup

### 1. Get Firebase Service Account (2 minutes)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select **lyfind-72845**
3. Click ⚙️ → **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key** → Download JSON

### 2. Setup Notification Server (3 minutes)

```bash
# Install dependencies
cd notification-server
npm install

# Create environment file
cp .env.example .env
```

Open `.env` and paste from your downloaded JSON:

```env
FIREBASE_PROJECT_ID=lyfind-72845
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lyfind-72845.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
API_SECRET=make-up-any-random-string-here
```

### 3. Test Locally (1 minute)

```bash
npm start
```

Open browser: http://localhost:3001/health

Should see: `{"status":"healthy"}`

### 4. Deploy to Render (3 minutes)

1. Go to [render.com](https://render.com) → Sign up (free)
2. Click **New** → **Web Service**
3. Connect GitHub → Select your repo
4. Settings:
   - **Name:** lyfind-notifications
   - **Root Directory:** `notification-server`
   - **Build:** `npm install`
   - **Start:** `npm start`
   - **Plan:** Free
5. Click **Environment** → Add variables from your `.env`
6. Click **Create Web Service**

Wait 2-3 minutes for deployment...

### 5. Update Your App (1 minute)

Add to your main `.env`:

```env
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com
VITE_NOTIFICATION_API_SECRET=same-secret-as-server
```

Rebuild:
```bash
npm run build
```

## Test It!

### Test 1: Server Health

```bash
curl https://lyfind-notifications.onrender.com/health
```

✅ Should return: `{"status":"healthy"}`

### Test 2: Send Test Notification

Replace `YOUR_USER_ID` with a real user ID from Firestore:

```bash
curl -X POST https://lyfind-notifications.onrender.com/api/send-notification \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: your-secret-key" \
  -d '{
    "userId": "YOUR_USER_ID",
    "title": "Test Notification",
    "message": "If you see this, it works!",
    "actionUrl": "/notifications"
  }'
```

✅ Should return: `{"success":true,"sent":1}`

### Test 3: Real World Test

1. Open app on your phone
2. Grant notification permission
3. Log in
4. Note your user ID (check Firestore or browser console)
5. Close the app completely
6. Send test notification using curl above
7. 🎉 You should receive a push notification!

## What Happens Now?

Every time your app creates a notification:

```typescript
await notificationService.createNotification({
  userId: recipientId,
  type: 'message',
  title: 'New Message',
  message: 'John sent you a message',
  actionUrl: '/messages'
});
```

The notification will:
1. ✅ Save to Firestore (for history)
2. ✅ Show in-app if user is online
3. ✅ Send push via your backend server
4. ✅ Appear on user's phone even if app is closed

## Troubleshooting

### "No FCM tokens for user"
- User needs to grant notification permission
- Check Firestore → users → [userId] → fcmTokens array

### "Server not responding"
- Check Render dashboard for logs
- Verify environment variables are set
- Server may be sleeping (free tier) - first request wakes it

### "Unauthorized"
- Check API_SECRET matches in both .env files
- Verify X-API-Secret header is sent

## Cost

**$0/month** - Everything is free:
- ✅ Render.com free tier (750 hours/month)
- ✅ Firebase Cloud Messaging (unlimited)
- ✅ Firebase Spark Plan (sufficient for campus app)

## Next Steps

1. ✅ Complete VAPID key setup (see PWA_PUSH_NOTIFICATIONS_SETUP.md)
2. ✅ Test with real users
3. ✅ Monitor server logs for a few days
4. ✅ Consider upgrading to Blaze plan later for Cloud Functions (easier)

## Support

Server logs: Render Dashboard → Your Service → Logs
Firebase logs: Firebase Console → Cloud Messaging

That's it! Your push notifications are now working 24/7 🚀
