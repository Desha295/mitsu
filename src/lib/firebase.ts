/**
 * Firebase initialization for MITSU.
 *
 * Phase 0 status: NO real Firebase project exists yet. All values come from
 * environment variables (see .env.local.example). Until a real project is
 * created and `.env.local` is filled in, `firebaseConfig` will be incomplete
 * and `app`/`db`/`storage`/`auth` will be `null` rather than throwing, so the
 * rest of the app (static pages, theme, language) keeps working.
 *
 * Do NOT hardcode real credentials here. See 09_DEVELOPMENT_STANDARDS.md #11.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "[MITSU] Firebase is not configured yet. Fill in .env.local using " +
      ".env.local.example once a Firebase project exists."
  );
}

export { app, db, storage, auth, isFirebaseConfigured };
