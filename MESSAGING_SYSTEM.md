# Messaging System Documentation

## Overview
The messaging system allows users to inquire about items by clicking the "Message Owner" button on any item detail page. Conversations are tied to specific items and display the item context above the chat.

## Features

### 1. Item-Based Conversations
- Users can only start conversations by clicking "Message Owner" on an item
- Each conversation is linked to a specific item
- Item card is displayed above the conversation for context
- Shows item image, title, type (lost/found), and link to item details

### 2. Real-Time Messaging
- Messages update in real-time using Firestore `onSnapshot` listeners
- Instant delivery and receipt of messages
- Auto-scroll to latest message

### 3. Unread Count Tracking
- Each conversation tracks unread messages per user
- Unread badge displayed on conversation list
- Messages marked as read when conversation is opened

### 4. Conversation Management
- Prevents duplicate conversations for same item + users
- Automatically creates conversation if it doesn't exist
- Stores participant names and photos for quick display

## File Structure

```
src/
├── services/
│   └── messageService.ts          # Core messaging logic
├── pages/lycean/
│   ├── Messages.tsx                # Messages page with conversation list and chat
│   └── Item.tsx                    # Item detail page with "Message Owner" button
```

## How It Works

### Starting a Conversation

1. User views an item detail page (`/item/:id`)
2. Clicks "Message Owner" button (only visible if not the item owner)
3. System checks if conversation already exists between these users for this item
4. If not, creates new conversation with:
   - Item details (ID, title, image, type)
   - Both participants (item owner + inquirer)
   - Participant names and photos
   - Initial unread counts
5. Navigates to Messages page with conversation auto-selected

### Sending Messages

1. User types message in input field
2. Clicks Send or presses Enter
3. Message is added to Firestore `messages` collection
4. Conversation is updated with:
   - Last message content
   - Last message timestamp
   - Incremented unread count for other user
5. Real-time listener updates UI immediately

### Reading Messages

1. User opens Messages page
2. Conversations list loads with real-time updates
3. User selects a conversation
4. Messages load with real-time updates
5. System marks conversation as read for current user
6. Unread count resets to 0

## Firestore Collections

### `conversations`
```typescript
{
  id: string
  itemId: string
  itemTitle: string
  itemImage: string
  itemType: 'lost' | 'found'
  participants: string[]  // [itemOwnerId, inquirerId]
  participantNames: { [userId: string]: string }
  participantPhotos: { [userId: string]: string }
  lastMessage?: string
  lastMessageTime?: Timestamp
  unreadCount: { [userId: string]: number }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `messages`
```typescript
{
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderPhoto?: string
  content: string
  read: boolean
  createdAt: Timestamp
}
```

## UI Components

### Messages Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (Desktop)                                   │
│  ┌──────────────┬──────────────────────────────┐   │
│  │ Conversations│  Chat Area                    │   │
│  │              │  ┌─────────────────────────┐  │   │
│  │ • Conv 1     │  │ Item Card               │  │   │
│  │ • Conv 2     │  │ [Image] Title Type      │  │   │
│  │ • Conv 3     │  └─────────────────────────┘  │   │
│  │              │                               │   │
│  │              │  Messages                     │   │
│  │              │  • Message 1                  │   │
│  │              │  • Message 2                  │   │
│  │              │                               │   │
│  │              │  [Input] [Send]               │   │
│  └──────────────┴──────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout
- Conversations list shown first
- Tap conversation to view chat (full screen)
- Back button returns to conversations list

## Key Functions

### `messageService.createConversation()`
Creates or retrieves existing conversation for an item and two users.

### `messageService.sendMessage()`
Sends a message and updates conversation metadata.

### `messageService.listenToUserConversations()`
Real-time listener for user's conversations.

### `messageService.listenToMessages()`
Real-time listener for messages in a conversation.

### `messageService.markAsRead()`
Marks all messages in a conversation as read for current user.

## Future Enhancements

- [ ] Typing indicators
- [ ] Message reactions
- [ ] Image/file attachments
- [ ] Push notifications
- [ ] Message search
- [ ] Conversation archiving
- [ ] Block/report users
- [ ] Message deletion
- [ ] Read receipts (seen by)
- [ ] Online status indicators

## Testing

To test the messaging system:

1. Create two user accounts with `@lsb.edu.ph` emails
2. Post an item with User A
3. Sign in as User B
4. Browse to the item and click "Message Owner"
5. Send messages back and forth
6. Check unread counts update correctly
7. Verify item card displays above conversation
8. Test on mobile (responsive layout)

## Security Rules (Firestore)

```javascript
// Conversations - users can only read/write their own conversations
match /conversations/{conversationId} {
  allow read: if request.auth != null && 
    request.auth.uid in resource.data.participants;
  allow create: if request.auth != null && 
    request.auth.uid in request.resource.data.participants;
  allow update: if request.auth != null && 
    request.auth.uid in resource.data.participants;
}

// Messages - users can only read messages in their conversations
match /messages/{messageId} {
  allow read: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
  allow create: if request.auth != null;
}
```

## Notes

- Conversations are never deleted, only archived (future feature)
- Messages are stored indefinitely
- Item context is preserved even if item is deleted (denormalized data)
- System prevents duplicate conversations for same item + users
- All timestamps use Firestore server timestamps for consistency
