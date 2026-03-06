import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

  // Handle redirect result from Google Sign-In (for PWA)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result) {
          const user = result.user;
          console.log('[Auth] Redirect result received:', user.email);

          // Double-check the email domain
          if (!userService.isLSBEmail(user.email!)) {
            await signOut(auth);
            toast.error('Only @lsb.edu.ph accounts are allowed');
            return;
          }

          // Create or update user profile
          await userService.createUserProfile(user, {
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
          });
          
          // Load the user profile
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          toast.success('Logged in with Google successfully!');
        }
      } catch (error: any) {
        console.error('[Auth] Redirect result error:', error);
        if (error.message?.includes('lsb.edu.ph')) {
          toast.error('Only @lsb.edu.ph accounts are allowed');
        } else if (error.code !== 'auth/popup-closed-by-user') {
          toast.error('Failed to sign in with Google');
        }
      }
    };

    handleRedirectResult();
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
      // Enhanced PWA detection for Android and iOS
      const isStandalone = 
        // Standard PWA detection
        window.matchMedia('(display-mode: standalone)').matches ||
        // iOS Safari
        (window.navigator as any).standalone === true ||
        // Android Chrome - check if opened from home screen
        document.referrer.includes('android-app://') ||
        // Check if running in TWA (Trusted Web Activity)
        window.matchMedia('(display-mode: fullscreen)').matches ||
        // Additional check for mobile PWA
        (window.matchMedia('(display-mode: standalone)').matches && 
         /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

      // Force redirect on mobile devices regardless of detection
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const shouldUseRedirect = isStandalone || isMobile;

      let result;
      
      if (shouldUseRedirect) {
        // Use redirect for PWA and mobile (popups don't work reliably)
        console.log('[Auth] PWA/Mobile detected, using redirect flow');
        console.log('[Auth] isStandalone:', isStandalone);
        console.log('[Auth] isMobile:', isMobile);
        await signInWithRedirect(auth, provider);
        // The redirect will happen, and we'll handle the result in useEffect
        return;
      } else {
        // Use popup for desktop browsers only
        console.log('[Auth] Desktop browser detected, using popup flow');
        result = await signInWithPopup(auth, provider);
      }

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
        console.error('[Auth] Google sign-in error:', error);
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
