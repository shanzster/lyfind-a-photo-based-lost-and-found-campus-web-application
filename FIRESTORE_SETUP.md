# Firestore Setup Instructions

## Issue: "Failed to load items" in Browse page

This error occurs when Firestore security rules are not configured or the `items` collection doesn't exist yet.

## Solution 1: Configure Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lyfind-72845`
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Items collection - authenticated users can read all, write their own
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Messages collection (for future use)
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click "Publish" to save the rules

## Solution 2: Create the Items Collection

The `items` collection will be automatically created when you post your first item. However, if you want to test the Browse page before posting:

1. Go to Firestore Database in Firebase Console
2. Click "Start collection"
3. Collection ID: `items`
4. Add a test document with these fields:
   - `type` (string): "lost" or "found"
   - `title` (string): "Test Item"
   - `description` (string): "This is a test item"
   - `category` (string): "Other"
   - `location` (map):
     - `lat` (number): 14.8167
     - `lng` (number): 120.2833
     - `address` (string): "Test Location"
   - `photos` (array): ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]
   - `userId` (string): your user ID from Authentication
   - `userName` (string): "Test User"
   - `userEmail` (string): "test@lsb.edu.ph"
   - `status` (string): "active"
   - `createdAt` (timestamp): Click "Add field" → Select "timestamp" → Click "Set to current time"
   - `updatedAt` (timestamp): Click "Add field" → Select "timestamp" → Click "Set to current time"

## Solution 3: Check Browser Console

Open the browser console (F12) and look for error messages. The updated code now logs:
- `[ItemService] Fetching items with filters: {...}`
- `[ItemService] Fetched X items from Firestore`
- `[ItemService] Returning X items after filtering`
- Or error messages with codes like `permission-denied`

## Testing the Post Functionality

Once the security rules are configured:

1. Navigate to `/post` page
2. Select "Lost" or "Found"
3. Upload at least one photo
4. Fill in all required fields:
   - Item Name
   - Category
   - Description
   - Location (click the map button)
   - Date
5. Click "Post Item"
6. Confirm in the modal
7. Wait for upload to complete
8. You'll be redirected to Browse page
9. Your item should appear in the feed

## Common Errors

### "Permission denied"
- **Cause**: Firestore security rules not configured
- **Solution**: Follow Solution 1 above

### "Database '(default)' not found"
- **Cause**: Firestore database not created
- **Solution**: Go to Firebase Console → Firestore Database → Click "Create database" → Choose production mode → Select location

### "Failed-precondition" or "Missing index"
- **Cause**: Composite index needed for complex queries
- **Solution**: The code now handles this by filtering client-side

## Next Steps

After configuring Firestore:
1. Refresh the Browse page
2. Try posting a new item
3. Verify it appears in the Browse page
4. Check that filters work (Lost/Found, categories)
