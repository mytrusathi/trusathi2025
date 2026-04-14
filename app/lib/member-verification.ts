import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  type ApplicationVerifier,
  type Auth,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from './firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const sendMemberEmailVerification = async () => {
  if (!auth.currentUser) {
    throw new Error('No active user found.');
  }

  await sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/dashboard/member`,
    handleCodeInApp: false,
  });
};

export const refreshCurrentUser = async () => {
  if (!auth.currentUser) {
    throw new Error('No active user found.');
  }

  await auth.currentUser.reload();
  return auth.currentUser;
};

export const ensurePhoneRecaptcha = (authInstance: Auth = auth) => {
  if (typeof window === 'undefined') {
    throw new Error('Phone verification is only available in the browser.');
  }

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(authInstance, 'phone-recaptcha', {
      size: 'invisible',
    });
  }

  return window.recaptchaVerifier as ApplicationVerifier;
};

export const sendPhoneVerificationOtp = async (phoneNumber: string) => {
  if (!auth.currentUser) {
    throw new Error('No active user found.');
  }

  const verifier = ensurePhoneRecaptcha();
  const provider = new PhoneAuthProvider(auth);
  return provider.verifyPhoneNumber(phoneNumber, verifier);
};

export const confirmPhoneVerificationOtp = async (
  verificationId: string,
  verificationCode: string,
) => {
  if (!auth.currentUser) {
    throw new Error('No active user found.');
  }

  const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
  await linkWithCredential(auth.currentUser, credential);
  await syncPhoneVerifiedProfiles(auth.currentUser.uid, true);
};

export const syncPhoneVerifiedProfiles = async (uid: string, phoneVerified: boolean) => {
  const profilesQuery = query(collection(db, 'profiles'), where('createdBy', '==', uid));
  const profilesSnapshot = await getDocs(profilesQuery);
  const batch = writeBatch(db);

  profilesSnapshot.forEach((profileDoc) => {
    batch.update(profileDoc.ref, { phoneVerified });
  });

  await batch.commit();
};

export const syncEmailVerifiedProfiles = async (uid: string, emailVerified: boolean) => {
  const profilesQuery = query(collection(db, 'profiles'), where('createdBy', '==', uid));
  const profilesSnapshot = await getDocs(profilesQuery);
  const batch = writeBatch(db);

  profilesSnapshot.forEach((profileDoc) => {
    batch.update(profileDoc.ref, { emailVerified });
  });

  await batch.commit();
};
