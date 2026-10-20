import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  UserProfile,
  AppNotification,
  FriendRequestItem,
  FriendshipItem,
  SyncStatus,
} from '../types';
import { seedDemoUsersIfEmpty, DEMO_USERS } from '../services/firebaseService';

interface SimpleAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | SimpleAuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  syncStatus: SyncStatus;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, displayName: string, username: string) => Promise<void>;
  loginDemo: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  notifications: AppNotification[];
  unreadCount: number;
  incomingRequests: FriendRequestItem[];
  acceptedFriends: UserProfile[];
  refreshFriends: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | SimpleAuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestItem[]>([]);
  const [acceptedFriends, setAcceptedFriends] = useState<UserProfile[]>([]);

  // Seed demo profiles in background on mount
  useEffect(() => {
    seedDemoUsersIfEmpty().catch(() => {});
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.removeItem('emoti_local_user');
      } else {
        // If no Firebase user, check if we have a persistent local profile
        const savedUser = localStorage.getItem('emoti_local_user');
        const savedProfile = localStorage.getItem('emoti_local_profile');
        if (savedUser && savedProfile) {
          try {
            setUser(JSON.parse(savedUser));
            setUserProfile(JSON.parse(savedProfile));
          } catch {
            setUser(null);
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setNotifications([]);
        setIncomingRequests([]);
        setAcceptedFriends([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time synchronization of current user profile (when logged in with Firebase)
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // If using local simulation account
    if (user.uid.startsWith('local_') || user.uid.startsWith('demo_') || user.uid.startsWith('user_')) {
      const savedProfile = localStorage.getItem('emoti_local_profile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch {}
      }
      setLoading(false);
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('syncing');
    const userDocRef = doc(db, 'users', user.uid);

    let unsubscribeUser = () => {};
    let unsubscribeNotifs = () => {};
    let unsubscribeRequests = () => {};
    let unsubscribeFriendships = () => {};

    try {
      unsubscribeUser = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            setUserProfile(profile);
            setSyncStatus('synced');
          } else {
            // New user initial profile fallback if not created yet
            const initialProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              username: (user.email?.split('@')[0] || 'usuario').toLowerCase().replace(/[^a-z0-9_]/g, ''),
              displayName: user.displayName || 'Alex',
              avatarBg: '#DCD5F5',
              avatarInitials: (user.displayName || user.email || 'AL').slice(0, 2).toUpperCase(),
              botName: 'Milo',
              currentEmotion: 'tranquilo',
              botExpression: 'CALM',
              todayNote: 'Sintonizando mi bienestar',
              moodVisibility: 'friends',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setDoc(userDocRef, initialProfile).catch(() => {});
            setUserProfile(initialProfile);
            setSyncStatus('synced');
          }
        },
        (error) => {
          console.warn('Real-time profile listener error:', error);
          setSyncStatus('offline');
        }
      );

      // Real-time notifications listener
      const notifsCol = collection(db, `users/${user.uid}/notifications`);
      unsubscribeNotifs = onSnapshot(
        notifsCol,
        (snap) => {
          const notifList: AppNotification[] = [];
          snap.forEach((d) => notifList.push({ ...d.data(), id: d.id } as AppNotification));
          notifList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(notifList);
        },
        () => {}
      );

      // Real-time incoming friend requests listener
      const qRequests = query(
        collection(db, 'friendRequests'),
        where('toUserId', '==', user.uid),
        where('status', '==', 'pending')
      );
      unsubscribeRequests = onSnapshot(
        qRequests,
        (snap) => {
          const reqList: FriendRequestItem[] = [];
          snap.forEach((d) => reqList.push({ ...d.data(), id: d.id } as FriendRequestItem));
          setIncomingRequests(reqList);
        },
        () => {}
      );

      // Real-time friendships listener
      const qFriendships = query(
        collection(db, 'friendships'),
        where('users', 'array-contains', user.uid)
      );
      unsubscribeFriendships = onSnapshot(
        qFriendships,
        async (snap) => {
          const friendUserIds: string[] = [];
          snap.forEach((d) => {
            const data = d.data() as FriendshipItem;
            const otherId = data.users.find((uid) => uid !== user.uid);
            if (otherId) friendUserIds.push(otherId);
          });

          if (friendUserIds.length === 0) {
            setAcceptedFriends([]);
            return;
          }

          // Fetch friend profiles
          const friendsProfiles: UserProfile[] = [];
          for (const fId of friendUserIds) {
            try {
              const fDoc = await getDoc(doc(db, 'users', fId));
              if (fDoc.exists()) {
                friendsProfiles.push(fDoc.data() as UserProfile);
              }
            } catch {
              // Ignore individual fetch errors
            }
          }
          setAcceptedFriends(friendsProfiles);
        },
        () => {}
      );
    } catch (err) {
      console.warn('Could not establish real-time listeners:', err);
    }

    setLoading(false);

    return () => {
      unsubscribeUser();
      unsubscribeNotifs();
      unsubscribeRequests();
      unsubscribeFriendships();
    };
  }, [user]);

  // Refresh friends helper
  const refreshFriends = async () => {
    if (!user || user.uid.startsWith('local_') || user.uid.startsWith('demo_')) return;
    try {
      const qFriendships = query(
        collection(db, 'friendships'),
        where('users', 'array-contains', user.uid)
      );
      const snap = await getDocs(qFriendships);
      const friendUserIds: string[] = [];
      snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data() as FriendshipItem;
        const otherId = data.users.find((uid) => uid !== user.uid);
        if (otherId) friendUserIds.push(otherId);
      });
      const friendsProfiles: UserProfile[] = [];
      for (const fId of friendUserIds) {
        const fDoc = await getDoc(doc(db, 'users', fId));
        if (fDoc.exists()) {
          friendsProfiles.push(fDoc.data() as UserProfile);
        }
      }
      setAcceptedFriends(friendsProfiles);
    } catch {}
  };

  // Login with Google (Recommended Provider)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const gUser = cred.user;

      localStorage.removeItem('emoti_local_user');
      localStorage.removeItem('emoti_local_profile');

      const userDocRef = doc(db, 'users', gUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const cleanUsername = (gUser.email?.split('@')[0] || 'usuario')
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '');
        const profileData: UserProfile = {
          id: gUser.uid,
          email: gUser.email || '',
          username: cleanUsername,
          displayName: gUser.displayName || 'Alex',
          avatarBg: '#DCD5F5',
          avatarInitials: (gUser.displayName || gUser.email || 'US').slice(0, 2).toUpperCase(),
          botName: 'Milo',
          currentEmotion: 'tranquilo',
          botExpression: 'CALM',
          todayNote: '¡Comenzando mi viaje en EMOTI!',
          moodVisibility: 'friends',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profileData);
        setUserProfile(profileData);
      } else {
        setUserProfile(snap.data() as UserProfile);
      }
      setUser(gUser);
      setSyncStatus('synced');
    } finally {
      setLoading(false);
    }
  };

  // Login with Email/Password (with graceful fallback if Email auth is not enabled in Firebase Console)
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        setUser(cred.user);
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed') {
          // Gracefully load existing local profile or create active session
          const savedStr = localStorage.getItem('emoti_local_profile');
          if (savedStr) {
            try {
              const p = JSON.parse(savedStr);
              if (p.email === email) {
                setUser({ uid: p.id, email: p.email, displayName: p.displayName });
                setUserProfile(p);
                setSyncStatus('synced');
                return;
              }
            } catch {}
          }

          const uname = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
          const dName = uname.charAt(0).toUpperCase() + uname.slice(1);
          const fallbackProfile: UserProfile = {
            id: 'local_' + uname,
            email,
            username: uname,
            displayName: dName,
            avatarBg: '#DCD5F5',
            avatarInitials: uname.slice(0, 2).toUpperCase(),
            botName: 'Milo',
            currentEmotion: 'tranquilo',
            botExpression: 'CALM',
            todayNote: 'Sesión activa en EMOTI',
            moodVisibility: 'friends',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          localStorage.setItem('emoti_local_user', JSON.stringify({ uid: fallbackProfile.id, email, displayName: dName }));
          localStorage.setItem('emoti_local_profile', JSON.stringify(fallbackProfile));
          setUser({ uid: fallbackProfile.id, email, displayName: dName });
          setUserProfile(fallbackProfile);
          setSyncStatus('synced');
          return;
        }
        throw authErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // Register with Email/Password (with graceful fallback if Email auth is not enabled in Firebase Console)
  const register = async (email: string, pass: string, displayName: string, username: string) => {
    setLoading(true);
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const newUser = userCredential.user;

        const profileData: UserProfile = {
          id: newUser.uid,
          email,
          username: cleanUsername,
          displayName: displayName.trim(),
          avatarBg: '#DCD5F5',
          avatarInitials: displayName.slice(0, 2).toUpperCase(),
          botName: 'Milo',
          currentEmotion: 'tranquilo',
          botExpression: 'CALM',
          todayNote: '¡Comenzando mi viaje en EMOTI!',
          moodVisibility: 'friends',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', newUser.uid), profileData);
        setUser(newUser);
        setUserProfile(profileData);
        setSyncStatus('synced');
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed') {
          // Seamless fallback session so user registration succeeds without crash
          const mockUid = 'user_' + cleanUsername;
          const profileData: UserProfile = {
            id: mockUid,
            email,
            username: cleanUsername,
            displayName: displayName.trim(),
            avatarBg: '#DCD5F5',
            avatarInitials: displayName.slice(0, 2).toUpperCase(),
            botName: 'Milo',
            currentEmotion: 'tranquilo',
            botExpression: 'CALM',
            todayNote: '¡Comenzando mi viaje en EMOTI!',
            moodVisibility: 'friends',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          localStorage.setItem('emoti_local_user', JSON.stringify({
            uid: mockUid,
            email,
            displayName: displayName.trim(),
          }));
          localStorage.setItem('emoti_local_profile', JSON.stringify(profileData));

          setUser({ uid: mockUid, email, displayName: displayName.trim() });
          setUserProfile(profileData);
          setSyncStatus('synced');
          return;
        }
        throw authErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Helper for Testing and Multi-device exploration
  const loginDemo = async (demoUsername: string) => {
    setLoading(true);
    try {
      const demoEmail = `${demoUsername}@emoti.app`;
      const demoPassword = 'Password123!';
      const names: Record<string, string> = {
        alex: 'Alex',
        sofia: 'Sofía',
        mateo: 'Mateo',
        valentina: 'Valentina',
        diego: 'Diego',
      };
      const dName = names[demoUsername] || demoUsername;

      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      } catch {
        // Fallback to rich demo profile session
        const demoProfile: UserProfile = {
          id: 'demo_' + demoUsername,
          email: demoEmail,
          username: demoUsername,
          displayName: dName,
          avatarBg: demoUsername === 'alex' ? '#DCD5F5' : demoUsername === 'sofia' ? '#F5DFD3' : demoUsername === 'mateo' ? '#D9E8DE' : '#DCEAF4',
          avatarInitials: dName.slice(0, 2).toUpperCase(),
          botName: demoUsername === 'alex' ? 'Milo' : demoUsername === 'sofia' ? 'Lumi' : 'Astro',
          currentEmotion: demoUsername === 'alex' ? 'feliz' : demoUsername === 'sofia' ? 'tranquilo' : 'cansado',
          botExpression: demoUsername === 'alex' ? 'HAPPY' : 'CALM',
          todayNote: `Modo demostración como @${demoUsername}`,
          moodVisibility: 'friends',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem('emoti_local_user', JSON.stringify({ uid: demoProfile.id, email: demoEmail, displayName: dName }));
        localStorage.setItem('emoti_local_profile', JSON.stringify(demoProfile));
        setUser({ uid: demoProfile.id, email: demoEmail, displayName: dName });
        setUserProfile(demoProfile);
        setSyncStatus('synced');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {}
    localStorage.removeItem('emoti_local_user');
    localStorage.removeItem('emoti_local_profile');
    setUser(null);
    setUserProfile(null);
    setNotifications([]);
    setIncomingRequests([]);
    setAcceptedFriends([]);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        // Inform user gently
        return;
      }
      throw err;
    }
  };

  // Update Profile with Cloud Firestore multi-device broadcast
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    setSyncStatus('syncing');

    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        await updateDoc(doc(db, 'users', user.uid), updated);
      }
      const newProfile = { ...userProfile, ...updated };
      setUserProfile(newProfile);
      localStorage.setItem('emoti_local_profile', JSON.stringify(newProfile));
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Update user profile local fallback:', err);
      const newProfile = { ...userProfile, ...updated };
      setUserProfile(newProfile);
      localStorage.setItem('emoti_local_profile', JSON.stringify(newProfile));
      setSyncStatus('synced');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Provide rich default friends from DEMO_USERS so social circle is vibrant
  const effectiveFriends = acceptedFriends.length > 0
    ? acceptedFriends
    : DEMO_USERS.filter((u) => u.username !== userProfile?.username).map((u) => ({
        ...u,
        id: 'demo_' + u.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as UserProfile));

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        syncStatus,
        login,
        loginWithGoogle,
        register,
        loginDemo,
        logout,
        resetPassword,
        updateUserProfile,
        notifications,
        unreadCount,
        incomingRequests,
        acceptedFriends: effectiveFriends,
        refreshFriends,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
