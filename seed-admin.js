/**
 * Admin Account Seeding Script
 * 
 * This script will automatically create an admin account in Firestore
 * for the user: admin@gmail.com
 * 
 * IMPORTANT: Make sure you've created this user in Firebase Auth first!
 * 
 * Usage:
 * 1. Make sure admin@gmail.com exists in Firebase Auth
 * 2. Run: node seed-admin.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw",
  authDomain: "lyfind-72845.firebaseapp.com",
  projectId: "lyfind-72845",
  storageBucket: "lyfind-72845.firebasestorage.app",
  messagingSenderId: "153935340746",
  appId: "1:153935340746:web:87ea7489649e48b3894033",
  measurementId: "G-JPED770NSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456'; // Change this if your password is different

// Super Admin Permissions
const SUPER_ADMIN_PERMISSIONS = [
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

async function seedAdminAccount() {
  try {
    console.log('🚀 Starting admin account seeding...\n');

    // Step 1: Sign in to get the UID
    console.log('📝 Signing in as admin@gmail.com...');
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log('✅ Signed in successfully!');
    console.log(`📋 User UID: ${user.uid}\n`);

    // Step 2: Create admin document
    console.log('📝 Creating admin document in Firestore...');
    
    const adminData = {
      email: ADMIN_EMAIL,
      displayName: 'Admin User',
      role: 'super_admin',
      adminLevel: 'super',
      permissions: SUPER_ADMIN_PERMISSIONS,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      twoFactorEnabled: false,
      assignedBy: 'system',
      active: true
    };

    await setDoc(doc(db, 'admins', user.uid), adminData);

    console.log('✅ Admin document created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Admin Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`UID:          ${user.uid}`);
    console.log(`Email:        ${ADMIN_EMAIL}`);
    console.log(`Display Name: Admin User`);
    console.log(`Role:         super_admin`);
    console.log(`Admin Level:  super`);
    console.log(`Permissions:  ${SUPER_ADMIN_PERMISSIONS.length} permissions`);
    console.log(`Status:       Active ✅`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🎉 SUCCESS! You can now login at:');
    console.log('   http://localhost:5173/admin/login\n');
    console.log('📧 Email:    admin@gmail.com');
    console.log('🔑 Password: 123456\n');
    
    // Sign out
    await auth.signOut();
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding admin account:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Make sure admin@gmail.com exists in Firebase Auth');
    console.error('2. Check if the password is correct (default: 123456)');
    console.error('3. Verify Firebase configuration is correct');
    console.error('4. Check your internet connection\n');
    process.exit(1);
  }
}

// Run the seeding script
console.log('╔════════════════════════════════════════╗');
console.log('║   LyFind Admin Account Seeding Tool   ║');
console.log('╚════════════════════════════════════════╝\n');

seedAdminAccount();
