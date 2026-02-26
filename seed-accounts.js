// Seed LSB Test Accounts
// Run this script with: node seed-accounts.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw",
  authDomain: "lyfind-72845.firebaseapp.com",
  projectId: "lyfind-72845",
  storageBucket: "lyfind-72845.firebasestorage.app",
  messagingSenderId: "15393