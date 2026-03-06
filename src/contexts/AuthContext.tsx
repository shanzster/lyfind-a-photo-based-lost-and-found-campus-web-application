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
      console.log('[Auth] Auth state changed:', user?.email || 'null');
      setUser(user);
      
      if (user) {
        // Check if this is a new sign-in (has pending flag)
        let isPending = false;
        try {
          isPending = sessionStorage.getItem('pendingGoogleSignIn') === 'true' ||
                     localStorage.getItem('pendingGoogleSignIn') === 'true';
        } catch (e) {
          // Ignore
        }

        console.log('[Auth] User signed in, isPending:', isPending);

        // Load user profile from Firestore
        const profile = await userService.getUserProfile(user.uid);
        setUserProfile(profile);

        // If this is from a redirect sign-in, navigate to browse
        if (isPending) {
          console.log('[Auth] Pending sign-in detected, clearing flag and navigating');
          try {
            sessionStorage.removeItem('pendingGoogleSignIn');
            localStorage.removeItem('pendingGoogleSignIn');
          } catch (e) {
            // Ignore
          }
          
          // Navigate to browse page
          toast.success('Logged in successfully!');
          setTimeout(() => {
            window.location.href = '/browse';
          }, 500);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle redirect result from Google Sign-In (for PWA/Mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Check if we're expecting a redirect result
        let isPending = false;
        try {
          isPending = sessionStorage.getItem('pendingGoogleSignIn') === 'true' ||
                     localStorage.getItem('pendingGoogleSignIn') === 'true';
        } catch (e) {
          console.warn('[Auth] Could not access storage');
        }

        console.log('[Auth] Checking for redirect result... isPending:', isPending);
        console.log('[Auth] Current URL:', window.location.href);
        
        const result = await getRedirectResult(auth);
        
        if (result) {
          const user = result.user;
          console.log('[Auth] ✅ Redirect result received:', user.email);

          // Clear the pending flag
          try {
            sessionStorage.removeItem('pendingGoogleSignIn');
            localStorage.removeItem('pendingGoogleSignIn');
          } catch (e) {
            console.warn('[Auth] Could not clear storage flags');
          }

          // Double-check the email domain
          if (!userService.isLSBEmail(user.email!)) {
            console.log('[Auth] ❌ Non-LSB email detected, signing out');
            await signOut(auth);
            toast.error('Only @lsb.edu.ph accounts are allowed');
            return;
          }

          console.log('[Auth] Creating/updating user profile...');
          // Create or update user profile
          await userService.createUserProfile(user, {
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
          });
          
          // Load the user profile
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          setUser(user);
          
          console.log('[Auth] ✅ Sign-in successful, redirecting to /browse');
          toast.success('Logged in with Google successfully!');
          
          // Navigate to browse page after successful sign-in
          setTimeout(() => {
            console.log('[Auth] Navigating to /browse...');
            window.location.href = '/browse';
          }, 500);
        } else {
          console.log('[Auth] No redirect result from getRedirectResult');
          
          // If we have a pending flag but no result, the auth state change will handle it
          if (isPending) {
            console.log('[Auth] Pending flag exists, waiting for auth state change...');
          }
        }
      } catch (error: any) {
        console.error('[Auth] ❌ Redirect result error:', error);
        console.error('[Auth] Error code:', error.code);
        console.error('[Auth] Error message:', error.message);
        
        // Clear pending flags on error
        try {
          sessionStorage.removeItem('pendingGoogleSignIn');
          localStorage.removeItem('pendingGoogleSignIn');
        } catch (e) {
          // Ignore
        }
        
        if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed') {
          toast.error('Network error. Please check your connection and try again.');
        } else if (error.message?.includes('lsb.edu.ph')) {
          toast.error('Only @lsb.edu.ph accounts are allowed');
        } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
          toast.error('Failed to sign in with Google. Please try again.');
        }
      }
    };

    // Run immediately
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
      // AGGRESSIVE mobile detection - use redirect for ANY mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      // Check for touch support
                      ('ontouchstart' in window) ||
                      // Check screen size
                      (window.innerWidth <= 768);

      // Enhanced PWA detection
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://') ||
        window.matchMedia('(display-mode: fullscreen)').matches;

      console.log('[Auth] Device detection:');
      console.log('[Auth] - isMobile:', isMobile);
      console.log('[Auth] - isStandalone:', isStandalone);
      console.log('[Auth] - userAgent:', navigator.userAgent);
      console.log('[Auth] - innerWidth:', window.innerWidth);

      let result;
      
      // ALWAYS use redirect for mobile devices (popup doesn't work well on mobile)
      if (isMobile) {
        console.log('[Auth] ✅ Using REDIRECT flow for mobile');
        
        // Store a flag to know we're expecting a redirect result
        try {
          sessionStorage.setItem('pendingGoogleSignIn', 'true');
          console.log('[Auth] Set pendingGoogleSignIn flag in sessionStorage');
        } catch (e) {
          console.warn('[Auth] sessionStorage failed, using localStorage');
          localStorage.setItem('pendingGoogleSignIn', 'true');
        }
        
        await signInWithRedirect(auth, provider);
        // The redirect will happen, and we'll handle the result in useEffect
        return;
      } else {
        // Use popup for desktop browsers only
        console.log('[Auth] ✅ Using POPUP flow for desktop');
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
