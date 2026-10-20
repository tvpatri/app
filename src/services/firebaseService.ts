import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  UserProfile,
  FriendRequestItem,
  FriendshipItem,
  AppNotification,
  EmotionType,
  BotExpression,
  MoodVisibility,
  Friend,
  EnergySparkEvent,
} from '../types';

// Pre-seeded demo accounts in Firestore for testing
export const DEMO_USERS: Omit<UserProfile, 'id'>[] = [
  {
    email: 'sofia@emoti.app',
    username: 'sofia',
    displayName: 'Sofía',
    avatarBg: '#DCD5F5',
    avatarInitials: 'SO',
    botName: 'Lumi',
    currentEmotion: 'tranquilo',
    botExpression: 'CALM',
    todayNote: 'Tomando un té de menta ☕',
    moodVisibility: 'friends',
  },
  {
    email: 'mateo@emoti.app',
    username: 'mateo',
    displayName: 'Mateo',
    avatarBg: '#F5DFD3',
    avatarInitials: 'MA',
    botName: 'Astro',
    currentEmotion: 'estresado',
    botExpression: 'STRESSED',
    todayNote: 'Mucho estudio para finales 💪',
    moodVisibility: 'friends',
  },
  {
    email: 'valentina@emoti.app',
    username: 'valentina',
    displayName: 'Valentina',
    avatarBg: '#D9E8DE',
    avatarInitials: 'VA',
    botName: 'Sol',
    currentEmotion: 'feliz',
    botExpression: 'HAPPY',
    todayNote: 'Tarde de paseo 🌿',
    moodVisibility: 'friends',
  },
  {
    email: 'diego@emoti.app',
    username: 'diego',
    displayName: 'Diego',
    avatarBg: '#DCEAF4',
    avatarInitials: 'DI',
    botName: 'Pixel',
    currentEmotion: 'cansado',
    botExpression: 'SUPPORTIVE',
    todayNote: 'Escuchando música relajante 🎧',
    moodVisibility: 'nobody', // Private mood example
  },
];

// Seed demo users in Firestore if missing
export async function seedDemoUsersIfEmpty(): Promise<void> {
  try {
    for (const demo of DEMO_USERS) {
      const q = query(collection(db, 'users'), where('username', '==', demo.username));
      const snap = await getDocs(q);
      if (snap.empty) {
        const newDocRef = doc(collection(db, 'users'));
        await setDoc(newDocRef, {
          ...demo,
          id: newDocRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Could not seed demo users:', err);
  }
}

// Search users by username (e.g. search "alex" or "sofia")
export async function searchUsersByUsername(
  searchQuery: string,
  currentUserId?: string
): Promise<UserProfile[]> {
  const clean = searchQuery.trim().toLowerCase().replace(/^@/, '');
  if (!clean) return [];

  try {
    const q = query(
      collection(db, 'users'),
      where('username', '>=', clean),
      where('username', '<=', clean + '\uf8ff')
    );
    const snap = await getDocs(q);
    const results: UserProfile[] = [];
    snap.forEach((d) => {
      if (d.id !== currentUserId) {
        results.push(d.data() as UserProfile);
      }
    });

    if (results.length === 0) {
      const demoMatches = DEMO_USERS.filter((u) =>
        u.username.toLowerCase().includes(clean) ||
        u.displayName.toLowerCase().includes(clean)
      ).map((u) => ({
        ...u,
        id: 'demo_' + u.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as UserProfile));
      return demoMatches.filter((u) => u.id !== currentUserId);
    }

    return results;
  } catch (err) {
    console.warn('Error searching users in Firestore, falling back to demo users:', err);
    const demoMatches = DEMO_USERS.filter((u) =>
      u.username.toLowerCase().includes(clean) ||
      u.displayName.toLowerCase().includes(clean)
    ).map((u) => ({
      ...u,
      id: 'demo_' + u.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserProfile));
    return demoMatches.filter((u) => u.id !== currentUserId);
  }
}

// Send Friend Request
export async function sendFriendRequest(
  fromUser: UserProfile,
  targetUser: UserProfile
): Promise<void> {
  // Check if request already exists
  const qExisting = query(
    collection(db, 'friendRequests'),
    where('fromUserId', '==', fromUser.id),
    where('toUserId', '==', targetUser.id),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(qExisting);
  if (!snap.empty) {
    throw new Error('Ya enviaste una solicitud a este usuario.');
  }

  const reqDoc = doc(collection(db, 'friendRequests'));
  const newRequest: FriendRequestItem = {
    id: reqDoc.id,
    fromUserId: fromUser.id,
    toUserId: targetUser.id,
    status: 'pending',
    fromUsername: fromUser.username,
    fromDisplayName: fromUser.displayName,
    fromAvatarBg: fromUser.avatarBg,
    fromAvatarInitials: fromUser.avatarInitials,
    toUsername: targetUser.username,
    toDisplayName: targetUser.displayName,
    createdAt: new Date().toISOString(),
  };

  await setDoc(reqDoc, newRequest);

  // Send notification to target user
  const notifRef = doc(collection(db, `users/${targetUser.id}/notifications`));
  const notif: AppNotification = {
    id: notifRef.id,
    type: 'friend_request',
    senderId: fromUser.id,
    senderName: fromUser.displayName,
    senderUsername: fromUser.username,
    senderAvatarBg: fromUser.avatarBg,
    senderAvatarInitials: fromUser.avatarInitials,
    message: `@${fromUser.username} te ha enviado una solicitud de amistad.`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedRequestId: reqDoc.id,
  };
  await setDoc(notifRef, notif);
}

// Accept Friend Request
export async function acceptFriendRequest(
  request: FriendRequestItem,
  currentUserId: string
): Promise<void> {
  // Update request status to accepted
  await updateDoc(doc(db, 'friendRequests', request.id), {
    status: 'accepted',
  });

  // Create Friendship record
  const friendshipRef = doc(collection(db, 'friendships'));
  const newFriendship: FriendshipItem = {
    id: friendshipRef.id,
    users: [request.fromUserId, request.toUserId],
    user1Id: request.fromUserId,
    user2Id: request.toUserId,
    createdAt: new Date().toISOString(),
  };
  await setDoc(friendshipRef, newFriendship);

  // Notify requester
  const notifRef = doc(collection(db, `users/${request.fromUserId}/notifications`));
  const notif: AppNotification = {
    id: notifRef.id,
    type: 'friend_accepted',
    senderId: currentUserId,
    senderName: request.toDisplayName,
    senderUsername: request.toUsername,
    senderAvatarBg: '#D9E8DE',
    senderAvatarInitials: request.toDisplayName.slice(0, 2).toUpperCase(),
    message: `¡${request.toDisplayName} aceptó tu solicitud de amistad! Ahora son parte de Mi Círculo.`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  await setDoc(notifRef, notif);
}

// Reject Friend Request
export async function rejectFriendRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'friendRequests', requestId), {
    status: 'rejected',
  });
}

// Remove Friend
export async function removeFriendship(friendshipId: string): Promise<void> {
  await deleteDoc(doc(db, 'friendships', friendshipId));
}

// Send Energy Spark to Friend (social interaction with push notification)
export async function sendSocialEnergySpark(
  sender: UserProfile,
  friendUserId: string,
  friendName: string,
  message: string
): Promise<void> {
  const nowIso = new Date().toISOString();

  // 1. Create notification in friend's notifications subcollection
  const notifRef = doc(collection(db, `users/${friendUserId}/notifications`));
  const notif: AppNotification = {
    id: notifRef.id,
    type: 'energy_spark',
    senderId: sender.id,
    senderName: sender.displayName,
    senderUsername: sender.username,
    senderAvatarBg: sender.avatarBg,
    senderAvatarInitials: sender.avatarInitials,
    message: `"${message}"`,
    read: false,
    createdAt: nowIso,
  };
  await setDoc(notifRef, notif);

  // 2. Save in sender's energySparks subcollection
  const senderSparkRef = doc(collection(db, `users/${sender.id}/energySparks`));
  await setDoc(senderSparkRef, {
    id: senderSparkRef.id,
    friendId: friendUserId,
    friendName,
    message,
    timestamp: 'Ahora mismo',
    isIncoming: false,
    createdAt: nowIso,
  });
}

// Send Support Pulse to Friend
export async function sendSocialSupportPulse(
  sender: UserProfile,
  friendUserId: string,
  friendName: string
): Promise<void> {
  const nowIso = new Date().toISOString();
  const notifRef = doc(collection(db, `users/${friendUserId}/notifications`));
  const notif: AppNotification = {
    id: notifRef.id,
    type: 'support_pulse',
    senderId: sender.id,
    senderName: sender.displayName,
    senderUsername: sender.username,
    senderAvatarBg: sender.avatarBg,
    senderAvatarInitials: sender.avatarInitials,
    message: `${sender.displayName} te ha enviado un pulso háptico de apoyo sensorial 💓`,
    read: false,
    createdAt: nowIso,
  };
  await setDoc(notifRef, notif);
}

// Mark notification as read
export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, `users/${userId}/notifications`, notifId), {
      read: true,
    });
  } catch (err) {
    console.warn('Error marking notification as read:', err);
  }
}
