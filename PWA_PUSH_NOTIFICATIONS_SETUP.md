# PWA & Push Notifications Setup Guide

## Current Status

### ✅ Implemented Features

1. **Persistent Login**
   - Firebase Auth with `browserLocalPersistence`
   - Users stay logged in across browser sessions
   - Login persists until explicit logout

2. **PWA Manifest**
   - App can be installed on mobile devices
   - Standalone app experience
   - Custom app icons and theme colors
   - App shortcuts for quick access

3. **Service Worker**
   - Firebase Cloud Messaging service worker configured
   - Background notification handling
   - Notification click handling

4. **Push Notification Infrastructure**
   - FCM token management
   - Foreground message handling
   - Browser notification API integration

### ⚠️ Required Setup Steps

To enable full background push notifications, you need to complete these steps:

## Step 1: Generate VAPID Key in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lyfind-72845`
3. Go to **Project Settings** (gear icon) → **Cloud Messaging** tab
4. Scroll to **Web Push certificates**
5. Click **Generate key pair**
6. Copy the generated VAPID key

## Step 2: Update VAPID Key in Code

Open `src/lib/firebase-messaging.ts` and replace:

```typescript
vapidKey: 'YOUR_VAPID_KEY_HERE'
```

With your actual VAPID key:

```typescript
vapidKey: 'BFxxx...your-actual-key...xxx'
```

## Step 3: Enable Firebase Cloud Messaging API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `lyfind-72845`
3. Go to **APIs & Services** → **Library**
4. Search for "Firebase Cloud Messaging API"
5. Click **Enable**

## Step 4: Test Push Notifications

### Testing on Desktop (Chrome/Edge):

1. Build and deploy your app: `npm run build`
2. Open the app in Chrome/Edge
3. Log in with your account
4. You should see a notification permission prompt
5. Click "Allow"
6. Check browser console for FCM token
7. Send a test notification from Firebase Console

### Testing on Mobile:

1. Deploy your app to a hosting service (Firebase Hosting, Vercel, etc.)
2. Open the app in Chrome/Safari on your phone
3. You should see "Add to Home Screen" prompt
4. Install the app
5. Grant notification permissions
6. Close the app (it will run in background)
7. Send a test notification - it should appear even when app is closed

## Step 5: Send Push Notifications from Backend

To send push notifications, you need to call Firebase Cloud Messaging API from your backend:

```typescript
// Example: Send notification when new message arrives
import { getMessaging } from 'firebase-admin/messaging';

async function sendPushNotification(userId: string, title: string, body: string, actionUrl: string) {
  // Get user's FCM tokens from Firestore
  const userDoc = await db.collection('users').doc(userId).get();
  const fcmTokens = userDoc.data()?.fcmTokens || [];

  if (fcmTokens.length === 0) {
    console.log('No FCM tokens for user:', userId);
    return;
  }

  // Send to all user's devices
  const messaging = getMessaging();
  const promises = fcmTokens.map(token => 
    messaging.send({
      token,
      notification: {
        title,
        body,
      },
      data: {
        actionUrl,
        notificationId: Date.now().toString(),
      },
      webpush: {
        fcmOptions: {
          link: actionUrl
        }
      }
    })
  );

  await Promise.allSettled(promises);
}
```

## How It Works

### When App is Open (Foreground):
1. User receives notification via `onForegroundMessage`
2. Toast notification appears in the app
3. User can click to navigate to relevant page

### When App is Closed (Background):
1. Service worker receives notification via `onBackgroundMessage`
2. Browser shows system notification
3. User clicks notification → app opens to relevant page
4. Works even when phone screen is off

### Persistent Login:
1. Firebase Auth uses `browserLocalPersistence`
2. Auth state stored in browser's IndexedDB
3. Survives browser restarts and phone reboots
4. Only cleared on explicit logout or cache clear

## Testing Checklist

- [ ] VAPID key configured
- [ ] FCM API enabled in Google Cloud
- [ ] App deployed to HTTPS domain
- [ ] Service worker registered successfully
- [ ] Notification permission granted
- [ ] FCM token saved to Firestore
- [ ] Test notification received in foreground
- [ ] Test notification received in background
- [ ] App opens to correct page on notification click
- [ ] Login persists after closing browser
- [ ] PWA can be installed on mobile

## Troubleshooting

### Notifications not working:
1. Check browser console for errors
2. Verify service worker is registered: `chrome://serviceworker-internals/`
3. Check notification permission: `Notification.permission`
4. Verify FCM token is saved in Firestore
5. Test with Firebase Console's "Send test message"

### PWA not installable:
1. Must be served over HTTPS (localhost is OK for testing)
2. Manifest.json must be valid
3. Service worker must be registered
4. App must meet PWA criteria (check Lighthouse audit)

### Login not persisting:
1. Check if `browserLocalPersistence` is set in firebase.ts
2. Verify IndexedDB is not being cleared
3. Check browser privacy settings (don't block cookies/storage)

## Production Deployment

1. Build the app: `npm run build`
2. Deploy to Firebase Hosting or similar
3. Ensure HTTPS is enabled
4. Test PWA installation on mobile
5. Test background notifications
6. Monitor FCM token refresh and cleanup

## Security Notes

- FCM tokens should be treated as sensitive
- Implement token refresh logic (tokens can expire)
- Clean up old tokens when user logs out
- Validate notification payloads on backend
- Rate limit notification sending to prevent spam

## Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
