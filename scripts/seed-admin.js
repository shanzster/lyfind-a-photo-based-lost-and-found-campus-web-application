/**
 * Seed Admin Account Script
 * 
 * This script creates an admin account in Firebase Auth and Firestore
 * 
 * Usage:
 *   node scripts/seed-admin.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Admin account configuration
const ADMIN_CONFIG = {
  email: 'admin@lsb.edu.ph',
  password: 'Admin123!@#',  // Change this after first login!
  displayName: 'Admin User',
  role: 'super_admin',
  adminLevel: 'super',
};

const PERMISSIONS = [
  'users.view', 'users.edit', 'users.delete', 'users.suspend', 'users.ban',
  'items.view', 'items.edit', 'items.delete', 'items.feature',
  'items.approve', 'items.reject', 'items.request_info',
  'reports.view', 'reports.handle', 'reports.delete',
  'messages.view', 'messages.delete',
  'ai.configure', 'ai.monitor',
  'analytics.view', 'analytics.export',
  'settings.view', 'settings.edit',
  'admins.create', 'admins.edit', 'admins.delete',
  'logs.view', 'logs.export',
  'system.backup', 'system.restore', 'system.shutdown'
];

async function seedAdmin() {
  try {
    console.log('🚀 Starting admin account creation...\n');

    // Load service account
    const serviceAccountPath = join(__dirname, '..', 'lyfind-72845-firebase-adminsdk-fbsvc-5da2bb902c.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: 'lyfind-72845'
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Firebase Admin initialized\n');

    // Step 1: Check if user already exists
    console.log('📧 Checking if admin user exists...');
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(ADMIN_CONFIG.email);
      console.log(`✅ User already exists with UID: ${userRecord.uid}\n`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Step 2: Create user in Firebase Auth
        console.log('👤 Creating user in Firebase Auth...');
        userRecord = await auth.createUser({
          email: ADMIN_CONFIG.email,
          password: ADMIN_CONFIG.password,
          displayName: ADMIN_CONFIG.displayName,
          emailVerified: true, // Auto-verify admin email
        });
        console.log(`✅ User created with UID: ${userRecord.uid}\n`);
      } else {
        throw error;
      }
    }

    // Step 3: Create/Update user profile in Firestore
    console.log('📝 Creating user profile in Firestore...');
    const userProfileRef = db.collection('users').doc(userRecord.uid);
    await userProfileRef.set({
      uid: userRecord.uid,
      email: ADMIN_CONFIG.email,
      displayName: ADMIN_CONFIG.displayName,
      photoURL: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      emailVerified: true,
      isActive: true,
      role: 'user', // Regular user role in users collection
    }, { merge: true });
    console.log('✅ User profile created\n');

    // Step 4: Create admin document in Firestore
    console.log('👑 Creating admin document in Firestore...');
    const adminRef = db.collection('admins').doc(userRecord.uid);
    await adminRef.set({
      email: ADMIN_CONFIG.email,
      displayName: ADMIN_CONFIG.displayName,
      role: ADMIN_CONFIG.role,
      adminLevel: ADMIN_CONFIG.adminLevel,
      permissions: PERMISSIONS,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      twoFactorEnabled: false,
      assignedBy: 'system',
      active: true,
    }, { merge: true });
    console.log('✅ Admin document created\n');

    // Success!
    console.log('🎉 Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${ADMIN_CONFIG.email}`);
    console.log(`Password: ${ADMIN_CONFIG.password}`);
    console.log(`UID:      ${userRecord.uid}`);
    console.log(`Role:     ${ADMIN_CONFIG.role}`);
    console.log(`Level:    ${ADMIN_CONFIG.adminLevel}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('🔗 Login at: /admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  }
}

// Run the script
seedAdmin();
