# Notification Issues Fixed

## Problems Identified

1. **Browser notifications showing to sender (YOU) instead of recipient** ❌
2. **Push notifications not being sent to recipient's phone** (needs investigation)

## Problem 1: Browser Notifications to Sender (FIXED)

### Root Cause
The `showBrowserNotification()` function was being called immediately when creating a notification in `createNotification()`. This meant the SENDER's browser would show the notification, not the recipient's.

### The Fix
1. Removed `showBrowserNotification()` from `createNotification()`
2. Added it to `subscribeToNotifications()` real-time listener
3. Only shows browser notifications for NEW notifications (not on first load)
4. Only shows for the RECIPIENT who is subscribed to their own notifications

### How It Works Now
1. You send a message to Sean
2. `messageService.sendMessage()` calls `notificationService.notifyNewMessage(seanId, ...)`
3. Notification is created in Firestore for Sean (userId: seanId)
4. Sean's browser (if open) receives the notification via real-time listener
5. Sean's browser shows the notification
6. Your browser does NOT show anything (because the notification userId is Sean, not you)

## Problem 2: Push Notifications Not Sent to Phone

### Possible Causes

1. **Render server is down or sleeping**
   - Free tier Render services sleep after 15 minutes of inactivity
   - Check: https://lyfind-notifications.onrender.com/health

2. **User (Sean) hasn't registered for push notifications**
   - Check Firestore `fcmTokens` collection
   - Does Sean have a token saved?

3. **FCM token expired or invalid**
   - Tokens can expire
   - Need to refresh token

4. **Notification server error**
   - Check Render logs for errors
   - Look for "Failed to send push" messages

### How to Debug

#### Step 1: Check if Render server is running
Open in browser: https://lyfind-notifications.onrender.com/health

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

If it doesn't load, the server is sleeping or down.

#### Step 2: Check Firestore for FCM tokens
1. Go to Firebase Console → Firestore
2. Open `fcmTokens` collection
3. Look for Sean's userId
4. Check if there's a token

#### Step 3: Check Render logs
1. Go to Render dashboard
2. Open your notification server
3. Click "Logs"
4. Look for errors when you send a message

#### Step 4: Test the notification server directly
Open browser console and run:
```javascript
fetch('https://lyfind-notifications.onrender.com/api/send-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Secret': 'lyfind-secret-key-change-this-in-production'
  },
  body: JSON.stringify({
    userId: 'SEAN_USER_ID_HERE',
    title: 'Test Notification',
    message: 'This is a test',
    actionUrl: '/messages'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Replace `SEAN_USER_ID_HERE` with Sean's actual user ID from Firestore.

### Expected Flow

1. You send message to Sean
2. `notificationService.createNotification()` is called with `userId: seanId`
3. Notification saved to Firestore
4. `sendPushViaBackend()` is called
5. POST request sent to Render server: `/api/send-notification`
6. Render server looks up Sean's FCM token in Firestore
7. Render server sends push notification via FCM
8. Sean's phone receives push notification

### Common Issues

#### Issue: Render server is sleeping
**Solution:** Upgrade to paid tier OR keep it awake with a cron job

#### Issue: No FCM token for user
**Solution:** User needs to:
1. Open the app
2. Allow notifications when prompted
3. Token will be saved automatically

#### Issue: Token expired
**Solution:** Token refresh happens automatically, but user may need to:
1. Clear app data
2. Reinstall PWA
3. Allow notifications again

#### Issue: Wrong API secret
**Solution:** Make sure `.env` and Render environment variables match

## Files Modified

1. `src/services/notificationService.ts`
   - Removed `showBrowserNotification()` from `createNotification()`
   - Added browser notification logic to `subscribeToNotifications()`
   - Only shows for NEW notifications (not first load)

## Testing

### Test Browser Notifications (Fixed)
1. Open app in two browsers
2. Login as User A in Browser 1
3. Login as User B in Browser 2
4. User A sends message to User B
5. Browser 2 should show notification ✅
6. Browser 1 should NOT show notification ✅

### Test Push Notifications (Needs Investigation)
1. User A on desktop browser
2. User B on phone (PWA installed)
3. User B closes the PWA
4. User A sends message to User B
5. User B's phone should receive push notification
6. If not, check Render logs and Firestore tokens

## Next Steps

1. **Deploy the fix:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

2. **Test browser notifications** (should work now)

3. **Check Render server status:**
   - Visit: https://lyfind-notifications.onrender.com/health
   - Check Render logs

4. **Check FCM tokens in Firestore:**
   - Does Sean have a token?
   - Is it recent?

5. **Test push notifications:**
   - Send message to Sean
   - Check if he receives push on phone
   - If not, check Render logs for errors

## Send Me

If push notifications still don't work, send me:
1. Screenshot of Render logs (when you send a message)
2. Screenshot of Firestore `fcmTokens` collection
3. Sean's user ID
4. Any error messages in browser console
