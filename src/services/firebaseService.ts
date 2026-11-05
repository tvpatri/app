import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  UserProfile,
  FriendRequestItem,
  FriendshipItem,
  AppNotification,
  EmotionType,
  MoodLogEntry,
  EnergySparkEvent,
} from '../types';

/**
 * Check if a username is globally available (case-insensitive)
 */
export async function checkUsernameAvailability(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const cleanLower = username.trim().toLowerCase().replace(/^@/, '');
  if (!cleanLower || cleanLower.length < 3) return false;

  const path = 'users';
  try {
    const q = query(
      collection(db, path),
      where('usernameLower', '==', cleanLower),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      // Also check fallback for any older documents where username was stored directly
      const qLegacy = query(
        collection(db, path),
        where('username', '==', cleanLower),
        limit(1)
      );
      const snapLegacy = await getDocs(qLegacy);
      if (snapLegacy.empty) return true;
      if (excludeUserId && snapLegacy.docs[0].id === excludeUserId) return true;
      return false;
    }

    if (excludeUserId && snap.docs[0].id === excludeUserId) {
      return true;
    }
    return false;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Search real registered users by username or display name
 */
export async function searchUsersByUsername(
  searchQuery: string,
  currentUserId?: string,
  blockedUsers: string[] = []
): Promise<UserProfile[]> {
  const clean = searchQuery.trim().toLowerCase().replace(/^@/, '');
  if (!clean) return [];

  const path = 'users';
  try {
    // Search by usernameLower prefix
    const qUsername = query(
      collection(db, path),
      where('usernameLower', '>=', clean),
      where('usernameLower', '<=', clean + '\uf8ff'),
      limit(20)
    );
    const snap = await getDocs(qUsername);
    const results: UserProfile[] = [];
    const seenIds = new Set<string>();

    snap.forEach((d) => {
      const data = d.data() as UserProfile;
      const uid = d.id;
      if (
        uid !== currentUserId &&
        !blockedUsers.includes(uid) &&
        !data.blockedUsers?.includes(currentUserId || '') &&
        !seenIds.has(uid)
      ) {
        seenIds.add(uid);
        results.push({ ...data, id: uid });
      }
    });

    // If query could match legacy usernames without usernameLower
    if (results.length === 0) {
      const qAll = query(collection(db, path), limit(50));
      const snapAll = await getDocs(qAll);
      snapAll.forEach((d) => {
        const data = d.data() as UserProfile;
        const uid = d.id;
        const uname = (data.usernameLower || data.username || '').toLowerCase();
        const dname = (data.displayName || '').toLowerCase();
        if (
          (uname.includes(clean) || dname.includes(clean)) &&
          uid !== currentUserId &&
          !blockedUsers.includes(uid) &&
          !data.blockedUsers?.includes(currentUserId || '') &&
          !seenIds.has(uid)
        ) {
          seenIds.add(uid);
          results.push({ ...data, id: uid });
        }
      });
    }

    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Get a specific user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    return { ...(snap.data() as UserProfile), id: snap.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Send Friend Request with duplicate and block guards
 */
export async function sendFriendRequest(
  fromUser: UserProfile,
  targetUser: UserProfile
): Promise<void> {
  if (fromUser.id === targetUser.id) {
    throw new Error('No puedes enviarte una solicitud de amistad a ti mismo.');
  }

  // Guard against blocked users
  if (fromUser.blockedUsers?.includes(targetUser.id)) {
    throw new Error('Tienes bloqueado a este usuario. Desbloquéalo primero para conectar.');
  }
  if (targetUser.blockedUsers?.includes(fromUser.id)) {
    throw new Error('No es posible enviar una solicitud a este usuario.');
  }

  // 1. Check if friendship already exists
  const qFriendships = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', fromUser.id)
  );
  try {
    const friendSnap = await getDocs(qFriendships);
    let alreadyFriends = false;
    friendSnap.forEach((d) => {
      const data = d.data() as FriendshipItem;
      if (data.users.includes(targetUser.id)) {
        alreadyFriends = true;
      }
    });
    if (alreadyFriends) {
      throw new Error(`Ya eres amigo de @${targetUser.username}.`);
    }

    // 2. Check if a pending request already exists in either direction
    const qOutgoing = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', fromUser.id),
      where('toUserId', '==', targetUser.id),
      where('status', '==', 'pending')
    );
    const snapOutgoing = await getDocs(qOutgoing);
    if (!snapOutgoing.empty) {
      throw new Error(`Ya enviaste una solicitud a @${targetUser.username}. Espera su respuesta.`);
    }

    const qIncoming = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', targetUser.id),
      where('toUserId', '==', fromUser.id),
      where('status', '==', 'pending')
    );
    const snapIncoming = await getDocs(qIncoming);
    if (!snapIncoming.empty) {
      throw new Error(
        `@${targetUser.username} ya te envió una solicitud. Puedes aceptarla en la pestaña Solicitudes.`
      );
    }

    // 3. Create real friend request in Firestore
    const reqDoc = doc(collection(db, 'friendRequests'));
    const nowIso = new Date().toISOString();
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
      createdAt: nowIso,
    };
    await setDoc(reqDoc, newRequest);

    // 4. Create real notification for recipient
    const notifRef = doc(collection(db, `users/${targetUser.id}/notifications`));
    const notif: AppNotification = {
      id: notifRef.id,
      type: 'friend_request',
      senderId: fromUser.id,
      senderName: fromUser.displayName,
      senderUsername: fromUser.username,
      senderAvatarBg: fromUser.avatarBg,
      senderAvatarInitials: fromUser.avatarInitials,
      message: `@${fromUser.username} te ha enviado una solicitud de amistad para unirse a tu Círculo.`,
      read: false,
      createdAt: nowIso,
      relatedRequestId: reqDoc.id,
    };
    await setDoc(notifRef, notif);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No puedes') || error instanceof Error && error.message.includes('Ya')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.CREATE, 'friendRequests');
  }
}

/**
 * Accept Friend Request
 */
export async function acceptFriendRequest(
  request: FriendRequestItem,
  currentUser: UserProfile
): Promise<void> {
  const nowIso = new Date().toISOString();
  try {
    // 1. Update friend request status to accepted
    await updateDoc(doc(db, 'friendRequests', request.id), {
      status: 'accepted',
      updatedAt: nowIso,
    });

    // 2. Create friendship record
    const friendshipRef = doc(collection(db, 'friendships'));
    const newFriendship: FriendshipItem = {
      id: friendshipRef.id,
      users: [request.fromUserId, request.toUserId],
      user1Id: request.fromUserId,
      user2Id: request.toUserId,
      createdAt: nowIso,
    };
    await setDoc(friendshipRef, newFriendship);

    // 3. Notify requester
    const notifRef = doc(collection(db, `users/${request.fromUserId}/notifications`));
    const notif: AppNotification = {
      id: notifRef.id,
      type: 'friend_accepted',
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderUsername: currentUser.username,
      senderAvatarBg: currentUser.avatarBg,
      senderAvatarInitials: currentUser.avatarInitials,
      message: `¡@${currentUser.username} aceptó tu solicitud de amistad! Ahora están conectados en Mi Círculo.`,
      read: false,
      createdAt: nowIso,
    };
    await setDoc(notifRef, notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `friendRequests/${request.id}`);
  }
}

/**
 * Reject Friend Request
 */
export async function rejectFriendRequest(requestId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `friendRequests/${requestId}`);
  }
}

/**
 * Remove an existing friendship
 */
export async function removeFriendship(friendshipId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'friendships', friendshipId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `friendships/${friendshipId}`);
  }
}

/**
 * Block a user (adds to blocked list and deletes any friendships or pending requests)
 */
export async function blockUser(
  currentUserId: string,
  targetUserId: string,
  currentBlocked: string[] = []
): Promise<void> {
  const updatedBlocked = Array.from(new Set([...currentBlocked, targetUserId]));
  const userPath = `users/${currentUserId}`;

  try {
    // 1. Update user document with blocked user
    await updateDoc(doc(db, 'users', currentUserId), {
      blockedUsers: updatedBlocked,
      updatedAt: new Date().toISOString(),
    });

    // 2. Remove any existing friendship
    const qFriendships = query(
      collection(db, 'friendships'),
      where('users', 'array-contains', currentUserId)
    );
    const snap = await getDocs(qFriendships);
    for (const d of snap.docs) {
      const data = d.data() as FriendshipItem;
      if (data.users.includes(targetUserId)) {
        await deleteDoc(d.ref);
      }
    }

    // 3. Clear any pending friend requests
    const qReq1 = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', currentUserId),
      where('toUserId', '==', targetUserId)
    );
    const snap1 = await getDocs(qReq1);
    for (const d of snap1.docs) {
      await deleteDoc(d.ref);
    }

    const qReq2 = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', targetUserId),
      where('toUserId', '==', currentUserId)
    );
    const snap2 = await getDocs(qReq2);
    for (const d of snap2.docs) {
      await deleteDoc(d.ref);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(
  currentUserId: string,
  targetUserId: string,
  currentBlocked: string[] = []
): Promise<void> {
  const updatedBlocked = currentBlocked.filter((id) => id !== targetUserId);
  const userPath = `users/${currentUserId}`;

  try {
    await updateDoc(doc(db, 'users', currentUserId), {
      blockedUsers: updatedBlocked,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Send Real Energy Spark to a registered friend
 */
export async function sendSocialEnergySpark(
  sender: UserProfile,
  friendUserId: string,
  friendName: string,
  message: string
): Promise<void> {
  const nowIso = new Date().toISOString();

  try {
    // 1. Create notification in recipient's subcollection
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

    // 2. Record spark event in sender's subcollection
    const senderSparkRef = doc(collection(db, `users/${sender.id}/energySparks`));
    const senderSpark: EnergySparkEvent = {
      id: senderSparkRef.id,
      friendId: friendUserId,
      friendName,
      message,
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: false,
    };
    await setDoc(senderSparkRef, {
      ...senderSpark,
      createdAt: nowIso,
    });

    // 3. Record spark event in recipient's subcollection as incoming
    const recipientSparkRef = doc(collection(db, `users/${friendUserId}/energySparks`));
    const recipientSpark: EnergySparkEvent = {
      id: recipientSparkRef.id,
      friendId: sender.id,
      friendName: sender.displayName,
      message,
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: true,
    };
    await setDoc(recipientSparkRef, {
      ...recipientSpark,
      senderId: sender.id,
      createdAt: nowIso,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${friendUserId}/notifications`);
  }
}

/**
 * Send Support Pulse to a registered friend
 */
export async function sendSocialSupportPulse(
  sender: UserProfile,
  friendUserId: string,
  friendName: string
): Promise<void> {
  const nowIso = new Date().toISOString();
  try {
    const notifRef = doc(collection(db, `users/${friendUserId}/notifications`));
    const notif: AppNotification = {
      id: notifRef.id,
      type: 'support_pulse',
      senderId: sender.id,
      senderName: sender.displayName,
      senderUsername: sender.username,
      senderAvatarBg: sender.avatarBg,
      senderAvatarInitials: sender.avatarInitials,
      message: `${sender.displayName} (@${sender.username}) te ha enviado un pulso háptico de apoyo sensorial 💓`,
      read: false,
      createdAt: nowIso,
    };
    await setDoc(notifRef, notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${friendUserId}/notifications`);
  }
}

/**
 * Save emotional check-in to mood history subcollection
 */
export async function logMoodToHistory(
  userId: string,
  emotion: EmotionType,
  note?: string
): Promise<void> {
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const entryDoc = doc(collection(db, `users/${userId}/moodHistory`));

  const entry: MoodLogEntry = {
    id: entryDoc.id,
    dateKey,
    dayLabel: 'Hoy',
    timestamp: timeStr,
    emotion,
    note: note || '',
  };

  try {
    await setDoc(entryDoc, {
      ...entry,
      createdAt: now.toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${userId}/moodHistory`);
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, `users/${userId}/notifications`, notifId), {
      read: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/notifications/${notifId}`);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(userId: string, notifId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, `users/${userId}/notifications`, notifId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/notifications/${notifId}`);
  }
}
