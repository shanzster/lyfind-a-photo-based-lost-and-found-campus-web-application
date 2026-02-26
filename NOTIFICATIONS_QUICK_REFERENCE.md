# Notifications Quick Reference Card

## 🎯 For Users

### Enable Notifications
1. Go to **Profile** page
2. Scroll to **"Notification Settings"**
3. Click **"Enable"**
4. Click **"Allow"** when browser asks
5. Done! ✅

### What You'll Get Notified About
- 💬 New messages
- 🔍 AI photo matches
- ✅ Item approved
- ❌ Item rejected
- 📢 System updates

### View Notifications
- Click **bell icon** in sidebar
- Or go to **Notifications** page
- Click notification to go to content

## 🔧 For Developers

### How to Send Notification
```typescript
import { notificationService } from '@/services/notificationService';

// New message
await notificationService.notifyNewMessage(
  recipientId,
  senderName,
  senderId,
  conversationId
);

// AI match
await notificationService.notifyMatch(
  userId,
  matchCount,
  itemId
);

// Item approved
await notificationService.notifyItemApproved(
  userId,
  itemTitle,
  itemId
);

// Custom notification
await notificationService.createNotification({
  userId: 'user123',
  type: 'system',
  title: 'Hello!',
  message: 'This is a notification',
  actionUrl: '/some-page'
});
```

### Notification Types
- `message` - New messages
- `match` - AI photo matches
- `approval` - Item approved/rejected
- `report` - Reports (admin only)
- `system` - System notifications

### Check User Preference
```typescript
// In Firestore
users/{userId}
  pushNotificationsEnabled: true/false
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No notifications | Enable from Profile page |
| Permission denied | Check browser settings |
| Not showing | Make sure app is open |
| Wrong page | Check actionUrl parameter |

## 📊 Files

### Services
- `src/services/notificationService.ts` - Core notification logic
- `src/services/pushNotificationService.ts` - Browser push handling

### Components
- `src/components/NotificationBell.tsx` - Bell icon in sidebar
- `src/components/PushNotificationPrompt.tsx` - Enable/disable UI
- `src/pages/lycean/Notifications.tsx` - Notifications page

### Context
- `src/contexts/NotificationContext.tsx` - Global state

## 💡 Tips

- Notifications auto-show when app is open
- Works in background tabs
- Click notification to navigate
- Unread count updates in real-time
- No setup required!

## 🎉 That's It!

Simple, free, and works immediately! 🚀
