# Messaging System Enhancements - Implementation Plan

## Features to Implement

### 1. ✅ Notifications When Admin Resolves Reports
- Notify all users who reported an item when admin takes action
- Include resolution details (archived, deleted, dismissed)
- Show admin's review note

### 2. 🔧 Google Image Bug Fix
- Need to identify the specific issue
- Likely related to image loading or display

### 3. ✅ Mark Item as Claimed (Owner Only)
- Add "Mark as Claimed" button in messages for item owners
- Show campus location picker for meetup
- Update item status to "claimed"
- Notify the claimer

### 4. ✅ Message Disclaimer
- Add disclaimer that admin is monitoring conversations
- Show at top of chat area

### 5. ✅ Upload Pictures in Messages
- Add image upload button in message input
- Support multiple images per message
- Use Cloudinary for storage
- Show image previews in chat

### 6. ✅ Push Notifications for New Messages
- Already implemented in notification system
- Just need to ensure it's triggered on message send

## Implementation Details

### Feature 1: Report Resolution Notifications

**Files to modify:**
- `src/services/reportService.ts` - Add notification trigger
- `src/pages/admin/ReportsManagement.tsx` - Call notification service

**Logic:**
1. When admin reviews report, get all users who reported that item
2. Send notification to each reporter
3. Include action taken and review note

### Feature 3: Mark as Claimed

**Files to modify:**
- `src/pages/lycean/Messages.tsx` - Add claim button and location picker
- `src/services/messageService.ts` - Add claim functionality
- `src/services/itemService.ts` - Add updateItemStatus method

**UI Components:**
- Claim button (only visible to item owner)
- Campus location picker modal
- Confirmation dialog

### Feature 4: Message Disclaimer

**Files to modify:**
- `src/pages/lycean/Messages.tsx` - Add disclaimer banner

**UI:**
- Small banner at top of chat
- Icon + text: "Admin monitors all conversations for safety"

### Feature 5: Image Upload in Messages

**Files to modify:**
- `src/pages/lycean/Messages.tsx` - Add image upload UI
- `src/services/messageService.ts` - Support image URLs in messages
- `src/services/storageService.ts` - Use existing upload function

**UI Components:**
- Image upload button (paperclip icon)
- Image preview before send
- Image display in message bubbles
- Lightbox for viewing full images

## Database Schema Updates

### Messages Collection
```typescript
{
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderPhoto?: string
  content: string
  images?: string[]  // NEW: Array of image URLs
  read: boolean
  createdAt: Timestamp
}
```

### Items Collection (add claimed fields)
```typescript
{
  ...existing fields
  claimedBy?: string  // User ID who claimed
  claimedAt?: Timestamp
  meetupLocation?: {
    name: string
    coordinates?: { lat: number, lng: number }
  }
}
```

## Testing Checklist

- [ ] Admin resolves report → all reporters get notification
- [ ] Item owner sees "Mark as Claimed" button
- [ ] Non-owners don't see claim button
- [ ] Location picker shows campus locations
- [ ] Claimed status updates correctly
- [ ] Disclaimer shows in all conversations
- [ ] Image upload button works
- [ ] Images display in messages
- [ ] Multiple images supported
- [ ] Push notification on new message
- [ ] Image lightbox works

## Priority Order

1. Message disclaimer (easiest, immediate value)
2. Push notifications for messages (already mostly done)
3. Report resolution notifications (important for user feedback)
4. Mark as claimed with location (core feature)
5. Image upload in messages (nice to have)

