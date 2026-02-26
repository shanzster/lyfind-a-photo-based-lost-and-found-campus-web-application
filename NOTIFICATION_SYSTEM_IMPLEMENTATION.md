# Notification System Implementation Guide

## Overview
A real-time notification system that alerts users about important events like new messages, AI matches, item approvals, and reports.

## Architecture

### Data Structure
```typescript
interface Notification {
  id: string;
  userId: string;              // Recipient
  type: 'message' | 'match' | 'approval' | 'report' | 'claim' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;          // Where to navigate when clicked
  metadata?: {
    itemId?: string;
    conversationId?: string;
    matchId?: string;
    senderId?: string;
    senderName?: string;
  };
  createdAt: Timestamp;
}
```

### Firestore Collection
- **Collection**: `notifications`
- **Indexes**: 
  - `userId` + `createdAt` (descending)
  - `userId` + `read` + `createdAt` (descending)

## Components

### 1. Notification Service (`src/services/notificationService.ts`)
**Purpose**: CRUD operations for notifications

**Methods**:
- `createNotification()` - Create new notification
- `getUserNotifications()` - Get user's notifications
- `getUnreadCount()` - Count unread notifications
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete notification
- `subscribeToNotifications()` - Real-time listener

### 2. Notification Bell Component (`src/components/NotificationBell.tsx`)
**Purpose**: Bell icon with badge showing unread count

**Features**:
- Shows unread count badge
- Dropdown with recent notifications
- Click to mark as read
- Navigate to action URL
- "View All" link to notifications page

**Location**: In LyceanSidebar and admin sidebar

### 3. Notifications Page (`src/pages/lycean/Notifications.tsx`)
**Purpose**: Full list of all notifications

**Features**:
- Filter by type (all, messages, matches, approvals)
- Mark all as read button
- Delete notifications
- Pagination/infinite scroll
- Empty state

### 4. Notification Context (`src/contexts/NotificationContext.tsx`)
**Purpose**: Global state for notifications

**Provides**:
- `notifications` - Array of notifications
- `unreadCount` - Number of unread
- `loading` - Loading state
- `markAsRead()` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete notification

## Notification Triggers

### 1. New Message
**When**: User receives a new message
**Trigger**: `messageService.sendMessage()`
**Notification**:
```typescript
{
  type: 'message',
  title: 'New Message',
  message: `${senderName} sent you a message`,
  actionUrl: `/messages?conversation=${conversationId}`,
  metadata: { conversationId, senderId, senderName }
}
```

### 2. AI Match Found
**When**: Photo matching finds a match
**Trigger**: `photoMatchService.processMatchRequest()`
**Notification**:
```typescript
{
  type: 'match',
  title: 'Match Found!',
  message: `We found ${count} potential matches for your photo`,
  actionUrl: `/photo-match`,
  metadata: { matchId, itemId }
}
```

### 3. Item Approved
**When**: Admin approves a pending item
**Trigger**: `itemService.updateItemStatus()`
**Notification**:
```typescript
{
  type: 'approval',
  title: 'Item Approved',
  message: `Your item "${itemTitle}" has been approved`,
  actionUrl: `/item/${itemId}`,
  metadata: { itemId }
}
```

### 4. Item Rejected
**When**: Admin rejects a pending item
**Trigger**: `itemService.updateItemStatus()`
**Notification**:
```typescript
{
  type: 'approval',
  title: 'Item Rejected',
  message: `Your item "${itemTitle}" was not approved`,
  actionUrl: `/my-items`,
  metadata: { itemId }
}
```

### 5. Report Response (Admin)
**When**: User reports an item/message
**Trigger**: `reportService.createReport()`
**Notification** (to admins):
```typescript
{
  type: 'report',
  title: 'New Report',
  message: `${reporterName} reported an item`,
  actionUrl: `/admin/reports`,
  metadata: { reportId, itemId }
}
```

## Implementation Steps

### Phase 1: Core Infrastructure
1. ✅ Create Firestore collection and indexes
2. ✅ Build `notificationService.ts`
3. ✅ Create `NotificationContext.tsx`
4. ✅ Build `NotificationBell.tsx` component

### Phase 2: UI Integration
5. ✅ Add NotificationBell to LyceanSidebar
6. ✅ Add NotificationBell to AdminSidebar
7. ✅ Create Notifications page
8. ✅ Add route for notifications page

### Phase 3: Trigger Integration
9. ✅ Add notification creation to messageService
10. ✅ Add notification creation to photoMatchService
11. ✅ Add notification creation to itemService (approvals)
12. ✅ Add notification creation to reportService

### Phase 4: Admin Notifications
13. ✅ Admin notifications for new reports
14. ✅ Admin notifications for new items pending approval
15. ✅ Admin notification preferences

## Firestore Security Rules

```javascript
match /notifications/{notificationId} {
  // Users can read their own notifications
  allow read: if request.auth != null && 
              resource.data.userId == request.auth.uid;
  
  // Only system can create notifications (via service)
  allow create: if request.auth != null;
  
  // Users can update their own notifications (mark as read)
  allow update: if request.auth != null && 
                resource.data.userId == request.auth.uid;
  
  // Users can delete their own notifications
  allow delete: if request.auth != null && 
                resource.data.userId == request.auth.uid;
}
```

## Firestore Indexes

```json
{
  "collectionGroup": "notifications",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "notifications",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "read", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

## UI Design

### Notification Bell
- Icon: Bell from lucide-react
- Badge: Red circle with unread count
- Position: Top right of sidebar
- Dropdown: Max 5 recent notifications
- Animation: Shake when new notification arrives

### Notification Item
```
[Icon] Title                    [Time]
       Message preview          [•] (if unread)
```

### Notification Types & Icons
- `message`: MessageCircle (blue)
- `match`: Sparkles (purple)
- `approval`: CheckCircle (green)
- `report`: Flag (red)
- `claim`: Package (orange)
- `system`: Bell (gray)

## Testing Checklist

### User Flow
- [ ] User receives message → notification appears
- [ ] User clicks notification → navigates to messages
- [ ] User marks as read → badge count decreases
- [ ] User views all notifications → sees full list
- [ ] User deletes notification → removed from list

### Admin Flow
- [ ] Admin receives report notification
- [ ] Admin receives new item notification
- [ ] Admin clicks notification → navigates to correct page
- [ ] Admin marks all as read

### Edge Cases
- [ ] No notifications → shows empty state
- [ ] 100+ notifications → pagination works
- [ ] Real-time updates → new notifications appear instantly
- [ ] Offline → notifications sync when back online

## Performance Considerations

### Optimization
1. **Limit Query**: Only fetch last 50 notifications
2. **Pagination**: Load more on scroll
3. **Real-time Listener**: Only subscribe when bell is open
4. **Unread Count**: Separate lightweight query
5. **Cleanup**: Auto-delete notifications older than 30 days

### Firestore Costs
- Read: ~1 read per notification view
- Write: 1 write per notification created
- Listener: 1 snapshot per new notification
- Estimated: ~100-500 reads/writes per day per user

## Future Enhancements

### Phase 2 Features
- [ ] Push notifications (PWA)
- [ ] Email notifications
- [ ] Notification preferences (enable/disable by type)
- [ ] Notification sounds
- [ ] Desktop notifications
- [ ] Notification grouping (e.g., "3 new messages")
- [ ] Scheduled notifications
- [ ] Notification templates

### Advanced Features
- [ ] Rich notifications with images
- [ ] Action buttons in notifications
- [ ] Notification history export
- [ ] Notification analytics
- [ ] Smart notifications (ML-based priority)

## Files to Create

```
src/
├── services/
│   └── notificationService.ts          (NEW)
├── contexts/
│   └── NotificationContext.tsx         (NEW)
├── components/
│   ├── NotificationBell.tsx            (NEW)
│   └── NotificationItem.tsx            (NEW)
├── pages/
│   └── lycean/
│       └── Notifications.tsx           (NEW)
└── hooks/
    └── useNotifications.ts             (NEW - optional)
```

## Files to Update

```
src/
├── services/
│   ├── messageService.ts               (ADD notification trigger)
│   ├── photoMatchService.ts            (ADD notification trigger)
│   ├── itemService.ts                  (ADD notification trigger)
│   └── reportService.ts                (ADD notification trigger)
├── components/
│   ├── lycean-sidebar.tsx              (ADD NotificationBell)
│   └── admin/AdminSidebar.tsx          (ADD NotificationBell)
├── App.tsx                             (ADD notifications route)
└── firestore.indexes.json              (ADD notification indexes)
```

## Success Metrics

### KPIs
- Notification delivery time: < 2 seconds
- Click-through rate: > 30%
- Mark as read rate: > 80%
- User engagement: +20% return visits

### Monitoring
- Track notification creation count
- Track notification read rate
- Track notification click rate
- Monitor Firestore costs

## Rollout Plan

### Week 1: Core System
- Day 1-2: Build service and context
- Day 3-4: Build UI components
- Day 5: Testing and bug fixes

### Week 2: Integration
- Day 1-2: Integrate with messaging
- Day 3: Integrate with photo matching
- Day 4: Integrate with approvals
- Day 5: Testing and deployment

### Week 3: Polish
- Day 1-2: Admin notifications
- Day 3: Performance optimization
- Day 4: User feedback and adjustments
- Day 5: Documentation and training

