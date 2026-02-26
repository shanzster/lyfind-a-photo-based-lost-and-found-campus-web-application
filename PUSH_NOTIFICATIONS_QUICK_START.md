# Push Notifications - Quick Start Guide

## 🚀 3 Steps to Enable Push Notifications

### Step 1: Get VAPID Key (2 minutes)

1. Go to https://console.firebase.google.com/
2. Select project: **lyfind-72845**
3. Click ⚙️ → **Project Settings**
4. Go to **Cloud Messaging** tab
5. Scroll to "Web Push certificates"
6. Click **"Generate key pair"**
7. Copy the key (starts with `B...`)

### Step 2: Update Code (1 minute)

Open `src/services/pushNotificationService.ts` and replace line 6:

```typescript
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';
```

With your actual key:

```typescript
const VAPID_KEY = 'BAbCdEfGhIjKlMnOpQrStUvWxYz...'; // Paste your key here
```

### Step 3: Deploy Cloud Function (2 minutes)

```bash
# Install dependencies
cd functions
npm install
cd ..

# Deploy to Firebase
firebase deploy --only functions
```

## ✅ That's It!

Now users can:
- Go to Profile page
- Click "Enable" on Push Notifications
- Grant browser permission
- Receive push notifications even when app is closed!

## 🧪 Test It

1. Open app in Chrome
2. Go to Profile → Enable Push Notifications
3. Send yourself a message from another account
4. You should get a push notification! 🎉

## 📚 Full Documentation

See `PUSH_NOTIFICATIONS_SETUP_COMPLETE.md` for:
- Detailed testing checklist
- Troubleshooting guide
- Security & privacy info
- Cost estimates
- Monitoring & analytics

## 🎯 What Gets Pushed

Users automatically receive push notifications for:
- ✉️ New messages
- 🔍 AI photo matches found
- ✅ Item approved by admin
- ❌ Item rejected by admin
- 📢 System announcements

## 💡 Pro Tips

- Push notifications work even when app is closed
- Users can disable anytime from Profile page
- Works on Chrome, Firefox, Edge, Safari 16+
- Completely free (Firebase FCM has no cost)
- Tokens automatically cleaned up on logout

## ⚠️ Important Notes

- **HTTPS required** - Service workers only work on HTTPS
- **User permission required** - Can't force enable notifications
- **Browser support** - iOS Safari requires iOS 16.4+
- **VAPID key is public** - Safe to commit to repo (it's not a secret)

## 🆘 Need Help?

Common issues:
- **"Permission denied"** → User blocked notifications in browser settings
- **"No token"** → VAPID key not set or incorrect
- **"Not working"** → Check Cloud Function logs: `firebase functions:log`

---

**Ready to go!** Just get the VAPID key, update the code, and deploy. 🚀
