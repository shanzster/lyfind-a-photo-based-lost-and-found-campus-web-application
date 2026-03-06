# PWA Google Sign-In Debug & Fix Plan

## Current Problem
- Google Sign-In redirects to Google ✅
- User signs in successfully ✅
- Returns to PWA ✅
- **BUT: Nothing happens - stays on login page ❌**
- Debug logs don't show in 🐛 button ❌

## Root Cause Analysis

### Issue 1: Debug Overlay Not Capturing Logs
The DebugOverlay component only captures logs that include `[Auth]` in the message, but it's not intercepting them properly in PWA.

### Issue 2: getRedirectResult() Returns Null
When the PWA returns from Google redirect, `getRedirectResult()` is likely returning `null` instead of the user. This can happen because:

1. **Firebase persistence issue** - IndexedDB might not be working in PWA
2. **Timing issue** - getRedirectResult() called too early
3. **Domain mismatch** - OAuth redirect URI doesn't match
4. **Session lost** - PWA loses context during redirect

## Fix Plan

### Step 1: Add Persistent Debug Logging
Create a debug system that writes to localStorage so logs survive the redirect.

### Step 2: Add Visual Status Indicators
Show on-screen status messages that don't rely on console.log.

### Step 3: Fix Firebase Persistence
Ensure Firebase uses the correct persistence for PWA.

### Step 4: Add Fallback Auth Detection
If getRedirectResult() fails, use onAuthStateChanged as backup.

### Step 5: Test Each Step
Add checkpoints to see exactly where it fails.

---

## Implementation

### File 1: Enhanced Debug System
**Location:** `src/utils/pwaDebug.ts`

```typescript
// Persistent debug logger for PWA
class PWADebugger {
  private logs: string[] = [];
  private maxLogs = 50;

  log(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('pwa_debug_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to save debug logs');
    }
    
    // Also log to console
    console.log(logEntry);
  }

  getLogs(): string[] {
    try {
      const saved = localStorage.getItem('pwa_debug_logs');
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load debug logs');
    }
    return this.logs;
  }

  clear() {
    this.logs = [];
    localStorage.removeItem('pwa_debug_logs');
  }
}

export const pwaDebug = new PWADebugger();
```

### File 2: Visual Status Component
**Location:** `src/components/AuthStatus.tsx`

```typescript
import { useState, useEffect } from 'react';

export function AuthStatus() {
  const [status, setStatus] = useState('Initializing...');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Listen for auth status updates
    const handleStatus = (event: CustomEvent) => {
      setStatus(event.detail);
      setVisible(true);
      
      // Auto-hide after 3 seconds unless it's an error
      if (!event.detail.includes('Error') && !event.detail.includes('Failed')) {
        setTimeout(() => setVisible(false), 3000);
      }
    };

    window.addEventListener('auth-status' as any, handleStatus);
    return () => window.removeEventListener('auth-status' as any, handleStatus);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4">
      <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl">
        <p className="text-white text-sm text-center">{status}</p>
      </div>
    </div>
  );
}

// Helper to emit status
export function emitAuthStatus(message: string) {
  window.dispatchEvent(new CustomEvent('auth-status', { detail: message }));
}
```

### File 3: Fixed AuthContext with Full Debugging
**Location:** `src/contexts/AuthContext.tsx`

Key changes:
1. Add persistent logging
2. Add visual status updates
3. Try multiple methods to detect auth
4. Add detailed error reporting
5. Add retry logic

```typescript
import { pwaDebug } from '@/utils/pwaDebug';
import { emitAuthStatus } from '@/components/AuthStatus';

// In the init function:
const init = async () => {
  try {
    pwaDebug.log('=== AUTH INIT START ===');
    emitAuthStatus('Checking authentication...');

    // Method 1: Check redirect result
    pwaDebug.log('Method 1: Checking getRedirectResult()');
    const result = await getRedirectResult(auth);
    
    if (result) {
      pwaDebug.log('✅ Redirect result found: ' + result.user.email);
      emitAuthStatus('Google sign-in detected!');
      // ... handle sign-in
    } else {
      pwaDebug.log('❌ No redirect result');
    }

    // Method 2: Check current auth state
    pwaDebug.log('Method 2: Checking current auth state');
    const currentUser = auth.currentUser;
    if (currentUser) {
      pwaDebug.log('✅ Current user found: ' + currentUser.email);
      emitAuthStatus('User already signed in');
      // ... handle existing user
    } else {
      pwaDebug.log('❌ No current user');
    }

    // Method 3: Set up listener
    pwaDebug.log('Method 3: Setting up onAuthStateChanged');
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      pwaDebug.log('Auth state changed: ' + (user?.email || 'null'));
      // ... handle state change
    });

  } catch (error: any) {
    pwaDebug.log('❌ ERROR: ' + error.message);
    emitAuthStatus('Error: ' + error.message);
  }
};
```

### File 4: Enhanced Debug Overlay
**Location:** `src/components/DebugOverlay.tsx`

Update to show persistent logs from localStorage:

```typescript
import { pwaDebug } from '@/utils/pwaDebug';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load logs from localStorage
    const loadLogs = () => {
      setLogs(pwaDebug.getLogs());
    };

    loadLogs();
    const interval = setInterval(loadLogs, 1000); // Refresh every second

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9999] w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
      >
        {isVisible ? '✕' : '🐛'}
      </button>

      {isVisible && (
        <div className="fixed inset-0 z-[9998] bg-black/95 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Debug Logs (Persistent)</h2>
                <button
                  onClick={() => {
                    pwaDebug.clear();
                    setLogs([]);
                  }}
                  className="px-3 py-1 bg-red-500 rounded text-sm"
                >
                  Clear
                </button>
              </div>

              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm">No logs yet.</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-800 rounded text-xs font-mono break-all"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### File 5: Firebase Config Check
**Location:** `src/lib/firebase.ts`

Ensure proper persistence:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';

// ... firebase config ...

export const auth = getAuth(app);

// Set persistence with fallback
const setupPersistence = async () => {
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
    console.log('[Firebase] Using IndexedDB persistence');
  } catch (error) {
    console.warn('[Firebase] IndexedDB failed, using localStorage');
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (e) {
      console.error('[Firebase] All persistence methods failed');
    }
  }
};

setupPersistence();
```

---

## Testing Checklist

### Test 1: Debug Logs Working
- [ ] Open PWA
- [ ] Click 🐛 button
- [ ] See logs appear
- [ ] Click "Sign in with Google"
- [ ] Redirects to Google
- [ ] Sign in
- [ ] Return to PWA
- [ ] Click 🐛 button again
- [ ] **Logs should still be there and show what happened**

### Test 2: Visual Status Working
- [ ] Open PWA
- [ ] Should see "Checking authentication..." at top
- [ ] Click "Sign in with Google"
- [ ] Should see "Redirecting to Google..."
- [ ] Return from Google
- [ ] Should see status messages

### Test 3: Auth Working
- [ ] Follow Test 1 & 2
- [ ] After returning from Google
- [ ] Should see "Google sign-in detected!"
- [ ] Should see "Setting up account..."
- [ ] Should navigate to /browse

---

## Expected Debug Log Output (Success)

```
[timestamp] === AUTH INIT START ===
[timestamp] Method 1: Checking getRedirectResult()
[timestamp] ✅ Redirect result found: user@lsb.edu.ph
[timestamp] Validating email domain
[timestamp] ✅ Email valid
[timestamp] Creating user profile
[timestamp] ✅ Profile created
[timestamp] Loading user profile from Firestore
[timestamp] ✅ Profile loaded
[timestamp] Navigating to /browse
```

## Expected Debug Log Output (Failure)

```
[timestamp] === AUTH INIT START ===
[timestamp] Method 1: Checking getRedirectResult()
[timestamp] ❌ No redirect result
[timestamp] Method 2: Checking current auth state
[timestamp] ❌ No current user
[timestamp] Method 3: Setting up onAuthStateChanged
[timestamp] Auth state changed: null
```

If you see the failure output, it means `getRedirectResult()` is returning null. This indicates:
1. OAuth redirect URI mismatch
2. Firebase persistence not working
3. Session lost during redirect

---

## Next Steps

1. **Implement all 5 files above**
2. **Build and deploy**
3. **Test in PWA**
4. **Click 🐛 button and screenshot the logs**
5. **Send me the logs**
6. **I'll tell you exactly what's wrong**

This plan will give us complete visibility into what's happening!
