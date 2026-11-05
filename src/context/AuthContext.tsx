import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  UserProfile,
  AppNotification,
  FriendRequestItem,
  FriendshipItem,
  SyncStatus,
} from '../types';
import {
  checkUsernameAvailability,
  blockUser,
  unblockUser,
  markNotificationAsRead,
  deleteNotification,
} from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  syncStatus: SyncStatus;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, displayName: string, username: string, bio?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  blockUserAction: (targetUserId: string) => Promise<void>;
  unblockUserAction: (targetUserId: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  deleteNotificationAction: (notifId: string) => Promise<void>;
  notifications: AppNotification[];
  unreadCount: number;
  incomingRequests: FriendRequestItem[];
  outgoingRequests: FriendRequestItem[];
  acceptedFriends: UserProfile[];
  refreshFriends: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestItem[]>([]);
  const [acceptedFriends, setAcceptedFriends] = useState<UserProfile[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
        setNotifications([]);
        setIncomingRequests([]);
        setOutgoingRequests([]);
        setAcceptedFriends([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time synchronization of current user profile, notifications, requests and friends
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setSyncStatus('syncing');
    const userDocRef = doc(db, 'users', user.uid);

    let unsubscribeUser = () => {};
    let unsubscribeNotifs = () => {};
    let unsubscribeIncomingRequests = () => {};
    let unsubscribeOutgoingRequests = () => {};
    let unsubscribeFriendships = () => {};
    let friendListeners: (() => void)[] = [];

    try {
      // 1. Current User Profile Listener
      unsubscribeUser = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const profile = { ...(docSnap.data() as UserProfile), id: docSnap.id };
            setUserProfile(profile);
            setSyncStatus('synced');
          } else {
            // Document does not exist yet (e.g. freshly created Google user)
            const cleanUsername = (user.email?.split('@')[0] || 'usuario')
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, '');
            const initialProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              emailVerified: user.emailVerified || false,
              username: cleanUsername,
              usernameLower: cleanUsername,
              displayName: user.displayName || 'Alex',
              avatarBg: '#FFD65A',
              avatarInitials: (user.displayName || user.email || 'EM').slice(0, 2).toUpperCase(),
              photoURL: user.photoURL || undefined,
              bio: '',
              botName: 'Milo',
              currentEmotion: 'tranquilo',
              botExpression: 'CALM',
              todayNote: 'Sintonizando mi bienestar en EMOTI',
              moodVisibility: 'friends',
              blockedUsers: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setDoc(userDocRef, initialProfile).catch((err) =>
              console.warn('Initial profile create error:', err)
            );
            setUserProfile(initialProfile);
            setSyncStatus('synced');
          }
        },
        (error) => {
          console.warn('Real-time profile listener error:', error);
          setSyncStatus('offline');
        }
      );

      // 2. Real-time Notifications Listener
      const notifsCol = collection(db, `users/${user.uid}/notifications`);
      unsubscribeNotifs = onSnapshot(
        notifsCol,
        (snap) => {
          const notifList: AppNotification[] = [];
          snap.forEach((d) => notifList.push({ ...(d.data() as AppNotification), id: d.id }));
          notifList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(notifList);
        },
        (err) => console.warn('Notifications listener error:', err)
      );

      // 3. Real-time Incoming Friend Requests
      const qIncoming = query(
        collection(db, 'friendRequests'),
        where('toUserId', '==', user.uid),
        where('status', '==', 'pending')
      );
      unsubscribeIncomingRequests = onSnapshot(
        qIncoming,
        (snap) => {
          const reqList: FriendRequestItem[] = [];
          snap.forEach((d) => reqList.push({ ...(d.data() as FriendRequestItem), id: d.id }));
          reqList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setIncomingRequests(reqList);
        },
        (err) => console.warn('Incoming requests listener error:', err)
      );

      // 4. Real-time Outgoing Friend Requests
      const qOutgoing = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', user.uid),
        where('status', '==', 'pending')
      );
      unsubscribeOutgoingRequests = onSnapshot(
        qOutgoing,
        (snap) => {
          const reqList: FriendRequestItem[] = [];
          snap.forEach((d) => reqList.push({ ...(d.data() as FriendRequestItem), id: d.id }));
          setOutgoingRequests(reqList);
        },
        (err) => console.warn('Outgoing requests listener error:', err)
      );

      // 5. Real-time Friendships and Live Multi-device Friend Profiles
      const qFriendships = query(
        collection(db, 'friendships'),
        where('users', 'array-contains', user.uid)
      );
      unsubscribeFriendships = onSnapshot(
        qFriendships,
        (snap) => {
          // Clean up old friend sub-listeners
          friendListeners.forEach((unsub) => unsub());
          friendListeners = [];

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

          // Attach real-time listener to each friend's profile document
          // so when a friend changes their emotion or botName, it reflects immediately!
          const friendsMap: Record<string, UserProfile> = {};

          friendUserIds.forEach((fId) => {
            const fDocRef = doc(db, 'users', fId);
            const unsubFriend = onSnapshot(
              fDocRef,
              (fSnap) => {
                if (fSnap.exists()) {
                  friendsMap[fId] = { ...(fSnap.data() as UserProfile), id: fSnap.id };
                  setAcceptedFriends(Object.values(friendsMap));
                }
              },
              (err) => console.warn('Friend doc listener error:', err)
            );
            friendListeners.push(unsubFriend);
          });
        },
        (err) => console.warn('Friendships listener error:', err)
      );
    } catch (err) {
      console.warn('Could not establish real-time listeners:', err);
    }

    setLoading(false);

    return () => {
      unsubscribeUser();
      unsubscribeNotifs();
      unsubscribeIncomingRequests();
      unsubscribeOutgoingRequests();
      unsubscribeFriendships();
      friendListeners.forEach((unsub) => unsub());
    };
  }, [user]);

  // Refresh friends manually helper
  const refreshFriends = async () => {
    if (!user) return;
    try {
      const qFriendships = query(
        collection(db, 'friendships'),
        where('users', 'array-contains', user.uid)
      );
      const snap = await onSnapshot(qFriendships, () => {});
      snap();
    } catch {}
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const gUser = cred.user;

      const userDocRef = doc(db, 'users', gUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const cleanUsername = (gUser.email?.split('@')[0] || 'usuario')
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '');

        // Verify uniqueness
        const isAvail = await checkUsernameAvailability(cleanUsername, gUser.uid);
        const finalUsername = isAvail
          ? cleanUsername
          : `${cleanUsername}${Math.floor(100 + Math.random() * 900)}`;

        const profileData: UserProfile = {
          id: gUser.uid,
          email: gUser.email || '',
          emailVerified: gUser.emailVerified || false,
          username: finalUsername,
          usernameLower: finalUsername.toLowerCase(),
          displayName: gUser.displayName || 'Alex',
          avatarBg: '#FFD65A',
          avatarInitials: (gUser.displayName || gUser.email || 'EM').slice(0, 2).toUpperCase(),
          photoURL: gUser.photoURL || undefined,
          bio: '',
          botName: 'Milo',
          currentEmotion: 'tranquilo',
          botExpression: 'CALM',
          todayNote: '¡Comenzando mi viaje en EMOTI!',
          moodVisibility: 'friends',
          blockedUsers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profileData);
        setUserProfile(profileData);
      } else {
        setUserProfile({ ...(snap.data() as UserProfile), id: snap.id });
      }
      setUser(gUser);
      setSyncStatus('synced');
    } finally {
      setLoading(false);
    }
  };

  // Login with Email/Password (NO fake simulation fallback)
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      setUser(cred.user);
    } finally {
      setLoading(false);
    }
  };

  // Register with Email/Password and real unique username verification
  const register = async (
    email: string,
    pass: string,
    displayName: string,
    username: string,
    bio?: string
  ) => {
    setLoading(true);
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      if (cleanUsername.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres alfanuméricos.');
      }

      // Check username availability in Firestore
      const isAvailable = await checkUsernameAvailability(cleanUsername);
      if (!isAvailable) {
        throw new Error(`El nombre de usuario @${cleanUsername} ya está ocupado por otra persona. Por favor elige otro.`);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const newUser = userCredential.user;

      // Send email verification
      try {
        await sendEmailVerification(newUser);
      } catch (err) {
        console.warn('Could not send verification email:', err);
      }

      const nowIso = new Date().toISOString();
      const profileData: UserProfile = {
        id: newUser.uid,
        email: email.trim(),
        emailVerified: false,
        username: cleanUsername,
        usernameLower: cleanUsername,
        displayName: displayName.trim(),
        avatarBg: '#FFD65A',
        avatarInitials: displayName.trim().slice(0, 2).toUpperCase(),
        bio: bio?.trim() || '',
        botName: 'Milo',
        currentEmotion: 'tranquilo',
        botExpression: 'CALM',
        todayNote: '¡Comenzando mi viaje en EMOTI!',
        moodVisibility: 'friends',
        blockedUsers: [],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      await setDoc(doc(db, 'users', newUser.uid), profileData);
      setUser(newUser);
      setUserProfile(profileData);
      setSyncStatus('synced');
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
    setUser(null);
    setUserProfile(null);
    setNotifications([]);
    setIncomingRequests([]);
    setOutgoingRequests([]);
    setAcceptedFriends([]);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  // Update Profile with Cloud Firestore multi-device broadcast
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    setSyncStatus('syncing');

    // If changing username, verify uniqueness first
    if (data.username && data.username.toLowerCase() !== userProfile.username.toLowerCase()) {
      const cleanUsername = data.username.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      const isAvail = await checkUsernameAvailability(cleanUsername, user.uid);
      if (!isAvail) {
        setSyncStatus('synced');
        throw new Error(`El nombre de usuario @${cleanUsername} ya está en uso.`);
      }
      data.username = cleanUsername;
      data.usernameLower = cleanUsername;
    }

    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, 'users', user.uid), updated);
      const newProfile = { ...userProfile, ...updated };
      setUserProfile(newProfile);
      setSyncStatus('synced');
    } catch (err) {
      console.error('Update user profile error:', err);
      setSyncStatus('offline');
      throw err;
    }
  };

  // Block user action
  const blockUserAction = async (targetUserId: string) => {
    if (!user || !userProfile) return;
    await blockUser(user.uid, targetUserId, userProfile.blockedUsers || []);
  };

  // Unblock user action
  const unblockUserAction = async (targetUserId: string) => {
    if (!user || !userProfile) return;
    await unblockUser(user.uid, targetUserId, userProfile.blockedUsers || []);
  };

  // Mark notification read
  const markNotificationRead = async (notifId: string) => {
    if (!user) return;
    await markNotificationAsRead(user.uid, notifId);
  };

  // Delete notification
  const deleteNotificationAction = async (notifId: string) => {
    if (!user) return;
    await deleteNotification(user.uid, notifId);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        logout,
        resetPassword,
        sendVerificationEmail,
        updateUserProfile,
        blockUserAction,
        unblockUserAction,
        markNotificationRead,
        deleteNotificationAction,
        notifications,
        unreadCount,
        incomingRequests,
        outgoingRequests,
        acceptedFriends,
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
