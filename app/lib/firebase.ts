import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getDatabase, type Database } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

const hasRequiredFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
)

let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let rtdb: Database

if (hasRequiredFirebaseConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    rtdb = getDatabase(app, firebaseConfig.databaseURL)
  } catch (error) {
    console.warn('Firebase initialization failed. Falling back to disabled services.', error)
    app = {} as FirebaseApp
    auth = {} as Auth
    db = {} as Firestore
    storage = {} as FirebaseStorage
    rtdb = {} as Database
  }
} else {
  // Keep module import-safe in environments without Firebase env vars
  // (e.g. preview screenshots/dev sandboxes).
  app = {} as FirebaseApp
  auth = {} as Auth
  db = {} as Firestore
  storage = {} as FirebaseStorage
  rtdb = {} as Database
}

export { app, auth, db, storage, rtdb }
