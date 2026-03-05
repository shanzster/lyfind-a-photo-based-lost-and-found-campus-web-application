import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
try {
  // Try to use service account JSON file first
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Use JSON string from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    // Use individual environment variables
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    throw new Error('No Firebase credentials found');
  }

  admin.initializeApp({ credential });
  console.log('🔥 Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();
const messaging = admin.messaging();

// Helper function to send push notification
async function sendPushNotification(userId, notification) {
  try {
    // Get user's FCM tokens
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log(`User ${userId} not found`);
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const fcmTokens = userData.fcmTokens || [];

    if (fcmTokens.length === 0) {
      console.log(`No FCM tokens for user ${userId}`);
      return { success: false, error: 'No FCM tokens' };
    }

    console.log(`📤 Sending notification to ${fcmTokens.length} device(s) for user ${userId}`);

    // Send to all user's devices
    const results = await Promise.allSettled(
      fcmTokens.map(async (token) => {
        try {
          const response = await messaging.send({
            token,
            notification: {
              title: notification.title,
              body: notification.message,
            },
            data: {
              actionUrl: notification.actionUrl || '/notifications',
              notificationId: notification.notificationId || Date.now().toString(),
              type: notification.type || 'general',
            },
            webpush: {
              fcmOptions: {
                link: notification.actionUrl || '/notifications',
              },
              notification: {
                icon: '/Untitled design (3).png',
                badge: '/Untitled design (3).png',
                requireInteraction: false,
              },
            },
          });

          console.log(`✅ Notification sent successfully:`, response);
          return { success: true, messageId: response };
        } catch (error) {
          // Handle invalid tokens
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            console.log(`🗑️ Removing invalid token for user ${userId}`);
            // Remove invalid token
            await db.collection('users').doc(userId).update({
              fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
            });
          }
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`📊 Notification results: ${successful} sent, ${failed} failed`);

    return {
      success: successful > 0,
      sent: successful,
      failed: failed,
      results,
    };
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint to send notification
app.post('/api/send-notification', async (req, res) => {
  try {
    const { userId, title, message, actionUrl, type, notificationId } = req.body;

    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, title, message',
      });
    }

    // Optional: Verify API secret for security
    const apiSecret = req.headers['x-api-secret'];
    if (process.env.API_SECRET && apiSecret !== process.env.API_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const result = await sendPushNotification(userId, {
      title,
      message,
      actionUrl,
      type,
      notificationId,
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/send-notification:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Batch send notifications
app.post('/api/send-batch-notifications', async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'notifications must be a non-empty array',
      });
    }

    // Optional: Verify API secret
    const apiSecret = req.headers['x-api-secret'];
    if (process.env.API_SECRET && apiSecret !== process.env.API_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const results = await Promise.allSettled(
      notifications.map(notif => 
        sendPushNotification(notif.userId, {
          title: notif.title,
          message: notif.message,
          actionUrl: notif.actionUrl,
          type: notif.type,
          notificationId: notif.notificationId,
        })
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;

    res.json({
      success: true,
      total: notifications.length,
      successful,
      failed: notifications.length - successful,
      results,
    });
  } catch (error) {
    console.error('Error in /api/send-batch-notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'LyFind Notification Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      sendNotification: 'POST /api/send-notification',
      sendBatch: 'POST /api/send-batch-notifications',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notification server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/send-notification`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
