import { auth, db, storage } from './firebase';
import { 
  collection, query, where, getDocs, writeBatch, doc, DocumentReference
} from 'firebase/firestore';
import { ref, listAll, deleteObject, type StorageReference } from 'firebase/storage';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

/**
 * Execute multiple Firestore delete operations in chunks of 500
 * to avoid writeBatch limit errors.
 */
async function commitDeleteBatches(docRefs: DocumentReference[]) {
  const CHUNK_SIZE = 450; // Staying safely under 500
  for (let i = 0; i < docRefs.length; i += CHUNK_SIZE) {
    const batch = writeBatch(db);
    const chunk = docRefs.slice(i, i + CHUNK_SIZE);
    chunk.forEach(ref => batch.delete(ref));
    await batch.commit();
  }
}

/**
 * Clean up all user data and delete account.
 */
export const deleteUserAccount = async (password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently logged in.");

  // 🔥 SECURITY: Re-authentication
  // This ensures the current person has the authority to delete this account.
  try {
    const credential = EmailAuthProvider.credential(user.email || '', password);
    await reauthenticateWithCredential(user, credential);
    console.log("Re-authentication successful.");
  } catch (reauthErr: any) {
    console.error("Re-authentication failed for deletion:", reauthErr);
    if (reauthErr.code === 'auth/wrong-password' || reauthErr.code === 'auth/invalid-credential') {
      throw new Error("INVALID_PASSWORD");
    }
    throw reauthErr;
  }

  const uid = user.uid;
  console.log("Starting robust account deletion for:", uid);

  // 1. Gather all document references for deletion
  const refsToDelete: DocumentReference[] = [];

  // A. Profiles created by user
  const profilesQ = query(collection(db, 'profiles'), where('createdBy', '==', uid));
  const profilesSnap = await getDocs(profilesQ);
  const profileIds = profilesSnap.docs.map(d => d.id);
  profilesSnap.forEach(d => refsToDelete.push(d.ref));

  // B. Favorites
  const myFavsQ = query(collection(db, 'favorites'), where('userId', '==', uid));
  const myFavsSnap = await getDocs(myFavsQ);
  myFavsSnap.forEach(d => refsToDelete.push(d.ref));

  for (const pid of profileIds) {
    const otherFavsQ = query(collection(db, 'favorites'), where('profileId', '==', pid));
    const otherFavsSnap = await getDocs(otherFavsQ);
    otherFavsSnap.forEach(d => refsToDelete.push(d.ref));
  }

  // C. Interests
  const sentIntQ = query(collection(db, 'interests'), where('senderId', '==', uid));
  const recvIntQ = query(collection(db, 'interests'), where('receiverId', '==', uid));
  const [sentIntSnap, recvIntSnap] = await Promise.all([getDocs(sentIntQ), getDocs(recvIntQ)]);
  sentIntSnap.forEach(d => refsToDelete.push(d.ref));
  recvIntSnap.forEach(d => refsToDelete.push(d.ref));

  // D. Notifications
  const recNotifQ = query(collection(db, 'notifications'), where('recipientId', '==', uid));
  const sentNotifQ = query(collection(db, 'notifications'), where('senderId', '==', uid));
  const [recNotifSnap, sentNotifSnap] = await Promise.all([getDocs(recNotifQ), getDocs(sentNotifQ)]);
  recNotifSnap.forEach(d => refsToDelete.push(d.ref));
  sentNotifSnap.forEach(d => refsToDelete.push(d.ref));

  // E. Conversations & Messages
  const convQ = query(collection(db, 'conversations'), where('participants', 'array-contains', uid));
  const convSnap = await getDocs(convQ);
  
  for (const cDoc of convSnap.docs) {
    const msgSnap = await getDocs(collection(db, 'conversations', cDoc.id, 'messages'));
    msgSnap.forEach(mDoc => refsToDelete.push(mDoc.ref));
    refsToDelete.push(cDoc.ref);
  }

  // F. User Record
  refsToDelete.push(doc(db, 'users', uid));

  // 2. Execute Firestore cleanup in safe chunks
  console.log(`Deleting ${refsToDelete.length} documents in chunks...`);
  await commitDeleteBatches(refsToDelete);
  console.log("Firestore data cleared.");

  // 3. Clean up Storage
  try {
    const deleteRecursively = async (folder: StorageReference) => {
      try {
        const result = await listAll(folder);
        await Promise.all(result.items.map(item => deleteObject(item)));
        await Promise.all(result.prefixes.map(prefix => deleteRecursively(prefix)));
      } catch (e) {
        // Folder might not exist, that's fine
        console.log(`Folder deletion skipped: ${folder.fullPath}`);
      }
    };

    await Promise.all([
      deleteRecursively(ref(storage, `profiles/${uid}`)),
      deleteRecursively(ref(storage, `selfies/${uid}`)),
    ]);
    console.log("Storage files cleared.");
  } catch (storageErr) {
    console.warn("Storage deletion process finished with minor skipped items.");
  }

  // 4. Final step: Delete Auth Account
  try {
    await deleteUser(user);
    console.log("Auth account successfully removed.");
  } catch (authErr: any) {
    if (authErr?.code === 'auth/requires-recent-login' || authErr?.message === 'auth/requires-recent-login') {
      throw new Error("REAUTH_REQUIRED");
    }
    console.error("Critical: Auth deletion failed after data wipe", authErr);
    throw authErr;
  }
};
