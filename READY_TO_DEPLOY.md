# ✅ Ready to Deploy - Your Notification Server is Configured!

## What's Done

I've configured your notification server with your Firebase credentials. Everything is ready to go!

## Quick Test (2 minutes)

### 1. Install and Start Server

```bash
cd notification-server
npm install
npm start
```

You should see:
```
🔥 Firebase Admin initialized
🚀 Notification server running on port 3001
📍 Health check: http://localhost:3001/health
```

### 2. Test Health Check

Open browser: http://localhost:3001/health

Should show:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.123
}
```

✅ If you see this, your server is working!

## Deploy to Render (5 minutes)

### Step 1: Push to GitHub

```bash
# Make sure notification-server/.env is in .gitignore (it already is)
git add .
git commit -m "Add notification server"
git push
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New** → **Web Service**
3. Connect your GitHub account
4. Select your **LyFind** repository
5. Configure:

```
Name: lyfind-notifications
Root Directory: notification-server
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

6. Click **Advanced** → **Add Environment Variable**

Add these (copy from your `notification-server/.env`):

```
FIREBASE_PROJECT_ID = lyfind-72845

FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@lyfind-72845.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8RlcH1sa4rv8L
6qVw7b5ymCnmV69LVYrXk1XYcochHQLMGmv+2ag6U20dxWmtxVVk/bPx+n9f4i7d
QlC+iqgoO7u9IdRtL/7wS8MVEzawwk+O5e6E3V+Z7uuuMmQpCw3g//HYG2jZg+PG
WM4zrPW4s5RIlHPsBBzp1kWwdiKnfMZWrqndaKxsFVVkAvrPbUw1gYhHS+EKW1vj
r2lPPt2U1g/YQaPWXy7ysV9chYCdgLWRu0nRnS+QZ239SwckTsLvkW+CTXV+C9gy
Pmt/mA7Z7qGKg18kZS+y5U3PmGhsWB2dkI3/AhYtIkgVAzVK3zHkSCfKui+eXWm+
jQXhS9/PAgMBAAECggEAAuxhel2ukdXykw/+dNWimP6D2zyOHD1Xyo3r51B5iKoX
dDpBmW0HwuAVi0DL3OB57JEdgJEpj40tIE8tsce1YYQlhh159VGpdutP1b2J1XTI
h3XkHjjRvMu/UEhRn2sfuNhAiRQXExZZLKgN8f93HhPe8yf0izwFHU+Wa9PQKSMs
xUDfooh3Y/0uofJP+dY3qB5+E9QNii6lcwD1tjcb6YhLrhQQVO53eIQ3ik7GVogC
cDKM40TITn8DHvKHQZYBXsAX4gEamGCpDHR7oKhAUgJNTSF/LC/R6gTyeaFmqFYq
H5XHOHc7pvrlBCHVqd7+kJjz3JNPdcKEwA0EnmABAQKBgQD49M1z/ujM3+qlEPxQ
IuVJIutXZsTGV6AvZqQRUdKdHe9oaqO94e3CWYZUGFP4CdFr69fDozBXSS4eFYPx
g6atTK4Dp136hP9y0pkuW3/US4qogRf2v0rck83KpRWy+pC5quIjZzXxSOu70lLN
jtM4gDGDRcddRPtO4afwrrK0WwKBgQDBmgUDGaTSwPQXlmkzsWnZoSPtecC47ack
BeW60FX7EgS9K6stwTksDJFEy3XMeYjOBgrmIFHIKGbKyJIAd3vegLV50W3rtQJg
ds6tW3iWKegr5X7afLPCJ9TFiVWN9pp+rXkuqEl/gShCcUR7VKLO07TqxsRSe4B3
maHlP+0MnQKBgQDBQXeDheu9rkx92pOiuZP3lC3QaSxzM25bnXfbIgM2iBhim/WD
3zAr4EcQXNpB/40cE7YoXjOWbm5oWBdWkfX/LTkgCPpBEKEjxyu1+r1eVU3LxHqP
xqscU3g6yK/xgeR63JYzGVmcdhjYckpo22hHweutlatPUc8ryqwNf++lZQKBgHEn
9Z//QBASyVh0CF83ZffWsGofzJ4KAbQTYlfTZz3NJUnwGSgwFJuDaPD9vodZzbUl
YP9qioJj4tjJbFSrgZHmRqvB1e57qLz7FAfNO+kA63uksoU/d82WfE1M3N2R8nDy
Ma8sm3DT69UR4QX4zQP4R3kl3h+bodXFzRNyTrodAoGARweWiiDTP3SCDFe+2MT1
w3vtB81qHarkcJZVXcAgC/8qvL0eAEw1VuTgLkbYCEYFmKgF1ZxooytnhtAaLHc4
JrgE/XrQ1DzSLha0L8HYuEaUZt8eTIS7+c2T1e9f+0v4E2Oww7y3yDYIS4YxKhrr
i8cM7Hl19jrqJZ48PSH7PLw=
-----END PRIVATE KEY-----

NODE_ENV = production

API_SECRET = lyfind-secret-key-change-this-in-production
```

**Important:** For FIREBASE_PRIVATE_KEY, paste the ENTIRE key including the BEGIN and END lines, but WITHOUT the quotes and \n characters. Render will handle the formatting.

7. Click **Create Web Service**

Wait 2-3 minutes for deployment...

### Step 3: Get Your Server URL

Once deployed, you'll see:
```
Your service is live at https://lyfind-notifications.onrender.com
```

Copy this URL!

### Step 4: Update Your Main App

Add to your main project's `.env`:

```env
VITE_NOTIFICATION_SERVER_URL=https://lyfind-notifications.onrender.com
VITE_NOTIFICATION_API_SECRET=lyfind-secret-key-change-this-in-production
```

Rebuild your app:
```bash
npm run build
```

## Test End-to-End

### 1. Test Server Health

```bash
curl https://lyfind-notifications.onrender.com/health
```

Should return: `{"status":"healthy",...}`

### 2. Test Notification (Replace USER_ID)

```bash
curl -X POST https://lyfind-notifications.onrender.com/api/send-notification \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: lyfind-secret-key-change-this-in-production" \
  -d '{
    "userId": "YOUR_USER_ID_HERE",
    "title": "Test Notification",
    "message": "If you see this, it works!",
    "actionUrl": "/notifications"
  }'
```

Should return: `{"success":true,"sent":1,...}`

### 3. Real World Test

1. Open your app on phone
2. Grant notification permission
3. Log in (note your user ID)
4. Close the app completely
5. Send test notification using curl above
6. 🎉 You should receive a push notification!

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

It will:
1. ✅ Save to Firestore (for history)
2. ✅ Show browser notification if app is open
3. ✅ Call your Render backend
4. ✅ Backend sends push via FCM
5. ✅ User receives notification even if app is closed!

## Monitoring

### Check Server Logs:
Render Dashboard → lyfind-notifications → Logs

### Check Notifications:
Firebase Console → Cloud Messaging → Reports

## Troubleshooting

### "No FCM tokens for user"
- User needs to grant notification permission
- Check Firestore → users → [userId] → fcmTokens array

### "Server not responding"
- Check Render dashboard for errors
- Verify environment variables are set correctly
- Server may be sleeping (free tier) - first request wakes it

### "Unauthorized"
- Check API_SECRET matches in both .env files
- Verify X-API-Secret header is sent

## Cost

**$0/month** - Everything is free:
- ✅ Render.com free tier (750 hours/month)
- ✅ Firebase Cloud Messaging (unlimited)
- ✅ Firebase Spark Plan

## Next Steps

1. ✅ Test locally (done if health check works)
2. ✅ Deploy to Render (follow steps above)
3. ✅ Update main app .env
4. ✅ Test end-to-end
5. ✅ Complete VAPID key setup (see PWA_PUSH_NOTIFICATIONS_SETUP.md)
6. ✅ Deploy your main app to Vercel
7. 🎉 Enjoy background push notifications!

## Security Note

**IMPORTANT:** Change the API_SECRET to a random string before deploying to production!

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update it in both:
- `notification-server/.env` (for Render)
- Your main `.env` (for your app)

---

Your notification server is ready! Just deploy to Render and you're done! 🚀
