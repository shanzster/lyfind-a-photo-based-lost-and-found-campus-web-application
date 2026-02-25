import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService, UserProfile } from '@/services/userService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load user profile from Firestore
        const profile = await userService.getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    // Check if email is from LSB domain
    if (!userService.isLSBEmail(email)) {
      throw new Error('Only @lsb.edu.ph email addresses are allowed');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create user profile in Firestore with displayName
    await userService.createUserProfile(userCredential.user, {
      displayName: name,
    });
    
    // Load the user profile
    const profile = await userService.getUserProfile(userCredential.user.uid);
    setUserProfile(profile);
    setUser(userCredential.user);
    
    toast.success('Account created successfully!');
  };

  const login = async (email: string, password: string) => {
    // Check if email is from LSB domain
    if (!userService.isLSBEmail(email)) {
      throw new Error('Only @lsb.edu.ph email addresses are allowed');
    }

    await signInWithEmailAndPassword(auth, email, password);
    toast.success('Logged in successfully!');
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    // Force account selection and restrict to lsb.edu.ph domain
    provider.setCustomParameters({
      prompt: 'select_account',
      hd: 'lsb.edu.ph', // Hosted domain - restricts to LSB accounts
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Double-check the email domain
      if (!userService.isLSBEmail(user.email!)) {
        // Sign out the user if they're not from LSB domain
        await signOut(auth);
        throw new Error('Only @lsb.edu.ph email addresses are allowed');
      }

      // Create or update user profile in Firestore with displayName
      await userService.createUserProfile(user, {
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
      });
      
      // Load the user profile
      const profile = await userService.getUserProfile(user.uid);
      setUserProfile(profile);
      
      toast.success('Logged in with Google successfully!');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (error.message.includes('lsb.edu.ph')) {
        toast.error('Only @lsb.edu.ph accounts are allowed');
      } else {
        toast.error('Failed to sign in with Google');
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
