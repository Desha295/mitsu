/**
 * Firebase app initialization (Sprint 2.1 — Firebase Foundation).
 *
 * Relocated from the flat `src/lib/firebase.ts` created in Phase 0 into
 * this dedicated folder, per Sprint 2.1's "Backend folder structure"
 * requirement. Nothing in the app imported the old file (verified before
 * this refactor), so this is a zero-risk move — no existing page,
 * component, or data file is affected.
 *
 * Sprint 2.1 status: still NO real Firebase project exists. All values
 * come from environment variables (see .env.local.example). Until a real
 * project is created and `.env.local` is filled in, `firebaseConfig` is
 * incomplete and `app`/`db`/`storage`/`auth` remain `null` rather than
 * throwing, so every public page keeps working exactly as before
 * (Sprint 2.1's "Keep all current public pages working" requirement).
 *
 * Do NOT hardcode real credentials here. See 09_DEVELOPMENT_STANDARDS.md #11.
 *
 * Out of scope for this sprint (see CURRENT_SPRINT.md): no reads, no
 * writes, no auth screens, no CRUD. This file only initializes the SDK.
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

export const isFirebaseConfigured = Boolean(
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

export { app, db, storage, auth };
