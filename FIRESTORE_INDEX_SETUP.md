# Firestore Index Setup Guide

## Issue
You're getting an error: "The query requires an index" when trying to send messages.

## Required Index

The messaging system needs a composite index for the `conversations` collection.

### Index Details:
- **Collection**: `conversations`
- **Fields**:
  1. `participants` (Array-contains)
  2. `updatedAt` (Descending)

## How to Create the Index

### Option 1: Use the Error Link (Easiest)
1. Look at the full error message in your browser console
2. It should contain a link that looks like: `https://console.firebase.google.com/v1/r/project/YOUR_PROJECT/firestore/indexes?create_composite=...`
3. Click that link - it will open Firebase Console with the index pre-configured
4. Click "Create Index"
5. Wait 2-5 minutes for the index to build

### Option 2: Manual Creation
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure:
   - Collection ID: `conversations`
   - Add Field 1:
     - Field path: `participants`
     - Query scope: Collection
     - Array config: CONTAINS
   - Add Field 2:
     - Field path: `updatedAt`
     - Order: Descending
6. Click **Create**
7. Wait for the index to build (usually 2-5 minutes)

### Option 3: Using Firebase CLI (Advanced)

Create a file `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "participants",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "conversationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy:
```bash
firebase deploy --only firestore:indexes
```

## Additional Indexes You May Need

While you're at it, create this index too (for the messages query):

- **Collection**: `messages`
- **Fields**:
  1. `conversationId` (Ascending)
  2. `createdAt` (Ascending)

## Verification

After creating the index:
1. Wait for the status to change from "Building" to "Enabled" in Firebase Console
2. Refresh your app
3. Try sending a message again
4. The error should be gone!

## Notes

- Indexes are required for queries that combine array-contains with orderBy
- Building indexes can take a few minutes depending on existing data
- You only need to create each index once per Firebase project
