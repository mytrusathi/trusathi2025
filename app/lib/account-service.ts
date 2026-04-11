import { auth, db, storage } from './firebase';
import { 
  collection, query, where, getDocs, writeBatch, doc
} from 'firebase/firestore';
import { ref, listAll, deleteObject, type StorageReference } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';

/**
 * Clean up all user data and delete account.
 * Note: Re-authentication may be required for deleteUser() if the session is old.
 */
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently logged in.");

  const uid = user.uid;
  console.log("Starting account deletion for:", uid);

  // 1. Clean up Firestore Data
  const batch = writeBatch(db);

  // A. Profiles created by user
  const profilesQ = query(collection(db, 'profiles'), where('createdBy', '==', uid));
  const profilesSnap = await getDocs(profilesQ);
  const profileIds = profilesSnap.docs.map(d => d.id);
  profilesSnap.forEach(d => batch.delete(d.ref));

  // B. Favorites
  // User's own favorites
  const myFavsQ = query(collection(db, 'favorites'), where('userId', '==', uid));
  const myFavsSnap = await getDocs(myFavsQ);
  myFavsSnap.forEach(d => batch.delete(d.ref));

  // Favorites of user's profiles by OTHERS
  for (const pid of profileIds) {
    const otherFavsQ = query(collection(db, 'favorites'), where('profileId', '==', pid));
    const otherFavsSnap = await getDocs(otherFavsQ);
    otherFavsSnap.forEach(d => batch.delete(d.ref));
  }

  // C. Interests
  const sentIntQ = query(collection(db, 'interests'), where('senderId', '==', uid));
  const recvIntQ = query(collection(db, 'interests'), where('receiverId', '==', uid));
  const [sentIntSnap, recvIntSnap] = await Promise.all([getDocs(sentIntQ), getDocs(recvIntQ)]);
  sentIntSnap.forEach(d => batch.delete(d.ref));
  recvIntSnap.forEach(d => batch.delete(d.ref));

  // D. Notifications
  const recNotifQ = query(collection(db, 'notifications'), where('recipientId', '==', uid));
  const sentNotifQ = query(collection(db, 'notifications'), where('senderId', '==', uid));
  const [recNotifSnap, sentNotifSnap] = await Promise.all([getDocs(recNotifQ), getDocs(sentNotifQ)]);
  recNotifSnap.forEach(d => batch.delete(d.ref));
  sentNotifSnap.forEach(d => batch.delete(d.ref));

  // E. Conversations & Messages
  const convQ = query(collection(db, 'conversations'), where('participants', 'array-contains', uid));
  const convSnap = await getDocs(convQ);
  
  for (const cDoc of convSnap.docs) {
    // Delete messages in the conversation first
    const msgSnap = await getDocs(collection(db, 'conversations', cDoc.id, 'messages'));
    msgSnap.forEach(mDoc => batch.delete(mDoc.ref));
    // Delete the conversation doc itself
    batch.delete(cDoc.ref);
  }

  // F. User Record
  batch.delete(doc(db, 'users', uid));

  // Execute Firestore batch
  await batch.commit();
  console.log("Firestore data cleared.");

  // 2. Clean up Storage
  try {
    const deleteRecursively = async (folder: StorageReference) => {
      const result = await listAll(folder);
      await Promise.all(result.items.map(item => deleteObject(item)));
      await Promise.all(result.prefixes.map(prefix => deleteRecursively(prefix)));
    };

    await Promise.all([
      deleteRecursively(ref(storage, `profiles/${uid}`)),
      deleteRecursively(ref(storage, `selfies/${uid}`)),
    ]);
    console.log("Storage files cleared.");
  } catch (storageErr) {
    console.warn("Storage deletion skipped or failed:", storageErr);
  }

  // 3. Delete Auth Account
  try {
    await deleteUser(user);
    console.log("Auth account deleted.");
  } catch (authErr: unknown) {
    if (typeof authErr === 'object' && authErr && 'code' in authErr && authErr.code === 'auth/requires-recent-login') {
      throw new Error("REAUTH_REQUIRED");
    }
    throw authErr;
  }
};
