# ✅ Your Server is Live! Complete Setup Now

Your notification server is deployed at:
**https://lyfind-notifications.onrender.com**

## Quick Checklist (10 minutes)

### ✅ Step 1: Test Server Health (30 seconds)

Open in browser:
```
https://lyfind-notifications.onrender.com/health
```

Should show: `{"status":"healthy",...}`

---

### ✅ Step 2: Get VAPID Key (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **lyfind-72845**
3. Click ⚙️ → **Project Settings** → **Cloud Messaging** tab
4. Scroll to **Web Push certificates**
5. Click **Generate key pair**
6. **Copy the key** (starts with `B...`)

Example: `BFxxx...long-string...xxx`

---

### ✅ Step 3: Update VAPID Key in Code (1 minute)

Open: `src/lib/firebase-messaging.ts`

Find line 67 and replace:
```typescript
vapidKey: 'YOUR_VAPID_KEY_HERE'
```

With your actual key:
```typescript
vapidKey: 'BFxxx...your-actual-key...xxx'
```

---

### ✅ Step 4: Rebuild Your App (1 minute)

```bash
npm run build
```

---

### ✅ Step 5: Test Locally (2 minutes)

```bash
npm run dev
```

1. Open http://localhost:3000
2. Log in
3. You should see notification permission prompt
4. Click "Allow"
5. Check browser console - should see FCM token

---

### ✅ Step 6: Test Notification (2 minutes)

#### Get Your User ID:
1. Open browser console (F12)
2. Type: `localStorage.getItem('firebase:authUser:...')`
3. Find your `uid` in the output

#### Send Test Notification:

**PowerShell:**
```powershell
$body = @{
    userId = "YOUR_USER_ID_HERE"
    title = "Test Notification"
    message = "Your notification system is working!"
    actionUrl = "/notifications"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://lyfind-notifications.onrender.com/api/send-notification" -Method Post -Headers @{"Content-Type"="application/json"; "X-API-Secret"="lyfind-secret-key-change-this-in-production"} -Body $body
```

**Or use curl (Git Bash):**
```bash
curl -X POST https://lyfind-notifications.onrender.com/api/send-notification \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: lyfind-secret-key-change-this-in-production" \
  -d '{
    "userId": "YOUR_USER_ID_HERE",
    "title": "Test Notification",
    "message": "Your notification system is working!",
    "actionUrl": "/notifications"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "sent": 1,
  "failed": 0
}
```

You should see a notification appear!

---

### ✅ Step 7: Test Background Notifications (2 minutes)

1. Keep your app open
2. Grant notification permission
3. **Close the app completely**
4. Send another test notification (use command above)
5. 🎉 You should receive a notification even though app is closed!

---

### ✅ Step 8: Deploy to Production (2 minutes)

```bash
# Deploy to Vercel
vercel --prod

# Or Firebase Hosting
npm run build
firebase deploy
```

---

## Troubleshooting

### "No FCM tokens for user"
**Solution:** User needs to grant notification permission first
- Open app → Allow notifications → Try again

### "Unauthorized"
**Solution:** Check API_SECRET matches
- Main `.env`: `VITE_NOTIFICATION_API_SECRET`
- Render env vars: `API_SECRET`
- Both must be identical

### "Server not responding"
**Solution:** Render free tier sleeps after 15 min
- First request wakes it (takes 1-2 seconds)
- Subsequent requests are instant

### VAPID key error
**Solution:** Make sure you copied the entire key
- Should start with `B`
- Should be very long (100+ characters)
- No quotes or extra spaces

---

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
1. ✅ Save to Firestore
2. ✅ Show browser notification if app is open
3. ✅ Call your Render server
4. ✅ Server sends push via FCM
5. ✅ User receives notification (even if app closed!)

---

## Next Steps

1. ✅ Complete VAPID setup (Step 2-3 above)
2. ✅ Test locally (Step 5-6)
3. ✅ Test background notifications (Step 7)
4. ✅ Deploy to production (Step 8)
5. ✅ Change API_SECRET to something secure
6. ✅ Test with real users

---

## Security Reminder

Before going live, generate a secure API secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update in:
1. Render Dashboard → Environment Variables → `API_SECRET`
2. Your `.env` → `VITE_NOTIFICATION_API_SECRET`

---

## You're Almost Done! 🎉

Just complete the VAPID key setup (Steps 2-3) and you'll have:
- ✅ Background push notifications
- ✅ Multi-device support
- ✅ 24/7 operation
- ✅ Free hosting
- ✅ Production-ready system

Total time remaining: ~5 minutes
Total cost: $0/month

Let's finish this! 🚀
