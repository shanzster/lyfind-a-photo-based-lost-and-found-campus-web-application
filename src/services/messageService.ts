import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notificationService } from './notificationService';

export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface Conversation {
  id?: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemType: 'lost' | 'found';
  participants: string[]; // [itemOwnerId, inquirerId]
  participantNames: { [userId: string]: string };
  participantPhotos: { [userId: string]: string };
  lastMessage?: string;
  lastMessageTime?: Timestamp;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';

export const messageService = {
  // Create or get existing conversation
  async createConversation(
    itemId: string,
    itemTitle: string,
    itemImage: string,
    itemType: 'lost' | 'found',
    itemOwnerId: string,
    itemOwnerName: string,
    inquirerId: string,
    inquirerName: string,
    inquirerPhoto?: string,
    itemOwnerPhoto?: string
  ): Promise<string> {
    // Check if conversation already exists
    const existingConv = await this.getConversationByItemAndUsers(
      itemId,
      itemOwnerId,
      inquirerId
    );

    if (existingConv) {
      return existingConv.id!;
    }

    // Create new conversation
    const conversationData: Omit<Conversation, 'id'> = {
      itemId,
      itemTitle,
      itemImage,
      itemType,
      participants: [itemOwnerId, inquirerId],
      participantNames: {
        [itemOwnerId]: itemOwnerName,
        [inquirerId]: inquirerName,
      },
      participantPhotos: {
        [itemOwnerId]: itemOwnerPhoto || '',
        [inquirerId]: inquirerPhoto || '',
      },
      unreadCount: {
        [itemOwnerId]: 0,
        [inquirerId]: 0,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, CONVERSATIONS_COLLECTION),
      conversationData
    );
    return docRef.id;
  },

  // Get conversation by item and users
  async getConversationByItemAndUsers(
    itemId: string,
    userId1: string,
    userId2: string
  ): Promise<Conversation | null> {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('itemId', '==', itemId),
      where('participants', 'array-contains', userId1)
    );

    const snapshot = await getDocs(q);
    const conversation = snapshot.docs.find((doc) => {
      const data = doc.data();
      return data.participants.includes(userId2);
    });

    if (conversation) {
      return { id: conversation.id, ...conversation.data() } as Conversation;
    }
    return null;
  },

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Conversation)
    );
  },

  // Listen to user's conversations (real-time)
  listenToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ) {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Conversation)
      );
      callback(conversations);
    });
  },

  // Send message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    senderPhoto?: string
  ): Promise<void> {
    // Add message - only include senderPhoto if it exists
    const messageData: any = {
      conversationId,
      senderId,
      senderName,
      content,
      read: false,
      createdAt: Timestamp.now(),
    };

    // Only add senderPhoto if it has a value
    if (senderPhoto) {
      messageData.senderPhoto = senderPhoto;
    }

    await addDoc(collection(db, MESSAGES_COLLECTION), messageData);

    // Update conversation
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data() as Conversation;

    // Increment unread count for other participant
    const otherUserId = conversationData.participants.find(
      (id) => id !== senderId
    )!;
    const newUnreadCount = {
      ...conversationData.unreadCount,
      [otherUserId]: (conversationData.unreadCount[otherUserId] || 0) + 1,
    };

    await updateDoc(conversationRef, {
      lastMessage: content,
      lastMessageTime: Timestamp.now(),
      updatedAt: Timestamp.now(),
      unreadCount: newUnreadCount,
    });

    // Send notification to recipient
    try {
      await notificationService.notifyNewMessage(
        otherUserId,
        senderName,
        senderId,
        conversationId
      );
    } catch (error) {
      console.error('[MessageService] Failed to send notification:', error);
      // Don't throw - message was sent successfully
    }
  },

  // Get messages for conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Message)
    );
  },

  // Alias for getMessages (for consistency)
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.getMessages(conversationId);
  },

  // Listen to messages (real-time)
  listenToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ) {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      callback(messages);
    });
  },

  // Mark conversation as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data() as Conversation;

    const newUnreadCount = {
      ...conversationData.unreadCount,
      [userId]: 0,
    };

    await updateDoc(conversationRef, {
      unreadCount: newUnreadCount,
    });

    // Mark all messages as read
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(messagesQuery);
    const updatePromises = snapshot.docs
      .filter((doc) => doc.data().senderId !== userId)
      .map((doc) => updateDoc(doc.ref, { read: true }));

    await Promise.all(updatePromises);
  },

  // Get total unread count for user
  async getTotalUnreadCount(userId: string): Promise<number> {
    const conversations = await this.getUserConversations(userId);
    return conversations.reduce(
      (total, conv) => total + (conv.unreadCount[userId] || 0),
      0
    );
  },
};
