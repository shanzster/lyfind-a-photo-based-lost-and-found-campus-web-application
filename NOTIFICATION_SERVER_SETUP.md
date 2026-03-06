# Notification Server Setup Guide

## What We Built

A simple Node.js backend server that:
- ✅ Listens for notification requests from your app
- ✅ Sends push notifications via Firebase Cloud Messaging
- ✅ Handles multiple devices per user
- ✅ Automatically cleans up invalid tokens
- ✅ Runs 24/7 on free hosting

## Quick Setup (5 Steps)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **lyfind-72845**
3. Click gear icon → **Project Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Download the JSON file

### Step 2: Install & Configure Server

```bash
# Navigate to notification server
cd notification-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials from the downloaded JSON:

```env
FIREBASE_PROJECT_ID=lyfind-72845
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lyfind-72845.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
PORT=3001
API_SECRET=make-up-a-random-secret-key-here
```

### Step 3: Test Locally

```bash
# Start the server
npm start

# In another terminal, test it:
curl http://localhost:3001/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Step 4: Deploy to Free Hosting

#### Option A: Render.com (Recommended)

1. Go to [render.com](https://render.com) and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** lyfind-notifications
   - **Root Directory:** `notification-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add environment variables (copy from your `.env`)
6. Click **Create Web Service**

Your server will be at: `https://lyfind-notifications.onrender.com`

#### Option B: Railway.app

1. Go to [railway.app](https://railway.app) and sign up
2. Click **New Project** → **Deploy from GitHub**
3. Select your repo
4. Click **Add variables** and paste your `.env` contents
5. Deploy!

### Step 5: Update Your App

Add to your `.env`:

```env
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com
VITE_NOTIFICATION_API_SECRET=same-secret-as-server
```

Rebuild your app:
```bash
npm run build
```

## How It Works

### Flow Diagram:

```
User sends message
    ↓
Your app calls notificationService.createNotification()
    ↓
Saves to Firestore (for history)
    ↓
Calls notification server API
    ↓
Server gets recipient's FCM tokens from Firestore
    ↓
Server sends push via Firebase Cloud Messaging
    ↓
User's phone receives notification (even if app is closed!)
```

### Example Usage:

```typescript
// When user sends a message
await notificationService.createNotification({
  userId: recipientId,
  type: 'message',
  title: 'New Message',
  message: `${senderName} sent you a message`,
  actionUrl: `/messages?conversation=${conversationId}`,
  metadata: {
    conversationId,
    senderId,
    senderName,
  }
});
```

The notification will:
1. ✅ Save to Firestore
2. ✅ Show browser notification if app is open
3. ✅ Send push notification via backend
4. ✅ Appear on user's phone even if app is closed

## Testing

### Test 1: Server Health

```bash
curl https://your-server.onrender.com/health
```

Expected: `{"status":"healthy",...}`

### Test 2: Send Test Notification

```bash
curl -X POST https://your-server.onrender.com/api/send-notification \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: your-secret-key" \
  -d '{
    "userId": "test-user-id",
    "title": "Test Notification",
    "message": "This is a test!",
    "actionUrl": "/notifications"
  }'
```

Expected: `{"success":true,"sent":1,...}`

### Test 3: End-to-End

1. Open your app on phone
2. Grant notification permission
3. Log in
4. Have another user send you a message
5. Close the app completely
6. You should receive a push notification!

## Monitoring

### Check Server Status:
- Render: Dashboard → Your Service → Logs
- Railway: Dashboard → Your Project → Deployments

### Check Notification Delivery:
- Firebase Console → Cloud Messaging → Reports
- Your server logs will show each notification sent

## Troubleshooting

### Server won't start:
```bash
# Check logs on hosting platform
# Verify environment variables are set
# Ensure Firebase credentials are correct
```

### Notifications not received:
1. Check user has FCM token in Firestore:
   ```javascript
   // In Firebase Console → Firestore → users → [userId]
   // Should have: fcmTokens: ["token1", "token2"]
   ```

2. Check server logs for errors

3. Verify notification permission granted in browser

4. Test with Firebase Console's "Send test message"

### Invalid token errors:
- Server automatically removes invalid tokens
- User needs to re-grant permission
- Check browser console for FCM errors

## Cost Breakdown

### Free Tier Limits:

**Render.com:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ Sleeps after 15 min inactivity (wakes in <1 sec)
- ✅ Unlimited requests

**Railway.app:**
- ✅ $5 credit/month
- ✅ ~500 hours of runtime
- ✅ No sleep

**Firebase:**
- ✅ Unlimited FCM messages
- ✅ Free on Spark plan

**Total Cost: $0/month** for typical campus app usage

## Scaling

If your app grows:
- Free tier handles ~10,000 notifications/day
- Upgrade to paid tier ($7/month) for unlimited
- Or upgrade Firebase to Blaze plan for Cloud Functions

## Security Best Practices

1. ✅ Keep API_SECRET secret
2. ✅ Use HTTPS in production
3. ✅ Rotate secrets regularly
4. ✅ Monitor for unusual activity
5. ✅ Rate limit if needed

## Next Steps

1. Complete VAPID key setup (see PWA_PUSH_NOTIFICATIONS_SETUP.md)
2. Deploy notification server
3. Update app with server URL
4. Test end-to-end
5. Monitor for a few days
6. Consider upgrading to Cloud Functions later for easier management

## Support

If you have issues:
1. Check server logs
2. Check Firebase Console
3. Check browser console
4. Test with curl commands above
5. Verify environment variables

The server is simple and reliable - once deployed, it just works! 🚀
