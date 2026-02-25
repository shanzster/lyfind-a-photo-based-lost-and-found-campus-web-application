# LyFind Backend Implementation Plan

## 📋 Overview
This document outlines the backend implementation needed for LyFind, focusing on free APIs and services to minimize costs while maintaining functionality.

---

## ✅ Already Implemented

### 1. Firebase Authentication
- ✅ Email/Password authentication
- ✅ Google OAuth (restricted to @lsb.edu.ph)
- ✅ User profile creation in Firestore
- ✅ Auth state management

### 2. Firestore Database
- ✅ Users collection structure
- ✅ Basic CRUD services (itemService, userService)
- ✅ Photo match request structure

### 3. Firebase Storage
- ✅ Image upload service
- ✅ Image compression
- ✅ Thumbnail generation

---

## 🔨 Pages Needing Backend Integration

### 1. **Browse Page** (`/browse`)
**Current State:** Mock data  
**Needs:**
- [ ] Fetch items from Firestore
- [ ] Real-time updates when new items posted
- [ ] Filter by type (lost/found)
- [ ] Filter by category
- [ ] Search functionality
- [ ] Pagination/infinite scroll

**Functions to Implement:**
```typescript
// src/pages/lycean/Browse.tsx
- useEffect(() => fetchItems())
- handleFilter(type, category)
- handleSearch(query)
- loadMoreItems()
```

**Firestore Queries:**
```typescript
// Get all active items
const itemsQuery = query(
  collection(db, 'items'),
  where('status', '==', 'active'),
  orderBy('createdAt', 'desc'),
  limit(20)
);

// Filter by type
where('type', '==', 'lost' | 'found')

// Filter by category
where('category', '==', selectedCategory)

// Search (client-side for now, or use Algolia free tier)
```

---

### 2. **Post Item Page** (`/post`)
**Current State:** Form only, no submission  
**Needs:**
- [ ] Upload photos to Firebase Storage
- [ ] Create item document in Firestore
- [ ] Extract location coordinates
- [ ] Trigger photo matching (Cloud Function)
- [ ] Increment user's itemsPosted count

**Functions to Implement:**
```typescript
// src/pages/lycean/Post.tsx
- handlePhotoUpload(files: File[])
- handleLocationSelect(lat, lng, address)
- handleSubmit(formData)
- compressImages(files)
```

**Backend Flow:**
1. Upload photos → Firebase Storage
2. Get download URLs
3. Create item document in Firestore
4. Trigger Cloud Function for photo matching
5. Update user profile

---

### 3. **Item Detail Page** (`/item/:id`)
**Current State:** Mock data  
**Needs:**
- [ ] Fetch item by ID from Firestore
- [ ] Display match suggestions
- [ ] Contact item owner
- [ ] Report item
- [ ] Mark as resolved (owner only)

**Functions to Implement:**
```typescript
// src/pages/lycean/Item.tsx
- useEffect(() => fetchItem(id))
- fetchMatchSuggestions(itemId)
- handleContact(ownerId)
- handleReport(itemId, reason)
- handleResolve(itemId)
```

---

### 4. **Photo Match AI Page** (`/photo-match`)
**Current State:** Frontend simulation  
**Needs:**
- [ ] Upload photo to Firebase Storage
- [ ] Create match request in Firestore
- [ ] Process with AI (Cloud Function)
- [ ] Display results from Firestore

**Functions to Implement:**
```typescript
// src/pages/lycean/PhotoMatch.tsx
- handleUpload(file) → Firebase Storage
- createMatchRequest(imageUrl) → Firestore
- listenToMatchStatus(requestId) → Real-time updates
- displayResults(matches)
```

**AI Processing Options (FREE):**
1. **TensorFlow.js (Client-side)** - FREE
   - MobileNet for feature extraction
   - Cosine similarity for matching
   - No server costs
   
2. **Google Cloud Vision API** - FREE tier: 1000 requests/month
   - Image labeling
   - Object detection
   - Better accuracy than client-side

3. **Hugging Face Inference API** - FREE
   - CLIP model for image similarity
   - 30,000 requests/month free

---

### 5. **Messages Page** (`/messages`)
**Current State:** Mock conversations  
**Needs:**
- [ ] Real-time messaging with Firestore
- [ ] Create conversation threads
- [ ] Send/receive messages
- [ ] Unread indicators
- [ ] Message notifications

**Functions to Implement:**
```typescript
// src/pages/lycean/Messages.tsx
- fetchConversations(userId)
- fetchMessages(threadId)
- sendMessage(threadId, content)
- markAsRead(messageId)
- listenToNewMessages() → Real-time
```

**Firestore Structure:**
```typescript
conversations/{conversationId}
  - participants: [userId1, userId2]
  - itemId: string
  - lastMessage: Message
  - updatedAt: Timestamp

messages/{messageId}
  - conversationId: string
  - senderId: string
  - content: string
  - read: boolean
  - createdAt: Timestamp
```

---

### 6. **Profile Page** (`/profile`)
**Current State:** Static data  
**Needs:**
- [ ] Fetch user profile from Firestore
- [ ] Display user's posted items
- [ ] Edit profile
- [ ] View statistics

**Functions to Implement:**
```typescript
// src/pages/lycean/Profile.tsx
- fetchUserProfile(uid)
- fetchUserItems(uid)
- updateProfile(updates)
- uploadAvatar(file)
```

---

## 🆓 Free APIs & Services to Use

### 1. **Photo Matching AI**

#### Option A: TensorFlow.js (Recommended - FREE)
```bash
npm install @tensorflow/tfjs @tensorflow-models/mobilenet
```

**Implementation:**
```typescript
// src/services/aiMatchingService.ts
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export const aiMatchingService = {
  async extractFeatures(imageUrl: string): Promise<number[]> {
    const model = await mobilenet.load();
    const img = await loadImage(imageUrl);
    const features = model.infer(img, true);
    return Array.from(features.dataSync());
  },

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  },

  async findMatches(queryFeatures: number[], items: Item[]): Promise<Match[]> {
    const matches = items.map(item => ({
      item,
      score: this.cosineSimilarity(queryFeatures, item.features) * 100
    }));
    
    return matches
      .filter(m => m.score > 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
};
```

**Pros:**
- ✅ Completely free
- ✅ Runs in browser
- ✅ No API limits
- ✅ Privacy-friendly

**Cons:**
- ❌ Slower than server-side
- ❌ Less accurate than specialized models

---

#### Option B: Hugging Face Inference API (FREE)
```bash
npm install @huggingface/inference
```

**Free Tier:** 30,000 requests/month

**Implementation:**
```typescript
// src/services/huggingFaceService.ts
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.VITE_HF_API_KEY);

export const huggingFaceService = {
  async getImageEmbedding(imageUrl: string) {
    const response = await hf.featureExtraction({
      model: 'openai/clip-vit-base-patch32',
      inputs: imageUrl,
    });
    return response;
  }
};
```

**Pros:**
- ✅ Better accuracy
- ✅ 30k requests/month free
- ✅ CLIP model for image similarity

**Cons:**
- ❌ Requires API key
- ❌ Rate limits

---

### 2. **Maps Integration**

#### Leaflet + OpenStreetMap (FREE)
```bash
npm install leaflet react-leaflet
```

**Implementation:**
```typescript
// src/components/CampusMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export function CampusMap({ items, onLocationSelect }) {
  return (
    <MapContainer center={[14.5995, 120.9842]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {items.map(item => (
        <Marker key={item.id} position={[item.location.lat, item.location.lng]}>
          <Popup>{item.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

**Geocoding (FREE):**
- Nominatim API (OpenStreetMap)
- 1 request/second limit
- No API key needed

```typescript
// src/services/geocodingService.ts
export const geocodingService = {
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return data.display_name;
  },

  async searchLocation(query: string) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
    );
    return response.json();
  }
};
```

---

### 3. **Push Notifications**

#### Firebase Cloud Messaging (FREE)
```bash
# Already included in Firebase
```

**Implementation:**
```typescript
// src/services/notificationService.ts
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const notificationService = {
  async requestPermission() {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.VITE_FIREBASE_VAPID_KEY
    });
    return token;
  },

  async sendNotification(userId: string, notification: Notification) {
    // Store in Firestore, Cloud Function will send via FCM
    await addDoc(collection(db, 'notifications'), {
      userId,
      ...notification,
      createdAt: Timestamp.now()
    });
  }
};
```

---

### 4. **Email Notifications**

#### SendGrid (FREE)
**Free Tier:** 100 emails/day

```bash
npm install @sendgrid/mail
```

**Implementation (Cloud Function):**
```typescript
// functions/src/sendEmail.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMatchNotification(email: string, match: Match) {
  await sgMail.send({
    to: email,
    from: 'noreply@lyfind.com',
    subject: 'New Match Found!',
    html: `<p>We found a potential match for your item!</p>`
  });
}
```

**Alternative (FREE):** Resend
- 100 emails/day free
- Better developer experience

---

### 5. **Image Optimization**

#### Sharp (FREE - Self-hosted)
```bash
npm install sharp
```

**Implementation (Cloud Function):**
```typescript
// functions/src/optimizeImage.ts
import sharp from 'sharp';

export async function optimizeImage(buffer: Buffer) {
  const optimized = await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();
  
  const thumbnail = await sharp(buffer)
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 70 })
    .toBuffer();
  
  return { optimized, thumbnail };
}
```

---

## 🔥 Firebase Cloud Functions Needed

### 1. **Photo Match Processor**
```typescript
// functions/src/processPhotoMatch.ts
export const processPhotoMatch = functions.firestore
  .document('photoMatches/{matchId}')
  .onCreate(async (snap, context) => {
    const matchRequest = snap.data();
    
    // 1. Download image
    // 2. Extract features using TensorFlow
    // 3. Compare with all items
    // 4. Update document with results
    
    await snap.ref.update({
      status: 'completed',
      results: matches,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

### 2. **New Item Trigger**
```typescript
// functions/src/onItemCreated.ts
export const onItemCreated = functions.firestore
  .document('items/{itemId}')
  .onCreate(async (snap, context) => {
    const item = snap.data();
    
    // 1. Extract features from photos
    // 2. Find potential matches
    // 3. Create match suggestions
    // 4. Send notifications to matched users
  });
```

### 3. **Send Notification**
```typescript
// functions/src/sendNotification.ts
export const sendNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    
    // Send via FCM
    await admin.messaging().send({
      token: userToken,
      notification: {
        title: notification.title,
        body: notification.message
      }
    });
  });
```

---

## 📊 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Items collection
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.auth.token.email.matches('.*@lsb.edu.ph$');
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Photo matches
    match /photoMatches/{matchId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🔐 Environment Variables Needed

```env
# Firebase (Already configured)
VITE_FIREBASE_API_KEY=AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw
VITE_FIREBASE_AUTH_DOMAIN=lyfind-72845.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lyfind-72845
VITE_FIREBASE_STORAGE_BUCKET=lyfind-72845.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=153935340746
VITE_FIREBASE_APP_ID=1:153935340746:web:87ea7489649e48b3894033

# Optional: Hugging Face (if using)
VITE_HF_API_KEY=your_huggingface_api_key

# Optional: SendGrid (if using)
SENDGRID_API_KEY=your_sendgrid_api_key

# Firebase Cloud Messaging
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

---

## 📝 Implementation Priority

### Phase 1: Core Functionality (Week 1-2)
1. ✅ Authentication (Done)
2. [ ] Browse page with real data
3. [ ] Post item with photo upload
4. [ ] Item detail page
5. [ ] Basic search/filter

### Phase 2: AI Features (Week 3)
1. [ ] TensorFlow.js integration
2. [ ] Photo matching (client-side)
3. [ ] Match suggestions
4. [ ] Photo Match AI page

### Phase 3: Communication (Week 4)
1. [ ] Real-time messaging
2. [ ] Notifications
3. [ ] Email alerts (optional)

### Phase 4: Maps & Polish (Week 5)
1. [ ] Leaflet map integration
2. [ ] Location picker
3. [ ] Campus boundaries
4. [ ] PWA features

---

## 💰 Cost Estimate (Monthly)

### Free Tier Limits:
- **Firebase Auth:** Unlimited
- **Firestore:** 50k reads, 20k writes, 20k deletes/day
- **Firebase Storage:** 5GB storage, 1GB/day download
- **Cloud Functions:** 2M invocations/month
- **TensorFlow.js:** Unlimited (client-side)
- **OpenStreetMap:** Unlimited (1 req/sec)
- **Hugging Face:** 30k requests/month
- **SendGrid:** 100 emails/day

**Expected Usage (100 active users):**
- Firestore: ~10k reads/day ✅ Within free tier
- Storage: ~500MB ✅ Within free tier
- Cloud Functions: ~5k/month ✅ Within free tier

**Total Cost: $0/month** (within free tiers)

---

## 🚀 Next Steps

1. **Immediate:**
   - [ ] Integrate Browse page with Firestore
   - [ ] Implement Post item functionality
   - [ ] Set up Firestore security rules

2. **Short-term:**
   - [ ] Add TensorFlow.js for photo matching
   - [ ] Implement real-time messaging
   - [ ] Add Leaflet maps

3. **Long-term:**
   - [ ] Deploy Cloud Functions
   - [ ] Set up FCM notifications
   - [ ] Add PWA features
   - [ ] Optimize performance

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Leaflet Documentation](https://leafletjs.com/)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Last Updated:** February 22, 2026  
**Status:** Ready for implementation
