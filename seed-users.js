// Seed script to create test LSB user accounts
// Run with: node seed-users.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

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

const testUsers = [
  {
    email: 'maria.santos@lsb.edu.ph',
    password: 'LyFind2024!',
    displayName: 'Maria Santos',
    department: 'Computer Science',
    yearLevel: '3rd Year',
    studentId: 'LSB-2021-0001'
  },
  {
    email: 'juan.dela.cruz@lsb.edu.ph',
    password: 'LyFind2024!',
    displayName: 'Juan Dela Cruz',
    department: 'Business Administration',
    yearLevel: '2nd Year',
    studentId: 'LSB-2022-0002'
  },
  {
    email: 'ana.reyes@lsb.edu.ph',
    password: 'LyFind2024!',
    displayName: 'Ana Reyes',
    department: 'Engineering',
    yearLevel: '4th Year',
    studentId: 'LSB-2020-0003'
  },
  {
    email: 'carlos.garcia@lsb.edu.ph',
    password: 'LyFind2024!',
    displayName: 'Carlos Garcia',
    department: 'Hospitality Management',
    yearLevel: '1st Year',
    studentId: 'LSB-2023-0004'
  },
  {
    email: 'sofia.martinez@lsb.edu.ph',
    password: 'LyFind2024!',
    displayName: 'Sofia Martinez',
    department: 'Marine Transportation',
    yearLevel: '3rd Year',
    studentId: 'LSB-2021-0005'
  }
];

async function createUser(userData) {
  try {
    console.log(`Creating user: ${userData.email}...`);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: userData.displayName
    });
    
    // Create Firestore user profile
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: userData.email,
      displayName: userData.displayName,
      department: userData.department,
      yearLevel: userData.yearLevel,
      studentId: userData.studentId,
      role: 'student',
      emailVerified: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
      itemsPosted: 0,
      itemsResolved: 0
    });
    
    console.log(`✓ Successfully created: ${userData.email}`);
    return { success: true, uid: user.uid };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠ User already exists: ${userData.email}`);
      return { success: false, error: 'already-exists' };
    }
    console.error(`✗ Error creating ${userData.email}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function seedUsers() {
  console.log('Starting user seeding...\n');
  
  for (const userData of testUsers) {
    await createUser(userData);
    // Wait a bit between creations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✓ User seeding complete!');
  console.log('Check TEST_ACCOUNTS.md for credentials');
  process.exit(0);
}

seedUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
